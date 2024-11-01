import { charset, generate } from 'voucher-code-generator';

// eslint-disable-next-line import/prefer-default-export
export const generateRefCodes = (id: string) => {
	const codes = generate({
		charset: charset('alphanumeric'),
		count: 10,
		length: 10,
		postfix: `-${id}`
	});
	return codes;
};
