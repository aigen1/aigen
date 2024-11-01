import Image from 'next/image';
import React from 'react';
import './style.css';

const StepperComponent = ({ currentStep }: { currentStep: number }) => {
	const steps = [
		{
			icon: '/assets/game-console.png',
			title: 'Select Controller'
		},
		{
			icon: '/assets/control-camera.png',
			title: 'Select LLM'
		},
		{
			icon: '/assets/chat-icon.png',
			title: 'Start Chat'
		}
	];

	const checkActive = (step: number) => {
		if (currentStep >= step) return true;
		return false;
	};

	return (
		<div className='steps border-4 border-[#282828] px-6 py-4 rounded-3xl flex items-center w-[600px] justify-between'>
			{steps.map((item, i) => (
				<div
					key={i}
					className={`step relative flex flex-col gap-y-2 items-center w-[200px] ${checkActive(i) && 'active'}`}
				>
					<div
						className={`h-[40px] z-10 w-[40px] p-2 flex justify-center items-center rounded-full ${checkActive(i) ? 'bg-primary_orange' : 'bg-[#222222] border-2 border-[#BDBDBD]'}`}
					>
						<Image
							src={item.icon}
							alt='steps'
							height={24}
							width={24}
						/>
					</div>
					<span className={`${checkActive(i) ? 'text-white' : 'text-[#BDBDBD]'} font-recharge text-sm`}>
						{item.title}
					</span>
				</div>
			))}
		</div>
	);
};

export default StepperComponent;
