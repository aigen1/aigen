import { NextUIProvider } from '@nextui-org/system';
// import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';
import NotificationsContainer from '@/ui-components/NotificationsContainer';
import { UserDetailsProvider } from './UserDetailsContext';
import CacheProvider from './CachedDataContext';
import OnboardingProvider from './OnboardingContext';
import PrivyProvider from './PrivyProvider';

export default function Providers({ children }: { children: ReactNode }) {
	return (
		<NextUIProvider>
			<NotificationsContainer />
			<PrivyProvider>
				<OnboardingProvider>
					<UserDetailsProvider>
						<CacheProvider>{children}</CacheProvider>
					</UserDetailsProvider>
				</OnboardingProvider>
			</PrivyProvider>
		</NextUIProvider>
	);
}
