import { firestoreDB } from '@/api/api-utils/firebaseInit';
import verifyUser from '@/api/api-utils/verifyUser';
import { withErrorHandling } from '@/api/api-utils/withErrorHandling';
import { responseMessages } from '@/api/constants/response_messages';
import { IReferralCodeDB, IUserDB } from '@/api/types/types';
import { NextRequest, NextResponse } from 'next/server';

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

		const { referralCode } = await req.json();

		if (!referralCode) NextResponse.json({ error: responseMessages.missing_params }, { status: 404 });

		const userRef = firestoreDB.collection('users').doc(validUser.userId);

		const doc = await userRef.get();

		if (!doc.exists) {
			return NextResponse.json({ data: null, error: 'Invalid User' }, { status: 400 });
		}

		const referralCollection = firestoreDB.collection('referralCodes');
		const referralRef = referralCollection.doc(String(referralCode));
		const refDoc = await referralRef.get();

		if (refDoc.exists) {
			const refData = refDoc.data() as IReferralCodeDB;

			if (refData.used && !refData.redeemed) {
				const points = 50;
				await referralRef.set({ pointsEarned: points, ...refData, redeemed: true }, { merge: true });
				const userData = doc.data() as IUserDB;
				const updatedPoints = userData.points + points;
				// Change this for level
				const newData: IUserDB = { ...userData, points: updatedPoints };
				await firestoreDB
					.collection('users')
					.doc(validUser.userId)
					.set({ ...newData }, { merge: true });
				return NextResponse.json(
					{ data: { points: updatedPoints, pointsEarned: points }, error: null },
					{ status: 200 }
				);
			}
			return NextResponse.json({ data: null, error: 'Referral Points Already Redeemed' }, { status: 400 });
		}

		return NextResponse.json({ data: null, error: 'Invalid Referral Code' }, { status: 400 });
	} catch (err: unknown) {
		console.error(err);
		return NextResponse.json({ error: responseMessages.internal }, { status: 500 });
	}
});
