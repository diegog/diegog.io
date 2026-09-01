import { basename } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vitest/config';

/**
 * Next's loader turns image imports into `StaticImageData`. Vite would hand back
 * a bare URL string, so components using `next/image` would break under test.
 */
const staticImageImports = (): Plugin => ({
	name: 'static-image-imports',
	enforce: 'pre',
	load(id: string) {
		const file = id.split('?')[0] ?? '';
		if (!/\.(png|jpe?g|webp|avif|gif)$/.test(file)) return null;
		const src = `/_next/static/media/${basename(file)}`;
		return `export default ${JSON.stringify({ src, width: 180, height: 180, blurDataURL: src })}`;
	}
});

export default defineConfig({
	plugins: [react(), staticImageImports()],
	// Vite resolves tsconfig `paths` natively now; no plugin needed
	resolve: { tsconfigPaths: true },
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./vitest.setup.ts'],
		include: ['src/**/*.{test,spec}.{ts,tsx}'],
		// e2e is Playwright's; it has its own runner and expect
		exclude: ['e2e/**', 'node_modules/**', '.next/**'],
		coverage: {
			provider: 'v8',
			include: ['src/**/*.{ts,tsx}'],
			exclude: ['src/components/ui/**', 'src/**/*.test.{ts,tsx}', 'src/app/**/layout.tsx']
		}
	}
});
