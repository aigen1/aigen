import { useGlobalUserDetailsContext } from '@/providers/UserDetailsContext';
import PrimaryButton from '@/ui-components/PrimaryButton';
import copyText from '@/utils/copyText';
import { Skeleton } from '@nextui-org/skeleton';
import React, { useState } from 'react';

const ShareReferral = ({ refCode }: { refCode: string }) => {
	const baseURL = typeof window !== 'undefined' && global.window.location.origin;
	const refLink = `${baseURL}/signup?ref=${refCode}`;

	const { userId, userLoading } = useGlobalUserDetailsContext();

	const [copied, setCopied] = useState<boolean>(false);

	return (
		<div className='rounded-2xl bg-bg_grey p-8 max-w-[45%]'>
			<div className='flex flex-col gap-y-1 mb-4'>
				<div className='text-text_deep_blue text-[20px] font-recharge'>Earn 600pts for invites</div>
				<div className='text-text_deep_blue text-sm'>
					Earn 50pts for each invite upto 8 people and 100pts for 9th & 10th invite. Get an NFT Badge for completing 10
					invites!
				</div>
			</div>
			<div className='flex flex-col gap-y-1'>
				<p className='text-text_grey text-xs'>Share Link</p>
				<div className='flex gap-x-2'>
					{userLoading ? (
						<Skeleton className='h-8 w-full rounded-xl' />
					) : (
						<p className='w-full px-4 bg-white outline-none border-none resize-none rounded-xl text-sm text-text_grey flex items-center'>
							{userId ? refLink : ''}
						</p>
					)}
					<PrimaryButton
						disabled={copied || !userId}
						size='sm'
						onClick={() => {
							copyText(refLink, 'Referral Link Copied!');
							setCopied(true);
						}}
					>
						{copied ? 'Copied' : 'Copy'}
					</PrimaryButton>
				</div>
			</div>
		</div>
	);
};

export default ShareReferral;
