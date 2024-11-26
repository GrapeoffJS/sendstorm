const { context } = require('esbuild');
const { clean } = require('esbuild-plugin-clean');
const { nodeExternalsPlugin } = require('esbuild-node-externals');
const esbuildPluginTsc = require('esbuild-plugin-tsc');
const envFilePlugin = require('esbuild-envfile-plugin');
const packageJson = require("./package.json");
const { resolve } = require("node:path");

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

  const entryFile = resolve(__dirname, 'src/index.ts');
  const outputFile = resolve(__dirname, 'dist/index.js');

  try {
    const ctx = await context({
      entryPoints: ['./src/index.ts'],
      outfile: 'dist/index.js',
      platform: 'node',
      target: 'node16',
      format: 'cjs',
      bundle: true,
      sourcemap: !isProduction,
      minify: isProduction,
      splitting: false,
      banner: {
        js: `
${licenseBanner}
#!/usr/bin/env node
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
        esbuildPluginTsc({ tsconfigPath: './tsconfig.json' }),
        envFilePlugin],
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
}

runBuild();
