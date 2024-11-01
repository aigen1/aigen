/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
	webpack(config) {
		config.module.rules.push(
			{
				test: /\.svg$/,
				use: ['@svgr/webpack']
			},
			{
				test: /\.md$/,
				use: 'raw-loader'
			}
		);

		return config;
	},
	env: {
		NEXT_PUBLIC_PRIVY_APP_ID: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
		PRIVY_APP_SECRET: process.env.PRIVY_APP_SECRET,
		AIGEN_FIREBASE_CONFIG: process.env.AIGEN_FIREBASE_CONFIG
	}
};

export default nextConfig;
