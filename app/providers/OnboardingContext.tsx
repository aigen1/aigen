// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
/* eslint-disable sort-keys */

'use client';

import { createContext, useContext, ReactNode, useMemo, useState } from 'react';

type ContextType = {
	startOnboarding: boolean;
	onStart: (value: boolean) => void;
	currStep: number;
	steps: { title: string; description: string; target: string; placement: string }[];
	nextStep: () => void;
	prevStep: () => void;
};

const OnboardingContext = createContext<ContextType | null>(null);

const steps = [
	{
		title: 'What is Home',
		description: 'asfadshfiushfishfkjsh adshfdsafh',
		target: 'tour-1',
		placement: 'bottom'
	},
	{
		title: 'What is Home',
		description: 'asfadshfiushfishfkjsh adshfdsafh',
		target: 'tour-2',
		placement: 'bottom'
	},
	{
		title: 'What is Home',
		description: 'asfadshfiushfishfkjsh adshfdsafh',
		target: 'tour-3',
		placement: 'top'
	}
];

export function useOnboardingContext() {
	return useContext(OnboardingContext) as ContextType;
}

export default function OnboardingProvider({ children }: { children: ReactNode }) {
	const [step, setStep] = useState<number>(0);
	const [startOnboarding, setStartOnBoarding] = useState<boolean>(false);

	const onStart = (start: boolean) => {
		setStartOnBoarding(start);
	};

	const nextStep = () => {
		setStep((prev) => (prev < steps.length ? prev + 1 : prev));
	};

	const prevStep = () => {
		setStep((prev) => (prev > 0 ? prev - 1 : prev));
	};

	const contextValue = useMemo(
		() => ({
			startOnboarding,
			onStart,
			currStep: step,
			steps,
			prevStep,
			nextStep
		}),
		[startOnboarding, step]
	);

	return <OnboardingContext.Provider value={contextValue}>{children}</OnboardingContext.Provider>;
}
