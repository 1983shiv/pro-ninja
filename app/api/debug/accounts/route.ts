import { NextResponse } from 'next/server';
import { getAccountsCollection } from '@/drizzle/db';

export async function GET() {
  try {
    const accountsCollection = await getAccountsCollection();
    
    // Get all accounts
    const accounts = await accountsCollection.find({}).toArray();
    
    // Get count
    const count = await accountsCollection.countDocuments();
    
    return NextResponse.json({
      success: true,
      count,
      accounts: accounts.map(acc => ({
        _id: acc._id,
        userId: acc.userId,
        provider: acc.provider,
        type: acc.type,
        providerAccountId: acc.providerAccountId,
      })),
    });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
