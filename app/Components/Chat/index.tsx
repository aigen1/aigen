'use client';

import './style.css';
import React, { useState } from 'react';
import PrimaryButton from '@/ui-components/PrimaryButton';
import SecondaryButton from '@/ui-components/SecondaryButton';
import UserLevel from '@/ui-components/UserLevel';
import UserPoints from '@/ui-components/UserPoints';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/dropdown';
import Image from 'next/image';
import { llms } from '@/global/constants/controllersAndLLMs';
import { useGlobalUserDetailsContext } from '@/providers/UserDetailsContext';
import Background from './Background';
import ControllersList from './Controllers/ControllersList';
import LLMsList from './LLMs/LLMsList';
import StartChat from './StartChat';

enum ETabs {
	CONTROLLER = 'Select Controller',
	LLM = 'Select LLM',
	CHAT = 'Start Chat'
}

const ChatPage = () => {
	const [tab, setTab] = useState<ETabs>(ETabs.CONTROLLER);

	const { credits, badges, points } = useGlobalUserDetailsContext();

	const [controller, setController] = useState<string>('');
	const [llm, setLlm] = useState<{ name: string; id: string } | null>(null);

	const tabsArray = Object.values(ETabs);

	const goNext = () => {
		const currStep = tabsArray.indexOf(tab);

		if (currStep === 2) return;

		const nextTab = tabsArray[currStep + 1];
		setTab(nextTab);
	};

	const goBack = () => {
		const currStep = tabsArray.indexOf(tab);

		if (currStep === 0) return;

		const prevTab = tabsArray[currStep - 1];
		setTab(prevTab);
	};

	return (
		<div className='h-full flex-1 flex flex-col'>
			<Background currentStep={tabsArray.indexOf(tab)} />
			<div className={`temp-h ${tab === ETabs.CHAT ? 'height-zero' : ''} transition-all`} />
			<div className='controllers flex-1 flex flex-col'>
				<div className='temp bg-transparent h-[120px] items-center justify-between flex px-6'>
					{tab === ETabs.CHAT && (
						<>
							<UserLevel />
							<UserPoints
								credits={credits}
								points={points}
								badges={badges}
							/>
							<Dropdown>
								<DropdownTrigger>
									<div className='px-6 py-4 rounded-2xl bg-primary_orange flex items-center gap-x-2 cursor-pointer'>
										<Image
											src='/assets/gpt-icon.png'
											alt='llm'
											height={28}
											width={28}
										/>
										<span className='text-xl text-white font-recharge'>{llm && llm.name}</span>
										<Image
											src='/assets/dropdown.png'
											alt='dropdown'
											height={30}
											width={30}
										/>
									</div>
								</DropdownTrigger>
								<DropdownMenu
									aria-label='Single selection example'
									variant='flat'
									disallowEmptySelection
									selectionMode='single'
									selectedKeys={[JSON.stringify(llm)]}
									onSelectionChange={(keys) =>
										setLlm((JSON.parse(keys.currentKey || '') as { name: string; id: string }) || null)
									}
								>
									{llms.map((item) => (
										<DropdownItem key={JSON.stringify(item)}>{item.name}</DropdownItem>
									))}
								</DropdownMenu>
							</Dropdown>
						</>
					)}
				</div>
				<div className='bg-white h-full max-h-[calc(100vh-80px-120px)] flex-1 flex flex-col'>
					{tab === ETabs.CHAT ? (
						<StartChat
							controller={controller}
							llm={llm}
							setController={setController}
						/>
					) : (
						<div className='flex flex-col gap-y-10 px-12 py-8'>
							<div className='flex justify-between w-full'>
								<span className='text-text_black text-2xl font-recharge'>{tab}</span>
								<div className='flex items-center gap-x-4'>
									{tabsArray.indexOf(tab) > 0 && (
										<SecondaryButton
											size='sm'
											onClick={goBack}
										>
											Back
										</SecondaryButton>
									)}
									{tabsArray.indexOf(tab) < 2 && (
										<PrimaryButton
											size='sm'
											disabled={(tab === ETabs.CONTROLLER && !controller) || (tab === ETabs.LLM && !llm)}
											onClick={goNext}
										>
											Next
										</PrimaryButton>
									)}
								</div>
							</div>
							{tab === ETabs.CONTROLLER ? (
								<ControllersList
									controller={controller}
									setController={setController}
								/>
							) : tab === ETabs.LLM ? (
								<LLMsList
									llm={llm}
									setLlm={setLlm}
								/>
							) : null}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ChatPage;
