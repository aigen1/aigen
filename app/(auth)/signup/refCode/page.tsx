'use client';

import RefCodeForm from '@/Components/SignupForm/RefCodeForm';
import { useGlobalUserDetailsContext } from '@/providers/UserDetailsContext';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React, { Suspense, useEffect } from 'react';

const SignupPage = () => {
	const { address, waiting } = useGlobalUserDetailsContext();

	useEffect(() => {
		if (!address || !waiting) {
			redirect('/signup');
		}
	}, [address, waiting]);

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
					<span className='font-recharge text-2xl text-text_black'>In Waitlist</span>
					<span />
				</div>
				<div className='pt-6 pb-8 px-12'>
					<Suspense fallback={<div>Loading...</div>}>
						<RefCodeForm />
					</Suspense>
				</div>
			</div>
		</section>
	);
};

export default SignupPage;
