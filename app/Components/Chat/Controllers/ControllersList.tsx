import { controllers } from '@/global/constants/controllersAndLLMs';
import ControllerLLM from '@/ui-components/ControllerLLM';
import React from 'react';

const ControllersList = ({
	controller,
	setController
}: {
	controller: string;
	setController: React.Dispatch<React.SetStateAction<string>>;
}) => {
	return (
		<div className='grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6'>
			{controllers.map((item) => (
				<ControllerLLM
					key={item.id}
					name={item.name}
					onClick={() => setController(item.id)}
					selected={controller === item.id}
					description=''
				/>
			))}
		</div>
	);
};

export default ControllersList;
