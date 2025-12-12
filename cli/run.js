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

    // Check if file uses advanced features that require transpilation
    const advancedFeatures = ['import ', 'require ', 'export ', 'class ', 'async ', 'await ', 'try ', 'catch '];
    const usesAdvancedFeatures = advancedFeatures.some(feature => source.includes(feature));
    
    if (usesAdvancedFeatures) {
      console.log(chalk.yellow('⚠️  This file uses advanced features (import/require/export/class/async/try).'));
      console.log(chalk.yellow('   These features require transpilation. Use:'));
      console.log(chalk.cyan('   vl build ' + path.basename(abs)));
      console.log(chalk.yellow('   Then run: ') + chalk.cyan('node dist/' + path.basename(abs, '.vl') + '.mjs\n'));
    }

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
