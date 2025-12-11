import { execFile } from "child_process";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const example = path.join(__dirname, "hello.vl");

execFile("node", ["../cli/index.js", "run", example], (err, stdout, stderr) => {
  if (err) {
    console.error("Error running example:", err);
  } else {
    process.stdout.write(stdout);
    process.stderr.write(stderr);
  }
});
