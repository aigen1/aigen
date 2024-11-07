import { firestoreDB } from './firebaseInit';
import { IUserDB } from '../types/types';

export const getCreditsUsedByController = (controller: string) => {
	const creditsToDeduct = controller === 'poem' ? 20 : 10;
	return creditsToDeduct;
};

export const deductCreditsFromUser = async (userId: string, controller: string) => {
	const userRef = firestoreDB.collection('users').doc(userId);
	const userDoc = await userRef.get();
	const userData = userDoc.data() as IUserDB;

	// Change this
	const creditsToDeduct = getCreditsUsedByController(controller);

	if (userData.credits >= creditsToDeduct) {
		userRef.set({ ...userData, credits: userData.credits - creditsToDeduct }, { merge: true });
		return creditsToDeduct;
	}
	return 0;
};

export const eligibleToChat = async (userId: string, creditsToBeUsed: number) => {
	const userRef = firestoreDB.collection('users').doc(userId);
	const userDoc = await userRef.get();
	const userData = userDoc.data() as IUserDB;

	return userData.credits >= creditsToBeUsed;
};
