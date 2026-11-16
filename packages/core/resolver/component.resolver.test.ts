import path from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { createProgram, type TypeScriptProject } from "../typescript/create-program";
import { resolveComponent } from "./component.resolver";

const fixturesDir = path.join(import.meta.dirname, "__fixtures__");

const buttonResolve = {
  source: "Button.component.tsx",
  exportName: "Button",
  propsType: "ButtonProps",
} as const;

describe("resolveComponent", () => {
  let project: TypeScriptProject;

  beforeAll(() => {
    project = createProgram({
      rootPath: fixturesDir,
      tsconfigPath: "tsconfig.json",
    });
  });

  it("resolves when the source, export, and props type exist", () => {
    const result = resolveComponent(buttonResolve, {
      rootPath: fixturesDir,
      ...project,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.component).toEqual({
      sourcePath: path.join(fixturesDir, "Button.component.tsx"),
      exportName: "Button",
      propsType: "ButtonProps",
    });
  });

  it("returns SPB001 when the source file is missing", () => {
    const result = resolveComponent(
      { ...buttonResolve, source: "Missing.component.tsx" },
      { rootPath: fixturesDir, ...project },
    );

    expect(result).toEqual({
      ok: false,
      finding: {
        ruleId: "SPB001",
        severity: "error",
        message: "Source file not found: Missing.component.tsx",
        expected: "Missing.component.tsx",
      },
    });
  });

  it("returns SPB001 when the export is missing", () => {
    const result = resolveComponent(
      { ...buttonResolve, exportName: "MissingButton" },
      { rootPath: fixturesDir, ...project },
    );

    expect(result).toEqual({
      ok: false,
      finding: {
        ruleId: "SPB001",
        severity: "error",
        message: "Export not found: MissingButton",
        expected: "MissingButton",
      },
    });
  });

  it("returns SPB002 when the props type is missing", () => {
    const result = resolveComponent(
      { ...buttonResolve, propsType: "MissingProps" },
      { rootPath: fixturesDir, ...project },
    );

    expect(result).toEqual({
      ok: false,
      finding: {
        ruleId: "SPB002",
        severity: "error",
        message: "Props type not found: MissingProps",
        expected: "MissingProps",
      },
    });
  });
});
