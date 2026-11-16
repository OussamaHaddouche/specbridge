import path from "node:path";
import { describe, expect, it } from "vitest";
import { FatalLoadError } from "../loader/fatal-error";
import { runCheck } from "./run-check";

const fixturesDir = path.join(import.meta.dirname, "__fixtures__");
const projectDir = path.join(fixturesDir, "project");

describe("runCheck", () => {
  it("checks all contracts and builds a report", () => {
    const report = runCheck(projectDir);

    expect(report.schemaVersion).toBe(1);
    expect(report.toolVersion).toBe("0.1.0");
    expect(report.summary).toEqual({
      checked: 2,
      errors: 1,
      warnings: 0,
    });

    expect(report.components.map((component) => component.name)).toEqual([
      "Button",
      "TextField",
    ]);

    const button = report.components.find(
      (component) => component.name === "Button",
    );
    const textField = report.components.find(
      (component) => component.name === "TextField",
    );

    expect(button?.source).toBe("src/Button.tsx");
    expect(button?.findings).toEqual([
      {
        ruleId: "SPB104",
        severity: "error",
        prop: "variant",
        message: 'Allowed value "danger" is missing in code.',
        expected: ["primary", "secondary", "danger"],
        actual: ["primary", "secondary"],
      },
    ]);

    expect(textField?.findings).toEqual([]);
  });

  it("throws when the project config is missing", () => {
    try {
      runCheck(fixturesDir);
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(FatalLoadError);
      expect(error).toMatchObject({ code: "CONFIG_NOT_FOUND" });
    }
  });
});
