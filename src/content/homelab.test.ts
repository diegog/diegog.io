import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { machines, serviceCategories, services } from './homelab';

describe('homelab content', () => {
	it('lists every machine with the fields the UI renders', () => {
		expect(machines.length).toBeGreaterThan(0);
		for (const machine of machines) {
			expect(machine.name.trim()).not.toBe('');
			expect(machine.role.trim()).not.toBe('');
			expect(machine.specs.length).toBeGreaterThan(0);
		}
		const names = machines.map((m) => m.name);
		expect(new Set(names).size).toBe(names.length);
	});

	it('lists every service with the fields the UI renders', () => {
		expect(services.length).toBeGreaterThan(0);
		for (const service of services) {
			expect(service.name.trim()).not.toBe('');
			if (service.description !== undefined) expect(service.description.trim()).not.toBe('');
			expect(service.url).toMatch(/^https:\/\//);
			expect(serviceCategories).toContain(service.category);
		}
		const names = services.map((s) => s.name);
		expect(new Set(names).size).toBe(names.length);
	});

	it('has a vendored icon for every service (run `pnpm icons` if this fails)', () => {
		const files = readdirSync(join(__dirname, '..', 'images', 'homelab'));
		const vendored = new Set(files.map((f) => f.replace(/\.(svg|png)$/, '')));
		for (const service of services) {
			expect(vendored, `missing icon for "${service.icon}"`).toContain(service.icon);
		}
	});
});
