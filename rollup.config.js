import {resolve} from 'node:path'
import {defineConfig} from 'rollup'
import dts from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'

const PREFIX = `js-utils`
const INPUT = `src/index.ts`

const isDev = process.env.NODE_ENV === `development`

const home = (...args) => resolve(__dirname, ...args)

export default defineConfig([
  !isDev && {
    input: INPUT,
    output: {
      file: `dist/index.d.ts`,
      format: `es`,
    },
    plugins: [
      dts(),
    ],
  },
  !isDev && {
    input: INPUT,
    output: [{
      file: `dist/${PREFIX}.min.cjs`,
      format: `cjs`,
    }, {
      file: `dist/${PREFIX}.min.mjs`,
      format: `es`,
    }, {
      file: `dist/${PREFIX}.min.js`,
      format: `iife`,
      name: `jsUtils`,
    }],
    plugins: [
      esbuild({
        minify: true,
      }),
    ],
  },
  {
    input: INPUT,
    output: [{
      file: `dist/${PREFIX}.cjs`,
      format: `cjs`,
    }, {
      file: `dist/${PREFIX}.mjs`,
      format: `es`,
    }, {
      file: `dist/${PREFIX}.js`,
      format: `iife`,
      name: `jsUtils`,
    }],
    plugins: [
      esbuild(),
    ],
  }
].filter(Boolean))
