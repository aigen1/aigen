import { getLeaderboard } from '@/backend-calls/getLeaderboard';
import { ILeaderboard } from '@/global/types';
import { useGlobalUserDetailsContext } from '@/providers/UserDetailsContext';
import UserLoggedOut from '@/ui-components/UserLoggedOut';
import { Skeleton } from '@nextui-org/skeleton';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const Leaderboard = () => {
	const { address, userLoading, userId } = useGlobalUserDetailsContext();

	const [leaderboard, setLeaderboard] = useState<ILeaderboard[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		const fetchLeaderboard = async () => {
			if (!address || userLoading) return;

			setLoading(true);
			const { data, error } = await getLeaderboard({ address });

			if (data && !error) {
				setLeaderboard(data);
			}
			setLoading(false);
		};

		fetchLeaderboard();
	}, [address, userLoading]);

	return (
		<div className='flex flex-col gap-y-6'>
			<div className='flex justify-center w-full'>
				<div
					id='tour-5'
					className='leaderboard-heading px-6 py-5 flex items-center gap-x-2 relative'
				>
					<Image
						alt='leaderboard'
						src='/assets/crown.png'
						height={24}
						width={24}
					/>
					<span className='text-text_black font-recharge text-base font-bold'>Leaderboard</span>
				</div>
			</div>
			<div className='px-2 flex flex-col gap-y-6'>
				{loading || userLoading ? (
					<>
						<div className='flex items-center gap-x-3 w-full'>
							<Skeleton className='rounded-full w-[50px] h-[50px]' />
							<div className='flex flex-col w-full'>
								<Skeleton className='h-5 w-3/5 rounded-lg mb-2' />
								<Skeleton className='h-3 w-2/5 rounded-lg' />
							</div>
						</div>
						<div className='flex items-center gap-x-3 w-full'>
							<Skeleton className='rounded-full w-[50px] h-[50px]' />
							<div className='flex flex-col w-full'>
								<Skeleton className='h-5 w-3/5 rounded-lg mb-2' />
								<Skeleton className='h-3 w-2/5 rounded-lg' />
							</div>
						</div>
					</>
				) : userId ? (
					leaderboard.map((user, i) => (
						<div className='px-8 py-5 flex items-center gap-x-4 bg-white rounded-2xl [box-shadow:_0px_0px_1px_0px_rgba(29,_33,_45,_0.20),_0px_0px_2px_0px_rgba(29,_33,_45,_0.08),_0px_3px_4px_0px_rgba(29,_33,_45,_0.12)]'>
							<div className='text-white px-2 py-[2px] text-xs bg-primary_brown rounded-md'>{i + 1}</div>
							<Image
								src='/assets/avatar.png'
								height={50}
								width={50}
								alt='avatar'
							/>
							<span className='text-text_black text-sm font-recharge'>{user.address}</span>
							<div className='flex-1' />
							<span className='text-text_grey text-lg'>{user.points}</span>
							<span className='text-[#5D6C87] text-2xl font-recharge'>Lv {user.level}</span>
						</div>
					))
				) : (
					<UserLoggedOut />
				)}
			</div>
		</div>
	);
};

export default Leaderboard;
