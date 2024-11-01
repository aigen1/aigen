import { PrivyClient } from '@privy-io/server-auth';

class Privy {
	private privy: PrivyClient;

	constructor() {
		this.privy = new PrivyClient(process.env.NEXT_PUBLIC_PRIVY_APP_ID || '', process.env.PRIVY_APP_SECRET || '');
	}

	async verifyAuthToken(token: string) {
		return this.privy.verifyAuthToken(token);
	}

	async getUserId(token: string) {
		const verifiedClaims = await this.verifyAuthToken(token);
		return verifiedClaims.userId;
	}

	async getPrivyUser(userId: string) {
		return this.privy.getUser(userId);
	}

	async getPrivyUserByWalletAddress(address: string) {
		return this.privy.getUserByWalletAddress(address);
	}
}
export default Privy;
