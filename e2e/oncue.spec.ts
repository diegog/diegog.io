import { expect, test } from '@playwright/test';

test.describe('On Cue privacy policy', () => {
	// The App Store listing links here, so the URL has to keep working.
	test('renders at its App Store URL with a way to get in touch', async ({ page }) => {
		const response = await page.goto('/oncue/privacy');
		expect(response?.status()).toBe(200);

		await expect(page).toHaveTitle('On Cue Privacy Policy · diegog.io');
		await expect(
			page.getByRole('heading', { level: 1, name: 'On Cue Privacy Policy' })
		).toBeVisible();
		await expect(
			page.getByRole('main').getByRole('link', { name: 'Get in touch' })
		).toHaveAttribute('href', '/contact');
	});
});
