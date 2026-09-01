export const PROGRAMMING_SINCE = 2013;
export const ENGINEERING_SINCE = 2020;

/**
 * Whole years elapsed since `startYear`.
 *
 * Uses UTC so the rendered count never depends on the server's timezone —
 * `getFullYear()` reports 2025 for `2026-01-01T00:00Z` anywhere west of
 * Greenwich, which would show the wrong number for part of every New Year.
 * Pure and injectable so it can be tested without mocking the clock.
 */
export function yearsSince(startYear: number, now: Date = new Date()): number {
	return Math.max(0, now.getUTCFullYear() - startYear);
}

export const bioHeading = 'About me';

export function getBioParagraphs(now: Date = new Date()): readonly string[] {
	const programming = yearsSince(PROGRAMMING_SINCE, now);
	const professional = yearsSince(ENGINEERING_SINCE, now);

	return [
		'Hey, my name is Diego! I am a software engineer currently working remotely at a fintech company that specializes in B2B commerce based out of San Francisco, California. When I am not coding, you will find me in the mountains!',
		`I have been programming for ${programming}+ years and have ${professional} years of professional work experience as a software engineer. I specialize in complex backend systems, but am comfortable working with full-stack development and love learning about new technology/concepts. I am also a huge proponent of creating CI/CD pipelines early on in the development process so that I can spend more time developing rather than building and deploying.`,
		'I am a ski bum at heart, so you will find me in the mountains skiing most of the winter. When skiing isn’t possible I will still be taking advantage of the beautiful landscape in the Rocky Mountains while either hiking or camping. I love learning about native ecosystems and being as self-sustainable as possible.'
	];
}

export const bioPhotoAlt = 'Diego Garcia standing on a waterfront path lined with palm trees';
