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

      case NodeType.FOR_STATEMENT:
        return this.evaluateForStatement(node, env);

      case NodeType.RETURN_STATEMENT:
        return this.evaluateReturnStatement(node, env);

      case NodeType.BREAK_STATEMENT:
        throw new Error('Break statement');

      case NodeType.CONTINUE_STATEMENT:
        throw new Error('Continue statement');

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

      case NodeType.NULL_LITERAL:
        return null;

      case NodeType.ARRAY_LITERAL:
        return this.evaluateArrayLiteral(node, env);

      case NodeType.OBJECT_LITERAL:
        return this.evaluateObjectLiteral(node, env);

      case NodeType.MEMBER_EXPRESSION:
        return this.evaluateMemberExpression(node, env);

      case NodeType.INDEX_EXPRESSION:
        return this.evaluateIndexExpression(node, env);

      case NodeType.BLOCK:
        return this.evaluateBlock(node, env);

      case NodeType.IMPORT_STATEMENT:
      case NodeType.REQUIRE_STATEMENT:
      case NodeType.EXPORT_STATEMENT:
        // For interpreter mode, skip import/require/export (they're for transpiled code)
        console.warn('Import/require/export statements are not supported in interpreter mode. Use "vl build" instead.');
        return null;

      case 'ExpressionStatement':
        return this.evaluate(node.expression, env);

      case NodeType.CLASS_DEF:
      case NodeType.NEW_EXPRESSION:
      case NodeType.TRY_STATEMENT:
      case NodeType.THROW_STATEMENT:
      case NodeType.AWAIT_EXPRESSION:
        // Advanced features require transpilation
        console.warn(`${node.type} is not supported in interpreter mode. Use "vl build" instead.`);
        return null;

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
    // Handle both string names and identifier/member expression nodes
    let func;
    let thisContext = null;
    let funcName;
    
    // node.name can be:
    // 1. A string (old parser style)
    // 2. An IDENTIFIER node
    // 3. A MEMBER_EXPRESSION node
    // 4. Any other expression that evaluates to a function
    
    if (typeof node.name === 'string') {
      funcName = node.name;
      // First check if it's a defined function
      func = env.getFunction(funcName);
      
      // If not found as a function, try as a variable (could be function assigned to variable)
      if (!func) {
        try {
          const varValue = env.get(funcName);
          if (typeof varValue === 'function') {
            func = { isNative: true, fn: varValue };
          }
        } catch (e) {
          // Variable doesn't exist, that's ok
        }
      }
    } else if (typeof node.name === 'object') {
      // Handle IDENTIFIER node
      if (node.name.type === NodeType.IDENTIFIER) {
        funcName = node.name.name;
        // First check if it's a defined function
        func = env.getFunction(funcName);
        
        // If not found as a function, try as a variable
        if (!func) {
          try {
            const varValue = env.get(funcName);
            if (typeof varValue === 'function') {
              func = { isNative: true, fn: varValue };
            }
          } catch (e) {
            // Variable doesn't exist, that's ok
          }
        }
      } else {
        // It's a member expression or other computed property
        const funcValue = this.evaluate(node.name, env);
        if (typeof funcValue === 'function') {
          func = { isNative: true, fn: funcValue };
          // If it's a member expression, get the object for 'this' context
          if (node.name.type === NodeType.MEMBER_EXPRESSION) {
            thisContext = this.evaluate(node.name.object, env);
          }
        } else {
          throw new Error(`Value is not a function`);
        }
      }
    }
    
    if (!func) {
      throw new Error(`Undefined function: ${funcName || 'unknown'}`);
    }

    // Evaluate arguments
    const args = node.arguments.map(arg => this.evaluate(arg, env));

    // If it's a native JavaScript function
    if (func.isNative) {
      return func.fn.apply(thisContext, args);
    }

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

  evaluateForStatement(node, env) {
    const collection = this.evaluate(node.collection, env);
    
    if (!Array.isArray(collection)) {
      throw new Error('For loop requires an array');
    }
    
    let result = null;
    for (const item of collection) {
      env.define(node.variable, item);
      try {
        result = this.evaluate(node.body, env);
      } catch (e) {
        if (e.message === 'Break statement') {
          break;
        }
        if (e.message === 'Continue statement') {
          continue;
        }
        throw e;
      }
    }
    
    return result;
  }

  evaluateArrayLiteral(node, env) {
    return node.elements.map(element => this.evaluate(element, env));
  }

  evaluateObjectLiteral(node, env) {
    const obj = {};
    for (const prop of node.properties) {
      obj[prop.key] = this.evaluate(prop.value, env);
    }
    return obj;
  }

  evaluateMemberExpression(node, env) {
    let obj;
    if (typeof node.object === 'string') {
      obj = env.get(node.object);
    } else {
      obj = this.evaluate(node.object, env);
    }
    
    if (obj && typeof obj === 'object') {
      return obj[node.property];
    }
    return undefined;
  }

  evaluateIndexExpression(node, env) {
    const obj = this.evaluate(node.object, env);
    const index = this.evaluate(node.index, env);
    
    if (obj && (Array.isArray(obj) || typeof obj === 'object')) {
      return obj[index];
    }
    return undefined;
  }

  evaluateBlock(node, env) {
    let result = null;
    for (const statement of node.statements) {
      try {
        result = this.evaluate(statement, env);
      } catch (e) {
        // Pass through break, continue, and return
        if (e.message === 'Break statement' || 
            e.message === 'Continue statement' ||
            e instanceof ReturnValue) {
          throw e;
        }
        throw e;
      }
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
