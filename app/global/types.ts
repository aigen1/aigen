import { Dispatch, SetStateAction } from 'react';

export interface IReferralCode {
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

export interface IUser {
	userId: string;
	address: any;
	email: string | null;
	created_at: Date;
	credits: number;
	points: number;
	badges: number;
	level: number;
	referralCodes: IReferralCode[];
	refCodeUsed?: string;
	waiting?: boolean;
}

export interface IUserContext extends IUser {
	userLoading: boolean;
	connectAddress?: (userID: string, address?: string, isLogin?: boolean) => Promise<void>;
	signup?: (userID: string, address?: string, referralCode?: string) => Promise<void>;
	setUserDetailsContextState: Dispatch<SetStateAction<IUserContext>>;
	setLoading: Dispatch<SetStateAction<boolean>>;
}

export interface IChat {
	created_at: Date;
	prompt: string;
	answer: string;
	llm: string;
	controller: string;
	creditsUsed?: number;
}

export interface ILeaderboard {
	userId: string;
	address: any;
	email: string | null;
	credits: number;
	points: number;
	badges: number;
	level: number;
}
