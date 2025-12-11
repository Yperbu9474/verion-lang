import fs from "fs";
import path from "path";
import chalk from "chalk";
import { Tokenizer } from "../compiler/tokenizer.js";
import { Parser } from "../compiler/parser.js";
import { Interpreter } from "../compiler/interpreter.js";

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

    // Tokenize
    const tokenizer = new Tokenizer(source);
    const tokens = tokenizer.tokenize();

    // Parse
    const parser = new Parser(tokens);
    const ast = parser.parse();

    // Interpret
    const interpreter = new Interpreter();
    interpreter.interpret(ast);

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
