import { NextRequest, NextResponse } from 'next/server';
import { getLicensesCollection } from '@/drizzle/db';

// POST /api/licenses/usage - Track review usage (from WordPress plugin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { licenseKey, reviewsCount } = body;

    if (!licenseKey || typeof reviewsCount !== 'number') {
      return NextResponse.json(
        { error: 'License key and reviews count required' },
        { status: 400 }
      );
    }

    const licensesCollection = await getLicensesCollection();
    const license = await licensesCollection.findOne({ licenseKey });

    if (!license) {
      return NextResponse.json({ error: 'Invalid license key' }, { status: 404 });
    }

    // Update usage
    await licensesCollection.updateOne(
      { _id: license._id },
      {
        $inc: { reviewsUsed: reviewsCount },
        $set: { updatedAt: new Date() },
      }
    );

    const updatedLicense = await licensesCollection.findOne({ _id: license._id });

    return NextResponse.json({
      success: true,
      reviewsUsed: updatedLicense?.reviewsUsed || 0,
      reviewLimit: license.reviewLimit,
      remaining: Math.max(0, license.reviewLimit - (updatedLicense?.reviewsUsed || 0)),
    });
  } catch (error) {
    console.error('Error tracking usage:', error);
    return NextResponse.json({ error: 'Failed to track usage' }, { status: 500 });
  }
}
