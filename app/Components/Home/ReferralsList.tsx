'use client';

import { useGlobalUserDetailsContext } from '@/providers/UserDetailsContext';
import copyText from '@/utils/copyText';
import { Skeleton } from '@nextui-org/skeleton';
import Image from 'next/image';
import React from 'react';
import UserLoggedOut from '@/ui-components/UserLoggedOut';
import SecondaryButton from '@/ui-components/SecondaryButton';
import { MetaMaskAvatar } from 'react-metamask-avatar';
import shortenAddress from '@/utils/shortenAddress';
import RedeemPoints from './RedeemPoints';

const ReferralsList = () => {
	const { referralCodes, userId, userLoading } = useGlobalUserDetailsContext();

	const redeemedCodes = referralCodes.filter((item) => item.used && item.redeemed);

	const usedRefCodes = referralCodes.filter((item) => item.used && !item.redeemed);

	const remainingRefCodes = referralCodes.filter((item) => !item.used);

	return (
		<div
			id='tour-4'
			className='flex flex-col flex-1'
		>
			<div className='font-recharge text-xl text-text_black mb-1'>Invites</div>
			<div className='text-sm text-text_black mb-3'>Your invites will show up here</div>
			{userId ? (
				<div className='flex flex-col gap-y-4 flex-1 overflow-y-auto'>
					{userLoading ? (
						<>
							<div className='flex items-center gap-x-2'>
								<Skeleton className='h-[30px] w-[30px] rounded-full' />
								<Skeleton className='h-4 w-full rounded-lg' />
							</div>
							<div className='flex items-center gap-x-2'>
								<Skeleton className='h-[30px] w-[30px] rounded-full' />
								<Skeleton className='h-4 w-full rounded-lg' />
							</div>
							<div className='flex items-center gap-x-2'>
								<Skeleton className='h-[30px] w-[30px] rounded-full' />
								<Skeleton className='h-4 w-full rounded-lg' />
							</div>
						</>
					) : (
						<>
							{redeemedCodes.map((item, i) => (
								<div
									className='flex items-center gap-x-2'
									key={i}
								>
									<MetaMaskAvatar
										size={30}
										address={item.usedBy?.address || ''}
									/>
									<div className='w-full'>
										<p className='text-sm mb-1 text-text_black flex items-center justify-between w-full gap-x-2'>
											<p>
												<span className='font-recharge'>{shortenAddress(item.usedBy?.address || '')} </span>
												<span className='text-text_grey text-xs'>referral redeemed</span>
											</p>
											{item.pointsEarned ? (
												<span className='text-success text-xs font-recharge'>+{item.pointsEarned} pts</span>
											) : (
												<Image
													src='/assets/checked-icon.png'
													height={20}
													width={20}
													alt='checked'
												/>
											)}
										</p>
									</div>
								</div>
							))}
							{usedRefCodes.map((item, i) => (
								<RedeemPoints
									key={i}
									code={item.code}
									email={item.usedBy?.email}
								/>
							))}
							{remainingRefCodes.map((item, i) => (
								<div
									className='flex items-center gap-x-2'
									key={i}
								>
									<Image
										src='/assets/ref-code-icon.png'
										height={30}
										width={30}
										alt='avatar'
									/>
									<div className='flex items-center justify-between w-full'>
										<p className='font-recharge text-sm mb-1 text-text_black'>{item.code}</p>
										<SecondaryButton
											size='sm'
											onClick={() => copyText(item.code)}
											className='px-4'
										>
											Copy
										</SecondaryButton>
									</div>
								</div>
							))}
						</>
					)}
				</div>
			) : (
				<UserLoggedOut />
			)}
		</div>
	);
};

export default ReferralsList;
