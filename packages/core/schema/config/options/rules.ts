export const ruleSeverityKeys = ["error", "warning"] as const;

export const ruleKeys = [
  "DSL001",
  "DSL002",
  "DSL101",
  "DSL102",
  "DSL103",
  "DSL104",
  "DSL105",
  "DSL106",
  "DSL107",
  "DSL401",
] as const;

export type RuleId = (typeof ruleKeys)[number];
export type RuleSeverity = (typeof ruleSeverityKeys)[number];

export const defaultRules: Record<RuleId, RuleSeverity> = {
  DSL001: "error",
  DSL002: "error",
  DSL101: "error",
  DSL102: "error",
  DSL103: "error",
  DSL104: "error",
  DSL105: "warning",
  DSL106: "warning",
  DSL107: "error",
  DSL401: "error",
};
