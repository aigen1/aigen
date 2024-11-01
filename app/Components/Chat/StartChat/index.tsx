/* eslint-disable sort-keys */
import { controllers } from '@/global/constants/controllersAndLLMs';
import ControllerLLM from '@/ui-components/ControllerLLM';
import PrimaryButton from '@/ui-components/PrimaryButton';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Typewriter } from 'react-simple-typewriter';
import './style.css';
import { useGlobalUserDetailsContext } from '@/providers/UserDetailsContext';
import useFetch from '@/hooks/useFetch';
import { IChat } from '@/global/types';
import { useCache } from '@/providers/CachedDataContext';
import { Spinner } from '@nextui-org/spinner';
import { chat } from '@/backend-calls/chat';
import { toast } from 'react-toastify';

const StartChat = ({
	controller,
	setController,
	llm
}: {
	controller: string;
	llm: { name: string; id: string } | null;
	setController: React.Dispatch<React.SetStateAction<string>>;
}) => {
	const { userId, address, setUserDetailsContextState } = useGlobalUserDetailsContext();
	const [message, setMessage] = useState<string>('');

	const [messages, setMessages] = useState<IChat[]>([]);

	const [animate, setAnimate] = useState<boolean>(false);

	const [latestMessage, setLatestMessage] = useState<string>('');

	const [loading, setLoading] = useState<boolean>(false);

	const { setCache } = useCache();

	const {
		data: chatsData,
		// error,
		loading: chatsLoading,
		refetch: chatsRefetch
	} = useFetch<IChat[]>({
		body: {
			controller,
			llm: llm?.id
		},
		cache: {
			enabled: true,
			tte: 3600
		},
		initialEnabled: false,
		key: `${controller}-${llm?.id}`,
		url: '/getChats'
	});

	useEffect(() => {
		setMessages(chatsData || []);
	}, [chatsData, controller, llm?.id]);

	useEffect(() => {
		chatsRefetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [controller, llm?.id]);

	const sendMessage = async () => {
		if (!message || !userId || !controller || !llm) return;

		setMessages((prev) => [{ answer: '', prompt: message, controller, llm: llm.id, created_at: new Date() }, ...prev]);

		const prompt = message;

		setMessage('');

		setLoading(true);

		setAnimate(true);

		const { data, error } = await chat({
			address,
			controller,
			llm: llm.id,
			prompt
		});

		setLoading(false);

		if (data && !error) {
			// deduct credits
			console.log('data', data);
			if (data.creditsUsed) {
				setUserDetailsContextState((prev) => ({
					...prev,
					credits: prev.credits - Number(data.creditsUsed)
				}));
			}
			setMessage('');
			setLatestMessage(JSON.stringify(data.response));
			setMessages((prev) => {
				const answer = JSON.stringify(data.response);
				const all = [...prev];
				const latest = { ...all[0] };
				latest.answer = answer;
				all[0] = latest;
				setCache(`${controller}-${llm.id}`, all, 3600);
				return all;
			});
		} else {
			console.log(error);
			toast(error, { type: 'error' });
		}
	};

	return (
		<div className='grid grid-cols-3 flex-1 overflow-auto'>
			<div className='col-span-1 border-r border-border_grey h-full flex flex-col overflow-auto'>
				<div className='w-full p-4 flex flex-col border-b border-border_grey'>
					<span className='text-text_black text-2xl font-recharge'>Controllers</span>
				</div>
				<div className='px-6 pt-10 pb-6 flex flex-col flex-1 gap-y-10 max-h-auto overflow-y-auto'>
					{controllers.map((item) => (
						<ControllerLLM
							key={item.id}
							name={item.name}
							description=''
							selected={item.id === controller}
							onClick={() => setController(item.id)}
						/>
					))}
				</div>
			</div>
			<div className='col-span-2 py-4 px-6 flex flex-col overflow-y-auto h-full'>
				<div>
					<span className='text-text_black text-2xl font-recharge'>Chat</span>
				</div>
				<div className='flex-1 overflow-y-auto flex flex-col-reverse gap-y-8 py-4 text-base text-text_chat'>
					{chatsLoading ? (
						<div className='w-full h-full flex items-center justify-center'>
							<Spinner
								size='lg'
								color='warning'
								label='Loading Chats...'
							/>
						</div>
					) : (
						messages.map((item, i) => (
							<div key={i}>
								<div className='flex items-start gap-x-4 mb-4'>
									<Image
										src='/assets/avatar.png'
										alt='user'
										height={28}
										width={28}
									/>
									<p>{item.prompt}</p>
								</div>
								<div className='flex items-start gap-x-4'>
									<Image
										src='/assets/gpt-icon.png'
										alt='llm'
										height={28}
										width={28}
									/>
									{animate && i === 0 ? (
										loading ? (
											<p className='blink h-[20px] w-[20px] bg-text_black rounded-full' />
										) : latestMessage ? (
											<div className='flex flex-col'>
												{latestMessage.split('\\n').map((text, idx) => (
													<Typewriter
														key={idx}
														words={[text]}
														typeSpeed={30}
														// cursorStyle={<span className='rounded-full px-[10px] bg-text_black text-text_black' />}
														// cursorBlinking={cursor}
														// cursor={cursor}
														onLoopDone={() => {
															setAnimate(false);
															setLatestMessage('');
														}}
													/>
												))}
											</div>
										) : (
											<p className='text-danger'>Error! Please Try Again.</p>
										)
									) : (
										<div className='flex flex-col whitespace-pre-wrap'>
											{item.answer
												.toString()
												.split('\\n')
												.map((text, idx) => (
													<p key={idx}>{text}</p>
												))}
										</div>
									)}
								</div>
							</div>
						))
					)}
				</div>
				<div className='w-full rounded-2xl bg-[#F7F8FA] border border-[#F0F2F5]'>
					<div className='border-b border-[#E3E6EA] p-4'>
						<textarea
							onKeyDown={(e) => {
								if (e.key === 'Enter' && message) {
									sendMessage();
								}
							}}
							rows={2}
							value={message}
							onChange={(e) => !loading && setMessage(e.target.value)}
							className='h-full w-full bg-transparent outline-none border-none resize-none'
							placeholder='Type your message....'
						/>
					</div>
					<div className='p-2 flex justify-end items-center'>
						<PrimaryButton
							className='bg-[#666F8D] px-4 font-manrope'
							size='sm'
							icon={
								<Image
									src='/assets/send-icon.png'
									alt='send'
									height={12}
									width={12}
								/>
							}
							onClick={() => sendMessage()}
						>
							Send
						</PrimaryButton>
					</div>
				</div>
			</div>
		</div>
	);
};

export default StartChat;
