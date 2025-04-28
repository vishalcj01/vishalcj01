'use server';

import { NextResponse } from 'next/server';
import { getLeaderboardData } from '@/services/leaderboardService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get('sortBy') || 'xp'; // Default sort field is 'xp'

    const leaderboardData = await getLeaderboardData(sortBy);

    return NextResponse.json({ leaderboard: leaderboardData });
  } catch (error: any) {
    console.error('Error getting leaderboard data:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
