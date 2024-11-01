import { redeemPoints } from '@/backend-calls/redeemPoints';
import { useGlobalUserDetailsContext } from '@/providers/UserDetailsContext';
import SecondaryButton from '@/ui-components/SecondaryButton';
import Image from 'next/image';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

const RedeemPoints = ({ code, email }: { code: string; email?: string }) => {
	const { userId, address, setUserDetailsContextState } = useGlobalUserDetailsContext();

	const [loading, setLoading] = useState<boolean>(false);

	const redeem = async () => {
		if (!userId || !code) {
			return;
		}
		setLoading(true);
		const { data: redeemData, error: redeemError } = await redeemPoints({ address, referralCode: code });

		if (redeemData && !redeemError) {
			toast('Congratulations!', { type: 'success' });
			setUserDetailsContextState((prev) => {
				const copyRefs = [...prev.referralCodes];
				const refObjIndex = copyRefs.findIndex((item) => item.code === code);
				copyRefs[refObjIndex] = {
					...prev.referralCodes[refObjIndex],
					pointsEarned: redeemData.pointsEarned,
					redeemed: true
				};
				return {
					...prev,
					// Change this for Level
					points: redeemData.points,
					referralCodes: copyRefs
				};
			});
		} else {
			toast(redeemError, { type: 'error' });
		}
		setLoading(false);
	};

	return (
		<div className='flex items-center gap-x-2'>
			<Image
				src='/assets/avatar.png'
				height={30}
				width={30}
				alt='avatar'
			/>
			<div className='flex-1'>
				<p className='font-recharge text-sm mb-1 text-text_black'>{code}</p>
				<p className='text-sm text-text_black'>{email}</p>
			</div>
			<SecondaryButton
				size='sm'
				onClick={redeem}
				className='px-4'
				loading={loading}
			>
				Redeem
			</SecondaryButton>
		</div>
	);
};

export default RedeemPoints;
