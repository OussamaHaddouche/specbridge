import { z } from "zod";
import { defaultRules, ruleKeys, ruleSeverityKeys } from "./options/rules";

const failOnKeys = ["error", "warning"] as const;

export const defaultConfig = {
  typescript: {
    tsconfig: "tsconfig.json",
  },
  failOn: "error" as const,
  rules: defaultRules,
};

export const userConfigSchema = z.strictObject({
  contracts: z.string(),
  typescript: z
    .object({
      tsconfig: z.string(),
    })
    .optional(),
  rules: z.partialRecord(z.enum(ruleKeys), z.enum(ruleSeverityKeys)).optional(),
  failOn: z.enum(failOnKeys).optional(),
});

export const configSchema = z.strictObject({
  contracts: z.string(),
  typescript: z.object({
    tsconfig: z.string(),
  }),
  rules: z.record(z.enum(ruleKeys), z.enum(ruleSeverityKeys)),
  failOn: z.enum(failOnKeys),
});

export type UserConfig = z.infer<typeof userConfigSchema>;
export type Config = z.infer<typeof configSchema>;
