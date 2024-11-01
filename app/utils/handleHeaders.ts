/* eslint-disable @typescript-eslint/naming-convention */
type headers = {
	address?: string;
	token?: string;
};

// eslint-disable-next-line import/prefer-default-export
export function handleHeaders(headers: headers) {
	const { address } = headers;
	return {
		'x-address': address || localStorage.getItem('address') || '',
		'x-token': (typeof window !== 'undefined' && localStorage.getItem('privy:token')?.split('"')[1]) || ''
	};
}
