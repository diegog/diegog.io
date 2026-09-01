import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from '@playwright/test';

const canvases = (page: import('@playwright/test').Page) =>
	page.evaluate(() => document.querySelectorAll('canvas').length);

test.describe('p5 sketch', () => {
	test('mounts a single canvas filling the hero', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('canvas')).toHaveCount(1);

		const box = await page.locator('canvas').boundingBox();
		const viewport = page.viewportSize();
		expect(box?.width).toBeCloseTo(viewport?.width ?? 0, -1);
		// hero is 60vh
		expect(box?.height).toBeCloseTo((viewport?.height ?? 0) * 0.6, -1);
	});

	test('does not leak a canvas across client-side navigation', async ({ page, isMobile }) => {
		test.skip(!!isMobile, 'nav links are behind the sheet on mobile; covered on desktop');

		await page.goto('/');
		await expect(page.locator('canvas')).toHaveCount(1);

		await page.getByRole('banner').getByRole('link', { name: 'Contact' }).click();
		await expect(page).toHaveURL('/contact');
		expect(await canvases(page)).toBe(0);

		await page.getByRole('banner').getByRole('link', { name: 'diegog.io' }).click();
		await expect(page).toHaveURL('/');
		await expect(page.locator('canvas')).toHaveCount(1);
	});

	test('wordmark is an SVG centred over the canvas, and lets clicks through', async ({ page }) => {
		await page.goto('/');

		const svg = page.getByRole('img', { name: 'Diego.' });
		await expect(svg).toBeVisible();

		const [svgBox, canvasBox] = await Promise.all([
			svg.boundingBox(),
			page.locator('canvas').boundingBox()
		]);
		// centres must coincide
		expect((svgBox?.x ?? 0) + (svgBox?.width ?? 0) / 2).toBeCloseTo(
			(canvasBox?.x ?? 0) + (canvasBox?.width ?? 0) / 2,
			0
		);
		expect((svgBox?.y ?? 0) + (svgBox?.height ?? 0) / 2).toBeCloseTo(
			(canvasBox?.y ?? 0) + (canvasBox?.height ?? 0) / 2,
			0
		);

		// the overlay must never swallow the clicks that spawn circles
		const pe = await svg.evaluate((el) => {
			const parent = el.parentElement;
			return parent ? getComputedStyle(parent).pointerEvents : 'missing';
		});
		expect(pe).toBe('none');
	});

	test('canvas repaints when the viewport resizes', async ({ page, isMobile }) => {
		test.skip(!!isMobile, 'viewport resizing is a desktop concern here');

		await page.goto('/');
		await page.setViewportSize({ width: 900, height: 700 });
		await expect
			.poll(async () => (await page.locator('canvas').boundingBox())?.width)
			.toBeCloseTo(900, -1);
	});

	test('p5 is dynamically imported, not in the initial bundle', () => {
		// p5 is ~1.4MB. It must land in its own lazy chunk, so none of the scripts
		// the document requests up front may contain it.
		const html = readFileSync(join('.next', 'server', 'app', 'index.html'), 'utf8');
		const srcs = [...html.matchAll(/src="(\/_next\/static\/[^"]+\.js)"/g)].flatMap(
			(m) => m[1] ?? []
		);
		expect(srcs.length).toBeGreaterThan(0);

		const carryingP5 = srcs.filter((src) => {
			try {
				// `p5Canvas` is the class p5 puts on the canvases it creates
				return readFileSync(join('.next', src.replace('/_next/', '')), 'utf8').includes('p5Canvas');
			} catch {
				return false;
			}
		});
		expect(carryingP5, 'p5 leaked into the initial bundle').toEqual([]);
	});
});
