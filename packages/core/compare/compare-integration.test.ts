import path from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import {
  createProgram,
  type TypeScriptProject,
} from "../typescript/create-program";
import { compareProps } from "./compare-props";
import { extractProps } from "./extract-props";

const fixturesDir = path.join(
  import.meta.dirname,
  "../resolver/__fixtures__",
);

describe("extractProps + compareProps", () => {
  let project: TypeScriptProject;

  beforeAll(() => {
    project = createProgram({
      rootPath: fixturesDir,
      tsconfigPath: "tsconfig.json",
    });
  });

  it("finds no issues when the contract matches ButtonProps", () => {
    const codeProps = extractProps({
      ...project,
      sourcePath: path.join(fixturesDir, "Button.component.tsx"),
      propsType: "ButtonProps",
    });

    const findings = compareProps(
      {
        label: { type: "string", required: true },
        variant: {
          values: ["primary", "secondary", "danger"],
          required: true,
        },
        disabled: { type: "boolean", required: false },
        count: { type: "number", required: true },
      },
      codeProps,
    );

    expect(findings).toEqual([]);
  });

  it("reports drift when the contract is out of date", () => {
    const codeProps = extractProps({
      ...project,
      sourcePath: path.join(fixturesDir, "Button.component.tsx"),
      propsType: "ButtonProps",
    });

    const findings = compareProps(
      {
        label: { type: "string", required: true },
        variant: {
          values: ["primary", "secondary"],
          required: true,
        },
      },
      codeProps,
    );

    expect(findings.map((finding) => finding.ruleId).sort()).toEqual([
      "SPB105",
      "SPB105",
      "SPB106",
    ]);
  });
});
