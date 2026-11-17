import path from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import {
  createProgram,
  type TypeScriptProject,
} from "../typescript/create-program";
import { extractParamDefaults } from "./extract-param-defaults";

const fixturesDir = path.join(import.meta.dirname, "__fixtures__/defaults");

describe("extractParamDefaults", () => {
  let project: TypeScriptProject;

  beforeAll(() => {
    project = createProgram({
      rootPath: fixturesDir,
      tsconfigPath: "tsconfig.json",
    });
  });

  it("reads string, boolean, and number literals from a function export", () => {
    const defaults = extractParamDefaults({
      ...project,
      sourcePath: path.join(fixturesDir, "Components.tsx"),
      exportName: "WithDefaults",
    });

    expect(defaults).toEqual({
      variant: "primary",
      disabled: false,
      size: 2,
    });
  });

  it("reads defaults from an arrow-function export", () => {
    const defaults = extractParamDefaults({
      ...project,
      sourcePath: path.join(fixturesDir, "Components.tsx"),
      exportName: "ArrowDefaults",
    });

    expect(defaults).toEqual({
      variant: "secondary",
      disabled: true,
    });
  });

  it("returns an empty object when props are not destructured", () => {
    const defaults = extractParamDefaults({
      ...project,
      sourcePath: path.join(fixturesDir, "Components.tsx"),
      exportName: "NoDefaults",
    });

    expect(defaults).toEqual({});
  });
});
