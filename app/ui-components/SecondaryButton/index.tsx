import { Button } from '@nextui-org/button';
import React, { ReactNode } from 'react';

const SecondaryButton = ({
	children,
	className,
	disabled,
	icon,
	onClick,
	loading,
	size
}: {
	children: ReactNode;
	className?: string;
	disabled?: boolean;
	icon?: ReactNode;
	onClick: () => void;
	loading?: boolean;
	size?: 'sm' | 'md' | 'lg';
}) => {
	return (
		<Button
			isLoading={loading}
			size={size}
			disabled={disabled}
			onClick={onClick}
			className={`secondary-btn bg-transparent border ${disabled ? 'border-text_grey text-text_grey' : 'border-primary_orange text-primary_orange'} rounded-xl text-xs font-bold font-recharge px-8 ${className}`}
			startContent={icon}
		>
			{children}
		</Button>
	);
};

export default SecondaryButton;
