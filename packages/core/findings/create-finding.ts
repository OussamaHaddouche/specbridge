import {
  defaultRules,
  type RuleId,
  type RuleSeverity,
} from "../schema/config/options/rules";

export type Finding = {
  ruleId: RuleId;
  severity: RuleSeverity;
  message: string;
  prop?: string;
  expected?: unknown;
  actual?: unknown;
};

type CreateFindingInput = {
  ruleId: RuleId;
  message: string;
  prop?: string;
  expected?: unknown;
  actual?: unknown;
};

export function createFinding(
  input: CreateFindingInput,
  rules: Record<RuleId, RuleSeverity> = defaultRules,
): Finding {
  const finding: Finding = {
    ruleId: input.ruleId,
    severity: rules[input.ruleId],
    message: input.message,
  };

  if (input.prop !== undefined) {
    finding.prop = input.prop;
  }
  if (input.expected !== undefined) {
    finding.expected = input.expected;
  }
  if (input.actual !== undefined) {
    finding.actual = input.actual;
  }

  return finding;
}
