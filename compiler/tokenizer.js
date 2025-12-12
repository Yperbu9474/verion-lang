// Tokenizer for Verion Language
// Converts source code into a stream of tokens

export const TokenType = {
  // Literals
  STRING: 'STRING',
  NUMBER: 'NUMBER',
  IDENTIFIER: 'IDENTIFIER',
  NULL: 'NULL',
  
  // Keywords
  WRITE: 'WRITE',
  SET: 'SET',
  TO: 'TO',
  DEFINE: 'DEFINE',
  END: 'END',
  IF: 'IF',
  ELSE: 'ELSE',
  ELIF: 'ELIF',
  REPEAT: 'REPEAT',
  TIMES: 'TIMES',
  WHILE: 'WHILE',
  FOR: 'FOR',
  IN: 'IN',
  RETURN: 'RETURN',
  TRUE: 'TRUE',
  FALSE: 'FALSE',
  BREAK: 'BREAK',
  CONTINUE: 'CONTINUE',
  
  // Imports/Exports
  IMPORT: 'IMPORT',
  REQUIRE: 'REQUIRE',
  EXPORT: 'EXPORT',
  AS: 'AS',
  
  // Async
  ASYNC: 'ASYNC',
  AWAIT: 'AWAIT',
  
  // Classes
  CLASS: 'CLASS',
  NEW: 'NEW',
  THIS: 'THIS',
  CONSTRUCTOR: 'CONSTRUCTOR',
  
  // Try/Catch
  TRY: 'TRY',
  CATCH: 'CATCH',
  FINALLY: 'FINALLY',
  THROW: 'THROW',
  
  // Special keywords
  WHEN: 'WHEN',
  BOT: 'BOT',
  LOGIN: 'LOGIN',
  WITH: 'WITH',
  MESSAGE: 'MESSAGE',
  RECEIVED: 'RECEIVED',
  CONNECT: 'CONNECT',
  DATABASE: 'DATABASE',
  SERVER: 'SERVER',
  AT: 'AT',
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  RESPOND: 'RESPOND',
  FROM: 'FROM',
  ALL: 'ALL',
  ROWS: 'ROWS',
  LISTEN: 'LISTEN',
  ON: 'ON',
  SEND: 'SEND',
  REQUEST: 'REQUEST',
  RESPONSE: 'RESPONSE',
  
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
  NOT: 'NOT',
  
  // Symbols
  COLON: 'COLON',
  COMMA: 'COMMA',
  DOT: 'DOT',
  LPAREN: 'LPAREN',
  RPAREN: 'RPAREN',
  LBRACKET: 'LBRACKET',
  RBRACKET: 'RBRACKET',
  LBRACE: 'LBRACE',
  RBRACE: 'RBRACE',
  NEWLINE: 'NEWLINE',
  EOF: 'EOF'
};

const KEYWORDS = {
  'write': TokenType.WRITE,
  'print': TokenType.WRITE,  // Alias for write
  'set': TokenType.SET,
  'to': TokenType.TO,
  'define': TokenType.DEFINE,
  'function': TokenType.DEFINE,  // Alias
  'end': TokenType.END,
  'if': TokenType.IF,
  'else': TokenType.ELSE,
  'elif': TokenType.ELIF,
  'elseif': TokenType.ELIF,
  'repeat': TokenType.REPEAT,
  'times': TokenType.TIMES,
  'while': TokenType.WHILE,
  'for': TokenType.FOR,
  'in': TokenType.IN,
  'return': TokenType.RETURN,
  'true': TokenType.TRUE,
  'false': TokenType.FALSE,
  'null': TokenType.NULL,
  'none': TokenType.NULL,
  'break': TokenType.BREAK,
  'continue': TokenType.CONTINUE,
  
  // Imports/Exports
  'import': TokenType.IMPORT,
  'require': TokenType.REQUIRE,
  'export': TokenType.EXPORT,
  'as': TokenType.AS,
  'from': TokenType.FROM,
  
  // Async
  'async': TokenType.ASYNC,
  'await': TokenType.AWAIT,
  
  // Classes
  'class': TokenType.CLASS,
  'new': TokenType.NEW,
  'this': TokenType.THIS,
  'constructor': TokenType.CONSTRUCTOR,
  
  // Try/Catch
  'try': TokenType.TRY,
  'catch': TokenType.CATCH,
  'finally': TokenType.FINALLY,
  'throw': TokenType.THROW,
  
  // Special keywords
  'when': TokenType.WHEN,
  'bot': TokenType.BOT,
  'login': TokenType.LOGIN,
  'with': TokenType.WITH,
  'message': TokenType.MESSAGE,
  'received': TokenType.RECEIVED,
  'connect': TokenType.CONNECT,
  'database': TokenType.DATABASE,
  'server': TokenType.SERVER,
  'at': TokenType.AT,
  'get': TokenType.GET,
  'post': TokenType.POST,
  'put': TokenType.PUT,
  'delete': TokenType.DELETE,
  'respond': TokenType.RESPOND,
  'all': TokenType.ALL,
  'rows': TokenType.ROWS,
  'listen': TokenType.LISTEN,
  'on': TokenType.ON,
  'send': TokenType.SEND,
  'request': TokenType.REQUEST,
  'response': TokenType.RESPONSE,
  
  // Operators
  'plus': TokenType.PLUS,
  'minus': TokenType.MINUS,
  'multiply': TokenType.MULTIPLY,
  'divide': TokenType.DIVIDE,
  'is': TokenType.IS,
  'greater': TokenType.GREATER,
  'less': TokenType.LESS,
  'than': TokenType.THAN,
  'equals': TokenType.EQUALS,
  'and': TokenType.AND,
  'or': TokenType.OR,
  'not': TokenType.NOT
};

export class Token {
  constructor(type, value, line, column) {
    this.type = type;
    this.value = value;
    this.line = line;
    this.column = column;
  }
}

export class Tokenizer {
  constructor(source) {
    this.source = source;
    this.pos = 0;
    this.line = 1;
    this.column = 1;
    this.tokens = [];
  }

  currentChar() {
    if (this.pos >= this.source.length) return null;
    return this.source[this.pos];
  }

  peek(offset = 1) {
    const pos = this.pos + offset;
    if (pos >= this.source.length) return null;
    return this.source[pos];
  }

  advance() {
    if (this.pos < this.source.length) {
      if (this.source[this.pos] === '\n') {
        this.line++;
        this.column = 1;
      } else {
        this.column++;
      }
      this.pos++;
    }
  }

  skipWhitespace() {
    while (this.currentChar() && /[ \t\r]/.test(this.currentChar())) {
      this.advance();
    }
  }

  skipComment() {
    if (this.currentChar() === '#') {
      while (this.currentChar() && this.currentChar() !== '\n') {
        this.advance();
      }
    }
  }

  readString() {
    const startLine = this.line;
    const startColumn = this.column;
    const quote = this.currentChar(); // " or '
    this.advance(); // skip opening quote

    let value = '';
    while (this.currentChar() && this.currentChar() !== quote) {
      if (this.currentChar() === '\\') {
        this.advance();
        const escapeChar = this.currentChar();
        switch (escapeChar) {
          case 'n': value += '\n'; break;
          case 't': value += '\t'; break;
          case 'r': value += '\r'; break;
          case '\\': value += '\\'; break;
          case '"': value += '"'; break;
          case "'": value += "'"; break;
          default: value += escapeChar;
        }
        this.advance();
      } else {
        value += this.currentChar();
        this.advance();
      }
    }

    if (this.currentChar() === quote) {
      this.advance(); // skip closing quote
    } else {
      throw new Error(`Unterminated string at line ${startLine}, column ${startColumn}`);
    }

    return new Token(TokenType.STRING, value, startLine, startColumn);
  }

  readNumber() {
    const startLine = this.line;
    const startColumn = this.column;
    let value = '';

    while (this.currentChar() && /[0-9.]/.test(this.currentChar())) {
      value += this.currentChar();
      this.advance();
    }

    return new Token(TokenType.NUMBER, parseFloat(value), startLine, startColumn);
  }

  readIdentifier() {
    const startLine = this.line;
    const startColumn = this.column;
    let value = '';

    while (this.currentChar() && /[a-zA-Z0-9_]/.test(this.currentChar())) {
      value += this.currentChar();
      this.advance();
    }

    const type = KEYWORDS[value.toLowerCase()] || TokenType.IDENTIFIER;
    return new Token(type, value, startLine, startColumn);
  }

  tokenize() {
    while (this.pos < this.source.length) {
      this.skipWhitespace();

      if (!this.currentChar()) break;

      // Comments
      if (this.currentChar() === '#') {
        this.skipComment();
        continue;
      }

      // Newlines
      if (this.currentChar() === '\n') {
        const token = new Token(TokenType.NEWLINE, '\\n', this.line, this.column);
        this.tokens.push(token);
        this.advance();
        continue;
      }

      // Strings
      if (this.currentChar() === '"' || this.currentChar() === "'") {
        this.tokens.push(this.readString());
        continue;
      }

      // Numbers
      if (/[0-9]/.test(this.currentChar())) {
        this.tokens.push(this.readNumber());
        continue;
      }

      // Identifiers and keywords
      if (/[a-zA-Z_]/.test(this.currentChar())) {
        this.tokens.push(this.readIdentifier());
        continue;
      }

      // Symbols
      const char = this.currentChar();
      const startLine = this.line;
      const startColumn = this.column;

      switch (char) {
        case ':':
          this.tokens.push(new Token(TokenType.COLON, ':', startLine, startColumn));
          this.advance();
          break;
        case ',':
          this.tokens.push(new Token(TokenType.COMMA, ',', startLine, startColumn));
          this.advance();
          break;
        case '.':
          this.tokens.push(new Token(TokenType.DOT, '.', startLine, startColumn));
          this.advance();
          break;
        case '(':
          this.tokens.push(new Token(TokenType.LPAREN, '(', startLine, startColumn));
          this.advance();
          break;
        case ')':
          this.tokens.push(new Token(TokenType.RPAREN, ')', startLine, startColumn));
          this.advance();
          break;
        case '[':
          this.tokens.push(new Token(TokenType.LBRACKET, '[', startLine, startColumn));
          this.advance();
          break;
        case ']':
          this.tokens.push(new Token(TokenType.RBRACKET, ']', startLine, startColumn));
          this.advance();
          break;
        case '{':
          this.tokens.push(new Token(TokenType.LBRACE, '{', startLine, startColumn));
          this.advance();
          break;
        case '}':
          this.tokens.push(new Token(TokenType.RBRACE, '}', startLine, startColumn));
          this.advance();
          break;
        case '+':
          this.tokens.push(new Token(TokenType.PLUS, '+', startLine, startColumn));
          this.advance();
          break;
        case '-':
          this.tokens.push(new Token(TokenType.MINUS, '-', startLine, startColumn));
          this.advance();
          break;
        case '*':
          this.tokens.push(new Token(TokenType.MULTIPLY, '*', startLine, startColumn));
          this.advance();
          break;
        case '/':
          this.tokens.push(new Token(TokenType.DIVIDE, '/', startLine, startColumn));
          this.advance();
          break;
        default:
          throw new Error(`Unexpected character '${char}' at line ${startLine}, column ${startColumn}`);
      }
    }

    this.tokens.push(new Token(TokenType.EOF, null, this.line, this.column));
    return this.tokens;
  }
}
