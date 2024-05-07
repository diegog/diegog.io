<div class="container">
	<audio id='audio'></audio>
	<p>Radio stream is playing...</p>


	<!-- Add a card with album cover, play button, title, artist name, uses streamData -->
	<div>
		{#await getStreamData()}
			<p>Loading...</p>
		{:then}
			<!-- // Create a center aligned div -->
			<div 
			class="d-flex justify-content-center"
			></div>

			<div class="container d-flex justify-content-center">
				<div class="card text-center" style="width: 18rem;">
					<img 
					src={streamData.albumCover} 
					alt="Album cover"
					class="card-img-top"
					/>
					<h5 class="card-title">{streamData.title}</h5>
					<h3>{streamData.artist}</h3>
					<button id="toggleButton" type="button" class="btn btn-lg btn-outline-dark" on:click={togglePlay}>Play</button>
				</div>
			</div>
		{:catch error}
			<p>{error.message}</p>
		{/await}
	
		{#if streamData.totalStreams}
			<p>Total streams: {streamData.totalStreams}</p>
		{/if}
	</div>
</div>

<script lang=ts>
import { Buffer } from 'buffer';
let streamData: any = {};

const getStreamData = async () => await fetch('https://api.diegog.io/stream-data')
	.then(response => response.json())
	.then((data) => {
		setTimeout(async () => {
			await getStreamData();
		}, data.timeRemaining < 0 ? 3000 : (data.timeRemaining + 2) * 1000);		


		let currentSong = data.currentSong;
		let albumData = Buffer.from(currentSong.picture[0].data.data).toString('base64');
		streamData.totalStreams = data.totalStreams;
		streamData.title = currentSong.title;
		streamData.artist = currentSong.artist;
		streamData.albumCover = `data:image/jpeg;base64,${albumData}`;
	})
	.catch(error => {
		console.error('Error:', error);
	});

	const togglePlay = () => {
		let button = document.getElementById('toggleButton') as HTMLButtonElement;
		button.disabled = true;
		let audio = document.getElementById('audio') as HTMLAudioElement;
		if (audio.paused) {
			audio.src = 'https://api.diegog.io/stream';
			audio.load();
			audio.play();
			button.textContent = 'Pause';
			button.disabled = false;
		} else {
			audio.pause();
			audio.removeAttribute('src');
			audio.load();
			button.textContent = 'Play';
			button.disabled = false;
		}
	}
</script>
