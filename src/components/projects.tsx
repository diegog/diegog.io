import Image from 'next/image';
import { projects } from '@/content/projects';

export function Projects() {
	return (
		<section>
			<h1 className="mb-2 text-center text-[40px] leading-[48px] font-medium">Projects</h1>
			<div className="container-page">
				<ul className="overflow-hidden rounded-md border border-black/[0.125] text-foreground">
					{projects.map((project) => (
						<li key={project.url} className="border-black/[0.125] not-first:border-t">
							<a
								href={project.url}
								className="flex items-center gap-6 bg-white px-4 py-[22px] transition-colors hover:bg-[#f8f9fa]"
							>
								<Image
									src={project.icon}
									alt=""
									sizes="90px"
									className="size-[90px] shrink-0 rounded-md object-cover"
								/>
								<div className="min-w-0">
									<h2 className="mb-2 text-left text-[24px] leading-[28.8px] font-medium">
										{project.name}
									</h2>
									<p className="text-left">{project.description}</p>
								</div>
							</a>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
