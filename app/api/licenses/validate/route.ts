import { NextRequest, NextResponse } from 'next/server';
import { getLicensesCollection, getUsersCollection, getProductsCollection } from '@/drizzle/db';
import { License, newObjectId } from '@/drizzle/schema';
import { v4 as uuidv4 } from 'uuid';

// POST /api/licenses/validate - Validate a license key (for WordPress plugin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Accept both camelCase and snake_case field names
    const licenseKey = body.licenseKey ?? body.license_key;
    const domain = body.domain;

    if (!licenseKey) {
      return NextResponse.json({ error: 'License key required' }, { status: 400 });
    }

    const licensesCollection = await getLicensesCollection();
    const license = await licensesCollection.findOne({ licenseKey });

    if (!license) {
      return NextResponse.json({
        valid: false,
        error: 'Invalid license key',
      }, { status: 404 });
    }

    // Check if license is active
    if (license.status !== 'active') {
      return NextResponse.json({
        valid: false,
        error: `License is ${license.status}`,
      }, { status: 403 });
    }

    // Check if license has expired
    if (license.expiresAt && new Date(license.expiresAt) < new Date()) {
      // Update status to expired
      await licensesCollection.updateOne(
        { _id: license._id },
        { $set: { status: 'expired', updatedAt: new Date() } }
      );

      return NextResponse.json({
        success: false,
        error: 'License has expired',
      }, { status: 403 });
    }

    // Update last checked time
    await licensesCollection.updateOne(
      { _id: license._id },
      { $set: { lastChecked: new Date(), updatedAt: new Date() } }
    );

    // Get product details
    const productsCollection = await getProductsCollection();
    const product = await productsCollection.findOne({ _id: license.productId });

    return NextResponse.json({
      success: true,
      data: {
        status: license.status,
        plan: product?.tierType ?? 'FREE',
        expires_at: license.expiresAt ?? null,
        review_limit: license.reviewLimit,
        reviews_used: license.reviewsUsed,
        site_limit: product?.siteLimit ?? 1,
        activations: license.activations,
        max_activations: license.maxActivations,
      },
    });
  } catch (error) {
    console.error('Error validating license:', error);
    return NextResponse.json({ error: 'Failed to validate license' }, { status: 500 });
  }
}
