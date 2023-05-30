<form bind:this={form}>
	<div class="mb-3">
		<label for="exampleFormControlInput1" class="form-label">Name</label>
		<input class="form-control" id="exampleFormControlInput1" placeholder="your name" bind:value={name}>
	</div>
	<div class="mb-3">
		<label for="exampleFormControlInput1" class="form-label">Email address</label>
		<input type="email" class="form-control" placeholder="name@example.com" bind:value={email}>
	</div>
	<div class="mb-3">
		<label for="exampleFormControlTextarea1" class="form-label">Message</label>
		<textarea class="form-control" id="exampleFormControlTextarea1" placeholder = "type your message here..." rows="5" bind:value={message}></textarea>
	</div>
	<button type="submit" class="btn btn-success" on:click={submitForm}>Submit</button>
</form>

<script lang="ts">
	import { goto } from "$app/navigation";

	let form: HTMLFormElement;
	let name: string;
	let email: string;
	let message: string;

	async function submitForm(e: Event) {
		e.preventDefault();
		if (!name || !email || !message) {
			return false;
		}
		const formData = {
			name,
			email,
			message
		}
		try {
			await fetch('https://api.diegog.io/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			})
			form.reset();
			goto('/');
			return true;
		} catch (error) {
			return false;
		}
	}
</script>
