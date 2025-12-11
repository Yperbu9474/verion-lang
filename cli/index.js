#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";
import { runFile } from "./run.js";
import { initProject } from "./init.js";
import { buildFile } from "./build.js";
import { addPackage } from "./pkg.js";
import { updateVL } from "./up.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const [,, cmd, ...args] = process.argv;

function printHelp() {
  console.log(chalk.cyanBright("Verion Language (vl) CLI"));
  console.log("");
  console.log("Usage:");
  console.log("  vl init                 Initialize a new VL project");
  console.log("  vl run <file.vl>        Run a VL script");
  console.log("  vl build <file.vl>      Transpile VL to JavaScript in dist/");
  console.log("  vl pkg add <name>       Install an npm package");
  console.log("  vl up                   Update VL toolchain (stub)");
  console.log("  vl help                 Show this help");
}

async function main() {
  switch (cmd) {
    case "init":
      await initProject();
      break;
    case "run":
      if (!args[0]) {
        console.error(chalk.red("Please specify a .vl file to run."));
        process.exit(1);
      }
      await runFile(args[0]);
      break;
    case "build":
      if (!args[0]) {
        console.error(chalk.red("Please specify a .vl file to build."));
        process.exit(1);
      }
      await buildFile(args[0]);
      break;
    case "pkg":
      if (args[0] === "add" && args[1]) {
        await addPackage(args[1]);
      } else {
        console.error(chalk.red("Usage: vl pkg add <name>"));
        process.exit(1);
      }
      break;
    case "up":
      await updateVL();
      break;
    case "help":
    case "--help":
    case "-h":
    case undefined:
      printHelp();
      break;
    default:
      console.error(chalk.red(`Unknown command: ${cmd}`));
      printHelp();
      process.exit(1);
  }
}

main().catch(err => {
  console.error(chalk.red("VL CLI crashed:"), err);
  process.exit(1);
});
