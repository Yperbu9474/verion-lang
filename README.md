# 🚀 Verion Language (VL)

**A simple, English-like programming language designed for beginners and makers.**

Verion Language is an installable programming language with English-like syntax, making code readable and beginner-friendly. Perfect for bots, web servers, and simple applications.

## ✨ Features

- **English-like Syntax** - Write code that reads like natural language (`set name to "Alice"`)
- **Easy to Learn** - Simple, intuitive syntax perfect for beginners
- **Interpreted or Compiled** - Run instantly with `vl run` or transpile to JavaScript
- **String Concatenation** - Natural string joining with `+`
- **Professional CLI** - Full-featured command-line interface
- **npm Installable** - Install globally like Node.js or Python
- **Complete Pipeline** - Tokenizer → Parser → Interpreter/Transpiler

## Install (from local clone)

```bash
git clone https://github.com/VerionTech/verion-lang.git
cd verion-lang
npm install
npm link   # or: npm install -g .
```

Now you have the `vl` command:

```bash
vl --help
```

## 🎯 Quick Start

Create a file called `hello.vl`:

```vl
write "Hello, World!"
```

Run it:
```bash
vl run hello.vl
```

Output:
```
Hello, World!
```

## 📚 Language Syntax

### Printing Output
```vl
write "Hello, World!"
write 42
```

### Variables
```vl
set name to "Alice"
set age to 25
set total to 100
```

### Math Operations
```vl
set x to 10
set y to 5

set sum to x plus y
set difference to x minus y
set product to x multiply y
set quotient to x divide y
```

### Functions
```vl
define greet(name):
    write "Hello "
    write name
end

greet("Bob")
```

### Conditionals
```vl
set score to 85

if score is greater than 80:
    write "Great job!"
else:
    write "Keep trying"
end
```

### Loops
```vl
repeat 5 times:
    write "Hello!"
end
```

### Comments
```vl
# This is a comment
write "This is code"
```

## 🛠️ CLI Commands

### Run a VL Script
```bash
vl run <file.vl>
```

### Build to JavaScript
```bash
vl build <file.vl>
```
This creates a `.mjs` file in the `dist/` directory.

### Initialize a Project
```bash
vl init
```

### Add npm Packages
```bash
vl pkg add <package-name>
```

### Help
```bash
vl help
```

## 🏗️ Architecture

Verion Language consists of four main components:

1. **Tokenizer** (`compiler/tokenizer.js`) - Converts source code into tokens
2. **Parser** (`compiler/parser.js`) - Converts tokens into an Abstract Syntax Tree
3. **Interpreter** (`compiler/interpreter.js`) - Executes the AST directly
4. **Transpiler** (`compiler/transpiler.js`) - Converts AST to JavaScript

## 📖 Examples

The `examples/` directory contains sample programs demonstrating all features:
- `hello.vl` - Hello World
- `variables.vl` - Variable declarations and math
- `functions.vl` - Function definitions and calls
- `conditionals.vl` - If/else statements
- `loops.vl` - Repeat loops
- `complete.vl` - All features combined
