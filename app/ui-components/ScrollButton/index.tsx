'use client';

import './style.css';
import React from 'react';

const ScrollButton = ({ scrollDistance }: { scrollDistance: number }) => {
	return (
		<button
			onClick={() => typeof window !== 'undefined' && window.scrollBy(0, scrollDistance)}
			className='scroll-btn h-[40px] w-[20px] rounded-2xl border-[2px] border-[#777777] relative'
		/>
	);
};

export default ScrollButton;
