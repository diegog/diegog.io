import Link from 'next/link';
import { MobileNav } from '@/components/mobile-nav';
import { NavLink } from '@/components/nav-link';
import { navLinks, site } from '@/content/site';

export function SiteHeader() {
	return (
		<header className="fixed inset-x-0 top-0 z-40 h-(--header-height) bg-background">
			<div className="container-page flex h-full items-center justify-between">
				<Link href="/" className="text-nav-brand text-[20px]">
					{site.name}
				</Link>

				<nav className="hidden items-center gap-4 sm:flex">
					{navLinks.map((link) => (
						<NavLink key={link.href} link={link} />
					))}
				</nav>

				<div className="sm:hidden">
					<MobileNav />
				</div>
			</div>
		</header>
	);
}
