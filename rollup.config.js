import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';

export default {
  input: 'dist/esm/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    name: 'Tracker',
  },
  plugins: [resolve(), babel({ babelHelpers: 'bundled' })],
};
