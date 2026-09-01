import { expect, test } from '@playwright/test';

test.describe('site shell', () => {
	test('home renders with metadata and header', async ({ page }) => {
		await page.goto('/');

		await expect(page).toHaveTitle('diegog.io');
		await expect(page.getByRole('banner').getByRole('link', { name: 'diegog.io' })).toBeVisible();

		const description = page.locator('meta[name="description"]');
		await expect(description).toHaveAttribute('content', /software engineer/i);
		await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'diegog.io');
		await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
			'content',
			'summary_large_image'
		);
	});

	test('unknown route renders the custom 404, not a framework page', async ({ page }) => {
		const response = await page.goto('/definitely-not-a-page');

		expect(response?.status()).toBe(404);
		await expect(page).toHaveTitle('Page not found · diegog.io');
		await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
		// the header must survive on the error route too
		await expect(page.getByRole('banner').getByRole('link', { name: 'diegog.io' })).toBeVisible();

		await page.getByRole('link', { name: 'Back home' }).click();
		await expect(page).toHaveURL('/');
	});

	test('removed routes are gone', async ({ page }) => {
		for (const path of ['/radio', '/resume.pdf']) {
			const response = await page.goto(path);
			expect(response?.status(), `${path} should be removed`).toBe(404);
		}
	});

	test('ships no analytics or third-party trackers', async ({ page }) => {
		const thirdParty: string[] = [];
		page.on('request', (request) => {
			const { host } = new URL(request.url());
			if (host !== 'localhost:3000') thirdParty.push(host);
		});

		await page.goto('/');
		await page.waitForLoadState('networkidle');

		expect(thirdParty, 'the site should make no third-party requests').toEqual([]);
		await expect(page.locator('script[src*="googletagmanager"]')).toHaveCount(0);
		expect(await page.context().cookies()).toEqual([]);
	});
});

test.describe('desktop navigation', () => {
	test.skip(({ isMobile }) => !!isMobile, 'desktop viewport only');

	test('nav is inline and navigates to contact', async ({ page }) => {
		await page.goto('/');

		const nav = page.getByRole('navigation');
		await expect(nav).toBeVisible();
		await expect(page.getByRole('button', { name: 'Toggle navigation' })).toBeHidden();

		await nav.getByRole('link', { name: 'Contact' }).click();
		await expect(page).toHaveURL('/contact');
		await expect(page).toHaveTitle('Contact · diegog.io');
	});

	test('external Github link is safely configured', async ({ page }) => {
		await page.goto('/');
		const github = page.getByRole('navigation').getByRole('link', { name: 'Github' });
		await expect(github).toHaveAttribute('href', 'https://github.com/diegog');
		await expect(github).toHaveAttribute('rel', /noopener/);
	});
});

test.describe('mobile navigation', () => {
	test.skip(({ isMobile }) => !isMobile, 'mobile viewport only');

	test('sheet opens, navigates, and closes', async ({ page }) => {
		await page.goto('/');

		const toggle = page.getByRole('button', { name: 'Toggle navigation' });
		await expect(toggle).toBeVisible();
		await expect(toggle).toHaveAttribute('aria-expanded', 'false');

		// inline nav links are collapsed behind the sheet at this width
		await expect(page.getByRole('link', { name: 'Contact' })).toBeHidden();

		await toggle.click();
		const dialog = page.getByRole('dialog');
		await expect(dialog).toBeVisible();
		await expect(dialog.getByRole('link', { name: 'Github' })).toHaveAttribute(
			'href',
			'https://github.com/diegog'
		);

		await dialog.getByRole('link', { name: 'Contact' }).click();
		await expect(page).toHaveURL('/contact');
		await expect(page.getByRole('dialog')).toBeHidden();
	});

	test('page does not scroll horizontally', async ({ page }) => {
		await page.goto('/');
		const overflow = await page.evaluate(
			() => document.documentElement.scrollWidth - document.documentElement.clientWidth
		);
		expect(overflow).toBeLessThanOrEqual(0);
	});
});
