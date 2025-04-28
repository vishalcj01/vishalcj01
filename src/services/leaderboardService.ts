// src/services/leaderboardService.ts
import {db} from '@/lib/firebaseAdmin';

/**
 * Retrieves leaderboard data from Firestore, sorted by the specified field.
 * @param sortBy The field to sort the leaderboard by (e.g., 'xp', 'strength', 'intelligence', 'wealth').
 * @returns A promise that resolves with an array of leaderboard entries.
 */
export async function getLeaderboardData(sortBy: string): Promise<any[]> {
  const leaderboardRef = db.collection('users').orderBy(sortBy, 'desc').limit(100); // Limit to top 100 users
  const snapshot = await leaderboardRef.get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}
