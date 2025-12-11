# VL CLI

## Commands

### `vl init`

Initialize a new project in the current directory.

- Creates `package.json` if missing
- Creates `vl.config.json` if missing
- Creates `main.vl` if missing

### `vl run <file.vl>`

Transpile the file and execute the result with Node.js.

### `vl build <file.vl>`

Transpile the file and write the output to `dist/<name>.mjs`.

### `vl pkg add <name>`

Install an npm package in the current project and record it in `vl.config.json`.

### `vl up`

Placeholder for a future auto-update mechanism.
