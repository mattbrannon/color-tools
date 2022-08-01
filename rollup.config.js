import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json';
import { terser } from 'rollup-plugin-terser';

const toCamelCase = (s) => {
  const re = /(-[a-z]){1}/g;
  return s.toLocaleLowerCase().replace(re, (s) => s.slice(1).toUpperCase());
};

export default [
  {
    plugins: [ commonjs(), resolve() ],
    input: 'dist/lib/index.js',
    output: [
      {
        name: toCamelCase(pkg.name),
        file: pkg.browser,
        format: 'umd',
        plugins: [terser()],
      },
      { file: pkg.main, format: 'cjs', plugins: [terser()] },
      { file: pkg.module, format: 'esm', plugins: [terser()] },
    ],
  },
];
