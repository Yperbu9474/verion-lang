// Extremely simple prototype transpiler for Verion Language.
// Phase 0: treat most of the code as JS, with a few sugar keywords:
//
// - `print "text"`  -> console.log("text")
// - `print {expr}`  -> console.log(expr)
// - comments: `#` at the beginning of a line

export function transpile(source, options = {}) {
  const lines = source.split(/\r?\n/);
  const out = [];

  out.push("// Transpiled from Verion Language");
  if (options.filename) {
    out.push(`// Source: ${options.filename}`);
  }
  out.push("");

  for (let raw of lines) {
    let line = raw.trim();
    if (line === "" || line.startsWith("#")) {
      out.push(""); // keep line for spacing
      continue;
    }

    // Very naive `print` handling
    if (line.startsWith("print ")) {
      const rest = line.slice("print ".length).trim();
      // If it starts with a quote, treat as string literal
      if (rest.startsWith("\"") && rest.endsWith("\"")) {
        out.push(`console.log(${rest});`);
      } else {
        out.push(`console.log(${rest});`);
      }
      continue;
    }

    // TODO: expand here for your custom syntax rules.
    // For now, just pass through as JS.
    out.push(line);
  }

  return out.join("\n");
}
