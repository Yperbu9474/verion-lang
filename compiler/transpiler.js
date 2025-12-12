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
    this.needsRequire = false;
    this.declaredVariables = new Set();
  }

  getIndent() {
    return '  '.repeat(this.indent);
  }

  generate(node) {
    switch (node.type) {
      case NodeType.PROGRAM:
        return this.generateProgram(node);
      case NodeType.IMPORT_STATEMENT:
        return this.generateImportStatement(node);
      case NodeType.REQUIRE_STATEMENT:
        return this.generateRequireStatement(node);
      case NodeType.EXPORT_STATEMENT:
        return this.generateExportStatement(node);
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
      case NodeType.FOR_STATEMENT:
        return this.generateForStatement(node);
      case NodeType.WHILE_STATEMENT:
        return this.generateWhileStatement(node);
      case NodeType.RETURN_STATEMENT:
        return this.generateReturnStatement(node);
      case NodeType.BREAK_STATEMENT:
        return 'break;';
      case NodeType.CONTINUE_STATEMENT:
        return 'continue;';
      case NodeType.THROW_STATEMENT:
        return this.generateThrowStatement(node);
      case NodeType.TRY_STATEMENT:
        return this.generateTryStatement(node);
      case NodeType.CLASS_DEF:
        return this.generateClassDefinition(node);
      case NodeType.NEW_EXPRESSION:
        return this.generateNewExpression(node);
      case NodeType.AWAIT_EXPRESSION:
        return this.generateAwaitExpression(node);
      case NodeType.BINARY_EXPRESSION:
        return this.generateBinaryExpression(node);
      case NodeType.ARRAY_LITERAL:
        return this.generateArrayLiteral(node);
      case NodeType.OBJECT_LITERAL:
        return this.generateObjectLiteral(node);
      case NodeType.IDENTIFIER:
        return node.name;
      case NodeType.STRING_LITERAL:
        return JSON.stringify(node.value);
      case NodeType.NUMBER_LITERAL:
        return String(node.value);
      case NodeType.BOOLEAN_LITERAL:
        return String(node.value);
      case NodeType.NULL_LITERAL:
        return 'null';
      case NodeType.MEMBER_EXPRESSION:
        return this.generateMemberExpression(node);
      case NodeType.INDEX_EXPRESSION:
        return this.generateIndexExpression(node);
      case NodeType.BLOCK:
        return this.generateBlock(node);
      case 'ExpressionStatement':
        return this.generateExpressionStatement(node);
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }

  generateProgram(node) {
    const lines = ['// Transpiled from Verion Language', ''];
    
    // Check if we need createRequire
    this.checkForRequire(node);
    
    if (this.needsRequire) {
      lines.push("import { createRequire } from 'module';");
      lines.push("const __require = createRequire(import.meta.url);");
      lines.push('');
    }
    
    for (const statement of node.body) {
      let code = this.generate(statement);
      if (code) {
        // Add semicolon to expression statements that need them
        if (statement.type === NodeType.FUNCTION_CALL || 
            statement.type === NodeType.MEMBER_EXPRESSION ||
            statement.type === NodeType.AWAIT_EXPRESSION) {
          if (!code.endsWith(';') && !code.endsWith('}')) {
            code += ';';
          }
        }
        lines.push(this.getIndent() + code);
      }
    }
    
    return lines.join('\n');
  }
  
  checkForRequire(node) {
    if (node.type === NodeType.REQUIRE_STATEMENT) {
      this.needsRequire = true;
      return;
    }
    
    if (node.body) {
      if (Array.isArray(node.body)) {
        for (const stmt of node.body) {
          this.checkForRequire(stmt);
        }
      } else if (node.body.statements) {
        for (const stmt of node.body.statements) {
          this.checkForRequire(stmt);
        }
      }
    }
  }

  generateWriteStatement(node) {
    const expr = this.generate(node.expression);
    return `console.log(${expr});`;
  }

  generateAssignment(node) {
    const value = this.generate(node.value);
    if (this.declaredVariables.has(node.name)) {
      // Variable already declared, just assign
      return `${node.name} = ${value};`;
    } else {
      // First declaration
      this.declaredVariables.add(node.name);
      return `let ${node.name} = ${value};`;
    }
  }

  generateFunctionDefinition(node) {
    const params = node.params.join(', ');
    const asyncKeyword = node.isAsync ? 'async ' : '';
    const functionName = node.name ? ` ${node.name}` : '';
    const exportKeyword = node.name && this.indent === 0 ? 'export ' : '';  // Export top-level named functions
    const lines = [`${exportKeyword}${asyncKeyword}function${functionName}(${params}) {`];
    
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
    const name = typeof node.name === 'string' ? node.name : this.generate(node.name);
    return `${name}(${args})`;
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

  generateWhileStatement(node) {
    const condition = this.generate(node.condition);
    const lines = [`while (${condition}) {`];
    
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

  generateReturnStatement(node) {
    if (node.value) {
      const value = this.generate(node.value);
      return `return ${value};`;
    }
    return 'return;';
  }

  generateImportStatement(node) {
    if (node.isDefault) {
      return `import ${node.imports[0]} from ${JSON.stringify(node.path)};`;
    } else {
      const imports = node.imports.join(', ');
      return `import { ${imports} } from ${JSON.stringify(node.path)};`;
    }
  }

  generateRequireStatement(node) {
    // Use __require which is set up in generateProgram
    if (node.alias) {
      return `const ${node.alias} = __require(${JSON.stringify(node.path)});`;
    } else {
      return `__require(${JSON.stringify(node.path)});`;
    }
  }

  generateExportStatement(node) {
    const stmt = this.generate(node.statement);
    if (node.statement.type === NodeType.FUNCTION_DEF) {
      // Replace 'function' with 'export function'
      return stmt.replace(/^(async )?function/, '$1export function');
    }
    return `export ${stmt}`;
  }

  generateForStatement(node) {
    const variable = node.variable;
    const iterable = this.generate(node.iterable);
    const lines = [`for (const ${variable} of ${iterable}) {`];
    
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

  generateTryStatement(node) {
    const lines = ['try {'];
    
    this.indent++;
    for (const statement of node.tryBlock.statements) {
      const code = this.generate(statement);
      if (code) {
        lines.push(this.getIndent() + code);
      }
    }
    this.indent--;
    
    if (node.catchBlock) {
      const errorVar = node.errorVar || 'error';
      lines.push(this.getIndent() + `} catch (${errorVar}) {`);
      this.indent++;
      for (const statement of node.catchBlock.statements) {
        const code = this.generate(statement);
        if (code) {
          lines.push(this.getIndent() + code);
        }
      }
      this.indent--;
    }
    
    if (node.finallyBlock) {
      lines.push(this.getIndent() + '} finally {');
      this.indent++;
      for (const statement of node.finallyBlock.statements) {
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

  generateClassDefinition(node) {
    const lines = [`class ${node.name} {`];
    
    this.indent++;
    for (const method of node.methods) {
      const params = method.params.join(', ');
      const asyncKeyword = method.isAsync ? 'async ' : '';
      const methodName = method.name === 'constructor' ? 'constructor' : method.name;
      lines.push(this.getIndent() + `${asyncKeyword}${methodName}(${params}) {`);
      
      this.indent++;
      for (const statement of method.body.statements) {
        const code = this.generate(statement);
        if (code) {
          lines.push(this.getIndent() + code);
        }
      }
      this.indent--;
      
      lines.push(this.getIndent() + '}');
      if (method !== node.methods[node.methods.length - 1]) {
        lines.push('');
      }
    }
    this.indent--;
    
    lines.push(this.getIndent() + '}');
    return lines.join('\n');
  }

  generateNewExpression(node) {
    const args = node.arguments.map(arg => this.generate(arg)).join(', ');
    return `new ${node.className}(${args})`;
  }

  generateAwaitExpression(node) {
    const expr = this.generate(node.expression);
    return `await ${expr}`;
  }

  generateThrowStatement(node) {
    const expr = this.generate(node.expression);
    return `throw ${expr};`;
  }

  generateArrayLiteral(node) {
    const elements = node.elements.map(el => this.generate(el)).join(', ');
    return `[${elements}]`;
  }

  generateObjectLiteral(node) {
    const props = node.properties.map(prop => {
      const key = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(prop.key) ? prop.key : JSON.stringify(prop.key);
      const value = this.generate(prop.value);
      return `${key}: ${value}`;
    }).join(', ');
    return `{ ${props} }`;
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

  generateMemberExpression(node) {
    const object = typeof node.object === 'string' ? node.object : this.generate(node.object);
    return `${object}.${node.property}`;
  }

  generateIndexExpression(node) {
    const object = this.generate(node.object);
    const index = this.generate(node.index);
    return `${object}[${index}]`;
  }

  generateExpressionStatement(node) {
    return this.generate(node.expression) + ';';
  }
}
