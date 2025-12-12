#!/usr/bin/env node
/**
 * Using Verion Language from Node.js - Working Example
 * 
 * This demonstrates how VL and Node.js work together seamlessly
 */

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('=== VL ↔ Node.js Interoperability Demo ===\n');

// 1. Node.js can execute VL files
console.log('1. Executing VL file from Node.js:');

try {
  const result = execSync('node cli/index.js run examples/hello.vl', { 
    encoding: 'utf8',
    cwd: __dirname + '/..'
  });
  console.log('Output:', result.trim());
} catch (error) {
  console.error('Error:', error.message);
}

console.log('\n2. Building VL module for import:');
try {
  execSync('node cli/index.js build examples/vl-exportable.vl', {
    encoding: 'utf8',
    cwd: __dirname + '/..'
  });
  console.log('✓ VL module built successfully!');
  console.log('Now you can:');
  console.log('  import * as vl from "./dist/vl-exportable.mjs"');
  console.log('  vl.greet("Alice")  // Returns: Hello from VL, Alice!');
  console.log('  vl.add(5, 3)       // Returns: 8');
} catch (error) {
  console.error('Error:', error.message);
}

console.log('\n3. VL can use any npm package:');
console.log('In your .vl file:');
console.log('  require "express" as express');
console.log('  require "axios" as axios');
console.log('  require "lodash" as lodash');
console.log('Then use them normally!');

console.log('\n4. Hybrid projects structure:');
console.log(`
my-project/
├── src/
│   ├── main.vl          # VL business logic
│   ├── utils.vl         # VL utilities
│   └── server.js        # Node.js server
├── dist/                # Transpiled VL code
└── package.json         # npm dependencies
`);

console.log('5. Best practices:');
console.log('✓ Use VL for readable business logic');
console.log('✓ Use Node.js for complex npm integrations');
console.log('✓ Build VL modules and import in Node.js');
console.log('✓ VL can require any Node.js module');

console.log('\n=== Interoperability Complete! ===');
console.log('\nVL gives you:');
console.log('  • Clean, readable syntax');
console.log('  • Full Node.js/npm ecosystem');
console.log('  • Easy Python integration (if Python installed)');
console.log('  • Seamless JavaScript interop');
