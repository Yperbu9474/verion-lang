// Parser for Verion Language
// Converts tokens into an Abstract Syntax Tree (AST)

import { TokenType } from './tokenizer.js';

// AST Node Types
export const NodeType = {
  PROGRAM: 'Program',
  EXPRESSION_STATEMENT: 'ExpressionStatement',
  WRITE_STATEMENT: 'WriteStatement',
  ASSIGNMENT: 'Assignment',
  FUNCTION_DEF: 'FunctionDefinition',
  FUNCTION_CALL: 'FunctionCall',
  IF_STATEMENT: 'IfStatement',
  WHILE_STATEMENT: 'WhileStatement',
  FOR_STATEMENT: 'ForStatement',
  REPEAT_STATEMENT: 'RepeatStatement',
  RETURN_STATEMENT: 'ReturnStatement',
  BREAK_STATEMENT: 'BreakStatement',
  CONTINUE_STATEMENT: 'ContinueStatement',
  BINARY_EXPRESSION: 'BinaryExpression',
  UNARY_EXPRESSION: 'UnaryExpression',
  AWAIT_EXPRESSION: 'AwaitExpression',
  IDENTIFIER: 'Identifier',
  BOOLEAN_LITERAL: 'BooleanLiteral',
  STRING_LITERAL: 'StringLiteral',
  NUMBER_LITERAL: 'NumberLiteral',
  NULL_LITERAL: 'NullLiteral',
  ARRAY_LITERAL: 'ArrayLiteral',
  OBJECT_LITERAL: 'ObjectLiteral',
  BLOCK: 'Block',
  MEMBER_EXPRESSION: 'MemberExpression',
  INDEX_EXPRESSION: 'IndexExpression',
  IMPORT_STATEMENT: 'ImportStatement',
  REQUIRE_STATEMENT: 'RequireStatement',
  EXPORT_STATEMENT: 'ExportStatement',
  CLASS_DEF: 'ClassDefinition',
  NEW_EXPRESSION: 'NewExpression',
  TRY_STATEMENT: 'TryStatement',
  THROW_STATEMENT: 'ThrowStatement'
};

export class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.pos = 0;
  }

  currentToken() {
    return this.tokens[this.pos];
  }

  peek(offset = 1) {
    const pos = this.pos + offset;
    if (pos >= this.tokens.length) return this.tokens[this.tokens.length - 1];
    return this.tokens[pos];
  }

  advance() {
    if (this.pos < this.tokens.length - 1) {
      this.pos++;
    }
    return this.currentToken();
  }

  expect(type) {
    const token = this.currentToken();
    if (token.type !== type) {
      throw new Error(
        `Expected token type ${type} but got ${token.type} at line ${token.line}, column ${token.column}`
      );
    }
    return this.advance();
  }

  skipNewlines() {
    while (this.currentToken().type === TokenType.NEWLINE) {
      this.advance();
    }
  }

  parse() {
    const statements = [];
    
    while (this.currentToken().type !== TokenType.EOF) {
      this.skipNewlines();
      if (this.currentToken().type === TokenType.EOF) break;
      
      const stmt = this.parseStatement();
      if (stmt) {
        statements.push(stmt);
      }
      this.skipNewlines();
    }

    return {
      type: NodeType.PROGRAM,
      body: statements
    };
  }

  parseStatement() {
    const token = this.currentToken();

    switch (token.type) {
      case TokenType.IMPORT:
        return this.parseImportStatement();
      case TokenType.REQUIRE:
        return this.parseRequireStatement();
      case TokenType.EXPORT:
        return this.parseExportStatement();
      case TokenType.WRITE:
        return this.parseWriteStatement();
      case TokenType.SET:
        return this.parseAssignment();
      case TokenType.ASYNC:
      case TokenType.DEFINE:
        return this.parseFunctionDefinition();
      case TokenType.CLASS:
        return this.parseClassDefinition();
      case TokenType.IF:
        return this.parseIfStatement();
      case TokenType.REPEAT:
        return this.parseRepeatStatement();
      case TokenType.WHILE:
        return this.parseWhileStatement();
      case TokenType.FOR:
        return this.parseForStatement();
      case TokenType.TRY:
        return this.parseTryStatement();
      case TokenType.RETURN:
        return this.parseReturnStatement();
      case TokenType.BREAK:
        return this.parseBreakStatement();
      case TokenType.CONTINUE:
        return this.parseContinueStatement();
      case TokenType.THROW:
        return this.parseThrowStatement();
      case TokenType.AWAIT:
      case TokenType.IDENTIFIER:
        // Could be a function call, member expression, or await statement
        // Parse as expression to handle complex cases like app.use(), await func(), etc.
        const expr = this.parseExpression();
        
        return {
          type: NodeType.EXPRESSION_STATEMENT,
          expression: expr
        };
        
      case TokenType.NEWLINE:
        this.advance();
        return null;
    }

    throw new Error(`Unexpected token ${token.type} at line ${token.line}`);
  }

  parseWriteStatement() {
    this.expect(TokenType.WRITE);
    const expression = this.parseExpression();
    this.skipNewlines();
    
    return {
      type: NodeType.WRITE_STATEMENT,
      expression
    };
  }

  parseAssignment() {
    this.expect(TokenType.SET);
    
    const nameToken = this.currentToken();
    if (nameToken.type !== TokenType.IDENTIFIER) {
      throw new Error(`Expected identifier after 'set' at line ${nameToken.line}`);
    }
    const name = nameToken.value;
    this.advance();
    
    this.expect(TokenType.TO);
    
    const value = this.parseExpression();
    this.skipNewlines();
    
    return {
      type: NodeType.ASSIGNMENT,
      name,
      value
    };
  }

  parseFunctionDefinition() {
    // Check for async
    let isAsync = false;
    if (this.currentToken().type === TokenType.ASYNC) {
      isAsync = true;
      this.advance();
    }
    
    this.expect(TokenType.DEFINE);
    
    // Check if it's an anonymous function (next token is LPAREN)
    let name = null;
    if (this.currentToken().type !== TokenType.LPAREN) {
      const nameToken = this.currentToken();
      if (!nameToken.value || nameToken.type === TokenType.COLON) {
        throw new Error(`Expected function name or '(' at line ${nameToken.line}`);
      }
      name = nameToken.value;
      this.advance();
    }
    
    this.expect(TokenType.LPAREN);
    
    const params = [];
    while (this.currentToken().type !== TokenType.RPAREN) {
      if (this.currentToken().type === TokenType.IDENTIFIER) {
        params.push(this.currentToken().value);
        this.advance();
        
        if (this.currentToken().type === TokenType.COMMA) {
          this.advance();
        }
      } else {
        break;
      }
    }
    
    this.expect(TokenType.RPAREN);
    this.expect(TokenType.COLON);
    this.skipNewlines();
    
    const body = this.parseBlock();
    
    return {
      type: NodeType.FUNCTION_DEF,
      name,
      params,
      body,
      isAsync
    };
  }

  parseFunctionCall() {
    const nameToken = this.currentToken();
    const name = nameToken.value;
    this.advance();
    
    this.expect(TokenType.LPAREN);
    
    const args = [];
    while (this.currentToken().type !== TokenType.RPAREN) {
      args.push(this.parseExpression());
      
      if (this.currentToken().type === TokenType.COMMA) {
        this.advance();
      } else if (this.currentToken().type !== TokenType.RPAREN) {
        break;
      }
    }
    
    this.expect(TokenType.RPAREN);
    
    return {
      type: NodeType.FUNCTION_CALL,
      name,
      arguments: args
    };
  }

  parseIfStatement() {
    this.expect(TokenType.IF);
    
    const condition = this.parseExpression();
    
    this.expect(TokenType.COLON);
    this.skipNewlines();
    
    const thenBlock = this.parseBlock();
    
    let elseBlock = null;
    if (this.currentToken().type === TokenType.ELSE) {
      this.advance();
      this.expect(TokenType.COLON);
      this.skipNewlines();
      elseBlock = this.parseBlock();
    }
    
    return {
      type: NodeType.IF_STATEMENT,
      condition,
      thenBlock,
      elseBlock
    };
  }

  parseRepeatStatement() {
    this.expect(TokenType.REPEAT);
    
    const count = this.parseExpression();
    
    this.expect(TokenType.TIMES);
    this.expect(TokenType.COLON);
    this.skipNewlines();
    
    const body = this.parseBlock();
    
    return {
      type: NodeType.REPEAT_STATEMENT,
      count,
      body
    };
  }

  parseWhileStatement() {
    this.expect(TokenType.WHILE);
    
    const condition = this.parseExpression();
    
    this.expect(TokenType.COLON);
    this.skipNewlines();
    
    const body = this.parseBlock();
    
    return {
      type: NodeType.WHILE_STATEMENT,
      condition,
      body
    };
  }

  parseReturnStatement() {
    this.expect(TokenType.RETURN);
    
    let value = null;
    if (this.currentToken().type !== TokenType.NEWLINE && 
        this.currentToken().type !== TokenType.EOF) {
      value = this.parseExpression();
    }
    
    return {
      type: NodeType.RETURN_STATEMENT,
      value
    };
  }

  parseBlock() {
    const statements = [];
    
    while (this.currentToken().type !== TokenType.END && 
           this.currentToken().type !== TokenType.ELSE &&
           this.currentToken().type !== TokenType.EOF) {
      this.skipNewlines();
      
      if (this.currentToken().type === TokenType.END || 
          this.currentToken().type === TokenType.ELSE) {
        break;
      }
      
      const stmt = this.parseStatement();
      if (stmt) {
        statements.push(stmt);
      }
    }
    
    if (this.currentToken().type === TokenType.END) {
      this.advance();
    }
    
    return {
      type: NodeType.BLOCK,
      statements
    };
  }

  parseExpression() {
    return this.parseLogicalExpression();
  }

  parseLogicalExpression() {
    let left = this.parseComparisonExpression();
    
    while (this.currentToken().type === TokenType.AND || 
           this.currentToken().type === TokenType.OR) {
      const operator = this.currentToken().type === TokenType.AND ? 'and' : 'or';
      this.advance();
      const right = this.parseComparisonExpression();
      
      left = {
        type: NodeType.BINARY_EXPRESSION,
        operator,
        left,
        right
      };
    }
    
    return left;
  }

  parseComparisonExpression() {
    let left = this.parseAdditiveExpression();
    
    // Handle "is greater than", "is less than", "is equals", etc.
    if (this.currentToken().type === TokenType.IS) {
      this.advance();
      
      let operator;
      if (this.currentToken().type === TokenType.GREATER) {
        this.advance();
        this.expect(TokenType.THAN);
        operator = '>';
      } else if (this.currentToken().type === TokenType.LESS) {
        this.advance();
        this.expect(TokenType.THAN);
        operator = '<';
      } else if (this.currentToken().type === TokenType.EQUALS) {
        this.advance();
        operator = '==';
      } else {
        operator = '==';
      }
      
      const right = this.parseAdditiveExpression();
      
      left = {
        type: NodeType.BINARY_EXPRESSION,
        operator,
        left,
        right
      };
    }
    
    return left;
  }

  parseAdditiveExpression() {
    let left = this.parseMultiplicativeExpression();
    
    while (this.currentToken().type === TokenType.PLUS || 
           this.currentToken().type === TokenType.MINUS) {
      const operator = this.currentToken().type === TokenType.PLUS ? '+' : '-';
      this.advance();
      const right = this.parseMultiplicativeExpression();
      
      left = {
        type: NodeType.BINARY_EXPRESSION,
        operator,
        left,
        right
      };
    }
    
    return left;
  }

  parseMultiplicativeExpression() {
    let left = this.parsePrimaryExpression();
    
    while (this.currentToken().type === TokenType.MULTIPLY || 
           this.currentToken().type === TokenType.DIVIDE) {
      const operator = this.currentToken().type === TokenType.MULTIPLY ? '*' : '/';
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

  parsePrimaryExpression() {
    const token = this.currentToken();
    
    switch (token.type) {
      case TokenType.STRING:
        this.advance();
        return {
          type: NodeType.STRING_LITERAL,
          value: token.value
        };
      
      case TokenType.NUMBER:
        this.advance();
        return {
          type: NodeType.NUMBER_LITERAL,
          value: token.value
        };
      
      case TokenType.TRUE:
        this.advance();
        return {
          type: NodeType.BOOLEAN_LITERAL,
          value: true
        };
      
      case TokenType.FALSE:
        this.advance();
        return {
          type: NodeType.BOOLEAN_LITERAL,
          value: false
        };
      
      case TokenType.NULL:
        this.advance();
        return {
          type: NodeType.NULL_LITERAL,
          value: null
        };
      
      case TokenType.AWAIT:
        this.advance();
        const awaitExpr = this.parsePrimaryExpression();
        return {
          type: NodeType.AWAIT_EXPRESSION,
          expression: awaitExpr
        };
      
      case TokenType.NEW:
        return this.parseNewExpression();
      
      case TokenType.LBRACKET:
        return this.parseArrayLiteral();
      
      case TokenType.LBRACE:
        return this.parseObjectLiteral();
      
      case TokenType.ASYNC:
      case TokenType.DEFINE:
        // Anonymous function as expression
        return this.parseFunctionDefinition();
      
      case TokenType.IDENTIFIER:
        const name = token.value;
        this.advance();
        
        let expr = {
          type: NodeType.IDENTIFIER,
          name
        };
        
        // Handle chained operations: member access, array indexing, function calls
        while (true) {
          if (this.currentToken().type === TokenType.DOT) {
            // Member access: obj.property
            this.advance();
            const propertyToken = this.currentToken();
            if (!propertyToken.value || propertyToken.type === TokenType.LPAREN || propertyToken.type === TokenType.COLON) {
              throw new Error(`Expected property name after '.' at line ${propertyToken.line}`);
            }
            const property = propertyToken.value;
            this.advance();
            
            expr = {
              type: NodeType.MEMBER_EXPRESSION,
              object: expr,
              property
            };
          } else if (this.currentToken().type === TokenType.LBRACKET) {
            // Array indexing: arr[0]
            this.advance();
            const index = this.parseExpression();
            this.expect(TokenType.RBRACKET);
            
            expr = {
              type: NodeType.INDEX_EXPRESSION,
              object: expr,
              index
            };
          } else if (this.currentToken().type === TokenType.LPAREN) {
            // Function call: func(args)
            this.advance();
            const args = [];
            
            while (this.currentToken().type !== TokenType.RPAREN && 
                   this.currentToken().type !== TokenType.EOF) {
              args.push(this.parseExpression());
              
              if (this.currentToken().type === TokenType.COMMA) {
                this.advance();
              }
            }
            
            this.expect(TokenType.RPAREN);
            
            expr = {
              type: NodeType.FUNCTION_CALL,
              name: expr,
              arguments: args
            };
          } else {
            break;
          }
        }
        
        return expr;
      
      case TokenType.LPAREN:
        this.advance();
        const parenExpr = this.parseExpression();
        this.expect(TokenType.RPAREN);
        return parenExpr;
      
      default:
        throw new Error(`Unexpected token ${token.type} at line ${token.line}`);
    }
  }

  // Import: import module from "path"
  // Import: import { item1, item2 } from "path"
  parseImportStatement() {
    this.expect(TokenType.IMPORT);
    
    let imports = [];
    let isDefault = false;
    
    if (this.currentToken().type === TokenType.IDENTIFIER) {
      // Default import: import module from "path"
      imports.push(this.currentToken().value);
      isDefault = true;
      this.advance();
    } else if (this.currentToken().type === TokenType.LBRACKET) {
      // Named imports: import { item1, item2 } from "path"
      this.advance(); // skip {
      while (this.currentToken().type !== TokenType.RBRACKET) {
        if (this.currentToken().type === TokenType.IDENTIFIER) {
          imports.push(this.currentToken().value);
          this.advance();
          if (this.currentToken().type === TokenType.COMMA) {
            this.advance();
          }
        } else {
          break;
        }
      }
      this.expect(TokenType.RBRACKET);
    }
    
    this.expect(TokenType.FROM);
    
    const pathToken = this.currentToken();
    if (pathToken.type !== TokenType.STRING) {
      throw new Error(`Expected string after 'from' at line ${pathToken.line}`);
    }
    const path = pathToken.value;
    this.advance();
    
    return {
      type: NodeType.IMPORT_STATEMENT,
      imports,
      path,
      isDefault
    };
  }

  // Require: require "path" as module
  parseRequireStatement() {
    this.expect(TokenType.REQUIRE);
    
    const pathToken = this.currentToken();
    if (pathToken.type !== TokenType.STRING) {
      throw new Error(`Expected string after 'require' at line ${pathToken.line}`);
    }
    const path = pathToken.value;
    this.advance();
    
    let alias = null;
    if (this.currentToken().type === TokenType.AS) {
      this.advance();
      if (this.currentToken().type === TokenType.IDENTIFIER) {
        alias = this.currentToken().value;
        this.advance();
      }
    }
    
    return {
      type: NodeType.REQUIRE_STATEMENT,
      path,
      alias
    };
  }

  // Export: export define functionName():
  parseExportStatement() {
    this.expect(TokenType.EXPORT);
    
    const statement = this.parseStatement();
    
    return {
      type: NodeType.EXPORT_STATEMENT,
      statement
    };
  }

  // For loop: for item in list:
  parseForStatement() {
    this.expect(TokenType.FOR);
    
    const variable = this.currentToken();
    if (variable.type !== TokenType.IDENTIFIER) {
      throw new Error(`Expected identifier in for loop at line ${variable.line}`);
    }
    const varName = variable.value;
    this.advance();
    
    this.expect(TokenType.IN);
    
    const iterable = this.parseExpression();
    
    this.expect(TokenType.COLON);
    this.skipNewlines();
    
    const body = this.parseBlock();
    
    return {
      type: NodeType.FOR_STATEMENT,
      variable: varName,
      iterable,
      body
    };
  }

  parseBreakStatement() {
    this.expect(TokenType.BREAK);
    return { type: NodeType.BREAK_STATEMENT };
  }

  parseContinueStatement() {
    this.expect(TokenType.CONTINUE);
    return { type: NodeType.CONTINUE_STATEMENT };
  }

  parseThrowStatement() {
    this.expect(TokenType.THROW);
    const expression = this.parseExpression();
    return {
      type: NodeType.THROW_STATEMENT,
      expression
    };
  }

  // Try: try: ... catch error: ... end
  parseTryStatement() {
    this.expect(TokenType.TRY);
    this.expect(TokenType.COLON);
    this.skipNewlines();
    
    const tryBlock = [];
    while (this.currentToken().type !== TokenType.CATCH && 
           this.currentToken().type !== TokenType.FINALLY &&
           this.currentToken().type !== TokenType.END &&
           this.currentToken().type !== TokenType.EOF) {
      this.skipNewlines();
      if (this.currentToken().type === TokenType.CATCH ||
          this.currentToken().type === TokenType.FINALLY ||
          this.currentToken().type === TokenType.END) {
        break;
      }
      const stmt = this.parseStatement();
      if (stmt) tryBlock.push(stmt);
    }
    
    let catchBlock = null;
    let errorVar = null;
    if (this.currentToken().type === TokenType.CATCH) {
      this.advance();
      if (this.currentToken().type === TokenType.IDENTIFIER) {
        errorVar = this.currentToken().value;
        this.advance();
      }
      this.expect(TokenType.COLON);
      this.skipNewlines();
      
      catchBlock = [];
      while (this.currentToken().type !== TokenType.FINALLY && 
             this.currentToken().type !== TokenType.END &&
             this.currentToken().type !== TokenType.EOF) {
        this.skipNewlines();
        if (this.currentToken().type === TokenType.FINALLY ||
            this.currentToken().type === TokenType.END) {
          break;
        }
        const stmt = this.parseStatement();
        if (stmt) catchBlock.push(stmt);
      }
    }
    
    let finallyBlock = null;
    if (this.currentToken().type === TokenType.FINALLY) {
      this.advance();
      this.expect(TokenType.COLON);
      this.skipNewlines();
      
      finallyBlock = [];
      while (this.currentToken().type !== TokenType.END) {
        this.skipNewlines();
        const stmt = this.parseStatement();
        if (stmt) finallyBlock.push(stmt);
      }
    }
    
    if (this.currentToken().type === TokenType.END) {
      this.advance();
    }
    
    return {
      type: NodeType.TRY_STATEMENT,
      tryBlock: { type: NodeType.BLOCK, statements: tryBlock },
      catchBlock: catchBlock ? { type: NodeType.BLOCK, statements: catchBlock } : null,
      errorVar,
      finallyBlock: finallyBlock ? { type: NodeType.BLOCK, statements: finallyBlock } : null
    };
  }

  // Class: class ClassName:
  parseClassDefinition() {
    this.expect(TokenType.CLASS);
    
    const nameToken = this.currentToken();
    if (nameToken.type !== TokenType.IDENTIFIER) {
      throw new Error(`Expected class name at line ${nameToken.line}`);
    }
    const name = nameToken.value;
    this.advance();
    
    this.expect(TokenType.COLON);
    this.skipNewlines();
    
    const methods = [];
    while (this.currentToken().type !== TokenType.END && 
           this.currentToken().type !== TokenType.EOF) {
      this.skipNewlines();
      
      if (this.currentToken().type === TokenType.END) {
        break;
      }
      
      if (this.currentToken().type === TokenType.DEFINE) {
        methods.push(this.parseFunctionDefinition());
      } else {
        break;
      }
    }
    
    if (this.currentToken().type === TokenType.END) {
      this.advance();
    }
    
    return {
      type: NodeType.CLASS_DEF,
      name,
      methods
    };
  }

  parseNewExpression() {
    this.expect(TokenType.NEW);
    
    const className = this.currentToken();
    if (className.type !== TokenType.IDENTIFIER) {
      throw new Error(`Expected class name after 'new' at line ${className.line}`);
    }
    this.advance();
    
    let args = [];
    if (this.currentToken().type === TokenType.LPAREN) {
      this.advance();
      while (this.currentToken().type !== TokenType.RPAREN) {
        args.push(this.parseExpression());
        if (this.currentToken().type === TokenType.COMMA) {
          this.advance();
        } else if (this.currentToken().type !== TokenType.RPAREN) {
          break;
        }
      }
      this.expect(TokenType.RPAREN);
    }
    
    return {
      type: NodeType.NEW_EXPRESSION,
      className: className.value,
      arguments: args
    };
  }

  parseArrayLiteral() {
    this.expect(TokenType.LBRACKET);
    
    const elements = [];
    while (this.currentToken().type !== TokenType.RBRACKET) {
      elements.push(this.parseExpression());
      if (this.currentToken().type === TokenType.COMMA) {
        this.advance();
      } else if (this.currentToken().type !== TokenType.RBRACKET) {
        break;
      }
    }
    
    this.expect(TokenType.RBRACKET);
    
    return {
      type: NodeType.ARRAY_LITERAL,
      elements
    };
  }

  parseObjectLiteral() {
    this.expect(TokenType.LBRACE);
    
    const properties = [];
    while (this.currentToken().type !== TokenType.RBRACE) {
      // Key can be identifier or string
      const keyToken = this.currentToken();
      let key;
      
      if (keyToken.type === TokenType.STRING) {
        key = keyToken.value;
        this.advance();
      } else if (keyToken.type === TokenType.IDENTIFIER) {
        key = keyToken.value;
        this.advance();
      } else {
        throw new Error(`Expected property key at line ${keyToken.line}`);
      }
      
      this.expect(TokenType.COLON);
      
      const value = this.parseExpression();
      
      properties.push({ key, value });
      
      if (this.currentToken().type === TokenType.COMMA) {
        this.advance();
        // Skip newlines after comma
        this.skipNewlines();
      } else if (this.currentToken().type !== TokenType.RBRACE) {
        // Also allow newlines between properties
        if (this.currentToken().type === TokenType.NEWLINE) {
          this.skipNewlines();
        } else {
          break;
        }
      }
    }
    
    this.expect(TokenType.RBRACE);
    
    return {
      type: NodeType.OBJECT_LITERAL,
      properties
    };
  }
}
