import { fetchPF } from './fetchPF';

// eslint-disable-next-line import/prefer-default-export
export function request<T>(endpoint: string, reqHeaders?: any, options?: RequestInit): Promise<T> {
	const baseUrl = window.location.origin;
	const reqURL = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;

	const url = `${baseUrl}/api/v1/${reqURL}`;

	const headers = {
		Accept: 'application/json',
		// eslint-disable-next-line @typescript-eslint/naming-convention
		'Content-Type': 'application/json',
		...reqHeaders
	};
	const config = {
		...options,
		headers
	};
	return fetchPF(url, config)
		.then((response) => {
			return response.json();
		})
		.catch((error) => {
			console.log('error', error);
			throw new Error(error.message);
		});
}
