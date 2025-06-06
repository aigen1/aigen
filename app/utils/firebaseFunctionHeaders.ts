/* eslint-disable @typescript-eslint/naming-convention */
const firebaseFunctionsHeader = (address?: string, contentType?: string) => ({
	Accept: 'application/json',
	'Content-Type': contentType || 'application/json',
	'x-address': address || localStorage.getItem('address') || '',
	'x-token': (typeof window !== 'undefined' && localStorage.getItem('privy:token')?.split('"')[1]) || ''
});

export default firebaseFunctionsHeader;
