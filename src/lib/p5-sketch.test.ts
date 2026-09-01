import type p5 from 'p5';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createSketch } from './p5-sketch';

type EllipseCall = { x: number; y: number; size: number };

/** Minimal stand-in for the p5 instance API this sketch actually touches. */
function fakeP5(width = 400, height = 300) {
	const ellipses: EllipseCall[] = [];
	const p = {
		width,
		height,
		mouseX: 0,
		mouseY: 0,
		CENTER: 'center',
		// deterministic: p5's random(n) => [0,n), random(a,b) => [a,b)
		random: (a: number, b?: number) => (b === undefined ? a / 2 : (a + b) / 2),
		createCanvas: vi.fn(),
		background: vi.fn(),
		fill: vi.fn(),
		noStroke: vi.fn(),
		ellipse: vi.fn((x: number, y: number, size: number) => {
			ellipses.push({ x, y, size });
		}),
		resizeCanvas: vi.fn(),
		noLoop: vi.fn()
		// p5 declares mouseX/mouseY readonly; the fake needs them writable
	} as unknown as Omit<p5, 'mouseX' | 'mouseY'> & {
		ellipse: ReturnType<typeof vi.fn>;
		mouseX: number;
		mouseY: number;
	};

	return { p, ellipses };
}

const host = (w = 400, h = 300) => ({ clientWidth: w, clientHeight: h }) as HTMLElement;

describe('createSketch', () => {
	let fake: ReturnType<typeof fakeP5>;

	beforeEach(() => {
		fake = fakeP5();
	});

	it('sizes the canvas to the host and paints the background once', () => {
		const controller = createSketch(host(640, 480));
		controller.sketch(fake.p);
		fake.p.setup();

		expect(fake.p.createCanvas).toHaveBeenCalledWith(640, 480);
		expect(fake.p.background).toHaveBeenCalledTimes(1);
	});

	it('seeds one circle at the centre', () => {
		const controller = createSketch(host());
		controller.sketch(fake.p);
		fake.p.setup();
		fake.p.draw();

		expect(fake.ellipses).toHaveLength(1);
		expect(fake.ellipses[0]).toMatchObject({ x: 200, y: 150 });
	});

	/**
	 * The whole look depends on draw() never clearing: circles accumulate and
	 * wash over one another. If a background() call ever appears in draw, the
	 * sketch becomes a single moving disc instead.
	 */
	it('never repaints the background during draw', () => {
		const controller = createSketch(host());
		controller.sketch(fake.p);
		fake.p.setup();
		const afterSetup = (fake.p.background as ReturnType<typeof vi.fn>).mock.calls.length;

		for (let i = 0; i < 20; i++) fake.p.draw();

		expect((fake.p.background as ReturnType<typeof vi.fn>).mock.calls.length).toBe(afterSetup);
	});

	it('grows each circle by 3px per frame', () => {
		const controller = createSketch(host());
		controller.sketch(fake.p);
		fake.p.setup();

		fake.p.draw();
		fake.p.draw();
		fake.p.draw();

		expect(fake.ellipses.map((e) => e.size)).toEqual([3, 6, 9]);
	});

	/**
	 * Circles must be drawn oldest-first so the newest lands on top. Reversing
	 * the loop (a tempting way to fix splice-while-iterating) inverts the
	 * layering and changes the whole look.
	 */
	it('draws circles oldest-first', () => {
		const controller = createSketch(host());
		controller.sketch(fake.p);
		fake.p.setup();
		fake.p.draw();

		fake.p.mouseX = 10;
		fake.p.mouseY = 20;
		fake.p.mousePressed();
		fake.p.mouseX = 300;
		fake.p.mouseY = 250;
		fake.p.mousePressed();

		fake.ellipses.length = 0;
		fake.p.draw();

		// centre circle (oldest) first, then the two clicks in the order made
		expect(fake.ellipses.map((e) => [e.x, e.y])).toEqual([
			[200, 150],
			[10, 20],
			[300, 250]
		]);
	});

	/**
	 * The original spliced while iterating forward, so removing a circle skipped
	 * the next one that frame. Sweeping after the draw pass keeps every live
	 * circle painted on every frame.
	 */
	it('keeps painting every live circle on the frame another expires', () => {
		const controller = createSketch(host());
		controller.sketch(fake.p);
		fake.p.setup();

		// stagger three more so they expire on different frames
		for (let i = 0; i < 3; i++) {
			fake.p.mouseX = 10 * (i + 1);
			fake.p.mouseY = 10 * (i + 1);
			fake.p.mousePressed();
			fake.p.draw();
		}

		const counts: number[] = [];
		for (let frame = 0; frame < 1010; frame++) {
			fake.ellipses.length = 0;
			fake.p.draw();
			counts.push(fake.ellipses.length);
		}

		// the count may only ever step down as circles expire, never dip and recover
		for (let i = 1; i < counts.length; i++) {
			expect(counts[i]).toBeLessThanOrEqual(counts[i - 1] as number);
		}
		// and they do eventually all expire
		expect(counts.at(-1)).toBe(0);
	});

	it('spawns a circle at the cursor on click', () => {
		const controller = createSketch(host());
		controller.sketch(fake.p);
		fake.p.setup();
		fake.p.mouseX = 123;
		fake.p.mouseY = 45;
		fake.p.mousePressed();

		fake.ellipses.length = 0;
		fake.p.draw();

		expect(fake.ellipses.map((e) => [e.x, e.y])).toContainEqual([123, 45]);
	});

	it('resizes the canvas to the host box', () => {
		const element = host(400, 300);
		const controller = createSketch(element);
		controller.sketch(fake.p);
		fake.p.setup();

		Object.assign(element, { clientWidth: 900, clientHeight: 500 });
		controller.resize();

		expect(fake.p.resizeCanvas).toHaveBeenCalledWith(900, 500);
	});

	describe('with reduced motion', () => {
		it('paints a flat background and stops the loop', () => {
			const controller = createSketch(host(), true);
			controller.sketch(fake.p);
			fake.p.setup();

			expect(fake.p.background).toHaveBeenCalledTimes(1);
			expect(fake.p.noLoop).toHaveBeenCalledOnce();
		});

		it('does not animate or respond to clicks', () => {
			const controller = createSketch(host(), true);
			controller.sketch(fake.p);
			fake.p.setup();
			fake.p.mousePressed();
			fake.p.draw();

			expect(fake.ellipses).toHaveLength(0);
		});
	});
});
