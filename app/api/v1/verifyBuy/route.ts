import { addCreditsToUser } from '@/api/api-utils/addCreditsToUser';
import { firestoreDB } from '@/api/api-utils/firebaseInit';
import verifyUser from '@/api/api-utils/verifyUser';
import { withErrorHandling } from '@/api/api-utils/withErrorHandling';
import { responseMessages } from '@/api/constants/response_messages';
import { ethers } from 'ethers';
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

		const { transactionHash, toAddress, amount } = await req.json();

		if (!transactionHash) return NextResponse.json({ error: responseMessages.missing_params }, { status: 404 });

		const provider = new ethers.JsonRpcProvider('https://polygon-rpc.com');

		const transactionDetails = await provider.getTransaction(transactionHash);

		if (transactionDetails) {
			const txData = transactionDetails.data;
			const erc20Abi = ['function transfer(address to, uint256 value)'];
			const contractInterface = new ethers.Interface(erc20Abi);
			const decoded = contractInterface.parseTransaction({ data: txData, value: transactionDetails.value });

			console.log('transaction', transactionDetails, decoded);

			const onChainToAddress = decoded?.args[0] || '';
			const onChainAmount = decoded?.args[1] || BigInt(0);

			// if valid, increase users credits
			if (BigInt(amount) === BigInt(onChainAmount) && toAddress === String(onChainToAddress)) {
				// check if transaction doc already exists.
				const transactionRef = firestoreDB.collection('transactions').doc(transactionHash);
				const transactionDoc = await transactionRef.get();
				if (transactionDoc.exists) {
					return NextResponse.json({ data: null, error: 'Transaction Already Done' }, { status: 400 });
				}

				// Change this for credits
				const creditsBought = 100;

				addCreditsToUser(validUser.userId, creditsBought);

				// create an entry of the transaction
				await transactionRef.set(
					{
						amount: ethers.formatUnits(onChainAmount, 6),
						blockHash: transactionDetails.blockHash,
						blockNumber: transactionDetails.blockNumber,
						creditsBought,
						fromAddress: transactionDetails.from,
						network: transactionDetails.chainId,
						txData: transactionDetails.data,
						txHash: transactionDetails.hash,
						userId: validUser.userId
					},
					{ merge: true }
				);

				// return bought credits to update states
				return NextResponse.json({ data: { creditsBought }, error: null }, { status: 200 });
			}
		}

		return NextResponse.json({ data: null, error: 'INVALID TRANSACTION' }, { status: 400 });
	} catch (err: unknown) {
		console.error(err);
		return NextResponse.json({ error: responseMessages.internal }, { status: 500 });
	}
});
