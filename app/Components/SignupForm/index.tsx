import { useGlobalUserDetailsContext } from '@/providers/UserDetailsContext';
import PrimaryButton from '@/ui-components/PrimaryButton';
import { useLogin, usePrivy } from '@privy-io/react-auth';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useCallback, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SignupForm = ({ onClose }: { onClose?: () => void }) => {
	const { logout } = usePrivy();
	const { signup, userLoading } = useGlobalUserDetailsContext();

	const searchParams = useSearchParams();
	const codeFromLink = searchParams.get('ref') || '';
	const [referralCode, setReferralCode] = useState<string>(codeFromLink);

	const handleSignup = useCallback(
		async (userID: string, address: string) => {
			try {
				if (!address || !userID) {
					return;
				}
				console.log('before connect address');
				await signup?.(userID, address, referralCode);
			} catch (err) {
				console.log(err);
				logout();
			}
		},
		[signup, referralCode, logout]
	);

	const { login } = useLogin({
		onComplete(user) {
			console.log(' privy login complete');
			if (user && user.id) {
				handleSignup(user?.id, user?.wallet?.address || '');
			}
		}
	});
	return (
		<div className='flex flex-col items-center gap-y-4'>
			<span className='text-sm text-text_black'>Signup to enter a world of Modular AI</span>
			<span className='text-xl font-recharge text-text_black'>Create an account</span>
			<div className='w-full'>
				<p className='text-text_grey text-xs mb-2'>Referral Code</p>
				<input
					disabled={userLoading}
					value={referralCode}
					onChange={(e) => setReferralCode(e.target.value)}
					placeholder='Referral Code'
					className='w-full px-4 py-2 bg-white outline-none border border-border_grey resize-none rounded-xl text-sm text-text_black flex items-center'
				/>
			</div>
			<PrimaryButton
				loading={userLoading}
				onClick={() => {
					login();
				}}
			>
				Connect Wallet
			</PrimaryButton>
			<div className='text-sm flex items-center gap-x-1'>
				<span className='text-text_secondary'>Already have an account with us?</span>
				<Link
					className='text-primary_orange'
					href='/login'
				>
					Log In
				</Link>
			</div>
		</div>
	);
};

export default SignupForm;
