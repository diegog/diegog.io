<script>
	import me from '../images/me.jpg';
</script>

<div class="container">
	<div class="row">
		<!-- picture -->
		<div class="col-sm">
			<!-- svelte-ignore a11y-missing-attribute -->
			<img srcset={me} class="img-fluid rounded mx-auto d-block" />
			<br />
		</div>
		<!-- text -->
		<div class="col-sm">
			<h1 class="text-center">About me</h1>
			<p class="text-start">
				Hey, my name is Diego! I am a software engineer currently working remotely at a fintech
				company that specializes in B2B commerce based out of San Francisco, California. When I am
				not coding, you will find me in the mountains!
			</p>
			<p class="text-start">
				I have been programming for 8+ years and have 3 years of professional work experience as a
				software engineer. I specialize in complex backend systems, but am comfortable working with
				full-stack development and love learning about new technology/concepts. I am also a huge
				proponent of creating CI/CD pipelines early on in the development process so that I can
				spend more time developing rather than building and deploying.
			</p>
			<p class="text-start">
				I am a ski bum at heart, so you will find me in the mountains skiing most of the winter.
				When skiing isn't possible I will still be taking advantage of the beautiful landscape in
				the Rocky Mountains while either hiking or camping. I love learning about native ecosystems
				and being as self-sustainable as possible.
			</p>
		</div>
	</div>
</div>
