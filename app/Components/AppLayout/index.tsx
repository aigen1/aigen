import React, { ReactNode } from 'react';
import NextTopLoader from 'nextjs-toploader';
import NavHeader from './NavHeader';
import './style.css';
import BackgroundBlur from './BackgroundBlur';

const AppLayout = ({ children }: { children: ReactNode }) => {
	return (
		<section className='relative mx-auto max-w-screen-2xl min-h-screen flex flex-col'>
			<BackgroundBlur />
			<NavHeader />
			<NextTopLoader color='#F67304' />
			<main className='flex-1 flex flex-col'>{children}</main>
		</section>
	);
};

export default AppLayout;
