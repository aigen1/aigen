import { handleHeaders } from '@/utils/handleHeaders';
import { request } from '@/utils/request';

// eslint-disable-next-line import/prefer-default-export
export function redeemPoints({ address, referralCode }: { address: string; referralCode: string }) {
	if (!address) {
		throw new Error('Invalid address');
	}
	const headers = handleHeaders({ address });
	return request<{ data: any; error: string }>('/redeemPoints', headers, {
		body: JSON.stringify({ referralCode }),
		method: 'POST'
	});
}
