import { useGlobalUserDetailsContext } from '@/providers/UserDetailsContext';
import copyText from '@/utils/copyText';
import { Button } from '@nextui-org/button';
import { Skeleton } from '@nextui-org/skeleton';
import Image from 'next/image';
import React from 'react';
import RedeemPoints from './RedeemPoints';
// import { MetaMaskAvatar } from 'react-metamask-avatar';

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
					userId && (
						<>
							{redeemedCodes.map((item, i) => (
								<div
									className='flex items-center gap-x-2'
									key={i}
								>
									<Image
										src='/assets/avatar.png'
										height={30}
										width={30}
										alt='avatar'
									/>
									<div className='w-full'>
										<p className='font-recharge text-sm mb-1 text-text_black flex items-center justify-between w-full gap-x-2'>
											<span className='line-through'>{item.code}</span>
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
										src='/assets/avatar.png'
										height={30}
										width={30}
										alt='avatar'
									/>
									<div>
										<p className='font-recharge text-sm mb-1 text-text_black flex items-center'>
											{item.code}
											<Button
												isIconOnly
												onClick={() => copyText(item.code)}
												className='p-0 bg-transparent border-none outline- h-auto'
											>
												<Image
													src='/assets/copy-icon.png'
													height={12}
													width={12}
													alt='copy'
												/>
											</Button>
										</p>
									</div>
								</div>
							))}
						</>
					)
				)}
			</div>
		</div>
	);
};

export default ReferralsList;
