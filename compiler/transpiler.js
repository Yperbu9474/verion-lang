// Transpiler for Verion Language
// Converts AST into JavaScript code

import { NodeType } from './parser.js';
import { Tokenizer } from './tokenizer.js';
import { Parser } from './parser.js';

export function transpile(source, options = {}) {
  try {
    // Tokenize
    const tokenizer = new Tokenizer(source);
    const tokens = tokenizer.tokenize();

    // Parse
    const parser = new Parser(tokens);
    const ast = parser.parse();

    // Generate JavaScript
    const generator = new JavaScriptGenerator();
    const js = generator.generate(ast);

    return js;
  } catch (error) {
    throw new Error(`Transpilation error: ${error.message}`);
  }
}

class JavaScriptGenerator {
  constructor() {
    this.indent = 0;
  }

  getIndent() {
    return '  '.repeat(this.indent);
  }

  generate(node) {
    switch (node.type) {
      case NodeType.PROGRAM:
        return this.generateProgram(node);
      case NodeType.WRITE_STATEMENT:
        return this.generateWriteStatement(node);
      case NodeType.ASSIGNMENT:
        return this.generateAssignment(node);
      case NodeType.FUNCTION_DEF:
        return this.generateFunctionDefinition(node);
      case NodeType.FUNCTION_CALL:
        return this.generateFunctionCall(node);
      case NodeType.IF_STATEMENT:
        return this.generateIfStatement(node);
      case NodeType.REPEAT_STATEMENT:
        return this.generateRepeatStatement(node);
      case NodeType.BINARY_EXPRESSION:
        return this.generateBinaryExpression(node);
      case NodeType.IDENTIFIER:
        return node.name;
      case NodeType.STRING_LITERAL:
        return JSON.stringify(node.value);
      case NodeType.NUMBER_LITERAL:
        return String(node.value);
      case NodeType.MEMBER_EXPRESSION:
        return `${node.object}.${node.property}`;
      case NodeType.BLOCK:
        return this.generateBlock(node);
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }

  generateProgram(node) {
    const lines = ['// Transpiled from Verion Language', ''];
    
    for (const statement of node.body) {
      const code = this.generate(statement);
      if (code) {
        lines.push(this.getIndent() + code);
      }
    }
    
    return lines.join('\n');
  }

  generateWriteStatement(node) {
    const expr = this.generate(node.expression);
    return `console.log(${expr});`;
  }

  generateAssignment(node) {
    const value = this.generate(node.value);
    return `let ${node.name} = ${value};`;
  }

  generateFunctionDefinition(node) {
    const params = node.params.join(', ');
    const lines = [`function ${node.name}(${params}) {`];
    
    this.indent++;
    for (const statement of node.body.statements) {
      const code = this.generate(statement);
      if (code) {
        lines.push(this.getIndent() + code);
      }
    }
    this.indent--;
    
    lines.push(this.getIndent() + '}');
    return lines.join('\n');
  }

  generateFunctionCall(node) {
    const args = node.arguments.map(arg => this.generate(arg)).join(', ');
    return `${node.name}(${args})`;
  }

  generateIfStatement(node) {
    const condition = this.generate(node.condition);
    const lines = [`if (${condition}) {`];
    
    this.indent++;
    for (const statement of node.thenBlock.statements) {
      const code = this.generate(statement);
      if (code) {
        lines.push(this.getIndent() + code);
      }
    }
    this.indent--;
    
    if (node.elseBlock) {
      lines.push(this.getIndent() + '} else {');
      this.indent++;
      for (const statement of node.elseBlock.statements) {
        const code = this.generate(statement);
        if (code) {
          lines.push(this.getIndent() + code);
        }
      }
      this.indent--;
    }
    
    lines.push(this.getIndent() + '}');
    return lines.join('\n');
  }

  generateRepeatStatement(node) {
    const count = this.generate(node.count);
    const lines = [`for (let __i = 0; __i < ${count}; __i++) {`];
    
    this.indent++;
    for (const statement of node.body.statements) {
      const code = this.generate(statement);
      if (code) {
        lines.push(this.getIndent() + code);
      }
    }
    this.indent--;
    
    lines.push(this.getIndent() + '}');
    return lines.join('\n');
  }

  generateBinaryExpression(node) {
    const left = this.generate(node.left);
    const right = this.generate(node.right);
    
    const operatorMap = {
      'and': '&&',
      'or': '||',
      '+': '+',
      '-': '-',
      '*': '*',
      '/': '/',
      '>': '>',
      '<': '<',
      '==': '==='
    };
    
    const op = operatorMap[node.operator] || node.operator;
    return `(${left} ${op} ${right})`;
  }

  generateBlock(node) {
    const lines = [];
    for (const statement of node.statements) {
      const code = this.generate(statement);
      if (code) {
        lines.push(this.getIndent() + code);
      }
    }
    return lines.join('\n');
  }
}
