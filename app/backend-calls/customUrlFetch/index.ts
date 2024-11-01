import { handleHeaders } from '@/utils/handleHeaders';
import { request } from '@/utils/request';

// eslint-disable-next-line import/prefer-default-export
export function customUrlFetch<T>({ address, url, body }: { address: string; url: string; body: object }) {
	if (!address) {
		throw new Error('Invalid address');
	}
	const headers = handleHeaders({ address });
	return request<{ data: T; error: string }>(url, headers, {
		body: JSON.stringify(body),
		method: 'POST'
	});
}
