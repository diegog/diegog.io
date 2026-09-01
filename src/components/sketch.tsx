'use client';

import type p5 from 'p5';
import { useEffect, useRef } from 'react';
import { createSketch } from '@/lib/p5-sketch';

export function Sketch() {
	const hostRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const host = hostRef.current;
		if (!host) return;

		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		let disposed = false;
		let instance: p5 | null = null;
		let observer: ResizeObserver | null = null;

		void (async () => {
			const { default: P5 } = await import('p5');
			if (disposed) return;

			const controller = createSketch(host, reducedMotion);
			instance = new P5(controller.sketch, host);

			observer = new ResizeObserver(() => controller.resize());
			observer.observe(host);
		})();

		return () => {
			disposed = true;
			observer?.disconnect();
			instance?.remove();
			instance = null;
		};
	}, []);

	return (
		<div className="relative h-[60vh] w-full overflow-hidden">
			<div ref={hostRef} className="absolute inset-0" />
			<div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
				<svg
					role="img"
					aria-label="Diego."
					width="260"
					height="96"
					viewBox="0 0 260 96"
					overflow="visible"
					className="font-sans text-black"
				>
					<title>Diego.</title>
					<text
						x="130"
						y="48"
						textAnchor="middle"
						dominantBaseline="central"
						fontSize="72"
						fill="currentColor"
					>
						Diego.
					</text>
				</svg>
			</div>
		</div>
	);
}
