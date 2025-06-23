#!/usr/bin/env node

// Cross-platform development server starter
import { spawn } from 'child_process';
import path from 'path';

// Set NODE_ENV environment variable
process.env.NODE_ENV = 'development';

// Check if we're on Windows
const isWindows = process.platform === 'win32';

// Determine the command to run
const command = isWindows ? 'npx.cmd' : 'npx';
const args = ['tsx', 'server/index.ts'];

console.log('🚀 Starting NewsHub development server...');
console.log('📁 Platform:', process.platform);
console.log('🌍 Environment:', process.env.NODE_ENV);
console.log('📡 Server will be available at: http://localhost:5000');
console.log('⚡ Hot reloading enabled');
console.log('---');

// Spawn the tsx process
const child = spawn(command, args, {
  stdio: 'inherit',
  shell: isWindows,
  env: {
    ...process.env,
    NODE_ENV: 'development'
  }
});

// Handle process termination
child.on('close', (code) => {
  if (code !== 0) {
    console.error(`\n❌ Development server exited with code ${code}`);
    process.exit(code);
  }
});

// Handle CTRL+C gracefully
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down development server...');
  child.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down development server...');
  child.kill('SIGTERM');
});