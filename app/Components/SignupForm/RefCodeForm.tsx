import { useGlobalUserDetailsContext } from '@/providers/UserDetailsContext';
import PrimaryButton from '@/ui-components/PrimaryButton';
import SecondaryButton from '@/ui-components/SecondaryButton';
import shortenAddress from '@/utils/shortenAddress';
import { usePrivy } from '@privy-io/react-auth';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const RefCodeForm = ({ onClose }: { onClose?: () => void }) => {
	const { logout, user } = usePrivy();
	const { signup, userLoading, setLoading, address: userAddress } = useGlobalUserDetailsContext();

	const searchParams = useSearchParams();
	const codeFromLink = searchParams.get('ref') || '';
	const [referralCode, setReferralCode] = useState<string>(codeFromLink);

	const navigate = useRouter();

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
	return (
		<div className='flex flex-col items-center gap-y-4'>
			<Image
				src='/assets/join-waitlist.png'
				alt='waitlist'
				height={150}
				width={150}
			/>
			<div className='text-sm text-text_black'>Oops, you are not approved- you need a referral code to sign in!</div>
			<div className='w-full'>
				<p className='text-text_grey text-xs mb-2'>If you have a referral code, please enter it</p>
				<input
					disabled={userLoading}
					value={referralCode}
					onChange={(e) => setReferralCode(e.target.value)}
					placeholder='Enter here'
					className='w-full px-4 py-2 bg-white outline-none border border-border_grey resize-none rounded-xl text-sm text-text_black flex items-center'
				/>
			</div>
			<div className='text-text_black text-sm'>{shortenAddress(userAddress, 8)} has been waitlisted.</div>
			<div className='flex w-full items-center justify-between'>
				<SecondaryButton
					disabled={userLoading}
					onClick={() => navigate.back()}
				>
					Back
				</SecondaryButton>
				<PrimaryButton
					loading={userLoading}
					disabled={!referralCode}
					onClick={() => {
						setLoading(true);
						handleSignup(user?.id || '', user?.wallet?.address || userAddress);
					}}
				>
					Continue
				</PrimaryButton>
			</div>
		</div>
	);
};

export default RefCodeForm;
