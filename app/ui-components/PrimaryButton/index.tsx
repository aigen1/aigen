import { Button } from '@nextui-org/button';
import React, { ReactNode } from 'react';
import './style.css';

const PrimaryButton = ({
	children,
	className,
	disabled,
	icon,
	onClick,
	loading,
	size,
	href
}: {
	children: ReactNode;
	className?: string;
	disabled?: boolean;
	icon?: ReactNode;
	onClick?: () => void;
	loading?: boolean;
	size?: 'sm' | 'md' | 'lg';
	href?: string;
}) => {
	return (
		<Button
			href={href}
			isLoading={loading}
			size={size}
			disabled={disabled}
			onClick={onClick}
			className={`primary-btn bg-primary_orange ${disabled && 'opacity-60 cursor-not-allowed'} rounded-xl text-white text-sm font-bold font-recharge px-8 ${className}`}
			startContent={icon}
		>
			{children}
		</Button>
	);
};

export default PrimaryButton;
