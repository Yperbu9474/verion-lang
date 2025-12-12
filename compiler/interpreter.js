// Interpreter for Verion Language
// Executes the Abstract Syntax Tree

import { NodeType } from './parser.js';

class ReturnValue {
  constructor(value) {
    this.value = value;
  }
}

export class Environment {
  constructor(parent = null) {
    this.parent = parent;
    this.variables = new Map();
    this.functions = new Map();
  }

  define(name, value) {
    this.variables.set(name, value);
  }

  get(name) {
    if (this.variables.has(name)) {
      return this.variables.get(name);
    }
    if (this.parent) {
      return this.parent.get(name);
    }
    throw new Error(`Undefined variable: ${name}`);
  }

  set(name, value) {
    if (this.variables.has(name)) {
      this.variables.set(name, value);
      return;
    }
    if (this.parent) {
      this.parent.set(name, value);
      return;
    }
    // If variable doesn't exist, define it
    this.define(name, value);
  }

  defineFunction(name, params, body) {
    this.functions.set(name, { params, body });
  }

  getFunction(name) {
    if (this.functions.has(name)) {
      return this.functions.get(name);
    }
    if (this.parent) {
      return this.parent.getFunction(name);
    }
    return null;
  }
}

export class Interpreter {
  constructor() {
    this.globalEnv = new Environment();
    this.setupBuiltins();
  }

  setupBuiltins() {
    // Built-in functions can be added here
    // For now, write is handled as a statement
  }

  interpret(ast) {
    return this.evaluateProgram(ast, this.globalEnv);
  }

  evaluateProgram(node, env) {
    let result = null;
    for (const statement of node.body) {
      result = this.evaluate(statement, env);
    }
    return result;
  }

  evaluate(node, env) {
    switch (node.type) {
      case NodeType.PROGRAM:
        return this.evaluateProgram(node, env);

      case NodeType.WRITE_STATEMENT:
        return this.evaluateWriteStatement(node, env);

      case NodeType.ASSIGNMENT:
        return this.evaluateAssignment(node, env);

      case NodeType.FUNCTION_DEF:
        return this.evaluateFunctionDefinition(node, env);

      case NodeType.FUNCTION_CALL:
        return this.evaluateFunctionCall(node, env);

      case NodeType.IF_STATEMENT:
        return this.evaluateIfStatement(node, env);

      case NodeType.REPEAT_STATEMENT:
        return this.evaluateRepeatStatement(node, env);

      case NodeType.WHILE_STATEMENT:
        return this.evaluateWhileStatement(node, env);

      case NodeType.RETURN_STATEMENT:
        return this.evaluateReturnStatement(node, env);

      case NodeType.BINARY_EXPRESSION:
        return this.evaluateBinaryExpression(node, env);

      case NodeType.IDENTIFIER:
        return env.get(node.name);

      case NodeType.STRING_LITERAL:
        return node.value;

      case NodeType.NUMBER_LITERAL:
        return node.value;

      case NodeType.BOOLEAN_LITERAL:
        return node.value;

      case NodeType.MEMBER_EXPRESSION:
        return this.evaluateMemberExpression(node, env);

      case NodeType.BLOCK:
        return this.evaluateBlock(node, env);

      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }

  evaluateWriteStatement(node, env) {
    const value = this.evaluate(node.expression, env);
    console.log(value);
    return value;
  }

  evaluateAssignment(node, env) {
    const value = this.evaluate(node.value, env);
    env.set(node.name, value);
    return value;
  }

  evaluateFunctionDefinition(node, env) {
    env.defineFunction(node.name, node.params, node.body);
    return null;
  }

  evaluateFunctionCall(node, env) {
    const func = env.getFunction(node.name);
    if (!func) {
      throw new Error(`Undefined function: ${node.name}`);
    }

    // Evaluate arguments
    const args = node.arguments.map(arg => this.evaluate(arg, env));

    // Create new environment for function execution
    const funcEnv = new Environment(env);

    // Bind parameters to arguments
    for (let i = 0; i < func.params.length; i++) {
      funcEnv.define(func.params[i], args[i] || null);
    }

    // Execute function body
    try {
      return this.evaluate(func.body, funcEnv);
    } catch (e) {
      if (e instanceof ReturnValue) {
        return e.value;
      }
      throw e;
    }
  }

  evaluateIfStatement(node, env) {
    const condition = this.evaluate(node.condition, env);
    
    if (this.isTruthy(condition)) {
      return this.evaluate(node.thenBlock, env);
    } else if (node.elseBlock) {
      return this.evaluate(node.elseBlock, env);
    }
    
    return null;
  }

  evaluateRepeatStatement(node, env) {
    const count = this.evaluate(node.count, env);
    
    if (typeof count !== 'number') {
      throw new Error('Repeat count must be a number');
    }
    
    let result = null;
    for (let i = 0; i < count; i++) {
      result = this.evaluate(node.body, env);
    }
    
    return result;
  }

  evaluateWhileStatement(node, env) {
    let result = null;
    
    while (this.isTruthy(this.evaluate(node.condition, env))) {
      result = this.evaluate(node.body, env);
    }
    
    return result;
  }

  evaluateReturnStatement(node, env) {
    const value = node.value ? this.evaluate(node.value, env) : null;
    throw new ReturnValue(value);
  }

  evaluateBinaryExpression(node, env) {
    const left = this.evaluate(node.left, env);
    const right = this.evaluate(node.right, env);

    switch (node.operator) {
      case '+':
        return left + right;
      case '-':
        return left - right;
      case '*':
        return left * right;
      case '/':
        return left / right;
      case '>':
        return left > right;
      case '<':
        return left < right;
      case '==':
        return left === right;
      case 'and':
        return this.isTruthy(left) && this.isTruthy(right);
      case 'or':
        return this.isTruthy(left) || this.isTruthy(right);
      default:
        throw new Error(`Unknown operator: ${node.operator}`);
    }
  }

  evaluateMemberExpression(node, env) {
    const obj = env.get(node.object);
    if (obj && typeof obj === 'object') {
      return obj[node.property];
    }
    return undefined;
  }

  evaluateBlock(node, env) {
    let result = null;
    for (const statement of node.statements) {
      result = this.evaluate(statement, env);
      // If this is a return value being passed up, don't catch it here
      // unless we're at the top level
    }
    return result;
  }

  isTruthy(value) {
    if (value === null || value === undefined || value === false || value === 0 || value === '') {
      return false;
    }
    return true;
  }
}
