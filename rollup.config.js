import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json';
// import { terser } from 'rollup-plugin-terser';

export default [
  {
    plugins: [ commonjs(), resolve() ],
    input: 'lib/index.js',
    output: [
      {
        name: 'colorTools',
        file: pkg.browser,
        format: 'umd',
      },
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'esm' },
    ],
  },
];
