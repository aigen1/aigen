import { ILeaderboard } from '@/global/types';
import { handleHeaders } from '@/utils/handleHeaders';
import { request } from '@/utils/request';

// eslint-disable-next-line import/prefer-default-export
export function getLeaderboard({ address }: { address: string }) {
	if (!address) {
		throw new Error('Invalid address');
	}
	const headers = handleHeaders({ address });
	return request<{ data: ILeaderboard[]; error: string }>('/getLeaderboard', headers, {
		method: 'POST'
	});
}
