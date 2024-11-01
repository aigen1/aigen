export interface IUserDB {
	userId: string;
	address: any;
	email: string | null;
	created_at: Date;
	credits: number;
	points: number;
	badges: number;
	level: number;
	referralCodes: string[];
	refCodeUsed?: string;
	waiting?: boolean;
}

export interface IReferralCodeDB {
	code: string;
	userId: string;
	userAddress: string;
	created_at: Date;
	used: boolean;
	usedBy?: {
		address: string;
		email?: string;
	};
	pointsEarned?: number;
	redeemed: boolean;
}

export interface IChatDB {
	created_at: Date;
	prompt: string;
	answer: string;
	llm: string;
	controller: string;
	creditsUsed?: number;
}

export interface ILeaderboardDB {
	userId: string;
	address: any;
	email: string | null;
	credits: number;
	points: number;
	badges: number;
	level: number;
}
