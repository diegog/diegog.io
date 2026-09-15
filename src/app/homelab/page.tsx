import type { Metadata } from 'next';
import Homelab from '@/content/homelab.mdx';

export const metadata: Metadata = {
	title: 'Homelab',
	description: "What's in Diego Garcia's homelab, how it's built, and what runs on it."
};

export default function HomelabPage() {
	return (
		<main className="container-page max-w-3xl pt-6 pb-16 font-prose text-prose">
			<Homelab />
		</main>
	);
}
