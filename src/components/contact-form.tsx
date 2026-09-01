'use client';

import { useActionState, useId } from 'react';
import { submitContact } from '@/app/contact/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { type ContactState, initialContactState } from '@/lib/contact';

function FieldError({ id, error }: { id: string; error?: string }) {
	if (!error) return null;
	return (
		<p id={id} className="mt-1 text-sm text-destructive">
			{error}
		</p>
	);
}

export function ContactForm() {
	// React 19: useActionState comes from 'react', not 'react-dom'
	const [state, formAction, pending] = useActionState<ContactState, FormData>(
		submitContact,
		initialContactState
	);

	// useId keeps label/control wiring unique — the original hardcoded the same
	// id on two inputs, so the email label focused the name field.
	const nameId = useId();
	const emailId = useId();
	const messageId = useId();

	if (state.status === 'success') {
		return (
			<div role="status" className="rounded-md border border-black/[0.125] bg-white p-6">
				<h2 className="mb-2 text-2xl font-medium">Thanks — message sent.</h2>
				<p className="text-muted-foreground">I&apos;ll get back to you soon.</p>
			</div>
		);
	}

	return (
		<form action={formAction} noValidate>
			{state.message ? (
				<p role="alert" className="mb-4 text-sm text-destructive">
					{state.message}
				</p>
			) : null}

			<div className="mb-4">
				<Label htmlFor={nameId} className="mb-2">
					Name
				</Label>
				<Input
					id={nameId}
					name="name"
					placeholder="your name"
					defaultValue={state.values?.name}
					aria-invalid={state.fieldErrors?.name ? true : undefined}
					aria-describedby={state.fieldErrors?.name ? `${nameId}-error` : undefined}
				/>
				<FieldError id={`${nameId}-error`} error={state.fieldErrors?.name} />
			</div>

			<div className="mb-4">
				<Label htmlFor={emailId} className="mb-2">
					Email address
				</Label>
				<Input
					id={emailId}
					name="email"
					type="email"
					placeholder="name@example.com"
					defaultValue={state.values?.email}
					aria-invalid={state.fieldErrors?.email ? true : undefined}
					aria-describedby={state.fieldErrors?.email ? `${emailId}-error` : undefined}
				/>
				<FieldError id={`${emailId}-error`} error={state.fieldErrors?.email} />
			</div>

			<div className="mb-4">
				<Label htmlFor={messageId} className="mb-2">
					Message
				</Label>
				<Textarea
					id={messageId}
					name="message"
					rows={5}
					placeholder="type your message here..."
					defaultValue={state.values?.message}
					aria-invalid={state.fieldErrors?.message ? true : undefined}
					aria-describedby={state.fieldErrors?.message ? `${messageId}-error` : undefined}
				/>
				<FieldError id={`${messageId}-error`} error={state.fieldErrors?.message} />
			</div>

			{/* honeypot — hidden from people, tempting to bots */}
			<div aria-hidden className="absolute left-[-9999px] h-px w-px overflow-hidden">
				<label htmlFor="company">Company</label>
				<input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
			</div>

			<Button
				type="submit"
				disabled={pending}
				className="bg-[#198754] text-white hover:bg-[#157347]"
			>
				{pending ? 'Sending…' : 'Submit'}
			</Button>
		</form>
	);
}
