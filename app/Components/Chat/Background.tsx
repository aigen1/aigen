import StepperComponent from '@/ui-components/StepperComponent';
import Image from 'next/image';
import React from 'react';

const Background = ({ currentStep }: { currentStep: number }) => {
	return (
		<div
			className={`bg-primary_grey pt-[120px] h-screen w-full fixed top-0 left-0 ${currentStep === 2 && 'background'}`}
		>
			{currentStep < 2 && (
				<>
					<Image
						src='/assets/bg-1.png'
						height={1000}
						width={1000}
						className='w-screen h-[80vh] z-[-1] absolute top-0 left-0'
						alt='bg'
					/>
					<div className='w-full flex justify-center'>
						<StepperComponent currentStep={currentStep} />
					</div>
				</>
			)}
		</div>
	);
};

export default Background;
