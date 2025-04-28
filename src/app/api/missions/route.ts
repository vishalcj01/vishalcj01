'use server';

import {NextResponse} from 'next/server';
import {getMissionsForUser} from '@/services/missionService';
import {auth} from '@/lib/firebaseAdmin';

export async function GET(request: Request) {
  try {
    const user = await auth.verifyIdToken(
      request.headers.get('Authorization')!.split(' ')[1]
    );

    if (!user) {
      return NextResponse.json({message: 'Unauthorized'}, {status: 401});
    }

    const missions = await getMissionsForUser(user.uid);
    return NextResponse.json({missions});
  } catch (error: any) {
    console.error('Error getting missions:', error);
    return NextResponse.json({message: error.message}, {status: 500});
  }
}
