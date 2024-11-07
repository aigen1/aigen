import Image from 'next/image';
import React from 'react';
import Link from 'next/link';

const UserLoggedOut = () => {
	return (
		<div className='flex flex-col gap-y-4 items-center w-full'>
			<Image
				src='/assets/logout-user.png'
				width={150}
				height={150}
				alt='user logged out'
			/>
			<p className='text-text_black text-sm'>Please Login/Sign Up to use Aigen</p>
			<Link
				className='bg-primary_orange rounded-xl text-white text-sm font-bold font-recharge px-8 py-3'
				href='/signup'
			>
				Sign Up
			</Link>
		</div>
	);
};

export default UserLoggedOut;
