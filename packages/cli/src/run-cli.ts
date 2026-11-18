import { FatalLoadError, runCheck } from "@dslint/core";
import { formatReport } from "./format-report";
import { parseArgs } from "./parse-args";

export type CliIo = {
  cwd: string;
  stdout: { write(chunk: string): void };
  stderr: { write(chunk: string): void };
  writeFile(filePath: string, contents: string): void;
};

export function runCli(argv: string[], io: CliIo): number {
  const parsed = parseArgs(argv);
  if (!parsed.ok) {
    io.stderr.write(`${parsed.message}\n`);
    return 2;
  }

  try {
    const { report, failed } = runCheck(io.cwd);
    const output = formatReport(report, parsed.value.format);
    io.stdout.write(output);

    if (parsed.value.output !== undefined) {
      io.writeFile(parsed.value.output, output);
    }

    return failed ? 1 : 0;
  } catch (error) {
    if (error instanceof FatalLoadError) {
      io.stderr.write(`${error.code}: ${error.message}\n`);
      return 2;
    }
    throw error;
  }
}
