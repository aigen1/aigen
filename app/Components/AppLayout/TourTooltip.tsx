import { useOnboardingContext } from '@/providers/OnboardingContext';
import SecondaryButton from '@/ui-components/SecondaryButton';
import React, { useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

const TourTooltip = ({
	target,
	title,
	description,
	index,
	placement = 'bottom'
}: {
	target: string;
	title: string;
	description: string;
	index: number;
	placement: string;
}) => {
	const { startOnboarding, steps, currStep, onStart, nextStep, prevStep } = useOnboardingContext();

	const ref = useRef<HTMLDivElement>(null);

	const [leftOffset, setLeftOffset] = useState<number>(0);
	const [topOffset, setTopOffset] = useState<number>(0);
	const [bottomOffset, setBottomOffset] = useState<number>(0);

	const elementRef = document.getElementById(target);
	const rect = elementRef?.getBoundingClientRect();

	const windowHeight = window.innerHeight;
	// const top = rect?.top || 0;
	const left = rect?.left || 0;
	const top = rect?.top || 0;
	const bottom = rect?.bottom || 0;

	useEffect(() => {
		if (index === currStep && top > windowHeight / 2) {
			elementRef?.scrollIntoView();
		}
		setTopOffset(top + window.scrollY + (rect?.height || 0) + 20);
		setLeftOffset(left + window.scrollX + (rect?.width || 0) / 5);
		setBottomOffset(
			bottom + window.screenY + (rect?.height || 20) + (ref.current?.getBoundingClientRect().height || 0) + 40
		);
	}, [bottom, currStep, elementRef, index, left, rect, target, top, windowHeight]);
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: index === currStep ? 1 : 0 }}
			transition={{ duration: 0.2 }}
			className={twMerge('absolute z-50')}
			style={placement === 'top' ? { bottom: bottomOffset, left: leftOffset } : { left: leftOffset, top: topOffset }}
		>
			{index === currStep && startOnboarding && (
				<div
					ref={ref}
					className='min-w-[300px] shadow-xl rounded-lg border border-primary_orange bg-white p-4 z-50'
				>
					<div className='flex flex-col items-start text-left gap-y-6 text-primary_orange w-full'>
						<div>
							<div className='font-bold font-recharge text-lg mb-2'>{title}</div>
							<div className='text-sm'>{description}</div>
						</div>
						<div className='flex items-center w-full justify-between'>
							<span className='text-sm'>
								{index + 1} of {steps.length}
							</span>
							<div className='flex items-center gap-x-2'>
								{index > 0 && index < steps.length && (
									<SecondaryButton
										onClick={prevStep}
										size='sm'
										className='px-2 font-recharge opacity-60'
									>
										Prev
									</SecondaryButton>
								)}
								<SecondaryButton
									onClick={
										index === steps.length - 1
											? () => onStart(false)
											: () => {
													nextStep();
												}
									}
									size='sm'
									className='px-2 font-recharge'
								>
									{index === steps.length - 1 ? 'Done' : 'Next'}
								</SecondaryButton>
							</div>
						</div>
					</div>
					{/* arrow */}
					<div
						className={`absolute bg-primary_orange w-4 h-4 rotate-45 left-10 rounded-sm z-[-1] ${placement === 'top' ? '-bottom-2' : '-top-2'}`}
					/>
				</div>
			)}
		</motion.div>
	);
};

export default TourTooltip;
