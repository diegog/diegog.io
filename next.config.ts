import createMDX from '@next/mdx';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	reactStrictMode: true,
	pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
	images: {
		formats: ['image/avif', 'image/webp'],
		// 75 is the default; 90 is for photos where detail matters (the rack shot)
		qualities: [75, 90]
	},
	async headers() {
		return [
			{
				source: '/:path*',
				headers: [
					{ key: 'X-Content-Type-Options', value: 'nosniff' },
					{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }
				]
			}
		];
	}
};

// plugins are named as strings so they work under Turbopack (functions can't cross into Rust)
const withMDX = createMDX({
	options: {
		remarkPlugins: ['remark-gfm']
	}
});

export default withMDX(nextConfig);
