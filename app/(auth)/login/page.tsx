'use client';

import LoginForm from '@/Components/LoginForm';
import RefCodeForm from '@/Components/SignupForm/RefCodeForm';
import { useGlobalUserDetailsContext } from '@/providers/UserDetailsContext';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React, { Suspense, useEffect } from 'react';

const LoginPage = () => {
	const { userId, address, waiting } = useGlobalUserDetailsContext();

	useEffect(() => {
		if (userId) {
			redirect('/');
		}
	}, [userId]);

	return (
		<section className='flex-1 flex justify-center items-start pt-[80px]'>
			<div className='bg-white rounded-2xl drop-shadow min-w-[500px]'>
				<div className='w-full p-4 flex items-center justify-between border-b border-border_grey'>
					<Link
						className='border-none outline-none p-0'
						href='/'
					>
						<Image
							src='/assets/arrow-right.png'
							alt='go back'
							height={24}
							width={24}
							className='rotate-[180deg]'
						/>
					</Link>
					<span className='font-recharge text-2xl text-text_black'>Login</span>
					<span />
				</div>
				<div className='pt-6 pb-8 px-12'>
					<Suspense fallback={<div>Loading...</div>}>{address && waiting ? <RefCodeForm /> : <LoginForm />}</Suspense>
				</div>
			</div>
		</section>
	);
};

export default LoginPage;
