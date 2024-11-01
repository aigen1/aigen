'use client';

import { Z_INDEX_10 } from '@/global/constants/zIndex';
import { useOnboardingContext } from '@/providers/OnboardingContext';
import React from 'react';
import TourTooltip from './TourTooltip';

const BackgroundBlur = () => {
	const { startOnboarding, steps } = useOnboardingContext();
	return startOnboarding ? (
		<>
			<div className={`h-full w-full fixed backdrop-blur ${Z_INDEX_10}`} />
			{steps.map((item, i) => (
				<TourTooltip
					title={item.title}
					target={item.target}
					description={item.description}
					index={i}
					placement={item.placement}
				/>
			))}
		</>
	) : null;
};

export default BackgroundBlur;
