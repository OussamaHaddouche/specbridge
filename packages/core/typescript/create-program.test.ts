import path from "node:path";
import { describe, expect, it } from "vitest";
import { FatalLoadError } from "../loader/fatal-error";
import { createProgram } from "./create-program";

const fixturesDir = path.join(
  import.meta.dirname,
  "../resolver/__fixtures__",
);

describe("createProgram", () => {
  it("creates a program and type checker from a tsconfig", () => {
    const { program, checker } = createProgram({
      rootPath: fixturesDir,
      tsconfigPath: "tsconfig.json",
    });

    expect(program.getSourceFiles().length).toBeGreaterThan(0);
    expect(checker).toBeDefined();
  });

  it("throws TSCONFIG_INVALID when the tsconfig cannot be read", () => {
    try {
      createProgram({
        rootPath: fixturesDir,
        tsconfigPath: "missing.tsconfig.json",
      });
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(FatalLoadError);
      expect(error).toMatchObject({ code: "TSCONFIG_INVALID" });
    }
  });
});
