import Image from 'next/image';
import { serviceCategories, services } from '@/content/homelab';
import { icons } from '@/images/homelab';

export function HomelabServices() {
	return (
		<div className="mb-4 flex flex-col gap-6">
			{serviceCategories.map((category) => {
				const group = services.filter((service) => service.category === category);
				if (group.length === 0) return null;

				return (
					<section key={category} aria-labelledby={`services-${slugify(category)}`}>
						<h3
							id={`services-${slugify(category)}`}
							className="mb-2 text-[18px] leading-tight font-medium"
						>
							{category}
						</h3>
						<ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
							{group.map((service) => (
								<li
									key={service.name}
									className="flex items-center gap-3 rounded-md border border-black/[0.125] bg-white p-3 text-foreground"
								>
									<Image
										src={icons[service.icon]}
										alt=""
										width={32}
										height={32}
										className="size-8 shrink-0"
									/>
									<div className="min-w-0">
										<a
											href={service.url}
											className="font-medium hover:underline"
											rel="noreferrer noopener"
											target="_blank"
										>
											{service.name}
										</a>
										{service.description && (
											<p className="text-sm text-muted-foreground">{service.description}</p>
										)}
									</div>
								</li>
							))}
						</ul>
					</section>
				);
			})}
		</div>
	);
}

function slugify(text: string): string {
	return text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}
