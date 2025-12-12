import fs from "fs";
import path from "path";
import { exec } from "child_process";
import chalk from "chalk";

export async function addPackage(name) {
  const cwd = process.cwd();
  const pkgPath = path.join(cwd, "package.json");
  if (!fs.existsSync(pkgPath)) {
    console.error(chalk.red("No package.json found. Run `vl init` first."));
    process.exit(1);
  }

  console.log(chalk.cyan(`Installing npm package: ${name} ...`));
  await new Promise((resolve, reject) => {
    const child = exec(`npm install ${name}`, { cwd });
    
    child.stdout?.on('data', (data) => {
      process.stdout.write(data);
    });
    
    child.stderr?.on('data', (data) => {
      process.stderr.write(data);
    });
    
    child.on("exit", code => {
      if (code === 0) resolve();
      else reject(new Error(`npm install failed with exit code ${code}`));
    });
    
    child.on("error", (err) => {
      reject(new Error(`Failed to start npm: ${err.message}`));
    });
  });

  const vlConfigPath = path.join(cwd, "vl.config.json");
  if (fs.existsSync(vlConfigPath)) {
    const cfg = JSON.parse(fs.readFileSync(vlConfigPath, "utf-8"));
    cfg.packages = cfg.packages || [];
    if (!cfg.packages.includes(name)) cfg.packages.push(name);
    fs.writeFileSync(vlConfigPath, JSON.stringify(cfg, null, 2));
    console.log(chalk.green(`Added ${name} to vl.config.json packages.`));
  }

  console.log(chalk.green("Done."));
}
