import { expect, test } from '@playwright/test';
import { machines, services } from '@/content/homelab';

test.describe('homelab page', () => {
	test('renders with metadata, the outline headings, and the data lists', async ({ page }) => {
		await page.goto('/homelab');

		await expect(page).toHaveTitle('Homelab · diegog.io');
		await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /homelab/i);
		await expect(page.getByRole('heading', { level: 1, name: 'Homelab' })).toBeVisible();
		await expect(page.getByRole('heading', { level: 2, name: 'What runs on it' })).toBeVisible();

		const main = page.getByRole('main');
		for (const machine of machines) {
			// not exact: the heading also carries the "× N" count badge
			await expect(main.getByRole('heading', { name: machine.name })).toBeVisible();
		}
		// scoped to the cards: the prose links to some of the same projects
		const cards = main.locator('li');
		for (const service of services) {
			const link = cards.getByRole('link', { name: service.name, exact: true });
			await expect(link).toHaveAttribute('href', service.url);
			await expect(link).toHaveAttribute('rel', /noopener/);
		}
	});

	test('service icons are vendored and actually load', async ({ page }) => {
		const thirdParty: string[] = [];
		page.on('request', (request) => {
			const { host } = new URL(request.url());
			if (host !== 'localhost:3000') thirdParty.push(host);
		});

		await page.goto('/homelab');
		await page.waitForLoadState('networkidle');

		expect(thirdParty, 'icons must not be fetched from a CDN at runtime').toEqual([]);

		// the service cards' icons — not the rack photo above the hardware list
		const icons = page.locator('main li img');
		await expect(icons).toHaveCount(services.length);
		// icons are lazy-loaded, so bring each into view before checking it decoded
		for (const icon of await icons.all()) {
			await icon.scrollIntoViewIfNeeded();
			await expect
				.poll(() => icon.evaluate((img) => (img as HTMLImageElement).naturalWidth), {
					message: 'every icon should decode'
				})
				.toBeGreaterThan(0);
		}
		expect(thirdParty, 'lazy-loaded icons must not come from a CDN either').toEqual([]);
	});

	test('is reachable from the header nav', async ({ page, isMobile }) => {
		await page.goto('/');
		if (isMobile) await page.getByRole('button', { name: 'Toggle navigation' }).click();

		// the header link, not the project card on the home page that goes to the same place
		const nav = isMobile ? page.getByRole('dialog') : page.getByRole('banner');
		await nav.getByRole('link', { name: 'Homelab', exact: true }).click();
		await expect(page).toHaveURL('/homelab');
	});
});
