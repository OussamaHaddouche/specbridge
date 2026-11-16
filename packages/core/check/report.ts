import { type Finding } from "../findings/create-finding";
import packageJson from "../package.json" with { type: "json" };

export const REPORT_SCHEMA_VERSION = 1;
export const TOOL_VERSION = packageJson.version;

export type ReportComponent = {
  name: string;
  source: string;
  findings: Finding[];
};

export type Report = {
  schemaVersion: typeof REPORT_SCHEMA_VERSION;
  toolVersion: string;
  summary: {
    checked: number;
    errors: number;
    warnings: number;
  };
  components: ReportComponent[];
};

export function buildReport(components: ReportComponent[]): Report {
  let errors = 0;
  let warnings = 0;

  for (const component of components) {
    for (const finding of component.findings) {
      if (finding.severity === "error") {
        errors += 1;
      } else {
        warnings += 1;
      }
    }
  }

  return {
    schemaVersion: REPORT_SCHEMA_VERSION,
    toolVersion: TOOL_VERSION,
    summary: {
      checked: components.length,
      errors,
      warnings,
    },
    components,
  };
}
