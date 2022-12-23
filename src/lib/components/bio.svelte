<script>
	import me from '../images/me.jpg';
</script>

<div class="container">
	<div class="row">
		<!-- picture -->
		<div class="col-sm">
			<!-- svelte-ignore a11y-missing-attribute -->
			<img srcset={me} class="img-fluid rounded mx-auto d-block" />
		</div>
		<!-- text -->
		<div class="col-sm">
			<h1 class="text-center">About me</h1>
			<p class="text-start">
				My name is Diego Garcia. I am a Software Engineer currently working for Tradeshift. I was
				born and raised in Miami, Florida. In 2019 I graduated from the University of Miami with a
				Bachelor of Science in Computer Science with minors in Chemistry and Math. At the beginning
				of 2020 I moved to Denver to experience the mountains and all of the greatness that Colorado
				has to offer (hiking, skiing, camping, etc.)!
			</p>
		</div>
	</div>
</div>
