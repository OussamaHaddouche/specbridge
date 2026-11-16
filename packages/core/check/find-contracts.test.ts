import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  componentNameFromContractPath,
  findContractPaths,
} from "./find-contracts";

const projectDir = path.join(import.meta.dirname, "__fixtures__", "project");

describe("findContractPaths", () => {
  it("finds contract files from the config glob", () => {
    const paths = findContractPaths(
      projectDir,
      "contracts/**/*.contract.json",
    );

    expect(paths.map((contractPath) => path.basename(contractPath))).toEqual([
      "Button.contract.json",
      "TextField.contract.json",
    ]);
  });
});

describe("componentNameFromContractPath", () => {
  it("uses the contract file name without the suffix", () => {
    expect(
      componentNameFromContractPath(
        path.join(projectDir, "contracts", "Button.contract.json"),
      ),
    ).toBe("Button");
  });
});
