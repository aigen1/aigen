import { NextRequest, NextResponse } from 'next/server';

// eslint-disable-next-line import/prefer-default-export
export const withErrorHandling = (handler: { (req: NextRequest, options?: any): Promise<NextResponse> }) => {
	return async (req: NextRequest, options: object) => {
		try {
			return await handler(req, options);
		} catch (error: any) {
			const err = error;
			console.log('Error in API call : ', req.nextUrl);
			return NextResponse.json({ ...err, message: err.message }, { status: err.status });
		}
	};
};
