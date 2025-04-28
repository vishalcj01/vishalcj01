'use server';

import {db} from '@/lib/firebaseAdmin';
import {FieldValue} from 'firebase-admin/firestore';
import {revalidatePath} from 'next/cache';
import {auth} from '@/lib/firebaseAdmin';
import {cookies} from 'next/headers';

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

export async function submitMissionCompletion(missionId: string): Promise<{ success: boolean; message: string }> {
  try {
    const session = cookies().get('session');

    if (!session) {
      return {success: false, message: 'Unauthorized'};
    }

    const user = await auth.verifySessionCookie(session.value);

    if (!user) {
      return {success: false, message: 'Unauthorized'};
    }

    const missionDoc = db
      .collection(USERS_COLLECTION)
      .doc(user.uid)
      .collection(MISSIONS_COLLECTION)
      .doc(missionId);
    const mission = await missionDoc.get();

    if (!mission.exists) {
      return {success: false, message: 'Mission not found'};
    }

    const missionData = mission.data();
    if (!missionData) {
      return {success: false, message: 'Mission data is missing'};
    }
    const xpReward = missionData.rewardXp || 100;

    const userDoc = db.collection(USERS_COLLECTION).doc(user.uid);
    await userDoc.update({
      xp: FieldValue.increment(xpReward),
      strength: FieldValue.increment(missionData.strengthIncrease || 0),
      intelligence: FieldValue.increment(missionData.intelligenceIncrease || 0),
      wealth: FieldValue.increment(missionData.wealthIncrease || 0),
    });

    await missionDoc.delete();
    revalidatePath('/');
    return {success: true, message: 'Mission completed successfully'};
  } catch (error: any) {
    console.error('Error completing mission:', error);
    return {success: false, message: error.message || 'Failed to complete mission.'};
  }
}
