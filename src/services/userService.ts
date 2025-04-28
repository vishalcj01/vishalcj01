// src/services/userService.ts
import {db} from '@/lib/firebaseAdmin';

interface StatsUpdate {
  strength?: number;
  intelligence?: number;
  wealth?: number;
  xp?: number;
  level?: number;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  rank?: string;
  title?: string;
  strength: number;
  intelligence: number;
  wealth: number;
  xp: number;
  level: number;
  hasPremiumAccess: boolean;
}

/**
 * Updates user stats in Firestore.
 * @param userId The ID of the user.
 * @param statsUpdate An object containing the stats to update.
 */
export async function updateUserStats(userId: string, statsUpdate: StatsUpdate): Promise<void> {
  try {
    const userDoc = db.collection('users').doc(userId);
    await userDoc.update(statsUpdate);
  } catch (error: any) {
    console.error('Error updating user stats:', error);
    throw new Error(error.message || 'Failed to update user stats.');
  }
}

/**
 * Fetches a user profile from Firestore.
 * @param userId The ID of the user.
 * @returns A promise that resolves with the user profile.
 */
export async function getUserProfile(userId: string): Promise<UserProfile> {
  try {
    const userDoc = db.collection('users').doc(userId);
    const doc = await userDoc.get();

    if (!doc.exists) {
      throw new Error('User not found');
    }

    const data = doc.data();
    if (!data) {
      throw new Error('User data is missing');
    }

    return {
      id: doc.id,
      name: data.name || 'Unknown User',
      email: data.email || 'no-email@example.com',
      avatarUrl: data.avatarUrl || '',
      rank: data.rank || 'Beginner',
      title: data.title || 'Novice',
      strength: data.strength || 0,
      intelligence: data.intelligence || 0,
      wealth: data.wealth || 0,
      xp: data.xp || 0,
      level: data.level || 1,
      hasPremiumAccess: data.hasPremiumAccess || false,
    };
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    throw new Error(error.message || 'Failed to fetch user profile.');
  }
}

