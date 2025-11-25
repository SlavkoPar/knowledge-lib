import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'
import path from 'path';

export default defineConfig({
   plugins: [react()],
   'base': '/knowledge-lib',
   build: {
      sourcemap: true,
      rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      }
    }
   },
   resolve: {
      alias: {
         '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
         '@': path.resolve(__dirname, './src') // Example: '@' maps to the 'src' directory
      },
   },
   // ... other Vite configurations
});