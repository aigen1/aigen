import { Spinner } from '@nextui-org/spinner';
import React, { ReactNode } from 'react';

const Spin = ({ children, label, loading }: { children: ReactNode; label: string; loading: boolean }) => {
	return (
		<div className='relative'>
			{children}
			{loading && (
				<div className='h-full w-full absolute top-0 left-0 backdrop-blur z-50'>
					<div className='w-full h-full flex items-center justify-center'>
						<Spinner
							size='lg'
							color='warning'
							label={label}
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default Spin;
