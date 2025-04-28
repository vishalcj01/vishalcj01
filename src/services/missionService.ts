// src/services/missionService.ts
import {db} from '@/lib/firebaseAdmin';
import {FieldValue} from 'firebase-admin/firestore';

const MISSIONS_COLLECTION = 'missions';
const USERS_COLLECTION = 'users';

/**
 * Retrieves missions for a given user.
 * @param userId The ID of the user.
 * @returns A promise that resolves with an array of missions.
 */
export async function getMissionsForUser(userId: string): Promise<any[]> {
  const userDoc = db.collection(USERS_COLLECTION).doc(userId);
  const user = await userDoc.get();

  if (!user.exists) {
    console.log('User does not exist');
    return [];
  }

  const userMissions = await db
    .collection(USERS_COLLECTION)
    .doc(userId)
    .collection(MISSIONS_COLLECTION)
    .get();
  return userMissions.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/**
 * Submits a mission completion and updates user stats.
 * @param userId The ID of the user.
 * @param missionId The ID of the mission completed.
 */
export async function submitMissionCompletion(userId: string, missionId: string): Promise<void> {
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
  const xpReward = missionData?.rewardXp || 100; // Default XP reward

  // Update user stats
  const userDoc = db.collection(USERS_COLLECTION).doc(userId);
  await userDoc.update({
    xp: FieldValue.increment(xpReward),
    strength: FieldValue.increment(missionData?.strengthIncrease || 0),
    intelligence: FieldValue.increment(missionData?.intelligenceIncrease || 0),
    wealth: FieldValue.increment(missionData?.wealthIncrease || 0),
  });

  // Delete the mission after completion
  await missionDoc.delete();
}
