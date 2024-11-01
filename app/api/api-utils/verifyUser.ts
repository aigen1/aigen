import { AuthTokenClaims } from '@privy-io/server-auth';
import Privy from './privy';

const privyBackend = new Privy();

export default async function verifyUser(token: string): Promise<false | AuthTokenClaims> {
	const user = await privyBackend.verifyAuthToken(token);
	if (!user) {
		return false;
	}
	return user;
}
