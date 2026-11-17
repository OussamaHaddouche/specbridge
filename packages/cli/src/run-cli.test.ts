import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { runCli } from "./run-cli";

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const testOutputDir = path.join(packageRoot, "test-output");
const coreFixtures = path.resolve(packageRoot, "../core/check/__fixtures__");
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
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, contents, "utf8");
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
    const outPath = path.join(testOutputDir, "report.json");
    const session = createIo(projectDir);
    const code = runCli(
      ["check", "--format", "json", "--output", outPath],
      session.io,
    );

    expect(code).toBe(1);
    const report = JSON.parse(session.buffers.stdout);
    expect(report.summary.errors).toBe(1);
    expect(report.components[0].name).toBe("Button");
    expect(fs.readFileSync(outPath, "utf8")).toBe(session.buffers.stdout);
  });

  it("prints Markdown when --format markdown is set", () => {
    const outPath = path.join(testOutputDir, "report.md");
    const session = createIo(projectDir);
    const code = runCli(
      ["check", "--format", "markdown", "--output", outPath],
      session.io,
    );

    expect(code).toBe(1);
    expect(session.buffers.stdout).toContain("## Button");
    expect(session.buffers.stdout).toContain("SPB104");
    expect(session.buffers.stdout).toMatch(/Checked \d+/);
    expect(session.buffers.stderr).toBe("");
    expect(fs.readFileSync(outPath, "utf8")).toBe(session.buffers.stdout);
  });

  it("exits 2 for an unknown --format", () => {
    const session = createIo(projectDir);
    const code = runCli(["check", "--format", "sarif"], session.io);

    expect(code).toBe(2);
    expect(session.buffers.stderr).toContain("Invalid --format");
  });

  it("exits 2 for an unknown command", () => {
    const session = createIo(projectDir);
    const code = runCli(["wat"], session.io);

    expect(code).toBe(2);
    expect(session.buffers.stderr).toContain("Unknown command");
  });
});
