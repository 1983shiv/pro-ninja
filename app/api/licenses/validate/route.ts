import { NextRequest, NextResponse } from 'next/server';
import { getLicensesCollection, getUsersCollection, getProductsCollection } from '@/drizzle/db';
import { License, newObjectId } from '@/drizzle/schema';
import { v4 as uuidv4 } from 'uuid';

// POST /api/licenses/validate - Validate a license key (for WordPress plugin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { licenseKey, domain } = body;

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
        valid: false,
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
      valid: true,
      license: {
        key: license.licenseKey,
        status: license.status,
        plan: product?.tierType,
        reviewLimit: license.reviewLimit,
        reviewsUsed: license.reviewsUsed,
        siteLimit: product?.siteLimit,
        activations: license.activations,
        maxActivations: license.maxActivations,
        expiresAt: license.expiresAt,
      },
    });
  } catch (error) {
    console.error('Error validating license:', error);
    return NextResponse.json({ error: 'Failed to validate license' }, { status: 500 });
  }
}
