'use client';

import { initialUserDetailsContext, useGlobalUserDetailsContext } from '@/providers/UserDetailsContext';
// import PrimaryButton from '@/ui-components/PrimaryButton';
import UserPoints from '@/ui-components/UserPoints';
import shortenAddress from '@/utils/shortenAddress';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/dropdown';
import { Skeleton } from '@nextui-org/skeleton';
import { Tab, Tabs } from '@nextui-org/tabs';
import { usePrivy } from '@privy-io/react-auth';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

const NavHeader = () => {
	const pathname = usePathname();
	const {
		address: userAddress,
		userId,
		userLoading,
		credits,
		points,
		badges,
		level,
		setUserDetailsContextState
	} = useGlobalUserDetailsContext();

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [loading, setLoading] = useState<boolean>(false);

	const { logout } = usePrivy();

	const userLogout = () => {
		logout();
		setUserDetailsContextState(initialUserDetailsContext);
	};

	return (
		<nav className='navbar px-12 h-[80px] flex items-center gap-x-10 sticky top-0 left-0 z-20'>
			<div>
				<Image
					src='/assets/aigen-logo.png'
					alt='Aigen Logo'
					height={30}
					width={140}
				/>
			</div>
			<div className='h-full'>
				<Tabs
					aria-label='Options'
					color='primary'
					variant='underlined'
					className='h-full relative'
					selectedKey={pathname !== '/login' ? pathname : undefined}
					classNames={{
						cursor: 'w-full bg-primary_orange rounded-full height-[2px]',
						tab: 'outline-none max-w-fit h-full',
						tabContent: 'text-sm font-recharge group-data-[selected=true]:bg-tab_bg_orange px-4 py-2 rounded-lg',
						tabList: 'gap-0 w-full relative rounded-none p-0 h-full overflow-visible'
					}}
				>
					<Tab
						id='/'
						key='/'
						// href='/'
						title={
							<Link href='/'>
								<div
									id='tour-1'
									className='flex items-center gap-x-2 text-white tour-1'
								>
									<Image
										src='/assets/home-icon.png'
										height={20}
										width={20}
										alt='home-icon'
									/>
									<span>Home</span>
								</div>
							</Link>
						}
					/>
					<Tab
						id='/chat'
						key='/chat'
						// href='/chat'
						disabled={!userId}
						title={
							<Link href='/chat'>
								<div
									id='tour-2'
									className={`tour-2 flex items-center space-x-2 ${!userId ? 'text-text_grey' : 'text-white'}`}
								>
									<Image
										src='/assets/chat-icon.png'
										height={20}
										width={20}
										alt='home-icon'
									/>
									<span>Chat</span>
								</div>
							</Link>
						}
					/>
				</Tabs>
			</div>
			<div className='flex-1' />
			<div className='flex items-center h-full gap-x-4'>
				{userId && (
					<>
						<Link
							href='/chat'
							className='new-chat-btn bg-primary_orange rounded-3xl text-white text-xs font-bold font-recharge px-6 py-3 flex items-center'
						>
							+ New Chat
						</Link>
						<UserPoints
							credits={credits}
							points={points}
							badges={badges}
							small
						/>
					</>
				)}
				{userLoading ? (
					<div className='flex items-center gap-x-2'>
						<Skeleton className='skeleton rounded-full bg-primary_orange'>
							<div className='w-[36px] h-[36px] rounded-full' />
						</Skeleton>
						<div className='flex flex-col font-recharge'>
							<Skeleton className='skeleton h-3 w-[80px] rounded-lg mb-2' />
							<Skeleton className='skeleton h-3 w-8 rounded-lg' />
						</div>
					</div>
				) : !userId ? (
					<Link
						href='/login'
						className='border border-primary_orange rounded-3xl px-10 py-3 bg-transparent text-primary_orange font-recharge text-xs'
					>
						Login
					</Link>
				) : (
					<Dropdown>
						<DropdownTrigger>
							<div className='flex items-center gap-x-2 cursor-pointer'>
								<Image
									src='/assets/user-logo.png'
									height={36}
									width={36}
									alt='user'
								/>
								<div className='flex flex-col font-recharge'>
									<span className='text-white text-sm'>{shortenAddress(userAddress)}</span>
									<span className='text-text_grey text-[10px]'>Lv {level}</span>
								</div>
								<Image
									src='/assets/arrow-down-white.png'
									height={16}
									width={16}
									alt='dropdown'
								/>
							</div>
						</DropdownTrigger>
						<DropdownMenu
							aria-label='Single selection example'
							variant='flat'
							disallowEmptySelection
							selectionMode='single'
						>
							<DropdownItem
								onClick={userLogout}
								className='text-center'
							>
								Logout
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				)}
			</div>
		</nav>
	);
};

export default NavHeader;
