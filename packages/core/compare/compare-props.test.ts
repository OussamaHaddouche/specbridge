import { describe, expect, it } from "vitest";
import { compareProps } from "./compare-props";
import { type CodeProps } from "./extract-props";

describe("compareProps", () => {
  it("returns no findings when contract and code match", () => {
    const codeProps: CodeProps = {
      label: { kind: "primitive", type: "string", required: true },
      variant: {
        kind: "values",
        values: ["primary", "secondary", "danger"],
        required: false,
      },
    };

    expect(
      compareProps(
        {
          label: { type: "string", required: true },
          variant: {
            values: ["primary", "secondary", "danger"],
            required: false,
          },
        },
        codeProps,
      ),
    ).toEqual([]);
  });

  it("reports DSL101 when a contract prop is missing in code", () => {
    const findings = compareProps(
      { label: { type: "string", required: true } },
      {},
    );

    expect(findings).toEqual([
      {
        ruleId: "DSL101",
        severity: "error",
        prop: "label",
        message: 'Prop "label" is listed in the contract but missing in code.',
        expected: "label",
      },
    ]);
  });

  it("reports DSL102 when types differ", () => {
    const findings = compareProps(
      { count: { type: "number", required: true } },
      { count: { kind: "primitive", type: "string", required: true } },
    );

    expect(findings[0]).toMatchObject({
      ruleId: "DSL102",
      prop: "count",
      expected: { type: "number" },
      actual: { type: "string" },
    });
  });

  it("reports DSL103 when required does not match", () => {
    const findings = compareProps(
      { disabled: { type: "boolean", required: false } },
      { disabled: { kind: "primitive", type: "boolean", required: true } },
    );

    expect(findings[0]).toMatchObject({
      ruleId: "DSL103",
      prop: "disabled",
      expected: false,
      actual: true,
    });
  });

  it("reports DSL104 when a contract value is missing in code", () => {
    const findings = compareProps(
      {
        variant: {
          values: ["primary", "secondary", "danger"],
          required: false,
        },
      },
      {
        variant: {
          kind: "values",
          values: ["primary", "secondary"],
          required: false,
        },
      },
    );

    expect(findings).toEqual([
      {
        ruleId: "DSL104",
        severity: "error",
        prop: "variant",
        message: 'Allowed value "danger" is missing in code.',
        expected: ["primary", "secondary", "danger"],
        actual: ["primary", "secondary"],
      },
    ]);
  });

  it("reports DSL105 when code has an extra prop", () => {
    const findings = compareProps(
      {},
      { className: { kind: "primitive", type: "string", required: false } },
    );

    expect(findings[0]).toMatchObject({
      ruleId: "DSL105",
      severity: "warning",
      prop: "className",
    });
  });

  it("reports DSL106 when code allows an extra value", () => {
    const findings = compareProps(
      {
        variant: {
          values: ["primary", "secondary"],
          required: false,
        },
      },
      {
        variant: {
          kind: "values",
          values: ["primary", "secondary", "ghost"],
          required: false,
        },
      },
    );

    expect(findings[0]).toMatchObject({
      ruleId: "DSL106",
      severity: "warning",
      prop: "variant",
      message:
        'Value "ghost" is allowed in code but not listed in the contract.',
    });
  });

  it("reports DSL107 when the contract default is missing in code", () => {
    const findings = compareProps(
      {
        variant: {
          values: ["primary", "secondary"],
          required: false,
          default: "primary",
        },
      },
      {
        variant: {
          kind: "values",
          values: ["primary", "secondary"],
          required: false,
        },
      },
    );

    expect(findings[0]).toMatchObject({
      ruleId: "DSL107",
      severity: "error",
      prop: "variant",
      expected: "primary",
    });
  });

  it("reports DSL107 when the contract default differs from code", () => {
    const findings = compareProps(
      {
        disabled: {
          type: "boolean",
          required: false,
          default: false,
        },
      },
      {
        disabled: {
          kind: "primitive",
          type: "boolean",
          required: false,
          default: true,
        },
      },
    );

    expect(findings[0]).toMatchObject({
      ruleId: "DSL107",
      severity: "error",
      prop: "disabled",
      expected: false,
      actual: true,
    });
  });

  it("does not report DSL107 when defaults match", () => {
    const findings = compareProps(
      {
        variant: {
          values: ["primary", "secondary"],
          required: false,
          default: "primary",
        },
      },
      {
        variant: {
          kind: "values",
          values: ["primary", "secondary"],
          required: false,
          default: "primary",
        },
      },
    );

    expect(findings).toEqual([]);
  });
});
