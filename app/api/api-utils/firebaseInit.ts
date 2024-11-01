import * as firebaseAdmin from 'firebase-admin';
import { deepParseJson } from 'deep-parse-json';

const config = process.env.AIGEN_FIREBASE_CONFIG;

if (!config) {
	throw new Error('Internal Error: POLKASAFE_FIREBASE_CONFIG missing.');
}

const initializeFirebase = (key: any) => {
	if (firebaseAdmin.apps.length > 0) {
		return firebaseAdmin.app();
	}
	return firebaseAdmin.initializeApp({
		credential: firebaseAdmin.credential.cert(key)
	});
};

const serviceAccount = deepParseJson(config) as firebaseAdmin.ServiceAccount;

const app = initializeFirebase(serviceAccount);
const firestoreDB = firebaseAdmin.firestore(app);
export { firestoreDB, firebaseAdmin as ADMIN };
