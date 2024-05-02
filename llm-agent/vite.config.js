import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import typescript from '@rollup/plugin-typescript';
import packageJson from './package.json';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@test': fileURLToPath(new URL('./test', import.meta.url)),
      },
    },
    build: {
      minify: false,
      sourcemap: true,
      lib: {
        entry: resolve(__dirname, 'src/main.ts'),
        formats: ['cjs'],
        name: 'server',
        fileName: 'server',
      },
      rollupOptions: {
        plugins: [
          typescript({ module: 'esnext' }),
        ],
        external: Object.keys(packageJson.dependencies),
      },
    },
    define: {
      __APP_ENV__: env.APP_ENV,
    },
  };
});
