import type { Metadata } from 'next';
import { ContactForm } from '@/components/contact-form';

export const metadata: Metadata = {
	title: 'Contact',
	description: 'Get in touch with Diego Garcia.'
};

export default function ContactPage() {
	return (
		<main className="container-page py-4">
			<ContactForm />
		</main>
	);
}
