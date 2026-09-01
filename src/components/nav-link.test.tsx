import { render, screen } from '@testing-library/react';
import type React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { NavLink } from './nav-link';

describe('NavLink', () => {
	it('renders an internal link without target or rel', () => {
		render(<NavLink link={{ href: '/contact', label: 'Contact' }} />);

		const link = screen.getByRole('link', { name: 'Contact' });
		expect(link).toHaveAttribute('href', '/contact');
		expect(link).not.toHaveAttribute('target');
	});

	it('opens external links safely', () => {
		render(
			<NavLink link={{ href: 'https://github.com/diegog', label: 'Github', external: true }} />
		);

		const link = screen.getByRole('link', { name: 'Github' });
		expect(link).toHaveAttribute('href', 'https://github.com/diegog');
		expect(link).toHaveAttribute('target', '_blank');
		// reverse tabnabbing protection
		expect(link.getAttribute('rel')).toContain('noopener');
	});

	/**
	 * Regression guard. Base UI composes via `render={<NavLink … />}`, passing
	 * onClick/ref down to the rendered element. NavLink originally accepted only
	 * `link` and `className` and dropped the rest, so the mobile sheet navigated
	 * but never closed.
	 */
	describe('forwards props for Base UI `render` composition', () => {
		it('forwards handlers on internal links', async () => {
			const onClick = vi.fn((event: React.MouseEvent) => event.preventDefault());
			render(<NavLink link={{ href: '/contact', label: 'Contact' }} onClick={onClick} />);

			screen.getByRole('link', { name: 'Contact' }).click();
			expect(onClick).toHaveBeenCalledOnce();
		});

		it('forwards handlers on external links', () => {
			const onClick = vi.fn((event: React.MouseEvent) => event.preventDefault());
			render(
				<NavLink
					link={{ href: 'https://example.com', label: 'Example', external: true }}
					onClick={onClick}
				/>
			);

			screen.getByRole('link', { name: 'Example' }).click();
			expect(onClick).toHaveBeenCalledOnce();
		});

		it('forwards arbitrary attributes such as aria state', () => {
			render(
				<NavLink
					link={{ href: '/contact', label: 'Contact' }}
					data-testid="composed"
					aria-current="page"
				/>
			);

			const link = screen.getByTestId('composed');
			expect(link).toHaveAttribute('aria-current', 'page');
		});
	});

	it('keeps its own label as the content', () => {
		render(<NavLink link={{ href: '/contact', label: 'Contact' }} className="extra" />);

		const link = screen.getByRole('link', { name: 'Contact' });
		expect(link).toHaveTextContent('Contact');
		expect(link.className).toContain('extra');
	});
});
