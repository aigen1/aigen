import Image from 'next/image';
import React from 'react';

const SplashScreen = () => {
	return (
		<div className='h-screen w-full flex justify-center items-center bg-[#161616]'>
			<Image
				src='/assets/aigen-logo.png'
				alt='Aigen Logo'
				height={30}
				width={140}
			/>
		</div>
	);
};

export default SplashScreen;
