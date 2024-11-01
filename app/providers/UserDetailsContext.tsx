// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
/* eslint-disable sort-keys */

'use client';

import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { IUserContext } from '@/global/types';
import { toast } from 'react-toastify';
import { loginEth } from '@/backend-calls/loginEth';
import { useRouter } from 'next/navigation';
import { signupEth } from '@/backend-calls/signupEth';
import { useOnboardingContext } from './OnboardingContext';

export const initialUserDetailsContext: IUserContext = {
	userId: '',
	address: '',
	credits: 0,
	email: '',
	points: 0,
	badges: 0,
	level: 1,
	referralCodes: [],
	created_at: new Date(),
	userLoading: false,
	setUserDetailsContextState: (): void => {
		throw new Error('setUserDetailsContextState function must be overridden');
	},
	setLoading: (): void => {
		throw new Error('setLoading function must be overridden');
	}
};

export const UserDetailsContext: React.Context<IUserContext> = createContext(initialUserDetailsContext);

export function useGlobalUserDetailsContext() {
	return useContext(UserDetailsContext);
}

export const UserDetailsProvider = ({ children }: { children?: ReactNode }): ReactNode => {
	const [userDetailsContextState, setUserDetailsContextState] = useState(initialUserDetailsContext);
	const { wallets } = useWallets();

	const navigate = useRouter();

	const { onStart } = useOnboardingContext();

	const [loading, setLoading] = useState(false);

	const { user, authenticated, logout, ready } = usePrivy();

	const signup = useCallback(
		async (userID: string, address?: string, referralCode?: string) => {
			console.log('connectAddress called');
			if (!userID) {
				return;
			}
			setLoading(true);
			const { data: userData, error: signupError } = await signupEth({
				address: wallets?.[0]?.address || address || '',
				referralCode: referralCode || ''
			});
			console.log('login', userData, signupError);

			// const { data: userData, error: connectAddressErr } = await nextApiClientFetch<IUser>(
			// `${EVM_API_AUTH_URL}/connectAddressEth`,
			// {},
			// { address, userID }
			// );

			if (signupError) {
				logout();
				setUserDetailsContextState(initialUserDetailsContext);
				toast(signupError || 'Error in Signup', { type: 'error' });
			}
			if (!signupError && userData) {
				if (userData.waiting) {
					setUserDetailsContextState({
						...initialUserDetailsContext,
						address: userData.address,
						waiting: userData.waiting
					});
					toast('Waitlisted!', { type: 'success' });
					navigate.push('/signup/refCode');
				} else {
					setUserDetailsContextState((prevState) => {
						return {
							...prevState,
							userId: userData.userId,
							email: userData.email,
							address: userData.address,
							referralCodes: userData.referralCodes,
							created_at: userData.created_at,
							credits: userData.credits,
							points: userData.points,
							badges: userData.badges,
							refCodeUsed: userData.refCodeUsed,
							level: userData.level,
							waiting: false
						};
					});
					if (typeof window !== 'undefined') {
						localStorage.setItem('userId', userData.userId);
					}
					onStart(true);
				}
			}
			setLoading(false);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	const connectAddress = useCallback(
		async (userID: string, address?: string, isLogin?: boolean) => {
			console.log('connectAddress called');
			if (!userID) {
				return;
			}
			setLoading(true);
			const { data: userData, error: loginError } = await loginEth({
				address: wallets?.[0]?.address || address || ''
			});
			console.log('login', userData, loginError);

			// const { data: userData, error: connectAddressErr } = await nextApiClientFetch<IUser>(
			// `${EVM_API_AUTH_URL}/connectAddressEth`,
			// {},
			// { address, userID }
			// );

			if (loginError) {
				logout();
				setUserDetailsContextState(initialUserDetailsContext);
				toast(loginError || 'Error in Login', { type: 'error' });
			}
			if (!loginError && userData) {
				if (userData.waiting) {
					if (isLogin) {
						setUserDetailsContextState({
							...initialUserDetailsContext,
							address: userData.address,
							waiting: userData.waiting
						});
						toast('User is in Waitlist, Please provide a Referral Code.', { type: 'warning' });
						navigate.push('/signup/refCode');
					} else {
						logout();
						setUserDetailsContextState(initialUserDetailsContext);
					}
				} else {
					setUserDetailsContextState((prevState) => {
						return {
							...prevState,
							userId: userData.userId,
							email: userData.email,
							address: userData.address,
							referralCodes: userData.referralCodes,
							created_at: userData.created_at,
							credits: userData.credits,
							points: userData.points,
							badges: userData.badges,
							refCodeUsed: userData.refCodeUsed,
							level: userData.level,
							waiting: false
						};
					});
					if (typeof window !== 'undefined') {
						localStorage.setItem('userId', userData.userId);
					}
				}
			}
			setLoading(false);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	useEffect(() => {
		// if (
		// sharedSafeAddress &&
		// isValidWeb3Address(sharedSafeAddress) &&
		// sharedSafeNetwork &&
		// Object.values(NETWORK).includes(sharedSafeNetwork as NETWORK)
		// ) {
		// // getSharedSafeAddressData();
		// return;
		// }
		if (authenticated && ready && !loading) {
			console.log('wallet changed');
			connectAddress(user?.id || '', user?.wallet?.address);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ready]);

	const value = useMemo(
		() => ({
			...userDetailsContextState,
			connectAddress,
			signup,
			userLoading: loading,
			setUserDetailsContextState,
			setLoading
		}),
		[connectAddress, loading, signup, userDetailsContextState]
	);

	return <UserDetailsContext.Provider value={value}>{children}</UserDetailsContext.Provider>;
};
