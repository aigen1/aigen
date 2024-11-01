import { handleHeaders } from '@/utils/handleHeaders';
import { request } from '@/utils/request';

// eslint-disable-next-line import/prefer-default-export
export function verifyBuy({
	address,
	transactionHash,
	toAddress,
	amount
}: {
	address: string;
	transactionHash: string;
	toAddress: string;
	amount: string;
}) {
	if (!address) {
		throw new Error('Invalid address');
	}
	const headers = handleHeaders({ address });
	return request<{ data: any; error: string }>('/verifyBuy', headers, {
		body: JSON.stringify({ amount, toAddress, transactionHash }),
		method: 'POST'
	});
}
