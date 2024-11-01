import { llms } from '@/global/constants/controllersAndLLMs';
import ControllerLLM from '@/ui-components/ControllerLLM';
import React from 'react';

const LLMsList = ({
	llm,
	setLlm
}: {
	llm: {
		name: string;
		id: string;
	} | null;
	setLlm: React.Dispatch<
		React.SetStateAction<{
			name: string;
			id: string;
		} | null>
	>;
}) => {
	return (
		<div className='grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6'>
			{llms.map((item, i) => (
				<ControllerLLM
					key={i}
					name={item.name}
					onClick={() => setLlm(item)}
					selected={llm ? llm.id === item.id : false}
					description=''
				/>
			))}
		</div>
	);
};

export default LLMsList;
