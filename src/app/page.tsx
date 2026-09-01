import { Bio } from '@/components/bio';
import { Projects } from '@/components/projects';
import { Sketch } from '@/components/sketch';

/**
 * The bio derives its year counts from the current date, so the prerendered
 * page is refreshed daily rather than freezing at build time.
 */
export const revalidate = 86400;

export default function HomePage() {
	return (
		<main className="flex flex-col gap-6 font-prose text-prose">
			<Sketch />
			<Bio />
			<Projects />
		</main>
	);
}
