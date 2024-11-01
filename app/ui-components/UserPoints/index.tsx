import Image from 'next/image';
import React from 'react';

const ImageComp = ({ src, alt, small }: { src: string; alt: string; small?: boolean }) => (
	<Image
		src={src}
		className={small ? '' : 'mt-3'}
		alt={alt}
		height={small ? 24 : 50}
		width={small ? 24 : 50}
	/>
);

const UserPoints = ({
	credits,
	points,
	badges,
	small
}: {
	credits: number;
	points: number;
	badges: number;
	small?: boolean;
}) => {
	return (
		<div
			className={`flex items-center text-white leading-none ${small ? 'gap-x-4 font-recharge text-2xl' : 'gap-x-8 font-surfquest text-7xl'}`}
		>
			<div className='flex items-center gap-x-2'>
				<ImageComp
					src='/assets/eth-orange.png'
					alt='credits'
					small={small}
				/>
				<span>{credits}</span>
			</div>
			<div className='flex items-center gap-x-2'>
				<ImageComp
					src='/assets/ticket.png'
					alt='credits'
					small={small}
				/>
				<span>{points}</span>
			</div>
			<div className='flex items-center gap-x-2'>
				<ImageComp
					src='/assets/star-icon.png'
					alt='credits'
					small={small}
				/>
				<span>{badges}</span>
			</div>
		</div>
	);
};

export default UserPoints;
