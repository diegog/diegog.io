import type { StaticImageData } from 'next/image';
import banyanBreadsIcon from '@/images/banyan_breads.webp';
import diegogIcon from '@/images/diegog_icon.webp';
import manzoIcon from '@/images/manzo_icon.webp';
import recipesIcon from '@/images/recipes_icon.webp';

export type Project = {
	name: string;
	url: string;
	icon: StaticImageData;
	description: string;
};

export const projects: readonly Project[] = [
	{
		name: 'banyanbreads.com',
		url: 'https://banyanbreads.com',
		icon: banyanBreadsIcon,
		description:
			'An ecomerce website built for the Banyan Breads micro bakery in Salida. Baker is able to manage their own menus/inventory and accept payment'
	},
	{
		name: 'manatee.zone',
		url: 'https://manatee.zone',
		icon: manzoIcon,
		description:
			"An easy-to-access data visualization of state-mandated 'manatee zones' in Florida. Created after noticing a rise in uninformed boaters and lack of signage in Biscayne Bay"
	},
	{
		name: 'diegog.io (this website)',
		url: 'https://diegog.io',
		icon: diegogIcon,
		description:
			'A simple serverless portfolio website made with Next.js and React. Deployed on Vercel, with cloud functions deployed on AWS Lambda'
	},
	{
		name: 'recipes',
		url: 'https://recipes.diegog.io',
		icon: recipesIcon,
		description:
			'A serverless progressive-web-application that renders recipes (written in markdown) into a fast and simple showcase-style website that can be downloaded for offline use'
	}
];
