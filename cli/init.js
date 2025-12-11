import fs from "fs";
import path from "path";
import chalk from "chalk";

export async function initProject() {
  const cwd = process.cwd();

  // package.json
  const pkgPath = path.join(cwd, "package.json");
  if (!fs.existsSync(pkgPath)) {
    const pkg = {
      name: path.basename(cwd),
      version: "0.1.0",
      private: true,
      type: "module",
      scripts: {
        start: "vl run main.vl"
      }
    };
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    console.log(chalk.green("Created package.json"));
  } else {
    console.log(chalk.yellow("package.json already exists, skipping."));
  }

  // vl.config.json
  const vlConfigPath = path.join(cwd, "vl.config.json");
  if (!fs.existsSync(vlConfigPath)) {
    const cfg = {
      languageVersion: "0.1.0",
      entry: "main.vl",
      packages: []
    };
    fs.writeFileSync(vlConfigPath, JSON.stringify(cfg, null, 2));
    console.log(chalk.green("Created vl.config.json"));
  } else {
    console.log(chalk.yellow("vl.config.json already exists, skipping."));
  }

  // main.vl
  const mainPath = path.join(cwd, "main.vl");
  if (!fs.existsSync(mainPath)) {
    fs.writeFileSync(mainPath, 'print "Hello from Verion Language!"\n');
    console.log(chalk.green("Created main.vl"));
  } else {
    console.log(chalk.yellow("main.vl already exists, skipping."));
  }

  console.log(chalk.cyanBright("VL project initialized."));
}
