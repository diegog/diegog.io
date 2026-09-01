import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { SiteHeader } from '@/components/site-header';
import { site } from '@/content/site';
import './globals.css';

export const metadata: Metadata = {
	metadataBase: new URL(site.url),
	title: {
		default: site.title,
		template: `%s · ${site.name}`
	},
	description: site.description,
	authors: [{ name: site.author, url: site.url }],
	creator: site.author,
	alternates: {
		canonical: '/'
	},
	openGraph: {
		type: 'website',
		siteName: site.name,
		title: site.title,
		description: site.description,
		url: site.url,
		locale: 'en_US'
	},
	twitter: {
		card: 'summary_large_image',
		title: site.title,
		description: site.description
	}
};

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	themeColor: '#f4f4f4'
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<body className="pt-(--header-height)">
				<SiteHeader />
				{children}
			</body>
		</html>
	);
}
