import type { Config } from 'tailwindcss';
import { nextui } from '@nextui-org/theme/plugin';

import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
	],
	important: true,
	plugins: [nextui()],
	theme: {
		extend: {
			colors: {
				bg_grey: 'var(--bg_grey)',
				border_grey: 'var(--border_grey)',
				primary_brown: 'var(--primary_brown)',
				primary_green: 'var(--primary_green)',
				primary_grey: 'var(--primary_grey)',
				primary_orange: 'var(--primary_orange)',
				secondary_green: 'var(--secondary_green)',
				secondary_orange: 'var(--secondary_orange)',
				stroke_black: 'var(--stroke_black)',
				success: 'var(--success)',
				tab_bg_orange: 'var(--tab_bg_orange)',
				text_black: 'var(--text_black)',
				text_chat: 'var(--text_chat)',
				text_deep_blue: 'var(--text_deep_blue)',
				text_grey: 'var(--text_grey)',
				text_secondary: 'var(--text_secondary)'
			},
			fontFamily: {
				// add new font family
				manrope: ['Manrope', ...defaultTheme.fontFamily.sans],
				recharge: ['var(--font-rec)', 'Manrope', ...defaultTheme.fontFamily.sans],
				surfquest: ['var(--font-surf)', 'var(--font-rec)', 'Manrope', ...defaultTheme.fontFamily.sans]
			}
		}
	}
};
export default config;
