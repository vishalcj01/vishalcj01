'use server';

import {NextResponse} from 'next/server';
import {updateUserStats} from '@/services/userService';
import {auth} from '@/lib/firebaseAdmin';

export async function POST(request: Request) {
  try {
    const user = await auth.verifyIdToken(
      request.headers.get('Authorization')!.split(' ')[1]
    );

    if (!user) {
      return NextResponse.json({message: 'Unauthorized'}, {status: 401});
    }

    const {strength, intelligence, wealth} = await request.json();
    await updateUserStats(user.uid, {strength, intelligence, wealth});
    return NextResponse.json({message: 'User stats updated successfully'});
  } catch (error: any) {
    console.error('Error updating user stats:', error);
    return NextResponse.json({message: error.message}, {status: 500});
  }
}
