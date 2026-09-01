import type { ContactSubmission } from '@/lib/discord';

/**
 * Shared shape for the contact form's action state.
 *
 * Lives outside `actions.ts` because a `"use server"` module may only export
 * async functions — exporting the initial-state object from there fails at
 * runtime with "A 'use server' file can only export async functions".
 */
export type ContactState = {
	status: 'idle' | 'success' | 'error';
	message?: string;
	fieldErrors?: Partial<Record<'name' | 'email' | 'message', string>>;
	/** Echoed back so a failed submit doesn't wipe what was typed. */
	values?: ContactSubmission;
};

export const initialContactState: ContactState = { status: 'idle' };
