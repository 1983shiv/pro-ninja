import { NextResponse } from 'next/server';
import { getUserByEmail, getUserById } from '@/data/user';
import { getAccountByUserId } from '@/data/account';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const id = searchParams.get('id');
  const byid = searchParams.get('byid');

  try {
    console.log('=== Testing getUserByEmail ===');
    
    if (email) {
      console.log(`Testing with email: ${email}`);
      const userByEmail = await getUserByEmail(email);
      console.log('Result:', userByEmail);
      
      return NextResponse.json({
        success: true,
        method: 'getUserByEmail',
        input: email,
        result: userByEmail,
        found: userByEmail !== null
      });
    }
    
    if (id) {
      console.log(`Testing with id: ${id}`);
      const userById = await getUserById(id);
      console.log('Result:', userById);
      
      return NextResponse.json({
        success: true,
        method: 'getUserById',
        input: id,
        result: userById,
        found: userById !== null
      });
    }

    if(byid){
        console.log(`Testing with id: ${byid}`);
        const userById = await getAccountByUserId(byid);
        console.log('Result:', userById);
      
      return NextResponse.json({
        success: true,
        method: 'getAccountByUserId',
        input: byid,
        result: userById,
        found: userById !== null
      });
    }

    return NextResponse.json({
      success: false,
      message: 'Please provide email or id parameter',
      examples: [
        '/api/test-user?email=test@example.com',
        '/api/test-user?id=123'
      ]
    });

  } catch (error) {
    console.error('Error testing user functions:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
