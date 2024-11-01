import { firestoreDB } from '@/api/api-utils/firebaseInit';
import { generateRefCodes } from '@/api/api-utils/generateRefCodes';
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

		// check user Exists
		const userRef = firestoreDB.collection('users').doc(validUser.userId);
		const userDoc = await userRef.get();

		// check if address doc already exists
		if (userDoc.exists) {
			return NextResponse.json({ data: null, error: responseMessages.address_already_exists }, { status: 500 });
		}

		const waitlistRef = firestoreDB.collection('waitlist').doc(String(address));

		const waitlistDoc = await waitlistRef.get();

		// if not waitlist and then waitlist him
		if (!waitlistDoc.exists) {
			await waitlistRef.set({ address, email: '' });
		}

		const { referralCode } = await req.json();

		// user is in waitlist by here, no ref code means no login.
		if (!referralCode) {
			return NextResponse.json({ data: { address, waiting: true }, error: null }, { status: 200 });
		}

		if (referralCode) {
			const referralCollection = firestoreDB.collection('referralCodes');
			const referralRef = referralCollection.doc(String(referralCode));
			const refDoc = await referralRef.get();

			if (!refDoc.exists) {
				return NextResponse.json({ data: null, error: 'Invalid Referral Code' }, { status: 400 });
			}

			const waitlistData = waitlistDoc.data() as { address: string; email: string };
			const userEmail = waitlistData.email || '';

			if (refDoc.exists) {
				const refData = refDoc.data() as IReferralCodeDB;

				if (!refData.used) {
					await referralRef.set({ ...refData, used: true, usedBy: { address, email: userEmail } }, { merge: true });

					// generate new codes for new user.
					const refCodes = generateRefCodes(validUser.userId.slice(-3));
					const newUser: IUserDB = {
						address: String(address),
						badges: 0,
						created_at: new Date(),
						credits: 500,
						email: userEmail,
						level: 1,
						points: 0,
						refCodeUsed: referralCode,
						referralCodes: refCodes,
						userId: validUser.userId
					};

					const referralsData = [];
					// eslint-disable-next-line no-restricted-syntax
					for (const code of refCodes) {
						const newRefCode: IReferralCodeDB = {
							code,
							created_at: new Date(),
							redeemed: false,
							used: false,
							userAddress: address,
							userId: validUser.userId
						};
						referralsData.push(newRefCode);
						// eslint-disable-next-line no-await-in-loop
						await referralCollection.doc(String(code)).set(newRefCode);
					}
					await firestoreDB
						.collection('users')
						.doc(validUser.userId)
						.set({ ...newUser }, { merge: true });
					return NextResponse.json(
						{ data: { ...newUser, referralCodes: referralsData }, error: null },
						{ status: 200 }
					);
				}
				return NextResponse.json({ data: null, error: 'Referral Code Already Used' }, { status: 400 });
			}
		}

		return NextResponse.json({ data: null, error: 'Address not in waitlist' }, { status: 400 });
	} catch (err: unknown) {
		console.error(err);
		return NextResponse.json({ error: responseMessages.internal }, { status: 500 });
	}
});
