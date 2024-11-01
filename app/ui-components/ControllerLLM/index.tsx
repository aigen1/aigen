import React from 'react';
import './style.css';

const ControllerLLM = ({
	name,
	selected,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	description,
	onClick
}: {
	name: string;
	selected: boolean;
	description: string;
	onClick: () => void;
}) => {
	return (
		<div
			onClick={onClick}
			className={`w-full hover:shadow-lg ${selected && 'shadow-lg'}  rounded-2xl cursor-pointer transition-shadow flex flex-col`}
		>
			<div className='flex w-full polygon-top relative'>
				<div className='flex items-center pl-7 pr-2 py-2 text-primary_grey font-recharge text-xl bg-primary_green flex-1'>
					{name}
				</div>
				<div
					className={`rounded-tr-2xl ${selected ? 'bg-primary_orange' : 'bg-primary_grey'} py-2 px-6 font-recharge text-sm text-white flex items-center justify-center`}
				>
					{selected ? 'Selected' : 'Select'}
				</div>
			</div>
			<div className='bg-white border border-grey px-7 py-4 rounded-b-2xl text-sm flex-1'>
				Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem
				aperiam, eaque ipsa. doloremque laudantium ipsa Read More
			</div>
		</div>
	);
};

export default ControllerLLM;
