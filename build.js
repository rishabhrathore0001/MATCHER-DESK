#!/usr/bin/env node
import { build as viteBuild } from 'vite';
import * as esbuild from 'esbuild';

async function buildApp() {
  try {
    console.log('Building frontend with Vite...');
    await viteBuild({
      root: process.cwd(),
    });
    console.log('✓ Frontend build complete');
    
    console.log('Building backend with esbuild...');
    await esbuild.build({
      entryPoints: ['server.ts'],
      bundle: true,
      platform: 'node',
      format: 'cjs',
      packages: 'external',
      sourcemap: true,
      outfile: 'dist/server.cjs',
    });
    console.log('✓ Backend build complete');
  } catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
  }
}

buildApp();
