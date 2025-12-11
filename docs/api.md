# Verion Language - Developer API Documentation

## Overview

This document provides technical documentation for developers who want to extend, modify, or integrate Verion Language into their own projects.

## Table of Contents

- [Architecture](#architecture)
- [Tokenizer API](#tokenizer-api)
- [Parser API](#parser-api)
- [Interpreter API](#interpreter-api)
- [Transpiler API](#transpiler-api)
- [Extending the Language](#extending-the-language)
- [Code Examples](#code-examples)

---

## Architecture

### Component Overview

```
┌─────────────┐
│ Source Code │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Tokenizer  │ ──→ Token Stream
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Parser    │ ──→ Abstract Syntax Tree (AST)
└──────┬──────┘
       │
       ├─────────────────┐
       ▼                 ▼
┌─────────────┐   ┌──────────────┐
│ Interpreter │   │  Transpiler  │
└──────┬──────┘   └──────┬───────┘
       │                 │
       ▼                 ▼
    Output          JavaScript
```

### Module Structure

```
compiler/
├── tokenizer.js    # Lexical analysis
├── parser.js       # Syntax analysis
├── interpreter.js  # Runtime execution
└── transpiler.js   # Code generation
```

---

## Tokenizer API

### Import

```javascript
import { Tokenizer, Token, TokenType } from './compiler/tokenizer.js';
```

### TokenType Enum

Complete list of token types:

```javascript
const TokenType = {
  // Literals
  STRING: 'STRING',
  NUMBER: 'NUMBER',
  IDENTIFIER: 'IDENTIFIER',
  
  // Keywords
  WRITE: 'WRITE',
  SET: 'SET',
  TO: 'TO',
  DEFINE: 'DEFINE',
  END: 'END',
  IF: 'IF',
  ELSE: 'ELSE',
  REPEAT: 'REPEAT',
  TIMES: 'TIMES',
  
  // Operators
  PLUS: 'PLUS',
  MINUS: 'MINUS',
  MULTIPLY: 'MULTIPLY',
  DIVIDE: 'DIVIDE',
  IS: 'IS',
  GREATER: 'GREATER',
  LESS: 'LESS',
  THAN: 'THAN',
  EQUALS: 'EQUALS',
  AND: 'AND',
  OR: 'OR',
  
  // Symbols
  COLON: 'COLON',
  COMMA: 'COMMA',
  DOT: 'DOT',
  LPAREN: 'LPAREN',
  RPAREN: 'RPAREN',
  NEWLINE: 'NEWLINE',
  EOF: 'EOF'
};
```

### Token Class

```javascript
class Token {
  constructor(type, value, line, column) {
    this.type = type;      // TokenType enum value
    this.value = value;    // Actual token value
    this.line = line;      // Line number (1-based)
    this.column = column;  // Column number (1-based)
  }
}
```

### Tokenizer Class

```javascript
class Tokenizer {
  constructor(source) {
    this.source = source;   // Source code string
    this.pos = 0;           // Current position
    this.line = 1;          // Current line
    this.column = 1;        // Current column
    this.tokens = [];       // Token array
  }

  // Main method - returns array of tokens
  tokenize() {
    // ... tokenization logic
    return this.tokens;
  }

  // Helper methods
  currentChar() { /* ... */ }
  peek(offset = 1) { /* ... */ }
  advance() { /* ... */ }
  skipWhitespace() { /* ... */ }
  skipComment() { /* ... */ }
  readString() { /* ... */ }
  readNumber() { /* ... */ }
  readIdentifier() { /* ... */ }
}
```

### Usage Example

```javascript
import { Tokenizer } from './compiler/tokenizer.js';

const source = `
set x to 10
write x
`;

const tokenizer = new Tokenizer(source);
const tokens = tokenizer.tokenize();

// tokens = [
//   Token(SET, 'set', 2, 1),
//   Token(IDENTIFIER, 'x', 2, 5),
//   Token(TO, 'to', 2, 7),
//   Token(NUMBER, 10, 2, 10),
//   Token(NEWLINE, '\n', 2, 12),
//   Token(WRITE, 'write', 3, 1),
//   Token(IDENTIFIER, 'x', 3, 7),
//   Token(NEWLINE, '\n', 3, 8),
//   Token(EOF, null, 4, 1)
// ]
```

---

## Parser API

### Import

```javascript
import { Parser, NodeType } from './compiler/parser.js';
```

### NodeType Enum

```javascript
const NodeType = {
  PROGRAM: 'Program',
  WRITE_STATEMENT: 'WriteStatement',
  ASSIGNMENT: 'Assignment',
  FUNCTION_DEF: 'FunctionDefinition',
  FUNCTION_CALL: 'FunctionCall',
  IF_STATEMENT: 'IfStatement',
  REPEAT_STATEMENT: 'RepeatStatement',
  BINARY_EXPRESSION: 'BinaryExpression',
  IDENTIFIER: 'Identifier',
  STRING_LITERAL: 'StringLiteral',
  NUMBER_LITERAL: 'NumberLiteral',
  BLOCK: 'Block',
  MEMBER_EXPRESSION: 'MemberExpression'
};
```

### AST Node Structures

**Program Node:**
```javascript
{
  type: 'Program',
  body: [Statement, ...]
}
```

**Write Statement:**
```javascript
{
  type: 'WriteStatement',
  expression: Expression
}
```

**Assignment:**
```javascript
{
  type: 'Assignment',
  name: string,
  value: Expression
}
```

**Function Definition:**
```javascript
{
  type: 'FunctionDefinition',
  name: string,
  params: [string, ...],
  body: Block
}
```

**Function Call:**
```javascript
{
  type: 'FunctionCall',
  name: string,
  arguments: [Expression, ...]
}
```

**If Statement:**
```javascript
{
  type: 'IfStatement',
  condition: Expression,
  thenBlock: Block,
  elseBlock: Block | null
}
```

**Repeat Statement:**
```javascript
{
  type: 'RepeatStatement',
  count: Expression,
  body: Block
}
```

**Binary Expression:**
```javascript
{
  type: 'BinaryExpression',
  operator: '+' | '-' | '*' | '/' | '>' | '<' | '==' | 'and' | 'or',
  left: Expression,
  right: Expression
}
```

**Identifier:**
```javascript
{
  type: 'Identifier',
  name: string
}
```

**Literals:**
```javascript
// String
{
  type: 'StringLiteral',
  value: string
}

// Number
{
  type: 'NumberLiteral',
  value: number
}
```

### Parser Class

```javascript
class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.pos = 0;
  }

  // Main method - returns AST
  parse() {
    // Returns Program node
  }

  // Statement parsers
  parseStatement() { /* ... */ }
  parseWriteStatement() { /* ... */ }
  parseAssignment() { /* ... */ }
  parseFunctionDefinition() { /* ... */ }
  parseFunctionCall() { /* ... */ }
  parseIfStatement() { /* ... */ }
  parseRepeatStatement() { /* ... */ }
  parseBlock() { /* ... */ }

  // Expression parsers (precedence climbing)
  parseExpression() { /* ... */ }
  parseLogicalExpression() { /* ... */ }
  parseComparisonExpression() { /* ... */ }
  parseAdditiveExpression() { /* ... */ }
  parseMultiplicativeExpression() { /* ... */ }
  parsePrimaryExpression() { /* ... */ }

  // Helper methods
  currentToken() { /* ... */ }
  peek(offset = 1) { /* ... */ }
  advance() { /* ... */ }
  expect(type) { /* ... */ }
  skipNewlines() { /* ... */ }
}
```

### Usage Example

```javascript
import { Tokenizer } from './compiler/tokenizer.js';
import { Parser } from './compiler/parser.js';

const source = 'set x to 10\nwrite x';

const tokenizer = new Tokenizer(source);
const tokens = tokenizer.tokenize();

const parser = new Parser(tokens);
const ast = parser.parse();

// ast = {
//   type: 'Program',
//   body: [
//     {
//       type: 'Assignment',
//       name: 'x',
//       value: { type: 'NumberLiteral', value: 10 }
//     },
//     {
//       type: 'WriteStatement',
//       expression: { type: 'Identifier', name: 'x' }
//     }
//   ]
// }
```

---

## Interpreter API

### Import

```javascript
import { Interpreter, Environment } from './compiler/interpreter.js';
```

### Environment Class

Manages variable and function scope:

```javascript
class Environment {
  constructor(parent = null) {
    this.parent = parent;
    this.variables = new Map();
    this.functions = new Map();
  }

  // Variable management
  define(name, value) { /* ... */ }
  get(name) { /* ... */ }
  set(name, value) { /* ... */ }

  // Function management
  defineFunction(name, params, body) { /* ... */ }
  getFunction(name) { /* ... */ }
}
```

### Interpreter Class

```javascript
class Interpreter {
  constructor() {
    this.globalEnv = new Environment();
    this.setupBuiltins();
  }

  // Main method - executes AST
  interpret(ast) {
    return this.evaluateProgram(ast, this.globalEnv);
  }

  // Node evaluators
  evaluate(node, env) { /* ... */ }
  evaluateProgram(node, env) { /* ... */ }
  evaluateWriteStatement(node, env) { /* ... */ }
  evaluateAssignment(node, env) { /* ... */ }
  evaluateFunctionDefinition(node, env) { /* ... */ }
  evaluateFunctionCall(node, env) { /* ... */ }
  evaluateIfStatement(node, env) { /* ... */ }
  evaluateRepeatStatement(node, env) { /* ... */ }
  evaluateBinaryExpression(node, env) { /* ... */ }
  evaluateMemberExpression(node, env) { /* ... */ }
  evaluateBlock(node, env) { /* ... */ }

  // Helpers
  isTruthy(value) { /* ... */ }
  setupBuiltins() { /* ... */ }
}
```

### Usage Example

```javascript
import { Tokenizer } from './compiler/tokenizer.js';
import { Parser } from './compiler/parser.js';
import { Interpreter } from './compiler/interpreter.js';

const source = `
set x to 10
write x
`;

// Tokenize
const tokenizer = new Tokenizer(source);
const tokens = tokenizer.tokenize();

// Parse
const parser = new Parser(tokens);
const ast = parser.parse();

// Interpret
const interpreter = new Interpreter();
interpreter.interpret(ast);
// Output: 10
```

---

## Transpiler API

### Import

```javascript
import { transpile } from './compiler/transpiler.js';
```

### transpile() Function

```javascript
/**
 * Transpile VL source code to JavaScript
 * @param {string} source - VL source code
 * @param {object} options - Options object
 * @returns {string} - Generated JavaScript code
 */
function transpile(source, options = {}) {
  // Tokenize -> Parse -> Generate
  return javascriptCode;
}
```

### JavaScriptGenerator Class

Internal class for code generation:

```javascript
class JavaScriptGenerator {
  constructor() {
    this.indent = 0;
  }

  // Main method
  generate(node) { /* ... */ }

  // Node generators
  generateProgram(node) { /* ... */ }
  generateWriteStatement(node) { /* ... */ }
  generateAssignment(node) { /* ... */ }
  generateFunctionDefinition(node) { /* ... */ }
  generateFunctionCall(node) { /* ... */ }
  generateIfStatement(node) { /* ... */ }
  generateRepeatStatement(node) { /* ... */ }
  generateBinaryExpression(node) { /* ... */ }
  generateBlock(node) { /* ... */ }

  // Helpers
  getIndent() { /* ... */ }
}
```

### Usage Example

```javascript
import { transpile } from './compiler/transpiler.js';

const source = `
set x to 10
write x
`;

const js = transpile(source);

console.log(js);
// Output:
// // Transpiled from Verion Language
//
// let x = 10;
// console.log(x);
```

---

## Extending the Language

### Adding a New Keyword

**Example: Adding a `return` statement**

#### 1. Update Tokenizer

Add to keywords map in `tokenizer.js`:

```javascript
const KEYWORDS = {
  // ... existing keywords
  'return': TokenType.RETURN
};
```

Add to TokenType enum:

```javascript
export const TokenType = {
  // ... existing types
  RETURN: 'RETURN',
};
```

#### 2. Update Parser

Add to NodeType enum in `parser.js`:

```javascript
export const NodeType = {
  // ... existing types
  RETURN_STATEMENT: 'ReturnStatement',
};
```

Add parsing method:

```javascript
parseReturnStatement() {
  this.expect(TokenType.RETURN);
  const value = this.parseExpression();
  
  return {
    type: NodeType.RETURN_STATEMENT,
    value
  };
}
```

Update `parseStatement()`:

```javascript
parseStatement() {
  const token = this.currentToken();
  
  switch (token.type) {
    // ... existing cases
    case TokenType.RETURN:
      return this.parseReturnStatement();
    // ...
  }
}
```

#### 3. Update Interpreter

Add evaluation method in `interpreter.js`:

```javascript
evaluateReturnStatement(node, env) {
  const value = this.evaluate(node.value, env);
  throw new ReturnValue(value); // Use exception for control flow
}
```

Create ReturnValue class:

```javascript
class ReturnValue {
  constructor(value) {
    this.value = value;
  }
}
```

Update function call handler:

```javascript
evaluateFunctionCall(node, env) {
  // ... existing code
  
  try {
    return this.evaluate(func.body, funcEnv);
  } catch (e) {
    if (e instanceof ReturnValue) {
      return e.value;
    }
    throw e;
  }
}
```

#### 4. Update Transpiler

Add generation method in `transpiler.js`:

```javascript
generateReturnStatement(node) {
  const value = this.generate(node.value);
  return `return ${value};`;
}
```

Update main generator:

```javascript
generate(node) {
  switch (node.type) {
    // ... existing cases
    case NodeType.RETURN_STATEMENT:
      return this.generateReturnStatement(node);
    // ...
  }
}
```

### Adding a New Operator

**Example: Adding modulo operator (`mod`)**

#### 1. Tokenizer

```javascript
const KEYWORDS = {
  // ... existing keywords
  'mod': TokenType.MOD
};
```

#### 2. Parser

Add to multiplicative expression:

```javascript
parseMultiplicativeExpression() {
  let left = this.parsePrimaryExpression();
  
  while (this.currentToken().type === TokenType.MULTIPLY || 
         this.currentToken().type === TokenType.DIVIDE ||
         this.currentToken().type === TokenType.MOD) {
    const operator = /* map token to operator */;
    this.advance();
    const right = this.parsePrimaryExpression();
    
    left = {
      type: NodeType.BINARY_EXPRESSION,
      operator,
      left,
      right
    };
  }
  
  return left;
}
```

#### 3. Interpreter

```javascript
evaluateBinaryExpression(node, env) {
  const left = this.evaluate(node.left, env);
  const right = this.evaluate(node.right, env);

  switch (node.operator) {
    // ... existing operators
    case '%':
      return left % right;
  }
}
```

#### 4. Transpiler

```javascript
generateBinaryExpression(node) {
  const operatorMap = {
    // ... existing mappings
    'mod': '%'
  };
  
  const op = operatorMap[node.operator] || node.operator;
  // ... rest of generation
}
```

---

## Code Examples

### Complete Pipeline Example

```javascript
import { Tokenizer } from './compiler/tokenizer.js';
import { Parser } from './compiler/parser.js';
import { Interpreter } from './compiler/interpreter.js';
import { transpile } from './compiler/transpiler.js';

const source = `
define greet(name):
    write "Hello, "
    write name
end

greet("Alice")
`;

// Method 1: Interpret directly
console.log("=== Interpretation ===");
const tokenizer1 = new Tokenizer(source);
const tokens1 = tokenizer1.tokenize();
const parser1 = new Parser(tokens1);
const ast1 = parser1.parse();
const interpreter = new Interpreter();
interpreter.interpret(ast1);

// Method 2: Transpile to JavaScript
console.log("\n=== Transpilation ===");
const js = transpile(source);
console.log(js);
```

### Error Handling Example

```javascript
import { Tokenizer } from './compiler/tokenizer.js';
import { Parser } from './compiler/parser.js';

function safeCompile(source) {
  try {
    const tokenizer = new Tokenizer(source);
    const tokens = tokenizer.tokenize();
    
    const parser = new Parser(tokens);
    const ast = parser.parse();
    
    return { success: true, ast };
  } catch (error) {
    return { 
      success: false, 
      error: error.message,
      line: error.line,
      column: error.column
    };
  }
}

const result = safeCompile('set x to');
if (!result.success) {
  console.error(`Error: ${result.error}`);
}
```

### Custom Built-in Functions

```javascript
class CustomInterpreter extends Interpreter {
  setupBuiltins() {
    super.setupBuiltins();
    
    // Add custom built-in
    this.globalEnv.defineFunction('sqrt', ['n'], {
      type: NodeType.BLOCK,
      statements: []
    });
  }

  evaluateFunctionCall(node, env) {
    // Handle custom built-ins
    if (node.name === 'sqrt') {
      const arg = this.evaluate(node.arguments[0], env);
      return Math.sqrt(arg);
    }
    
    return super.evaluateFunctionCall(node, env);
  }
}
```

---

## Testing

### Unit Test Example

```javascript
import { Tokenizer, TokenType } from './compiler/tokenizer.js';
import assert from 'assert';

function testTokenizer() {
  const source = 'set x to 10';
  const tokenizer = new Tokenizer(source);
  const tokens = tokenizer.tokenize();
  
  assert.strictEqual(tokens[0].type, TokenType.SET);
  assert.strictEqual(tokens[1].type, TokenType.IDENTIFIER);
  assert.strictEqual(tokens[1].value, 'x');
  assert.strictEqual(tokens[2].type, TokenType.TO);
  assert.strictEqual(tokens[3].type, TokenType.NUMBER);
  assert.strictEqual(tokens[3].value, 10);
  
  console.log('✓ Tokenizer tests passed');
}

testTokenizer();
```

---

## Additional Resources

- [Syntax Reference](syntax.md) - Language syntax
- [CLI Documentation](cli.md) - Command-line usage
- [Examples](../examples/) - Sample programs

---

For questions or contributions, please open an issue on GitHub.
