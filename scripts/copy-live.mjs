// Live editing for the site's words (#561): watch src/content/copy/*.md and run
// the dev server, so every save in Obsidian (or any editor) shows on the page
// within a second. Local only: nothing is committed, pushed or published.
//   npm run copy:live            (http://localhost:3012)
//   npm run copy:live -- 3020    (another port)
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const port = process.argv[2] ?? "3012";
const node = process.execPath;
const run = (args, name) => {
  const p = spawn(node, args, { cwd: ROOT, stdio: ["ignore", "pipe", "pipe"] });
  for (const s of [p.stdout, p.stderr]) s.on("data", (d) => process.stdout.write(`[${name}] ${d}`));
  return p;
};
const copy = run([join(ROOT, "scripts/copy.mjs"), "build", "--watch"], "copy");
const next = run([join(ROOT, "node_modules/next/dist/bin/next"), "dev", "-p", port], "next");
console.log(`copy: live editing on http://localhost:${port} (add ?copy to see which lines are editable)`);
const stop = () => {
  copy.kill();
  next.kill();
  process.exit(0);
};
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
next.on("exit", stop);
