import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const Background = ({
	scrolledToTop,
	credits,
	points,
	badges
}: {
	scrolledToTop: boolean;
	credits: number;
	points: number;
	badges: number;
}) => {
	return (
		<div className='background pt-[100px] flex justify-center items-start'>
			<motion.div
				initial={{ opacity: scrolledToTop ? 0 : 1, scale: 0.8 }}
				animate={{ opacity: scrolledToTop ? 0 : 1, scale: 1 }}
				transition={{ duration: 0.2, type: 'spring' }}
				className='flex justify-center items-end relative'
			>
				<motion.div
					animate={{ rotate: -17, x: -250 }}
					transition={{ damping: 30, duration: 0.3, ease: 'easeInOut', stiffness: 700, type: 'spring' }}
					className='card-left absolute z-0 rounded-[32px] p-6 w-[300px] h-[400px] flex flex-col items-center gap-y-4'
				>
					<div className='flex items-center gap-x-2'>
						<Image
							src='/assets/star-icon-white.png'
							className='mt-3'
							alt='credits'
							height={70}
							width={70}
						/>
						<span className='font-surfquest text-8xl text-white [text-shadow:_0_0_5px] leading-none'>{badges}</span>
					</div>
					<p className='font-recharge text-2xl text-white'>Badges</p>
				</motion.div>
				<div className='card-center z-10 border-[5px] border-[#FF7302] rounded-[32px] p-6 w-[350px] h-[500px] flex flex-col items-center gap-y-4'>
					<div className='flex items-center gap-x-2'>
						<Image
							src='/assets/eth-white.png'
							className='mt-3'
							alt='credits'
							height={70}
							width={70}
						/>
						<span className='font-surfquest text-8xl text-white [text-shadow:_0_0_5px] leading-none'>{credits}</span>
					</div>
					<p className='font-recharge text-2xl text-white'>Credits</p>
				</div>
				<motion.div
					animate={{ rotate: 17, x: 250 }}
					transition={{ damping: 30, duration: 0.3, ease: 'easeInOut', stiffness: 700, type: 'spring' }}
					className='card-right border border-white absolute z-20 rounded-[32px] p-6 w-[300px] h-[400px] flex flex-col items-center gap-y-4'
				>
					<span className='font-surfquest text-8xl text-white [text-shadow:_0_0_5px] leading-none'>{points}</span>
					<p className='font-recharge text-2xl text-white'>Points</p>
				</motion.div>
			</motion.div>
		</div>
	);
};

export default Background;
