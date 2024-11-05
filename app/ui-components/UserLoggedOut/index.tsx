import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import PrimaryButton from '../PrimaryButton';

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
			<Link href='/signup'>
				<PrimaryButton>Sign Up</PrimaryButton>
			</Link>
		</div>
	);
};

export default UserLoggedOut;
