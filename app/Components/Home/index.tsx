'use client';

import './style.css';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ScrollButton from '@/ui-components/ScrollButton';
import UserPoints from '@/ui-components/UserPoints';
import UserLevel from '@/ui-components/UserLevel';
import { useGlobalUserDetailsContext } from '@/providers/UserDetailsContext';
import Leaderboard from './Leaderboard';
import Background from './Background';
import ShareReferral from './ShareReferral';
import ReferralsList from './ReferralsList';
import BuyCredits from './BuyCredits';

const HomePage = () => {
	const [scrolledToTop, setScrolledToTop] = useState<boolean>(false);
	const [scrollDistance, setScrollDistance] = useState<number>(0);
	const { referralCodes, credits, badges, points, userId } = useGlobalUserDetailsContext();

	const listenToScroll = () => {
		if (typeof window !== 'undefined') {
			// const heightToHideFrom = 200;
			const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
			const totalHeight = window.innerHeight;
			const scrollHeight = (totalHeight / 100) * 40 - 80;
			setScrollDistance(scrollHeight);
			if (winScroll > scrollHeight / 2) {
				setScrolledToTop(true);
			} else {
				setScrolledToTop(false);
			}
		}
	};

	useEffect(() => {
		listenToScroll();
	}, []);

	useEffect(() => {
		if (typeof window === 'undefined') return;
		window.addEventListener('scroll', listenToScroll);
		// eslint-disable-next-line consistent-return
		return () => window.removeEventListener('scroll', listenToScroll);
	}, []);

	return (
		<div className='h-full flex-1 flex flex-col'>
			<Background
				scrolledToTop={scrolledToTop}
				credits={credits}
				points={points}
				badges={badges}
			/>
			<div className='temp-height' />
			<div className='main-container flex-1 flex flex-col'>
				<div className='btn-div bg-transparent h-[120px] items-center justify-between flex px-6 top-[80px]'>
					<UserLevel />
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: scrolledToTop ? 1 : 0 }}
						transition={{ duration: 0.2 }}
					>
						{userId && (
							<UserPoints
								credits={credits}
								points={points}
								badges={badges}
							/>
						)}
					</motion.div>
					<div>
						<ScrollButton scrollDistance={scrollDistance} />
					</div>
				</div>
				<div className='content bg-white h-full max-h-[calc(100vh-80px-120px)] overflow-y-auto p-12 flex-1 relative'>
					<div className='flex gap-x-6 w-full mb-6 h-[300px]'>
						<div className='rounded-2xl p-4 bg-[#3D3E43] text-white flex-1 flex flex-col'>
							<p className='text-xs font-recharge mb-4'>Credits</p>
							<div className='flex flex-col w-full gap-y-4 text-sm flex-1'>
								<div className='p-4 py-2 rounded-2xl bg-[#494C4E]'>$20 - 100 credits</div>
								<div className='p-4 py-2 rounded-2xl bg-[#494C4E]'>$40 - 250 credits</div>
								<div className='p-4 py-2 rounded-2xl bg-[#494C4E]'>$100 - 1000 credits</div>
								<div className='flex-1' />
								<BuyCredits />
							</div>
						</div>
						<ShareReferral
							refCode={referralCodes.length > 0 ? referralCodes.filter((item) => !item.used)[0]?.code : ''}
						/>
						<ReferralsList />
					</div>
					<Leaderboard />
				</div>
			</div>
		</div>
	);
};

export default HomePage;
