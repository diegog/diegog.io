import { describe, expect, it, vi } from 'vitest';
import { buildDiscordPayload, type ContactSubmission, deliverToDiscord } from './discord';

const submission: ContactSubmission = {
	name: 'Ada Lovelace',
	email: 'ada@example.com',
	message: 'Hello there'
};

describe('buildDiscordPayload', () => {
	it('puts the message in the description and the identity in fields', () => {
		const payload = buildDiscordPayload(submission, new Date('2026-09-01T12:00:00Z'));
		const embed = payload.embeds[0];

		expect(embed?.description).toBe('Hello there');
		expect(embed?.fields[0]).toMatchObject({ name: 'Name', value: 'Ada Lovelace' });
		expect(embed?.fields[1]).toMatchObject({ name: 'Email', value: 'ada@example.com' });
		expect(embed?.timestamp).toBe('2026-09-01T12:00:00.000Z');
	});

	it('disables mention resolution so submitted text cannot ping the server', () => {
		const payload = buildDiscordPayload({ ...submission, message: 'hey @everyone @here' });

		// the text is delivered verbatim, but Discord is told to resolve nothing
		expect(payload.allowed_mentions).toEqual({ parse: [] });
		expect(payload.embeds[0]?.description).toBe('hey @everyone @here');
	});

	it('truncates to Discord limits so the webhook does not 400', () => {
		const payload = buildDiscordPayload({
			name: 'n'.repeat(5000),
			email: 'e'.repeat(5000),
			message: 'm'.repeat(9000)
		});
		const embed = payload.embeds[0];

		expect(embed?.fields[0]?.value).toHaveLength(1024);
		expect(embed?.fields[1]?.value).toHaveLength(1024);
		expect(embed?.description).toHaveLength(4096);
		expect(embed?.description.endsWith('…')).toBe(true);
	});

	it('leaves content at the limit untouched', () => {
		const payload = buildDiscordPayload({ ...submission, message: 'm'.repeat(4096) });
		expect(payload.embeds[0]?.description).not.toContain('…');
	});
});

describe('deliverToDiscord', () => {
	it('reports unconfigured when no webhook url is set, without calling fetch', async () => {
		const fetchSpy = vi.fn();
		const result = await deliverToDiscord(
			submission,
			undefined,
			fetchSpy as unknown as typeof fetch
		);

		expect(result).toEqual({ ok: false, reason: 'unconfigured' });
		expect(fetchSpy).not.toHaveBeenCalled();
	});

	it('POSTs JSON to the webhook', async () => {
		const fetchSpy = vi.fn(async () => new Response(null, { status: 204 }));
		const result = await deliverToDiscord(
			submission,
			'https://discord.test/hook',
			fetchSpy as unknown as typeof fetch
		);

		expect(result).toEqual({ ok: true });
		expect(fetchSpy).toHaveBeenCalledOnce();

		const [url, init] = fetchSpy.mock.calls[0] as unknown as [string, RequestInit];
		expect(url).toBe('https://discord.test/hook');
		expect(init.method).toBe('POST');
		expect(JSON.parse(String(init.body)).allowed_mentions).toEqual({ parse: [] });
	});

	it('reports failure on a non-2xx response', async () => {
		const fetchSpy = vi.fn(async () => new Response('rate limited', { status: 429 }));
		vi.spyOn(console, 'error').mockImplementation(() => {});

		await expect(
			deliverToDiscord(submission, 'https://discord.test/hook', fetchSpy as unknown as typeof fetch)
		).resolves.toEqual({ ok: false, reason: 'failed' });
	});

	it('reports failure when the request throws', async () => {
		const fetchSpy = vi.fn(async () => {
			throw new Error('network down');
		});
		vi.spyOn(console, 'error').mockImplementation(() => {});

		await expect(
			deliverToDiscord(submission, 'https://discord.test/hook', fetchSpy as unknown as typeof fetch)
		).resolves.toEqual({ ok: false, reason: 'failed' });
	});

	it('never logs the webhook url, which is the credential', async () => {
		const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		const fetchSpy = vi.fn(async () => new Response(null, { status: 500 }));

		await deliverToDiscord(
			submission,
			'https://discord.com/api/webhooks/123/SECRET',
			fetchSpy as unknown as typeof fetch
		);

		const logged = errorSpy.mock.calls.flat().map(String).join(' ');
		expect(logged).not.toContain('SECRET');
		expect(logged).toContain('500');
	});
});
