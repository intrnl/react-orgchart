import * as path from 'node:path';
import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react';


export default defineConfig((config) => {
	return {
		build: {
			lib: {
				entry: path.resolve(__dirname, 'lib/index.jsx'),
				formats: ['cjs', 'es'],
				fileName: (format) => `react-orgchart.${format}.js`,
			},
			sourcemap: true,
			rollupOptions: {
				external: ['react'],
			},
		},
		plugins: [
			config.command !== 'build' && react(),
		],
	};
});
