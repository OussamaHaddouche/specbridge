import path from "node:path";
import { describe, expect, it } from "vitest";
import { FatalLoadError } from "../loader/fatal-error";
import { isFailing, runCheck } from "./run-check";
import type { Report } from "./report";

const fixturesDir = path.join(import.meta.dirname, "__fixtures__");
const projectDir = path.join(fixturesDir, "project");

describe("runCheck", () => {
  it("checks all contracts and builds a report", () => {
    const { report, failed } = runCheck(projectDir);

    expect(failed).toBe(true);
    expect(report.schemaVersion).toBe(1);
    expect(report.toolVersion).toBe("0.3.0");
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
        ruleId: "DSL104",
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

describe("isFailing", () => {
  function reportWith(summary: Report["summary"]): Report {
    return {
      schemaVersion: 1,
      toolVersion: "0.1.0",
      summary,
      components: [],
    };
  }

  it("fails on errors when failOn is error", () => {
    expect(
      isFailing(reportWith({ checked: 1, errors: 1, warnings: 0 }), "error"),
    ).toBe(true);
  });

  it("ignores warnings when failOn is error", () => {
    expect(
      isFailing(reportWith({ checked: 1, errors: 0, warnings: 2 }), "error"),
    ).toBe(false);
  });

  it("fails on warnings when failOn is warning", () => {
    expect(
      isFailing(reportWith({ checked: 1, errors: 0, warnings: 1 }), "warning"),
    ).toBe(true);
  });

  it("passes when there are no findings", () => {
    expect(
      isFailing(reportWith({ checked: 1, errors: 0, warnings: 0 }), "warning"),
    ).toBe(false);
  });
});
