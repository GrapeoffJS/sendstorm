import { context } from 'esbuild';
import { nodeExternalsPlugin } from 'esbuild-node-externals';
import esbuildPluginTsc from 'esbuild-plugin-tsc';
import { resolve } from 'node:path';
import dotenv from 'dotenv';
import * as fs from 'node:fs/promises';
import esbuildPluginEslint from "esbuild-plugin-eslint";
import logger from './build-logger.mjs';
import os from "os";
import { chmod } from "node:fs/promises";
import { existsSync } from "node:fs";

dotenv.config();
const packageJson = JSON.parse((await fs.readFile('./package.json', 'utf-8')).toString());

const licenseBanner = `
/*
 * SendStorm - Development Mode
 * Version: ${packageJson.version}
 */
`;
const entryFile = resolve('./src/index.ts');

const outputFile = resolve('./dist/index.js');

const logBuildInfo = () => {
  logger.info(`
=== Build Info ===
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
    sourcemap: true,
    minify: false,
    splitting: false,
    banner: { js: `#!/usr/bin/env node\n${licenseBanner}` },
    external: Object.keys(packageJson.dependencies || {}),
    define: {
      'process.env.NODE_ENV': '"development"',
      '__VERSION__': JSON.stringify(packageJson.version),
    },
    plugins: [
      nodeExternalsPlugin(),
      esbuildPluginTsc({ tsconfigPath: './tsconfig.json' }),
      esbuildPluginEslint()
    ],
  });

  logBuildInfo();
  logger.info('Running in watch mode...');
  await ctx.watch();

  if (os.platform() !== 'win32') {
    if (existsSync('./dist/index.js')) {
      await chmod(outputFile, '755');
      logger.info(`Execution rights added to ${outputFile}`);
    }
  } else {
    logger.info(`Windows detected. Ensure execution is set correctly for ${outputFile}`);
  }
}

build().catch((err) => {
  logger.error('Build failed:', err);
  process.exit(1);
});