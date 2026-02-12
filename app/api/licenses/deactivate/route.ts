import { NextRequest, NextResponse } from 'next/server';
import { getLicensesCollection } from '@/drizzle/db';

// POST /api/licenses/deactivate - Deactivate license from a domain
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { licenseKey, domain } = body;

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

    // Check if domain is activated
    if (!license.activatedDomains.includes(domain)) {
      return NextResponse.json(
        { error: 'Domain is not activated' },
        { status: 400 }
      );
    }

    // Deactivate domain
    const updatedDomains = license.activatedDomains.filter(d => d !== domain);
    await licensesCollection.updateOne(
      { _id: license._id },
      {
        $set: {
          activatedDomains: updatedDomains,
          activations: Math.max(0, license.activations - 1),
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: 'License deactivated successfully',
      activations: Math.max(0, license.activations - 1),
      maxActivations: license.maxActivations,
    });
  } catch (error) {
    console.error('Error deactivating license:', error);
    return NextResponse.json({ error: 'Failed to deactivate license' }, { status: 500 });
  }
}
