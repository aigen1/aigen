import { firestoreDB } from '@/api/api-utils/firebaseInit';
import verifyUser from '@/api/api-utils/verifyUser';
import { withErrorHandling } from '@/api/api-utils/withErrorHandling';
import { responseMessages } from '@/api/constants/response_messages';
import { IReferralCodeDB, IUserDB } from '@/api/types/types';
import { NextRequest, NextResponse } from 'next/server';

const getUserRefCodesDetails = async (userId: string) => {
	if (!userId) return;

	const referralsData = (await firestoreDB.collection('referralCodes').where('userId', '==', userId).get()).docs.map(
		(r) => (r.exists ? (r.data() as IReferralCodeDB) : [])
	);

	// eslint-disable-next-line consistent-return
	return referralsData;
};

// eslint-disable-next-line import/prefer-default-export
export const POST = withErrorHandling(async (req: NextRequest) => {
	const { headers } = req;
	const token = headers.get('x-token');
	const address = headers.get('x-address');

	try {
		if (!token || !address) {
			return NextResponse.json({ error: responseMessages.missing_headers }, { status: 404 });
		}
		const validUser = await verifyUser(token);
		if (!validUser) {
			return NextResponse.json({ error: responseMessages.invalid_signature }, { status: 400 });
		}
		const userRef = firestoreDB.collection('users').doc(validUser.userId);

		const doc = await userRef.get();

		// check if address doc already exists
		if (doc.exists) {
			const data = doc.data() as IUserDB;
			// const userDoc = {
			// ...data,
			// created_at: data?.created_at.toDate()
			// } as IUser;

			const referralsData = await getUserRefCodesDetails(validUser.userId);

			const resUser = { ...data, level: data.level || 1, referralCodes: referralsData || [] };
			return NextResponse.json({ data: resUser, error: null }, { status: 200 });
		}

		const waitlistRef = firestoreDB.collection('waitlist').doc(String(address));

		const waitlistDoc = await waitlistRef.get();

		// user exists in waitlist, sign up.
		if (waitlistDoc.exists) {
			return NextResponse.json({ data: { address, waiting: true }, error: null }, { status: 200 });
		}
		return NextResponse.json({ data: null, error: 'Address not in Waitlist, Please Sign Up.' }, { status: 400 });
	} catch (err: unknown) {
		console.error(err);
		return NextResponse.json({ error: responseMessages.internal }, { status: 500 });
	}
});
