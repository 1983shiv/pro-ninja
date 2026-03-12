import { NextRequest, NextResponse } from 'next/server';
import { getLicensesCollection, getProductsCollection } from '@/drizzle/db';

// POST /api/licenses/activate - Activate license on a domain
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Accept both camelCase and snake_case field names
    const licenseKey = body.licenseKey ?? body.license_key;
    const domain = body.domain;

    if (!licenseKey || !domain) {
      return NextResponse.json(
        { error: 'License key and domain required' },
        { status: 400 }
      );
    }

    const licensesCollection = await getLicensesCollection();
    const license = await licensesCollection.findOne({ licenseKey });

    if (!license) {
      return NextResponse.json({ error: 'Invalid license key' }, { status: 404 });
    }

    // Check if license is active
    if (license.status !== 'active') {
      return NextResponse.json(
        { error: `License is ${license.status}` },
        { status: 403 }
      );
    }

    // Check if domain is already activated
    if (license.activatedDomains.includes(domain)) {
      return NextResponse.json({
        success: true,
        message: 'Domain already activated',
      });
    }

    // Check activation limit
    if (license.activations >= license.maxActivations) {
      return NextResponse.json(
        { error: 'Maximum activations reached' },
        { status: 403 }
      );
    }

    // Activate domain
    const updatedDomains = [...license.activatedDomains, domain];
    await licensesCollection.updateOne(
      { _id: license._id },
      {
        $set: {
          activatedDomains: updatedDomains,
          activations: license.activations + 1,
          activatedAt: license.activatedAt || new Date(),
          updatedAt: new Date(),
        },
      }
    );

    // Fetch product for plan details
    const productsCollection = await getProductsCollection();
    const product = await productsCollection.findOne({ _id: license.productId });

    return NextResponse.json({
      success: true,
      message: 'License activated successfully',
      data: {
        status: license.status,
        plan: product?.tierType ?? 'FREE',
        expires_at: license.expiresAt ?? null,
        review_limit: license.reviewLimit,
        site_limit: product?.siteLimit ?? 1,
        activations: license.activations + 1,
        max_activations: license.maxActivations,
      },
    });
  } catch (error) {
    console.error('Error activating license:', error);
    return NextResponse.json({ error: 'Failed to activate license' }, { status: 500 });
  }
}
