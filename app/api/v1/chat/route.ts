/* eslint-disable @typescript-eslint/naming-convention */
import { firestoreDB } from '@/api/api-utils/firebaseInit';
import verifyUser from '@/api/api-utils/verifyUser';
import { withErrorHandling } from '@/api/api-utils/withErrorHandling';
import { responseMessages } from '@/api/constants/response_messages';
import { IChatDB } from '@/api/types/types';
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { deductCreditsFromUser, eligibleToChat } from '@/api/api-utils/chatUtils';

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

		const { prompt, controller, llm } = await req.json();

		if (!prompt || !controller || !llm)
			return NextResponse.json({ error: responseMessages.missing_params }, { status: 404 });

		const eligible = await eligibleToChat(validUser.userId, 20);

		if (!eligible) {
			return NextResponse.json(
				{ data: null, error: 'Insufficient Credits to Chat, Please Buy Credits' },
				{ status: 400 }
			);
		}

		const controllerRes = await axios.post(
			`http://194.61.20.150:5000/${controller}`,
			{
				model: `${llm}`,
				text: `${prompt}`
			},
			{
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				}
			}
		);

		const data = await controllerRes.data;

		if (data.response) {
			const answer = JSON.stringify(data.response);

			const chat: IChatDB = {
				answer,
				controller,
				created_at: new Date(),
				llm,
				prompt
			};

			const creditsUsed = await deductCreditsFromUser(validUser.userId, controller);

			await firestoreDB
				.collection('chats')
				.doc(validUser.userId)
				.collection(`${controller}-${llm}`)
				.doc()
				.set({ ...chat });
			return NextResponse.json({ data: { creditsUsed, response: data.response }, error: null }, { status: 200 });
		}
		return NextResponse.json(
			{ data: null, error: 'There was some error in generating the response.' },
			{ status: 400 }
		);
	} catch (err: unknown) {
		console.error(err);
		return NextResponse.json({ error: responseMessages.internal }, { status: 500 });
	}
});
