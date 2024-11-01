import { IChat } from '@/global/types';
import { handleHeaders } from '@/utils/handleHeaders';
import { request } from '@/utils/request';

// eslint-disable-next-line import/prefer-default-export
export function getChats({ address, controller, llm }: { address: string; controller: string; llm: string }) {
	if (!address) {
		throw new Error('Invalid address');
	}
	const headers = handleHeaders({ address });
	return request<{ data: IChat[]; error: string }>('/getChats', headers, {
		body: JSON.stringify({ controller, llm }),
		method: 'POST'
	});
}
