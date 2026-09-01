import { beforeEach, describe, expect, it, vi } from 'vitest';
import { initialContactState } from '@/lib/contact';

const deliverToDiscord = vi.hoisted(() => vi.fn());
vi.mock('@/lib/discord', () => ({ deliverToDiscord }));

const { submitContact } = await import('./actions');

const form = (fields: Record<string, string>) => {
	const data = new FormData();
	for (const [k, v] of Object.entries(fields)) data.set(k, v);
	return data;
};

const valid = { name: 'Ada', email: 'ada@example.com', message: 'hello' };

beforeEach(() => {
	deliverToDiscord.mockReset();
	deliverToDiscord.mockResolvedValue({ ok: true });
});

describe('submitContact validation', () => {
	it('reports every missing field at once', async () => {
		const state = await submitContact(initialContactState, form({}));

		expect(state.status).toBe('error');
		expect(state.fieldErrors).toEqual({
			name: expect.any(String),
			email: expect.any(String),
			message: expect.any(String)
		});
		expect(deliverToDiscord).not.toHaveBeenCalled();
	});

	it('treats whitespace-only input as missing', async () => {
		const state = await submitContact(
			initialContactState,
			form({ name: '   ', email: '  ', message: '\n\t' })
		);

		expect(state.status).toBe('error');
		expect(Object.keys(state.fieldErrors ?? {})).toHaveLength(3);
		expect(deliverToDiscord).not.toHaveBeenCalled();
	});

	it.each(['plainstring', 'no@tld', '@example.com', 'two@@example.com', 'spaced @example.com'])(
		'rejects %s as an email',
		async (email) => {
			const state = await submitContact(initialContactState, form({ ...valid, email }));

			expect(state.fieldErrors?.email).toBeDefined();
			expect(deliverToDiscord).not.toHaveBeenCalled();
		}
	);

	it('echoes values back so a failed submit does not wipe the form', async () => {
		const state = await submitContact(
			initialContactState,
			form({ ...valid, email: 'bad', message: 'keep me' })
		);

		expect(state.values).toMatchObject({ name: 'Ada', message: 'keep me' });
	});

	it('rejects an over-long message without calling the webhook', async () => {
		const state = await submitContact(
			initialContactState,
			form({ ...valid, message: 'm'.repeat(4001) })
		);

		expect(state.fieldErrors?.message).toBeDefined();
		expect(deliverToDiscord).not.toHaveBeenCalled();
	});
});

describe('submitContact delivery', () => {
	it('delivers trimmed values and reports success', async () => {
		const state = await submitContact(
			initialContactState,
			form({ name: '  Ada  ', email: ' ada@example.com ', message: '  hello  ' })
		);

		expect(state.status).toBe('success');
		expect(deliverToDiscord).toHaveBeenCalledWith(valid);
	});

	it('silently drops honeypot submissions but fakes success', async () => {
		const state = await submitContact(initialContactState, form({ ...valid, company: 'AcmeCorp' }));

		expect(state.status).toBe('success');
		expect(deliverToDiscord).not.toHaveBeenCalled();
	});

	it('explains an unconfigured webhook without leaking why', async () => {
		deliverToDiscord.mockResolvedValue({ ok: false, reason: 'unconfigured' });
		const state = await submitContact(initialContactState, form(valid));

		expect(state.status).toBe('error');
		expect(state.message).toMatch(/temporarily unavailable/i);
		expect(state.message).not.toMatch(/webhook|discord|env/i);
		// the typed values survive so the visitor can retry
		expect(state.values).toEqual(valid);
	});

	it('asks the visitor to retry when delivery fails', async () => {
		deliverToDiscord.mockResolvedValue({ ok: false, reason: 'failed' });
		const state = await submitContact(initialContactState, form(valid));

		expect(state.status).toBe('error');
		expect(state.message).toMatch(/try again/i);
	});
});
