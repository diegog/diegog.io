import { expect, test } from '@playwright/test';

test.describe('contact form', () => {
	test('labels are wired to their own controls', async ({ page }) => {
		await page.goto('/contact');

		// The Svelte original gave two inputs id="exampleFormControlInput1", so
		// clicking "Email address" focused the name field.
		await page.getByText('Email address').click();
		await expect(page.locator('input[name="email"]')).toBeFocused();

		await page.getByText('Name', { exact: true }).click();
		await expect(page.locator('input[name="name"]')).toBeFocused();

		await page.getByText('Message', { exact: true }).click();
		await expect(page.locator('textarea[name="message"]')).toBeFocused();
	});

	test('empty submit reports every field and sends nothing', async ({ page }) => {
		const posts: string[] = [];
		page.on('request', (r) => {
			if (r.method() === 'POST') posts.push(r.url());
		});

		await page.goto('/contact');
		await page.getByRole('button', { name: 'Submit' }).click();

		await expect(page.getByText('Please enter your name.')).toBeVisible();
		await expect(page.getByText('Please enter your email address.')).toBeVisible();
		await expect(page.getByText('Please enter a message.')).toBeVisible();

		// the form must not have been cleared
		await expect(page.locator('input[name="name"]')).toBeVisible();
	});

	test('rejects a malformed email and keeps what was typed', async ({ page }) => {
		await page.goto('/contact');

		await page.fill('input[name="name"]', 'Ada Lovelace');
		await page.fill('input[name="email"]', 'not-an-email');
		await page.fill('textarea[name="message"]', 'a message worth keeping');
		await page.getByRole('button', { name: 'Submit' }).click();

		await expect(page.getByText('Please enter a valid email address.')).toBeVisible();
		await expect(page.locator('input[name="name"]')).toHaveValue('Ada Lovelace');
		await expect(page.locator('textarea[name="message"]')).toHaveValue('a message worth keeping');
	});

	test('carries a honeypot that is hidden from people', async ({ page }) => {
		await page.goto('/contact');

		const honeypot = page.locator('input[name="company"]');
		await expect(honeypot).toHaveCount(1);

		// Positioned off-screen rather than display:none — bots skip display:none,
		// which defeats the point. So assert it is off-canvas, not "hidden".
		const box = await honeypot.boundingBox();
		expect(box?.x ?? 0).toBeLessThan(0);

		// unreachable by keyboard, and out of the accessibility tree
		await expect(honeypot).toHaveAttribute('tabindex', '-1');
		await expect(page.locator('[aria-hidden="true"] input[name="company"]')).toHaveCount(1);
	});

	test('fails gracefully when the webhook is not configured', async ({ page }) => {
		// the test server runs without DISCORD_WEBHOOK_URL, so a valid submission
		// must surface a message rather than a 500
		await page.goto('/contact');

		await page.fill('input[name="name"]', 'Ada Lovelace');
		await page.fill('input[name="email"]', 'ada@example.com');
		await page.fill('textarea[name="message"]', 'hello');
		await page.getByRole('button', { name: 'Submit' }).click();

		await expect(page.getByRole('main').getByRole('alert')).toContainText(
			/temporarily unavailable|went wrong/i
		);
	});

	test('does not ship the webhook secret to the browser', async ({ page }) => {
		const scripts: string[] = [];
		page.on('response', async (r) => {
			if (r.request().resourceType() === 'script') {
				try {
					scripts.push(await r.text());
				} catch {
					/* ignore */
				}
			}
		});

		await page.goto('/contact');
		await page.waitForLoadState('networkidle');

		const all = scripts.join('\n');
		expect(all).not.toContain('discord.com/api/webhooks');
		expect(all).not.toContain('DISCORD_WEBHOOK_URL');
	});
});
