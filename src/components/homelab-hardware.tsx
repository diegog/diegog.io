import { machines } from '@/content/homelab';

export function HomelabHardware() {
	return (
		<ul className="mb-4 grid gap-4 sm:grid-cols-2">
			{machines.map((machine) => (
				<li
					key={machine.name}
					className="rounded-md border border-black/[0.125] bg-white p-4 text-foreground"
				>
					<h3 className="mb-0.5 text-[18px] leading-tight font-medium">
						{machine.url ? (
							<a
								href={machine.url}
								className="hover:underline"
								rel="noreferrer noopener"
								target="_blank"
							>
								{machine.name}
							</a>
						) : (
							machine.name
						)}
						{machine.count && machine.count > 1 && (
							<span className="ml-2 text-sm font-normal text-muted-foreground">
								× {machine.count}
							</span>
						)}
					</h3>
					<p className="mb-2 text-sm text-muted-foreground">{machine.role}</p>
					<ul className="space-y-0.5 text-sm">
						{machine.specs.map((spec) => (
							<li key={spec}>{spec}</li>
						))}
					</ul>
				</li>
			))}
		</ul>
	);
}
