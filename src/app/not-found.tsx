import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
	title: 'Page not found'
};

export default function NotFound() {
	return (
		<main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-4 px-4 text-center">
			<h1 className="text-4xl font-bold">404</h1>
			<p className="text-muted-foreground">That page doesn&apos;t exist.</p>
			<Button render={<Link href="/">Back home</Link>} />
		</main>
	);
}
