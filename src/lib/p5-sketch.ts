import type p5 from 'p5';

const BACKGROUND = '#f4f4f4';
const GROWTH_PER_FRAME = 3;
const LIFESPAN_FRAMES = 1000;

type Circle = {
	x: number;
	y: number;
	size: number;
	r: number;
	g: number;
	b: number;
	lifespan: number;
};

export type SketchController = {
	sketch: (p: p5) => void;
	resize: () => void;
};

export function createSketch(host: HTMLElement, reducedMotion = false): SketchController {
	let instance: p5 | null = null;
	let circles: Circle[] = [];

	const spawn = (p: p5, x: number, y: number, size: number): Circle => ({
		x,
		y,
		size,
		r: p.random(255),
		g: p.random(255),
		b: p.random(255),
		lifespan: LIFESPAN_FRAMES
	});

	const sketch = (p: p5) => {
		instance = p;

		p.setup = () => {
			p.createCanvas(host.clientWidth, host.clientHeight);
			p.background(BACKGROUND);

			if (reducedMotion) {
				p.noLoop();
				return;
			}

			circles.push(spawn(p, p.width * 0.5, p.height * 0.5, 0));
		};

		p.draw = () => {
			for (const circle of circles) {
				circle.size += GROWTH_PER_FRAME;
				circle.lifespan -= 1;
				p.fill(circle.r, circle.g, circle.b);
				p.noStroke();
				p.ellipse(circle.x, circle.y, circle.size);
			}
			circles = circles.filter((circle) => circle.lifespan > 0);
		};

		p.mousePressed = () => {
			if (reducedMotion) return;
			circles.push(spawn(p, p.mouseX, p.mouseY, p.random(7, 15)));
		};
	};

	return {
		sketch,
		resize: () => instance?.resizeCanvas(host.clientWidth, host.clientHeight)
	};
}
