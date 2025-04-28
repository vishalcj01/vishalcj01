'use server';

import {NextResponse} from 'next/server';
import {getMissionsForUser, submitMissionCompletion} from '@/services/missionService';
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

export async function POST(request: Request) {
  try {
    const user = await auth.verifyIdToken(
      request.headers.get('Authorization')!.split(' ')[1]
    );

    if (!user) {
      return NextResponse.json({message: 'Unauthorized'}, {status: 401});
    }

    const {missionId} = await request.json();
    await submitMissionCompletion(user.uid, missionId);
    return NextResponse.json({message: 'Mission completed successfully'});
  } catch (error: any) {
    console.error('Error completing mission:', error);
    return NextResponse.json({message: error.message}, {status: 500});
  }
}
