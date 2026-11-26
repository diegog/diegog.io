import type { Metadata } from 'next';
import Privacy from '@/content/oncue-privacy.mdx';

export const metadata: Metadata = {
	title: 'On Cue Privacy Policy',
	description: 'How the On Cue class timer app handles your information: it collects none.',
	alternates: { canonical: '/oncue/privacy' }
};

export default function OnCuePrivacyPage() {
	return (
		<main className="container-page max-w-3xl pt-6 pb-16 font-prose text-prose">
			<Privacy />
		</main>
	);
}
