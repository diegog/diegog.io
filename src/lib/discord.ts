/**
 * Discord webhook delivery for the contact form.
 *
 * Kept free of Next.js imports so the payload shaping can be unit-tested
 * without a request context.
 */

/** Discord's own limits; exceeding any of these makes the webhook 400. */
const MAX_FIELD_VALUE = 1024;
const MAX_DESCRIPTION = 4096;

const EMBED_COLOR = 0x2c3e50;

export type ContactSubmission = {
	name: string;
	email: string;
	message: string;
};

export type DeliveryResult = { ok: true } | { ok: false; reason: 'unconfigured' | 'failed' };

function truncate(value: string, max: number): string {
	return value.length <= max ? value : `${value.slice(0, max - 1)}…`;
}

export function buildDiscordPayload(submission: ContactSubmission, now: Date = new Date()) {
	return {
		username: 'diegog.io',
		/**
		 * Load-bearing: this endpoint is public, so without an empty `parse` a
		 * submission containing `@everyone` would ping the whole server.
		 */
		allowed_mentions: { parse: [] as string[] },
		embeds: [
			{
				title: 'New contact form submission',
				color: EMBED_COLOR,
				timestamp: now.toISOString(),
				description: truncate(submission.message, MAX_DESCRIPTION),
				fields: [
					{ name: 'Name', value: truncate(submission.name, MAX_FIELD_VALUE), inline: true },
					{ name: 'Email', value: truncate(submission.email, MAX_FIELD_VALUE), inline: true }
				]
			}
		]
	};
}

export async function deliverToDiscord(
	submission: ContactSubmission,
	webhookUrl = process.env.DISCORD_WEBHOOK_URL,
	fetchImpl: typeof fetch = fetch
): Promise<DeliveryResult> {
	if (!webhookUrl) {
		console.error('DISCORD_WEBHOOK_URL is not set; contact submission dropped');
		return { ok: false, reason: 'unconfigured' };
	}

	try {
		const response = await fetchImpl(webhookUrl, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(buildDiscordPayload(submission))
		});

		if (!response.ok) {
			// never log the webhook URL itself — it is the credential
			console.error(`Discord webhook responded ${response.status}`);
			return { ok: false, reason: 'failed' };
		}

		return { ok: true };
	} catch (error) {
		console.error('Discord webhook request failed', error);
		return { ok: false, reason: 'failed' };
	}
}
