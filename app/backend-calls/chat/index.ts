import { handleHeaders } from '@/utils/handleHeaders';
import { request } from '@/utils/request';

// eslint-disable-next-line import/prefer-default-export
export function chat({
	address,
	prompt,
	controller,
	llm
}: {
	address: string;
	prompt: string;
	controller: string;
	llm: string;
}) {
	if (!address) {
		throw new Error('Invalid address');
	}
	const headers = handleHeaders({ address });
	return request<{ data: any; error: string }>('/chat', headers, {
		body: JSON.stringify({ controller, llm, prompt }),
		method: 'POST'
	});
}
