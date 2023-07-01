import {dtsPlugin} from 'esbuild-plugin-d.ts'
import {build} from 'esbuild'

build({
  bundle: true,
  platform: `node`,
  format: `cjs`,
  entryPoints: [`./src/index.ts`],
  outfile: `./dist/index.js`,
  plugins: [
    dtsPlugin(),
  ],
})
