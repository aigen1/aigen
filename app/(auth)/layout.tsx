import Image from 'next/image';
import React from 'react';

import NextTopLoader from 'nextjs-toploader';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className='background'>
			<div className='mx-auto w-full max-w-screen-2xl min-h-screen flex flex-col'>
				<nav className='navbar px-12 h-[80px] flex items-center justify-center sticky top-0 left-0 z-50'>
					<Image
						src='/assets/aigen-logo.png'
						alt='Aigen Logo'
						height={30}
						width={140}
					/>
				</nav>
				<NextTopLoader color='#F67304' />
				{children}
			</div>
		</div>
	);
};

export default AuthLayout;
