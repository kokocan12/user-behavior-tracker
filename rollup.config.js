import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'dist/esm/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    name: 'Tracker',
    strict: false,
  },
  plugins: [resolve(), babel({ babelHelpers: 'bundled' }), terser()],
};
