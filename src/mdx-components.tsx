import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';
import type { ComponentProps } from 'react';

/**
 * Element overrides for every MDX file. Sized to match the hand-written pages
 * (the h1 is the same 40px/500 as the "About me" and "Projects" headings).
 */
const components = {
	h1: (props) => <h1 className="mt-2 mb-4 text-[40px] leading-[48px] font-medium" {...props} />,
	h2: (props) => (
		<h2
			className="mt-10 mb-3 scroll-mt-(--header-height) text-[32px] leading-[38px] font-medium"
			{...props}
		/>
	),
	h3: (props) => (
		<h3
			className="mt-6 mb-2 scroll-mt-(--header-height) text-[24px] leading-[28.8px] font-medium"
			{...props}
		/>
	),
	p: (props) => <p className="mb-4 leading-relaxed" {...props} />,
	a: ({ href = '', ...props }: ComponentProps<'a'>) => {
		const classes = 'underline underline-offset-2 hover:text-foreground';
		if (/^https?:\/\//.test(href)) {
			return (
				<a href={href} className={classes} rel="noreferrer noopener" target="_blank" {...props} />
			);
		}
		return <Link href={href} className={classes} {...props} />;
	},
	ul: (props) => <ul className="mb-4 list-disc space-y-1 pl-6" {...props} />,
	ol: (props) => <ol className="mb-4 list-decimal space-y-1 pl-6" {...props} />,
	li: (props) => <li className="leading-relaxed" {...props} />,
	blockquote: (props) => (
		<blockquote className="mb-4 border-l-4 border-black/10 pl-4 text-muted-foreground" {...props} />
	),
	hr: (props) => <hr className="my-8 border-black/10" {...props} />,
	code: (props) => (
		<code
			className="rounded-sm bg-black/[0.06] px-1 py-0.5 font-mono text-[0.9em] [pre_&]:bg-transparent [pre_&]:p-0"
			{...props}
		/>
	),
	pre: (props) => (
		<pre
			className="mb-4 overflow-x-auto rounded-md bg-white p-4 font-mono text-sm ring-1 ring-black/[0.125]"
			{...props}
		/>
	),
	table: (props) => (
		<div className="mb-4 overflow-x-auto">
			<table className="w-full border-collapse text-left text-sm" {...props} />
		</div>
	),
	th: (props) => <th className="border-b border-black/20 px-3 py-2 font-medium" {...props} />,
	td: (props) => <td className="border-b border-black/10 px-3 py-2 align-top" {...props} />
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
	return components;
}
