'use client';

import { MenuIcon } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from '@/components/nav-link';
import { Button } from '@/components/ui/button';
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from '@/components/ui/sheet';
import { navLinks, site } from '@/content/site';

export function MobileNav() {
	const [open, setOpen] = useState(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger
				render={
					<Button
						variant="ghost"
						aria-label="Toggle navigation"
						className="h-[38px] w-[54px] rounded-md border border-black/10 p-0"
					>
						<MenuIcon className="size-[30px]" strokeWidth={1.75} />
					</Button>
				}
			/>
			<SheetContent side="right" className="w-64">
				<SheetHeader>
					<SheetTitle>{site.name}</SheetTitle>
				</SheetHeader>
				<nav className="flex flex-col gap-1 px-4">
					{navLinks.map((link) => (
						<SheetClose
							key={link.href}
							render={<NavLink link={link} className="py-2 text-base" />}
						/>
					))}
				</nav>
			</SheetContent>
		</Sheet>
	);
}
