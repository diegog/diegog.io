'use server';

import type { ContactState } from '@/lib/contact';
import { deliverToDiscord } from '@/lib/discord';

const MAX_NAME = 200;
const MAX_EMAIL = 200;
const MAX_MESSAGE = 4000;

// Deliberately loose: enough to catch typos, not to adjudicate RFC 5322.
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function submitContact(
	_previous: ContactState,
	formData: FormData
): Promise<ContactState> {
	// Honeypot: a real person never sees or fills this field.
	if (String(formData.get('company') ?? '').trim() !== '') {
		return { status: 'success' };
	}

	const name = String(formData.get('name') ?? '').trim();
	const email = String(formData.get('email') ?? '').trim();
	const message = String(formData.get('message') ?? '').trim();
	const values = { name, email, message };

	const fieldErrors: ContactState['fieldErrors'] = {};
	if (!name) fieldErrors.name = 'Please enter your name.';
	else if (name.length > MAX_NAME) fieldErrors.name = 'That name is too long.';

	if (!email) fieldErrors.email = 'Please enter your email address.';
	else if (!EMAIL.test(email) || email.length > MAX_EMAIL)
		fieldErrors.email = 'Please enter a valid email address.';

	if (!message) fieldErrors.message = 'Please enter a message.';
	else if (message.length > MAX_MESSAGE) fieldErrors.message = 'That message is too long.';

	if (Object.keys(fieldErrors).length > 0) {
		return { status: 'error', fieldErrors, values };
	}

	const result = await deliverToDiscord(values);

	if (!result.ok) {
		return {
			status: 'error',
			values,
			message:
				result.reason === 'unconfigured'
					? 'Messaging is temporarily unavailable. Please email me directly.'
					: 'Something went wrong sending that. Please try again.'
		};
	}

	return { status: 'success' };
}
