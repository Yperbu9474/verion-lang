// Parser for Verion Language
// Converts tokens into an Abstract Syntax Tree (AST)

import { TokenType } from './tokenizer.js';

// AST Node Types
export const NodeType = {
  PROGRAM: 'Program',
  WRITE_STATEMENT: 'WriteStatement',
  ASSIGNMENT: 'Assignment',
  FUNCTION_DEF: 'FunctionDefinition',
  FUNCTION_CALL: 'FunctionCall',
  IF_STATEMENT: 'IfStatement',
  WHILE_STATEMENT: 'WhileStatement',
  REPEAT_STATEMENT: 'RepeatStatement',
  RETURN_STATEMENT: 'ReturnStatement',
  BINARY_EXPRESSION: 'BinaryExpression',
  UNARY_EXPRESSION: 'UnaryExpression',
  IDENTIFIER: 'Identifier',
  BOOLEAN_LITERAL: 'BooleanLiteral',
  STRING_LITERAL: 'StringLiteral',
  NUMBER_LITERAL: 'NumberLiteral',
  BLOCK: 'Block',
  MEMBER_EXPRESSION: 'MemberExpression'
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
      case TokenType.WRITE:
        return this.parseWriteStatement();
      case TokenType.SET:
        return this.parseAssignment();
      case TokenType.DEFINE:
        return this.parseFunctionDefinition();
      case TokenType.IF:
        return this.parseIfStatement();
      case TokenType.REPEAT:
        return this.parseRepeatStatement();
      case TokenType.IDENTIFIER:
        // Could be a function call
        if (this.peek().type === TokenType.LPAREN) {
          return this.parseFunctionCall();
        }
        break;
      case TokenType.NEWLINE:
        this.advance();
        return null;
    }

    throw new Error(`Unexpected token ${token.type} at line ${token.line}`);
  }

  parseWriteStatement() {
    this.expect(TokenType.WRITE);
    const expression = this.parseExpression();
    
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
    
    return {
      type: NodeType.ASSIGNMENT,
      name,
      value
    };
  }

  parseFunctionDefinition() {
    this.expect(TokenType.DEFINE);
    
    const nameToken = this.currentToken();
    if (nameToken.type !== TokenType.IDENTIFIER) {
      throw new Error(`Expected function name at line ${nameToken.line}`);
    }
    const name = nameToken.value;
    this.advance();
    
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
      body
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
      
      case TokenType.IDENTIFIER:
        const name = token.value;
        this.advance();
        
        // Check for member access (e.g., message.content)
        if (this.currentToken().type === TokenType.DOT) {
          this.advance();
          const propertyToken = this.currentToken();
          if (propertyToken.type !== TokenType.IDENTIFIER) {
            throw new Error(`Expected property name after '.' at line ${propertyToken.line}`);
          }
          const property = propertyToken.value;
          this.advance();
          
          return {
            type: NodeType.MEMBER_EXPRESSION,
            object: name,
            property
          };
        }
        
        // Check for function call
        if (this.currentToken().type === TokenType.LPAREN) {
          this.pos--; // Go back to re-parse as function call
          return this.parseFunctionCall();
        }
        
        return {
          type: NodeType.IDENTIFIER,
          name
        };
      
      case TokenType.LPAREN:
        this.advance();
        const expr = this.parseExpression();
        this.expect(TokenType.RPAREN);
        return expr;
      
      default:
        throw new Error(`Unexpected token ${token.type} at line ${token.line}`);
    }
  }
}
