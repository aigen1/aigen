import { firestoreDB } from '@/api/api-utils/firebaseInit';
import verifyUser from '@/api/api-utils/verifyUser';
import { withErrorHandling } from '@/api/api-utils/withErrorHandling';
import { responseMessages } from '@/api/constants/response_messages';
import { ILeaderboardDB, IUserDB } from '@/api/types/types';
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

		const usersCollection = await firestoreDB.collection('users').get();

		const usersDocs = usersCollection.docs;

		const leaderBoard: ILeaderboardDB[] = usersDocs
			.sort((a, b) => b.data().points - a.data().points)
			.map((doc) => {
				const userData = doc.data() as IUserDB;

				return {
					address: userData.address,
					badges: userData.badges,
					credits: userData.credits,
					email: userData.email,
					level: userData.level || 1,
					points: userData.points,
					userId: userData.userId
				};
			});

		return NextResponse.json({ data: leaderBoard, error: null }, { status: 200 });
	} catch (err: unknown) {
		console.error(err);
		return NextResponse.json({ error: responseMessages.internal }, { status: 500 });
	}
});
