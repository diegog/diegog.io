export const site = {
	name: 'diegog.io',
	title: 'diegog.io',
	description: 'Diego Garcia — Software Engineer',
	author: 'Diego Garcia',
	url: 'https://diegog.io',
	github: 'https://github.com/diegog'
} as const;

export type NavLink = {
	href: string;
	label: string;
	external?: boolean;
};

export const navLinks: readonly NavLink[] = [
	{ href: '/contact', label: 'Contact' },
	{ href: site.github, label: 'Github', external: true }
];
