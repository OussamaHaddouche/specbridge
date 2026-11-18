import { describe, expect, it } from "vitest";
import { createFinding } from "./create-finding";

describe("createFinding", () => {
  it("formats a finding and fills severity from defaultRules", () => {
    expect(
      createFinding({
        ruleId: "DSL001",
        message: "Source file not found: Button.tsx",
        expected: "Button.tsx",
      }),
    ).toEqual({
      ruleId: "DSL001",
      severity: "error",
      message: "Source file not found: Button.tsx",
      expected: "Button.tsx",
    });
  });

  it("includes optional prop when provided", () => {
    expect(
      createFinding({
        ruleId: "DSL105",
        message: "Public prop is not in the contract.",
        prop: "className",
      }),
    ).toEqual({
      ruleId: "DSL105",
      severity: "warning",
      message: "Public prop is not in the contract.",
      prop: "className",
    });
  });
});
