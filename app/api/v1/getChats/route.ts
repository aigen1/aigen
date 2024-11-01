import { firestoreDB } from '@/api/api-utils/firebaseInit';
import verifyUser from '@/api/api-utils/verifyUser';
import { withErrorHandling } from '@/api/api-utils/withErrorHandling';
import { responseMessages } from '@/api/constants/response_messages';
import { IChatDB } from '@/api/types/types';
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

		const { controller, llm } = await req.json();

		if (!controller || !llm) return NextResponse.json({ error: responseMessages.missing_params }, { status: 404 });

		const chatsData = (
			await firestoreDB
				.collection('chats')
				.doc(validUser.userId)
				.collection(`${controller}-${llm}`)
				.orderBy('created_at', 'desc')
				.get()
		).docs.map((r) => (r.exists ? (r.data() as IChatDB) : {}));

		if (chatsData && chatsData.length > 0) {
			return NextResponse.json({ data: chatsData, error: null }, { status: 200 });
		}
		return NextResponse.json({ data: null, error: 'No chats found.' }, { status: 400 });
	} catch (err: unknown) {
		console.error(err);
		return NextResponse.json({ error: responseMessages.internal }, { status: 500 });
	}
});
