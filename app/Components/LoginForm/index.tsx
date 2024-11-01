import { useGlobalUserDetailsContext } from '@/providers/UserDetailsContext';
import PrimaryButton from '@/ui-components/PrimaryButton';
import { useLogin, usePrivy } from '@privy-io/react-auth';
import Link from 'next/link';
import React, { useCallback } from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const LoginForm = ({ onClose }: { onClose?: () => void }) => {
	const { logout } = usePrivy();
	const { connectAddress, userLoading } = useGlobalUserDetailsContext();

	const handleLogin = useCallback(
		async (userID: string, address: string) => {
			try {
				if (!address || !userID) {
					return;
				}
				console.log('before connect address');
				await connectAddress?.(userID, address, true);
			} catch (err) {
				console.log(err);
				logout();
			}
		},
		[connectAddress, logout]
	);

	const { login } = useLogin({
		onComplete(user) {
			console.log(' privy login complete');
			if (user && user.id) {
				handleLogin(user?.id, user?.wallet?.address || '');
			}
		}
	});
	return (
		<div className='flex flex-col items-center gap-y-4'>
			<span className='text-xl font-recharge text-text_black'>Welcome Back</span>
			<PrimaryButton
				loading={userLoading}
				onClick={() => {
					login();
				}}
			>
				Connect Wallet
			</PrimaryButton>
			<div className='text-sm flex items-center gap-x-1'>
				<span className='text-text_secondary'>Don&apos;t have an account with us?</span>
				<Link
					className='text-primary_orange'
					href='/signup'
				>
					Sign Up
				</Link>
			</div>
		</div>
	);
};

export default LoginForm;
