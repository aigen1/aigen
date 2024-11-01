import PrimaryButton from '@/ui-components/PrimaryButton';
import React, { useState } from 'react';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/modal';
import SecondaryButton from '@/ui-components/SecondaryButton';
import shortenAddress from '@/utils/shortenAddress';
import { useGlobalUserDetailsContext } from '@/providers/UserDetailsContext';
import { ethers } from 'ethers';
import { Interface } from '@ethersproject/abi';
import { useWallets } from '@privy-io/react-auth';
import { Divider } from '@nextui-org/divider';
import { verifyBuy } from '@/backend-calls/verifyBuy';
import { toast } from 'react-toastify';
import { twMerge } from 'tailwind-merge';
import Image from 'next/image';
import Spin from '@/ui-components/Spin';

const encodeERC20TransferData = (to: string, value: any): string => {
	const erc20Abi = ['function transfer(address to, uint256 value)'];
	const contractInterface = new Interface(erc20Abi);
	return contractInterface.encodeFunctionData('transfer', [to, value]);
};

export interface ICreditPlan {
	name: string;
	amount: number;
	credits: number;
}

const BuyCredits = () => {
	const { isOpen, onOpen, onOpenChange, onClose: closeModal } = useDisclosure();
	const { address, setUserDetailsContextState } = useGlobalUserDetailsContext();

	const [loading, setLoading] = useState<boolean>(false);

	const [loadingMessages, setLoadingMessages] = useState<string>('');

	const creditPlans: ICreditPlan[] = [
		{
			amount: 0.001,
			credits: 100,
			name: 'Popular'
		},
		{
			amount: 0.002,
			credits: 250,
			name: 'Recommended'
		}
	];

	const [selectedPlan, setSelectedPlan] = useState<ICreditPlan>(creditPlans[0]);

	const { wallets } = useWallets();
	const connectedWallet = wallets?.[0];

	const contractAddress = '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359';
	const toAddress = '0x491286D1907458c6446078a6462E7072EAcb8A7c';

	const buyCredits = async () => {
		if (!connectedWallet || !connectedWallet.address) return;

		if (!selectedPlan) return;

		try {
			setLoading(true);
			setLoadingMessages('Please sign the Transaction');
			const polygonChainID = 137;
			const usdcTokenDecimals = 6;

			connectedWallet.switchChain(polygonChainID);
			const provider = await connectedWallet.getEthersProvider();
			const signer = provider.getSigner();
			if (!signer) {
				console.log('No signer found');
				return;
			}

			const amount = ethers.parseUnits(selectedPlan.amount.toString(), usdcTokenDecimals);

			const txData = encodeERC20TransferData(toAddress, amount);

			const limit = await provider.estimateGas({
				data: txData,
				from: address,
				to: contractAddress,
				value: ethers.parseUnits('0.000', 'ether')
			});
			const tx = await signer.sendTransaction({
				chainId: polygonChainID,
				data: txData,
				gasLimit: limit,
				to: contractAddress,
				value: ethers.parseUnits('0', 'ether')
			});
			setLoadingMessages('Sending Funds');
			const { transactionHash } = await tx.wait();

			console.log('txn hash', transactionHash);

			if (transactionHash) {
				setLoadingMessages('Verifying the Transaction');
				const { data, error } = await verifyBuy({
					address,
					amount: amount.toString(),
					toAddress,
					transactionHash
				});
				console.log('transaction', data, error);
				if (data && !error) {
					setUserDetailsContextState((prev) => ({
						...prev,
						credits: prev.credits + Number(data.creditsBought)
					}));
					toast(`Success! ${data.creditsBought} credits added.`, { type: 'success' });
					closeModal();
				} else {
					toast(error, { type: 'error' });
				}
			}
			setLoading(false);
		} catch (err) {
			console.log('error from handleSubmit sendUsdc', err);
			toast('Failed! Insuffient USDC in Signer Account', { type: 'error' });
			setLoading(false);
		}
	};

	return (
		<>
			<PrimaryButton
				onClick={onOpen}
				className='w-full'
			>
				Buy Credits
			</PrimaryButton>
			<Modal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				className='min-w-[500px]'
				isDismissable={false}
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className='flex justify-center w-full font-recharge text-2xl border-b border-border_grey'>
								Buy Credits
							</ModalHeader>
							<Spin
								loading={loading}
								label={loadingMessages}
							>
								<ModalBody className='flex flex-col gap-y-8 py-6 px-12'>
									<div className='w-full'>
										<p className='text-xs text-text_black mb-1'>Buy with account</p>
										<div className='px-3 py-1 rounded-3xl border border-primary_orange'>
											<span className='font-recharge text-sm'>{shortenAddress(address, 8)}</span>
										</div>
									</div>
									<div className='w-full flex gap-x-3 items-center'>
										{creditPlans.map((item) => (
											<div
												key={item.name}
												onClick={() => setSelectedPlan(item)}
												className={twMerge(
													'p-6 rounded-2xl border flex flex-col items-center flex-1 relative cursor-pointer',
													item.name === selectedPlan.name ? 'border-primary_orange' : 'border-border_grey'
												)}
											>
												<div className='absolute -top-3 left-[50%] -translate-x-1/2 border border-primary_orange rounded-md px-3 py-1 text-[10px] font-recharge text-primary_orange bg-secondary_orange'>
													{item.name}
												</div>
												<div className='flex-1' />
												<div className='font-surfquest text-7xl text-primary_orange flex items-center gap-x-1'>
													<Image
														src='/assets/eth-orange.png'
														alt='credits'
														height={50}
														width={50}
														className='mt-2'
													/>
													{item.credits}
												</div>
												<div className='flex-1 text-xs text-text_black mt-1'>for ${item.amount} only!</div>
											</div>
										))}
									</div>
									<div className='border border-border_grey rounded-2xl py-2 px-4 flex flex-col gap-y-2'>
										<div className='flex items-center justify-between'>
											<span className='py-1 px-2 rounded-2xl border border-border_grey text-text_black text-sm font-medium'>
												Network
											</span>
											<span className='text-text_black text-lg'>Polygon</span>
										</div>
										<Divider className='border-border_grey' />
										<div className='flex items-center justify-between'>
											<span className='py-1 px-2 rounded-2xl border border-border_grey text-text_black text-sm font-medium'>
												USDC
											</span>
											<div>
												<p className='text-text_black text-lg mb-1'>{selectedPlan.amount.toFixed(3)}</p>
												<p className='text-text_grey text-xs'>${selectedPlan.amount.toFixed(2)}</p>
											</div>
										</div>
										<Divider className='border-border_grey' />
										<div className='flex items-center justify-between'>
											<span className='py-1 px-2 rounded-2xl border border-border_grey text-text_black text-sm font-medium'>
												CREDITS
											</span>
											<span className='text-text_black text-lg'>{selectedPlan.credits}</span>
										</div>
									</div>
								</ModalBody>
								<ModalFooter className='justify-between px-12'>
									<SecondaryButton
										disabled={loading}
										size='sm'
										onClick={onClose}
									>
										Cancel
									</SecondaryButton>
									<PrimaryButton
										loading={loading}
										size='sm'
										onClick={() => buyCredits()}
									>
										Continue
									</PrimaryButton>
								</ModalFooter>
							</Spin>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default BuyCredits;
