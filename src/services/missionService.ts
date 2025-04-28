// src/services/missionService.ts
import {db} from '@/lib/firebaseAdmin';
import {FieldValue} from 'firebase-admin/firestore';

const MISSIONS_COLLECTION = 'missions';
const USERS_COLLECTION = 'users';

interface Mission {
  id: string;
  type: string;
  title: string;
  description: string;
  rewardXp: number;
  strengthIncrease?: number;
  intelligenceIncrease?: number;
  wealthIncrease?: number;
}

/**
 * Retrieves missions for a given user.
 * @param userId The ID of the user.
 * @returns A promise that resolves with an array of missions.
 */
export async function getMissionsForUser(userId: string): Promise<Mission[]> {
  try {
    const userDoc = db.collection(USERS_COLLECTION).doc(userId);
    const user = await userDoc.get();

    if (!user.exists) {
      console.log('User does not exist');
      return [];
    }

    const userMissionsSnapshot = await db
      .collection(USERS_COLLECTION)
      .doc(userId)
      .collection(MISSIONS_COLLECTION)
      .get();

    return userMissionsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        type: data.type || 'Unknown',
        title: data.title || 'Unnamed Mission',
        description: data.description || 'No description',
        rewardXp: data.rewardXp || 0,
        strengthIncrease: data.strengthIncrease || 0,
        intelligenceIncrease: data.intelligenceIncrease || 0,
        wealthIncrease: data.wealthIncrease || 0,
      };
    }) as Mission[];
  } catch (error) {
    console.error("Error fetching missions for user:", error);
    throw new Error("Failed to retrieve missions.");
  }
}

/**
 * Submits a mission completion and updates user stats.
 * @param userId The ID of the user.
 * @param missionId The ID of the mission completed.
 */
export async function submitMissionCompletion(userId: string, missionId: string): Promise<void> {
  try {
    const missionDoc = db
      .collection(USERS_COLLECTION)
      .doc(userId)
      .collection(MISSIONS_COLLECTION)
      .doc(missionId);
    const mission = await missionDoc.get();

    if (!mission.exists) {
      throw new Error('Mission not found');
    }

    const missionData = mission.data();
    if (!missionData) {
      throw new Error('Mission data is missing');
    }
    const xpReward = missionData.rewardXp || 100; // Default XP reward

    // Update user stats
    const userDoc = db.collection(USERS_COLLECTION).doc(userId);
    await userDoc.update({
      xp: FieldValue.increment(xpReward),
      strength: FieldValue.increment(missionData.strengthIncrease || 0),
      intelligence: FieldValue.increment(missionData.intelligenceIncrease || 0),
      wealth: FieldValue.increment(missionData.wealthIncrease || 0),
    });

    // Delete the mission after completion
    await missionDoc.delete();
  } catch (error: any) {
    console.error('Error completing mission:', error);
    throw new Error(error.message || 'Failed to complete mission.');
  }
}

