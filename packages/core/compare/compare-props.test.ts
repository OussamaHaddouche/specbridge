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

  it("reports SPB101 when a contract prop is missing in code", () => {
    const findings = compareProps(
      { label: { type: "string", required: true } },
      {},
    );

    expect(findings).toEqual([
      {
        ruleId: "SPB101",
        severity: "error",
        prop: "label",
        message: 'Prop "label" is listed in the contract but missing in code.',
        expected: "label",
      },
    ]);
  });

  it("reports SPB102 when types differ", () => {
    const findings = compareProps(
      { count: { type: "number", required: true } },
      { count: { kind: "primitive", type: "string", required: true } },
    );

    expect(findings[0]).toMatchObject({
      ruleId: "SPB102",
      prop: "count",
      expected: { type: "number" },
      actual: { type: "string" },
    });
  });

  it("reports SPB103 when required does not match", () => {
    const findings = compareProps(
      { disabled: { type: "boolean", required: false } },
      { disabled: { kind: "primitive", type: "boolean", required: true } },
    );

    expect(findings[0]).toMatchObject({
      ruleId: "SPB103",
      prop: "disabled",
      expected: false,
      actual: true,
    });
  });

  it("reports SPB104 when a contract value is missing in code", () => {
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
        ruleId: "SPB104",
        severity: "error",
        prop: "variant",
        message: 'Allowed value "danger" is missing in code.',
        expected: ["primary", "secondary", "danger"],
        actual: ["primary", "secondary"],
      },
    ]);
  });

  it("reports SPB105 when code has an extra prop", () => {
    const findings = compareProps(
      {},
      { className: { kind: "primitive", type: "string", required: false } },
    );

    expect(findings[0]).toMatchObject({
      ruleId: "SPB105",
      severity: "warning",
      prop: "className",
    });
  });

  it("reports SPB106 when code allows an extra value", () => {
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
      ruleId: "SPB106",
      severity: "warning",
      prop: "variant",
      message:
        'Value "ghost" is allowed in code but not listed in the contract.',
    });
  });

  it("reports SPB107 when the contract default is missing in code", () => {
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
      ruleId: "SPB107",
      severity: "error",
      prop: "variant",
      expected: "primary",
    });
  });

  it("reports SPB107 when the contract default differs from code", () => {
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
      ruleId: "SPB107",
      severity: "error",
      prop: "disabled",
      expected: false,
      actual: true,
    });
  });

  it("does not report SPB107 when defaults match", () => {
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
