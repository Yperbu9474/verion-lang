# Verion Language (VL)

Verion Language (VL) is an experimental high-level scripting language designed to:

- Feel **crazy simple** to read and write
- Run **entirely on the user's device** (no backend required)
- Compile to **Node.js / JavaScript** so you can:
  - Build Discord bots
  - Build web servers & APIs
  - Talk to databases
  - Build CLIs
  - Eventually build Android apps (via JS/TS toolchains)

> **Status:** early prototype. The CLI works, but the language currently transpiles to JavaScript in a very thin way. This repo is a starting point for you to extend.

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

## Quick start

```bash
mkdir my-app
cd my-app
vl init
echo 'print "Hello from VL!"' > main.vl
vl run main.vl
```

Under the hood, `vl run`:

1. Reads your `.vl` file
2. Transpiles VL → JavaScript
3. Executes it with Node.js

## Commands

- `vl init` – initialize a new VL project (creates `package.json`, `vl.config.json`)
- `vl run <file.vl>` – run a VL script
- `vl build <file.vl>` – transpile to JavaScript and write `dist/<file>.js`
- `vl pkg add <name>` – install an npm package and register it in `vl.config.json`
- `vl up` – (stub) update VL toolchain from GitHub (to be implemented)

## Project layout (this repo)

```text
compiler/   – VL → JS transpiler
cli/        – `vl` CLI implementation
stdlib/     – standard library (VL-level helpers)
examples/   – example VL programs
docs/       – language & CLI documentation
```

You can use this as a foundation to grow Verion Language into a real language
with a custom parser and rich syntax.
