import path from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import {
  createProgram,
  type TypeScriptProject,
} from "../typescript/create-program";
import { extractProps } from "./extract-props";

const fixturesDir = path.join(
  import.meta.dirname,
  "../resolver/__fixtures__",
);

describe("extractProps", () => {
  let project: TypeScriptProject;

  beforeAll(() => {
    project = createProgram({
      rootPath: fixturesDir,
      tsconfigPath: "tsconfig.json",
    });
  });

  it("extracts primitives, optional flags, and string unions", () => {
    const props = extractProps({
      ...project,
      sourcePath: path.join(fixturesDir, "Button.component.tsx"),
      propsType: "ButtonProps",
    });

    expect(props).toEqual({
      label: { kind: "primitive", type: "string", required: true },
      variant: {
        kind: "values",
        values: ["primary", "secondary", "danger"],
        required: true,
      },
      disabled: { kind: "primitive", type: "boolean", required: false },
      count: { kind: "primitive", type: "number", required: true },
    });
  });
});
