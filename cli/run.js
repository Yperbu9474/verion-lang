import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { transpile } from "../compiler/transpiler.js";
import { execFile } from "child_process";
import os from "os";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runFile(filePath) {
  const abs = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(abs)) {
    console.error("File not found:", abs);
    process.exit(1);
  }

  const src = fs.readFileSync(abs, "utf-8");
  const js = transpile(src, { filename: abs });

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "vl-"));
  const outFile = path.join(tmpDir, "main.mjs");
  fs.writeFileSync(outFile, js, "utf-8");

  await new Promise((resolve, reject) => {
    const child = execFile("node", [outFile], { stdio: "inherit" });
    child.on("exit", code => {
      if (code === 0) resolve();
      else reject(new Error(`Node exited with code ${code}`));
    });
  });
}
