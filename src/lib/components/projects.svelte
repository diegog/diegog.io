<script>
	import manzoIcon from '../images/manzo_icon.png';
	import diegogIcon from '../images/diegog_icon.gif';
	import recipesIcon from '../images/recipes_icon.png';

	const projects = [
		{
			name: 'manatee.zone',
			url: 'https://manatee.zone',
			icon: manzoIcon,
			description:
				"An easy-to-access data visualization of state-mandated 'manatee zones' in Florida. Created after noticing a rise in uninformed boaters and lack of signage in Biscayne Bay"
		},
		{
			name: 'diegog.io (this website)',
			url: 'https://diegog.io',
			icon: diegogIcon,
			description:
				'A simple serverless portfolio website made with vue.js and the serverless framework. Deployed on an AWS S3 bucket and functions deployed on AWS lambda'
		},
		{
			name: 'recipes',
			url: 'https://recipes.diegog.io',
			icon: recipesIcon,
			description:
				'A serverless progressive-web-application that renders recipes (written in markdown) into a fast and simple showcase-style website that can be downloaded for offline use'
		}
	];
</script>

<h1 class="text-center">Projects</h1>
<div class="container list-group">
	{#each projects as project}
		<a class="list-group-item list-group-item-action" href={project.url}>
			<table class="table table-borderless">
				<tr>
					<td class="align-middle">
						<div>
							<img
								srcset={project.icon}
								style="max-width: 90px; max-height: 90px; border-radius: 10px;"
								alt={project.name}
								class="img-fluid rounded float-start"
							/>
						</div>
					</td>
					<td>
						<div>
							<h4 class="mb-2 text-start">{project.name}</h4>
							<p class="text-start mb-0" style="font-weight:normal">{project.description}</p>
						</div>
					</td>
				</tr>
			</table>
		</a>
	{/each}
</div>
