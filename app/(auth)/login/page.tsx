'use client';

import LoginForm from '@/Components/LoginForm';
import { useGlobalUserDetailsContext } from '@/providers/UserDetailsContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { Suspense, useEffect } from 'react';

const LoginPage = () => {
	const router = useRouter();
	const { userId, address, waiting } = useGlobalUserDetailsContext();

	useEffect(() => {
		if (userId) {
			router.push('/');
		} else if (address && waiting) {
			router.push('/signup/refCode');
		}
	}, [address, router, userId, waiting]);

	return (
		<section className='flex-1 flex justify-center items-start pt-[80px]'>
			<div className='bg-white rounded-2xl drop-shadow min-w-[500px]'>
				<div className='w-full p-4 flex items-center justify-between border-b border-border_grey'>
					<button
						className='border-none outline-none p-0'
						onClick={() => router.push('/')}
					>
						<Image
							src='/assets/arrow-right.png'
							alt='go back'
							height={24}
							width={24}
							className='rotate-[180deg]'
						/>
					</button>
					<span className='font-recharge text-2xl text-text_black'>Login</span>
					<span />
				</div>
				<div className='pt-6 pb-8 px-12'>
					<Suspense fallback={<div>Loading...</div>}>
						<LoginForm />
					</Suspense>
				</div>
			</div>
		</section>
	);
};

export default LoginPage;
