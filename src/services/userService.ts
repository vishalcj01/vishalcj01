// src/services/userService.ts
import {db} from '@/lib/firebaseAdmin';

interface StatsUpdate {
  strength?: number;
  intelligence?: number;
  wealth?: number;
}

/**
 * Updates user stats in Firestore.
 * @param userId The ID of the user.
 * @param statsUpdate An object containing the stats to update.
 */
export async function updateUserStats(userId: string, statsUpdate: StatsUpdate): Promise<void> {
  const userDoc = db.collection('users').doc(userId);
  await userDoc.update(statsUpdate);
}
