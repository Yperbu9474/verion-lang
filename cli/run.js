import fs from "fs";
import path from "path";
import os from "os";
import { fork } from "child_process";
import chalk from "chalk";
import { Tokenizer } from "../compiler/tokenizer.js";
import { Parser } from "../compiler/parser.js";
import { Interpreter } from "../compiler/interpreter.js";
import { transpile } from "../compiler/transpiler.js";

export async function runFile(filePath) {
  const abs = path.resolve(process.cwd(), filePath);
  
  // Check if file exists
  if (!fs.existsSync(abs)) {
    console.error(chalk.red(`Error: File not found: ${abs}`));
    process.exit(1);
  }

  try {
    // Read source code
    const source = fs.readFileSync(abs, "utf-8");

    // Check if file uses advanced features that require transpilation
    const advancedFeatures = ['import ', 'require ', 'export ', 'class ', 'async ', 'await ', 'try ', 'catch '];
    const usesAdvancedFeatures = advancedFeatures.some(feature => source.includes(feature));
    
    if (usesAdvancedFeatures) {
      // Transpile and run
      const jsCode = transpile(source);
      
      // Create a temporary file to execute
      const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'verion-'));
      const tempFile = path.join(tempDir, 'temp-run.mjs');
      fs.writeFileSync(tempFile, jsCode);
      
      // Execute the file in a new Node.js process
      const child = fork(tempFile, { stdio: 'inherit' });
      
      child.on('close', (code) => {
        // Clean up the temporary file and directory
        fs.unlinkSync(tempFile);
        fs.rmdirSync(tempDir);
        if (code !== 0) {
          console.error(chalk.red(`\nExecution finished with exit code ${code}`));
        }
      });

    } else {
      // Interpret directly for simple scripts
      const tokenizer = new Tokenizer(source);
      const tokens = tokenizer.tokenize();
      const parser = new Parser(tokens);
      const ast = parser.parse();
      const interpreter = new Interpreter();
      interpreter.interpret(ast);
    }

  } catch (error) {
    console.error(chalk.red(`\nExecution Error:`));
    console.error(chalk.red(error.message));
    if (error.stack) {
      console.error(chalk.gray('\nStack trace:'));
      console.error(chalk.gray(error.stack));
    }
    process.exit(1);
  }
}
