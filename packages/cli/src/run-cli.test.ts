import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { runCli } from "./run-cli";

const coreFixtures = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../core/check/__fixtures__",
);
const projectDir = path.join(coreFixtures, "project");

function createIo(cwd: string) {
  const buffers = { stdout: "", stderr: "" };
  const files = new Map<string, string>();

  return {
    buffers,
    files,
    io: {
      cwd,
      stdout: {
        write(chunk: string) {
          buffers.stdout += chunk;
        },
      },
      stderr: {
        write(chunk: string) {
          buffers.stderr += chunk;
        },
      },
      writeFile(filePath: string, contents: string) {
        files.set(filePath, contents);
      },
    },
  };
}

describe("runCli", () => {
  it("prints findings and exits 1 when the check fails", () => {
    const session = createIo(projectDir);
    const code = runCli(["check"], session.io);

    expect(code).toBe(1);
    expect(session.buffers.stdout).toContain("Button");
    expect(session.buffers.stdout).toContain("SPB104");
    expect(session.buffers.stderr).toBe("");
  });

  it("exits 2 and prints to stderr when the check cannot run", () => {
    const session = createIo(coreFixtures);
    const code = runCli(["check"], session.io);

    expect(code).toBe(2);
    expect(session.buffers.stderr).toContain("CONFIG_NOT_FOUND");
    expect(session.buffers.stdout).toBe("");
  });

  it("prints JSON when --format json is set", () => {
    const session = createIo(projectDir);
    const code = runCli(["check", "--format", "json"], session.io);

    expect(code).toBe(1);
    const report = JSON.parse(session.buffers.stdout);
    expect(report.summary.errors).toBe(1);
    expect(report.components[0].name).toBe("Button");
  });

  it("writes the report when --output is set", () => {
    const outPath = "report.json";
    const session = createIo(projectDir);
    const code = runCli(
      ["check", "--format", "json", "--output", outPath],
      session.io,
    );

    expect(code).toBe(1);
    expect(session.files.get(outPath)).toBe(session.buffers.stdout);
  });

  it("exits 2 for an unknown command", () => {
    const session = createIo(projectDir);
    const code = runCli(["wat"], session.io);

    expect(code).toBe(2);
    expect(session.buffers.stderr).toContain("Unknown command");
  });
});
