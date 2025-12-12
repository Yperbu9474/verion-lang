#!/usr/bin/env node
/**
 * Using Verion Language from Node.js
 * This demonstrates importing transpiled VL code in regular Node.js
 */

console.log('=== Using VL from Node.js ===\n');

// You can import transpiled VL modules
// First, build a VL file: vl build mymodule.vl
// Then import it: import { myFunction } from './dist/mymodule.mjs'

// Example: Using VL as a library
console.log('1. Direct Node.js code:');
console.log('This is regular Node.js\n');

// Example: Execute VL code via CLI
console.log('2. Executing VL file from Node.js:');
const { execSync } = require('child_process');

try {
  // Run a VL file
  const result = execSync('node cli/index.js run examples/hello.vl', { encoding: 'utf8' });
  console.log('VL output:', result);
} catch (error) {
  console.error('Error running VL:', error.message);
}

console.log('\n3. Building and importing VL module:');
console.log('To use VL as a module:');
console.log('  1. Create module.vl with exports');
console.log('  2. Run: vl build module.vl');
console.log('  3. Import: import * as mod from "./dist/module.mjs"');
console.log('  4. Use: mod.myFunction()');

console.log('\n=== Integration complete! ===');
