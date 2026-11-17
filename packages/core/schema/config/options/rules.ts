export const ruleSeverityKeys = ["error", "warning"] as const;

export const ruleKeys = [
  "SPB001",
  "SPB002",
  "SPB101",
  "SPB102",
  "SPB103",
  "SPB104",
  "SPB105",
  "SPB106",
  "SPB107",
  "SPB401",
] as const;

export type RuleId = (typeof ruleKeys)[number];
export type RuleSeverity = (typeof ruleSeverityKeys)[number];

export const defaultRules: Record<RuleId, RuleSeverity> = {
  SPB001: "error",
  SPB002: "error",
  SPB101: "error",
  SPB102: "error",
  SPB103: "error",
  SPB104: "error",
  SPB105: "warning",
  SPB106: "warning",
  SPB107: "error",
  SPB401: "error",
};
