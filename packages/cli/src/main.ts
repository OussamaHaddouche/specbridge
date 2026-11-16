import fs from "node:fs";
import { runCli } from "./run-cli";

const code = runCli(process.argv.slice(2), {
  cwd: process.cwd(),
  stdout: process.stdout,
  stderr: process.stderr,
  writeFile(filePath, contents) {
    fs.writeFileSync(filePath, contents, "utf8");
  },
});

process.exitCode = code;
