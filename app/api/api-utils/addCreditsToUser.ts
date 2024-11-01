import { firestoreDB } from './firebaseInit';
import { IUserDB } from '../types/types';

// eslint-disable-next-line import/prefer-default-export
export const addCreditsToUser = async (userId: string, creditsToAdd: number) => {
	const userRef = firestoreDB.collection('users').doc(userId);
	const userDoc = await userRef.get();
	const userData = userDoc.data() as IUserDB;

	userRef.set({ ...userData, credits: userData.credits + creditsToAdd }, { merge: true });
};
