import Link from 'next/link';
import type { ComponentProps } from 'react';
import type { NavLink as NavLinkData } from '@/content/site';
import { cn } from '@/lib/utils';

type NavLinkProps = Omit<ComponentProps<'a'>, 'href' | 'children'> & {
	link: NavLinkData;
};

export function NavLink({ link, className, ...props }: NavLinkProps) {
	const classes = cn(
		'px-2 py-2 text-nav-link transition-colors hover:text-nav-link-hover',
		className
	);

	if (link.external) {
		return (
			<a href={link.href} className={classes} rel="noreferrer noopener" target="_blank" {...props}>
				{link.label}
			</a>
		);
	}

	return (
		<Link href={link.href} className={classes} {...props}>
			{link.label}
		</Link>
	);
}
