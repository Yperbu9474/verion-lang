import fs from "fs";
import path from "path";
import { transpile } from "../compiler/transpiler.js";

export async function buildFile(filePath) {
  const abs = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(abs)) {
    console.error("File not found:", abs);
    process.exit(1);
  }

  const src = fs.readFileSync(abs, "utf-8");
  const js = transpile(src, { filename: abs });

  const distDir = path.join(process.cwd(), "dist");
  if (!fs.existsSync(distDir)) fs.mkdirSync(distDir);

  const base = path.basename(filePath, path.extname(filePath));
  const outFile = path.join(distDir, base + ".mjs");
  fs.writeFileSync(outFile, js, "utf-8");

  console.log("Built:", outFile);
}
