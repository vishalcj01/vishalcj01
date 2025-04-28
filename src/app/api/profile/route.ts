'use server';

import {NextResponse} from 'next/server';
import {updateUserStats, getUserProfile} from '@/services/userService';
import {auth} from '@/lib/firebaseAdmin';

export async function PUT(request: Request) {
  try {
    const user = await auth.verifyIdToken(
      request.headers.get('Authorization')!.split(' ')[1]
    );

    if (!user) {
      return NextResponse.json({message: 'Unauthorized'}, {status: 401});
    }

    const {strength, intelligence, wealth} = await request.json();

    if (typeof strength !== 'number' || typeof intelligence !== 'number' || typeof wealth !== 'number') {
      console.error('Invalid stats provided', {strength, intelligence, wealth});
      return NextResponse.json({message: 'Invalid stats provided. Must be numbers.'}, {status: 400});
    }

    await updateUserStats(user.uid, {strength, intelligence, wealth});
    return NextResponse.json({message: 'User stats updated successfully'});
  } catch (error: any) {
    console.error('Error updating user stats:', error);
    return NextResponse.json({message: error.message}, {status: 500});
  }
}

export async function GET(request: Request) {
  try {
    const user = await auth.verifyIdToken(
      request.headers.get('Authorization')!.split(' ')[1]
    );

    if (!user) {
      return NextResponse.json({message: 'Unauthorized'}, {status: 401});
    }

    const userProfile = await getUserProfile(user.uid);
    return NextResponse.json({user: userProfile});
  } catch (error: any) {
    console.error('Error getting user profile:', error);
    return NextResponse.json({message: error.message}, {status: 500});
  }
}

