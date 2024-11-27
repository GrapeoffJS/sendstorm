import { context } from 'esbuild';
import { clean } from 'esbuild-plugin-clean';
import { nodeExternalsPlugin } from 'esbuild-node-externals';
import esbuildPluginTsc from 'esbuild-plugin-tsc';
import { resolve } from 'node:path';
import os from 'os';
import { chmod } from 'node:fs/promises';
import { execSync } from 'child_process';
import dotenv from 'dotenv';
import esbuildPluginEslint from 'esbuild-plugin-eslint'
import * as fs from 'node:fs/promises';
import logger from "./build-logger.mjs";
import { existsSync } from "node:fs";

dotenv.config();

const packageJson = JSON.parse((await fs.readFile('./package.json', 'utf-8')).toString());
const gitHash = execSync('git rev-parse --short HEAD').toString().trim();
const licenseBanner = `
/*
 * SendStorm - A versatile CLI tool for testing microservices.
 * Version: ${packageJson.version}-${gitHash}
 * License: GNU General Public License v3
 */
 
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

const logBuildInfo = () => {
  logger.info(`
=== Production Build Info ===
Entry Point: ${entryFile}
Output File: ${outputFile}
Platform: Node.js
Target: Node 16+
Format: ESM
===============================
`);
};

async function build() {

  const ctx = await context({
    entryPoints: ['./src/index.ts'],
    outfile: outputFile,
    platform: 'node',
    target: 'node16',
    format: 'esm',
    bundle: true,
    sourcemap: false,
    minify: true,
    splitting: false,
    minifySyntax: true,
    minifyWhitespace: true,
    minifyIdentifiers: true,
    banner: { js: `#!/usr/bin/env node\n${licenseBanner}` },
    external: Object.keys(packageJson.dependencies || {}),
    define: {
      'process.env.NODE_ENV': '"production"',
      '__VERSION__': JSON.stringify(`${packageJson.version}-${gitHash}`),
    },
    plugins: [
      clean({ patterns: ['./dist'] }),
      nodeExternalsPlugin(),
      esbuildPluginTsc({ tsconfigPath: './tsconfig.json' }),
      esbuildPluginEslint()
    ],
  });

  logBuildInfo();

  await ctx.rebuild();
  await ctx.dispose();

  if (os.platform() !== 'win32') {
    if (existsSync('./dist/index.js')) {
      await chmod(outputFile, '755');
      logger.info(`Execution rights added to ${outputFile}`);
    }
  } else {
    logger.info(`Windows detected. Ensure execution is set correctly for ${outputFile}`);
  }

  logger.info('Production build completed!\n');
}

build().catch((err) => {
  logger.error('Build failed:', err);
  process.exit(1);
});