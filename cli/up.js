import chalk from "chalk";
import { exec } from "child_process";
import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function getLatestVersion() {
  return new Promise((resolve, reject) => {
    https.get("https://registry.npmjs.org/verion-lang/latest", (res) => {
      let data = "";
      res.on("data", (chunk) => data += chunk);
      res.on("end", () => {
        try {
          const pkg = JSON.parse(data);
          resolve(pkg.version);
        } catch (err) {
          reject(err);
        }
      });
    }).on("error", reject);
  });
}

function getCurrentVersion() {
  try {
    const pkgPath = path.join(__dirname, "..", "package.json");
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
      return pkg.version || "0.0.0";
    }
  } catch (err) {
    // Ignore errors
  }
  return "0.0.0";
}

async function checkForUpdates() {
  try {
    const latest = await getLatestVersion();
    const current = getCurrentVersion();
    
    console.log(chalk.cyan(`Current version: ${current}`));
    console.log(chalk.cyan(`Latest version: ${latest}`));
    
    if (latest === current) {
      console.log(chalk.green("✓ You are using the latest version!"));
      return false;
    } else {
      console.log(chalk.yellow(`→ Update available: ${current} → ${latest}`));
      return true;
    }
  } catch (err) {
    console.log(chalk.yellow("Could not check for updates (package may not be published yet)"));
    return false;
  }
}

async function updatePackage() {
  console.log(chalk.cyan("Updating verion-lang..."));
  
  return new Promise((resolve, reject) => {
    const child = exec("npm install -g verion-lang@latest");
    
    child.stdout?.on('data', (data) => {
      process.stdout.write(data);
    });
    
    child.stderr?.on('data', (data) => {
      process.stderr.write(data);
    });
    
    child.on("exit", code => {
      if (code === 0) {
        console.log(chalk.green("✓ Update completed successfully!"));
        resolve();
      } else {
        reject(new Error(`Update failed with exit code ${code}`));
      }
    });
    
    child.on("error", (err) => {
      reject(new Error(`Failed to update: ${err.message}`));
    });
  });
}

export async function updateVL() {
  console.log(chalk.cyanBright("Checking for updates..."));
  
  const hasUpdate = await checkForUpdates();
  
  if (!hasUpdate) {
    console.log(chalk.gray("\nTo update manually when published:"));
    console.log(chalk.gray("  npm install -g verion-lang@latest"));
    return;
  }
  
  try {
    await updatePackage();
  } catch (err) {
    console.error(chalk.red("\nUpdate failed:"), err.message);
    console.log(chalk.yellow("\nTo update manually:"));
    console.log(chalk.yellow("  npm install -g verion-lang@latest"));
    console.log(chalk.yellow("or if working from a clone:"));
    console.log(chalk.yellow("  git pull && npm install"));
    process.exit(1);
  }
}
