import { IUser } from '@/global/types';
import { handleHeaders } from '@/utils/handleHeaders';
import { request } from '@/utils/request';

// eslint-disable-next-line import/prefer-default-export
export function loginEth({ address }: { address: string }) {
	if (!address) {
		throw new Error('Invalid address');
	}
	const headers = handleHeaders({ address });
	return request<{ data: IUser; error: string }>('/auth/loginEth', headers, {
		method: 'POST'
	});
}
