'use client';

import { ReactNode } from 'react';
import { PrivyProvider as Privy } from '@privy-io/react-auth';

const PrivyProvider = ({ children }: { children: ReactNode }) => {
	const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
	return (
		<Privy
			appId={appId || ''}
			config={{
				appearance: {
					accentColor: '#38A1FF',
					logo: '/assets/aigen-logo.png',
					theme: '#1B2028',
					walletList: ['metamask', 'detected_wallets']
				},
				loginMethods: ['wallet']
			}}
		>
			{children}
		</Privy>
	);
};

export default PrivyProvider;
