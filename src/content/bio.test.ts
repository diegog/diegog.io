import { describe, expect, it } from 'vitest';
import { ENGINEERING_SINCE, getBioParagraphs, PROGRAMMING_SINCE, yearsSince } from './bio';

describe('yearsSince', () => {
	it('counts whole calendar years', () => {
		expect(yearsSince(2013, new Date('2026-09-01'))).toBe(13);
		expect(yearsSince(2020, new Date('2026-01-01'))).toBe(6);
	});

	it('rolls over on new year', () => {
		expect(yearsSince(2013, new Date('2026-12-31'))).toBe(13);
		expect(yearsSince(2013, new Date('2027-01-01'))).toBe(14);
	});

	it('never reports negative years for a future start', () => {
		expect(yearsSince(2030, new Date('2026-09-01'))).toBe(0);
	});
});

describe('getBioParagraphs', () => {
	it('interpolates both counts from the start years', () => {
		const [, experience] = getBioParagraphs(new Date('2026-09-01'));

		expect(experience).toContain('programming for 13+ years');
		expect(experience).toContain('6 years of professional work experience');
	});

	it('tracks the clock rather than hardcoding', () => {
		const later = getBioParagraphs(new Date('2031-06-15'))[1] ?? '';

		expect(later).toContain(
			`programming for ${yearsSince(PROGRAMMING_SINCE, new Date('2031-06-15'))}+ years`
		);
		expect(later).toContain(
			`${yearsSince(ENGINEERING_SINCE, new Date('2031-06-15'))} years of professional`
		);
		// the values the Svelte original had baked in.
		// word-bounded: '18+ years' would otherwise "contain" '8+ years'
		expect(later).not.toMatch(/\b8\+ years/);
		expect(later).not.toMatch(/have 3 years/);
	});

	it('returns all three paragraphs', () => {
		expect(getBioParagraphs(new Date('2026-09-01'))).toHaveLength(3);
	});
});
