# Verion Language - CLI Documentation

## Overview

The `vl` command-line interface provides tools for running, building, and managing Verion Language projects.

## Table of Contents

- [Installation](#installation)
- [Commands](#commands)
- [Usage Examples](#usage-examples)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)

---

## Installation

### Prerequisites

- Node.js v16 or higher
- npm (included with Node.js)

### Install from Repository

```bash
# Clone the repository
git clone https://github.com/yourusername/verion-lang.git
cd verion-lang

# Install dependencies
npm install

# Link globally
npm link
```

### Verify Installation

```bash
vl help
```

---

## Commands

### `vl run <file.vl>`

Execute a Verion Language file directly.

**Syntax:**
```bash
vl run <file.vl>
```

**Description:**
- Reads the `.vl` source file
- Tokenizes and parses the code
- Interprets and executes the program
- Displays output in the terminal

**Examples:**
```bash
# Run a simple hello world
vl run hello.vl

# Run with relative path
vl run examples/complete.vl

# Run with absolute path
vl run C:\projects\myapp\main.vl
```

**Output:**
- Program output is displayed in real-time
- Errors are shown with line/column information
- Exit code 0 on success, 1 on error

**Error Handling:**
```bash
# File not found
vl run missing.vl
# Error: File not found: C:\path\to\missing.vl

# Syntax error
vl run bad-syntax.vl
# Execution Error:
# Expected token type COLON but got NEWLINE at line 5, column 20
```

---

### `vl build <file.vl>`

Transpile Verion Language to JavaScript.

**Syntax:**
```bash
vl build <file.vl>
```

**Description:**
- Reads the `.vl` source file
- Tokenizes and parses the code
- Generates equivalent JavaScript
- Writes output to `dist/<filename>.mjs`

**Examples:**
```bash
# Build a single file
vl build main.vl
# Output: dist/main.mjs

# Build from examples
vl build examples/functions.vl
# Output: dist/functions.mjs
```

**Output:**
```
Building main.vl...
✓ Built successfully: C:\path\to\dist\main.mjs
```

**Running Built Files:**
```bash
# After building
vl build hello.vl

# Run the transpiled JavaScript
node dist/hello.mjs
```

**Build Output Format:**
```javascript
// Transpiled from Verion Language

let name = "Alice";
console.log(name);

function greet(name) {
  console.log("Hello, ");
  console.log(name);
}
```

---

### `vl init`

Initialize a new Verion Language project.

**Syntax:**
```bash
vl init
```

**Description:**
- Creates project structure
- Generates `package.json` if needed
- Creates `vl.config.json` for project settings
- Creates example `main.vl` file

**Example:**
```bash
# Create a new project
mkdir my-vl-project
cd my-vl-project
vl init

# Files created:
# - package.json
# - vl.config.json
# - main.vl
```

**Generated Files:**

`package.json`:
```json
{
  "name": "my-vl-project",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "vl run main.vl"
  }
}
```

`vl.config.json`:
```json
{
  "packages": []
}
```

`main.vl`:
```vl
# Welcome to Verion Language!
write "Hello, World!"
```

---

### `vl pkg add <package>`

Install an npm package for use in your VL project.

**Syntax:**
```bash
vl pkg add <package-name>
```

**Description:**
- Installs the npm package using `npm install`
- Records package in `vl.config.json`
- Makes package available for future transpilation

**Examples:**
```bash
# Install a package
vl pkg add axios

# Install with version
vl pkg add express@4.18.0

# Install multiple packages (run separately)
vl pkg add chalk
vl pkg add dotenv
```

**Updates `vl.config.json`:**
```json
{
  "packages": ["axios", "express", "chalk", "dotenv"]
}
```

**Note:** This feature prepares the project for future module support in VL.

---

### `vl up`

Update the Verion Language toolchain (placeholder).

**Syntax:**
```bash
vl up
```

**Description:**
- Future feature for auto-updating VL
- Currently shows a stub message

**Planned Features:**
- Fetch latest VL version from repository
- Update compiler and CLI tools
- Migrate configuration if needed

---

### `vl help`

Display CLI help information.

**Syntax:**
```bash
vl help
vl --help
vl
```

**Output:**
```
Verion Language (vl) CLI

Usage:
  vl init                 Initialize a new VL project
  vl run <file.vl>        Run a VL script
  vl build <file.vl>      Transpile VL to JavaScript in dist/
  vl pkg add <name>       Install an npm package
  vl up                   Update VL toolchain (stub)
  vl help                 Show this help
```

---

## Usage Examples

### Example 1: Quick Script

Create and run a simple script:

```bash
# Create file
echo "write 'Hello from VL!'" > test.vl

# Run it
vl run test.vl
```

### Example 2: Full Project Workflow

```bash
# Initialize project
mkdir calculator
cd calculator
vl init

# Edit main.vl
# ... add your code ...

# Run during development
vl run main.vl

# Build for production
vl build main.vl

# Deploy the JavaScript
node dist/main.mjs
```

### Example 3: Working with Examples

```bash
# Run all examples
vl run examples/hello.vl
vl run examples/variables.vl
vl run examples/functions.vl
vl run examples/conditionals.vl
vl run examples/loops.vl
vl run examples/complete.vl
```

### Example 4: Build and Test

```bash
# Build multiple files
vl build examples/hello.vl
vl build examples/functions.vl
vl build examples/complete.vl

# Test each transpiled file
node dist/hello.mjs
node dist/functions.mjs
node dist/complete.mjs
```

---

## Configuration

### vl.config.json

Project-specific configuration file.

**Location:** Project root directory

**Structure:**
```json
{
  "packages": ["package1", "package2"],
  "entry": "main.vl",
  "outputDir": "dist"
}
```

**Fields:**
- `packages` - List of installed npm packages
- `entry` - Main entry file (default: `main.vl`)
- `outputDir` - Build output directory (default: `dist`)

---

## Command Line Options

### Global Flags

Currently, VL CLI uses positional arguments. Future versions may include:

```bash
# Planned flags
vl run main.vl --verbose      # Verbose output
vl build main.vl --watch      # Watch mode
vl build main.vl --minify     # Minified output
vl run main.vl --debug        # Debug mode
```

---

## Troubleshooting

### Command Not Found

**Problem:**
```
'vl' is not recognized as an internal or external command
```

**Solutions:**
1. Verify installation: `npm list -g verion-lang`
2. Re-link the package: `npm link` (in project directory)
3. Check PATH includes npm global binaries
4. Restart terminal after installation

### File Not Found

**Problem:**
```
Error: File not found: C:\path\to\file.vl
```

**Solutions:**
1. Check file path is correct
2. Use relative path from current directory
3. Verify file extension is `.vl`
4. Check file actually exists

### Syntax Errors

**Problem:**
```
Execution Error:
Expected token type COLON but got NEWLINE at line 5
```

**Solutions:**
1. Check line 5 of your VL file
2. Ensure blocks end with colon (`:`)
3. Verify all blocks have `end` keyword
4. Check for typos in keywords

### Permission Errors (Windows)

**Problem:**
```
Error: EPERM: operation not permitted
```

**Solutions:**
1. Run terminal as Administrator
2. Check file/directory permissions
3. Close programs that might lock files

### Build Errors

**Problem:**
```
Build Error:
Cannot create directory
```

**Solutions:**
1. Ensure write permissions in project directory
2. Close programs using dist/ directory
3. Manually create dist/ directory
4. Check available disk space

---

## Performance Tips

1. **Build once, run many:**
   ```bash
   vl build main.vl
   node dist/main.mjs  # Faster than vl run
   ```

2. **Use relative paths:**
   ```bash
   vl run ./main.vl  # Faster file resolution
   ```

3. **Batch operations:**
   ```bash
   # Build all at once
   for file in examples/*.vl; do vl build $file; done
   ```

---

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Error (file not found, syntax error, runtime error) |

**Usage in scripts:**
```bash
vl run main.vl
if [ $? -eq 0 ]; then
    echo "Success"
else
    echo "Failed"
fi
```

---

## Environment Variables

Future versions may support:

```bash
# Planned environment variables
export VL_DEBUG=1          # Enable debug output
export VL_OUTPUT_DIR=build # Change output directory
export VL_NO_COLOR=1       # Disable colored output
```

---

## Integration with Other Tools

### npm scripts

Add VL commands to `package.json`:

```json
{
  "scripts": {
    "start": "vl run main.vl",
    "build": "vl build main.vl",
    "dev": "vl run main.vl",
    "prod": "vl build main.vl && node dist/main.mjs"
  }
}
```

Then use:
```bash
npm start      # Run with vl
npm run build  # Build to JS
npm run prod   # Build and execute
```

### VS Code Tasks

Create `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Run VL",
      "type": "shell",
      "command": "vl run ${file}",
      "group": {
        "kind": "build",
        "isDefault": true
      }
    }
  ]
}
```

---

## Additional Resources

- [Syntax Reference](syntax.md) - Complete language syntax
- [Examples](../examples/) - Sample VL programs
- [README](../README.md) - Project overview

---

For bugs or feature requests, please open an issue on GitHub.
