'use server';

import {NextResponse} from 'next/server';
import {verifyPayment} from '@/services/paymentService';
import {auth} from '@/lib/firebaseAdmin';

export async function POST(request: Request) {
  try {
    const user = await auth.verifyIdToken(
      request.headers.get('Authorization')!.split(' ')[1]
    );

    if (!user) {
      return NextResponse.json({message: 'Unauthorized'}, {status: 401});
    }

    const {paymentId} = await request.json();
    const verificationResult = await verifyPayment(user.uid, paymentId);

    if (verificationResult.success) {
      return NextResponse.json({message: 'Payment verified, premium access granted'});
    } else {
      return NextResponse.json({message: 'Payment verification failed', error: verificationResult.error}, {status: 400});
    }
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({message: error.message}, {status: 500});
  }
}
