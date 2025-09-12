import path from 'path';
import { defineConfig } from 'vitest/config';

const jsxRuntimePath = path.resolve(__dirname, './src/jsx-runtime.ts');

export default defineConfig({
  resolve: {
    alias: {
      '@antv/infographic-jsx/jsx-dev-runtime': jsxRuntimePath,
      '@antv/infographic-jsx/jsx-runtime': jsxRuntimePath,
      '@antv/infographic-jsx': path.resolve(__dirname, './src'),
    },
  },
});
