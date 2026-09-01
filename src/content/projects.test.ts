import { describe, expect, it } from 'vitest';
import { projects } from './projects';

describe('projects content', () => {
	it('lists every project with the fields the UI renders', () => {
		expect(projects).toHaveLength(4);

		for (const project of projects) {
			expect(project.name.trim()).not.toBe('');
			expect(project.description.trim()).not.toBe('');
			expect(project.url).toMatch(/^https:\/\//);
			// static import, not a bare string path — this is what next/image needs
			expect(project.icon.src).toBeTypeOf('string');
			expect(project.icon.src).not.toBe('');
		}
	});

	it('has no duplicate urls', () => {
		const urls = projects.map((p) => p.url);
		expect(new Set(urls).size).toBe(urls.length);
	});

	it('does not still describe this site as a Svelte app on S3', () => {
		const copy = projects.map((p) => p.description).join(' ');
		expect(copy).not.toMatch(/svelte/i);
		expect(copy).not.toMatch(/S3 bucket/i);
	});
});
