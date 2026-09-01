import Image from 'next/image';
import { bioHeading, bioPhotoAlt, getBioParagraphs } from '@/content/bio';
import me from '@/images/me.webp';

export function Bio() {
	const paragraphs = getBioParagraphs();

	return (
		<section className="container-page">
			<div className="grid gap-x-6 sm:grid-cols-2">
				<div>
					<Image
						src={me}
						alt={bioPhotoAlt}
						priority
						sizes="(min-width: 576px) 50vw, 100vw"
						className="mx-auto block h-auto w-full rounded-md"
					/>
				</div>

				<div>
					{/* Bootstrap h1: 2.5rem / 500 */}
					<h1 className="mb-2 text-center text-[40px] leading-[48px] font-medium">{bioHeading}</h1>
					{paragraphs.map((paragraph) => (
						<p key={paragraph.slice(0, 32)} className="mb-4 text-left">
							{paragraph}
						</p>
					))}
				</div>
			</div>
		</section>
	);
}
