import { expect, test } from '@playwright/test';
import { ENGINEERING_SINCE, PROGRAMMING_SINCE, yearsSince } from '@/content/bio';

test.describe('home page content', () => {
	test('bio renders with an accessible photo', async ({ page }) => {
		await page.goto('/');

		await expect(page.getByRole('heading', { name: 'About me' })).toBeVisible();
		await expect(page.getByRole('main').getByRole('paragraph')).not.toHaveCount(0);

		// the Svelte original shipped this <img> with no alt at all.
		// scope to real <img> elements — the hero wordmark is an SVG with role="img".
		const photo = page.locator('main img').first();
		await expect(photo).toBeVisible();
		const alt = await photo.getAttribute('alt');
		expect(alt?.trim().length ?? 0).toBeGreaterThan(0);
	});

	test('every project renders and links out', async ({ page }) => {
		await page.goto('/');

		await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();

		const expected = [
			['banyanbreads.com', 'https://banyanbreads.com'],
			['manatee.zone', 'https://manatee.zone'],
			['diegog.io (this website)', 'https://diegog.io'],
			['recipes', 'https://recipes.diegog.io']
		] as const;

		const items = page.locator('main li');
		await expect(items).toHaveCount(expected.length);

		for (const [name, url] of expected) {
			const heading = page.getByRole('heading', { name, exact: true });
			await expect(heading).toBeVisible();
			const card = page.locator('main li').filter({ has: heading });
			await expect(card.getByRole('link')).toHaveAttribute('href', url);
		}
	});

	test('experience years are derived from the start years, not hardcoded', async ({ page }) => {
		await page.goto('/');

		// computed from the same constants the page uses, so this stays true next year
		const programming = yearsSince(PROGRAMMING_SINCE);
		const professional = yearsSince(ENGINEERING_SINCE);

		const main = page.getByRole('main');
		await expect(main).toContainText(`programming for ${programming}+ years`);
		await expect(main).toContainText(`${professional} years of professional work experience`);

		// the values the original had hardcoded must not survive
		await expect(main).not.toContainText('programming for 8+ years');
		await expect(main).not.toContainText('have 3 years of professional');
	});

	test('project copy is not stale', async ({ page }) => {
		await page.goto('/');
		// the old copy described this site as "made with svelte" on an "S3 bucket"
		await expect(page.getByRole('main')).not.toContainText(/made with svelte/i);
		await expect(page.getByRole('main')).not.toContainText(/S3 bucket/i);
	});

	test('images are served through the Next optimizer, not as raw sources', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		const srcs = await page.evaluate(() => [...document.images].map((i) => i.currentSrc));
		expect(srcs.length).toBe(5);
		for (const src of srcs) {
			expect(src, 'every image should go through /_next/image').toContain('/_next/image');
		}
		// the 3.8MB animated GIF must not come back
		expect(srcs.join(' ')).not.toContain('.gif');
	});
});
