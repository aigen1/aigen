import Image from 'next/image';
import React from 'react';
import './style.css';
import { useOnboardingContext } from '@/providers/OnboardingContext';
import { Z_INDEX_0, Z_INDEX_30 } from '@/global/constants/zIndex';
import { useGlobalUserDetailsContext } from '@/providers/UserDetailsContext';

const UserLevel = () => {
	const { currStep } = useOnboardingContext();
	const { level } = useGlobalUserDetailsContext();

	return (
		<div
			id='tour-3'
			className={currStep === 2 ? Z_INDEX_30 : Z_INDEX_0}
		>
			<div className='level-btn px-6 py-4 rounded-2xl text-lg text-white font-recharge flex items-center justify-center gap-x-3'>
				<Image
					src='/assets/lightning-bolt.png'
					alt='level'
					height={28}
					width={28}
				/>
				LEVEL {level}
			</div>
		</div>
	);
};

export default UserLevel;
