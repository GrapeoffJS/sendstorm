import { context } from 'esbuild';
import { clean } from 'esbuild-plugin-clean';
import { nodeExternalsPlugin } from 'esbuild-node-externals';
import esbuildPluginTsc from 'esbuild-plugin-tsc';
import { resolve } from 'node:path';
import os from 'os';
import { chmod } from 'node:fs/promises';
import * as fs from "node:fs/promises";

const packageJson = JSON.parse((await fs.readFile('./package.json', 'utf-8')).toString());
const isProduction = process.env.NODE_ENV === 'production';
const isWatchMode = process.argv.includes('--watch');

const logBuildInfo = (entry, outfile, options) => {
  console.log(`
=== Build Info ===
Entry Point: ${entry}
Output File: ${outfile}
Platform: ${options.platform}
Target: ${options.target}
Minify: ${options.minify}
Source Maps: ${options.sourcemap}
===================
  `);
};

async function runBuild() {
  const licenseBanner = `
/*
 * This file is part of the SendStorm project.
 *
 * Licensed under the GNU General Public License, Version 3.
 * See LICENSE in the project root for license information.
 *
 * SendStorm is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * SendStorm is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with SendStorm. If not, see <https://www.gnu.org/licenses/>.
 */
`;

  const entryFile = resolve('./src/index.ts');
  const outputFile = resolve('./dist/index.js');

  try {
    const ctx = await context({
      entryPoints: ['./src/index.ts'],
      outfile: 'dist/index.js',
      platform: 'node',
      target: 'node16',
      format: 'esm',
      bundle: true,
      sourcemap: !isProduction,
      minify: isProduction,
      splitting: false,
      banner: {
        js: `#!/usr/bin/env node
${licenseBanner}
`,
      },
      logLevel: 'info',
      external: ['esbuild'],
      define: {
        'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
        '__VERSION__': JSON.stringify(packageJson.version),
      },
      legalComments: 'none',
      plugins: [
        clean({ patterns: ['./dist'] }),
        nodeExternalsPlugin(),
        esbuildPluginTsc({ tsconfigPath: './tsconfig.json' })
      ],
    });

    logBuildInfo(entryFile, outputFile, {
      platform: 'node',
      target: 'node16',
      minify: isProduction,
      sourcemap: !isProduction,
    });

    if (isWatchMode) {
      console.log('Running in watch mode...');
      await ctx.watch();
    } else {
      await ctx.rebuild();
      console.log(isProduction ? 'Production build completed!' : 'Development build completed!');
      await ctx.dispose();
    }
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }

  if (os.platform() === 'linux' || os.platform() === 'darwin') {
    try {
      await chmod(outputFile, '755');
      console.log(`Execution rights added to ${outputFile}`);
    } catch (err) {
      console.error(`Failed to set execution rights: ${err.message}`);
    }
  } else {
    console.log(`Skipping execution rights setup for platform: ${os.platform()}`);
  }
}

await runBuild();