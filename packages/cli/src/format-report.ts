import type { Report } from "@specbridge/core";

export function formatReport(
  report: Report,
  format: "text" | "json",
): string {
  switch (format) {
    case "json":
      return `${JSON.stringify(report, null, 2)}\n`;
    case "text":
      return formatText(report);
    default: {
      const _exhaustive: never = format;
      return _exhaustive;
    }
  }
}

function formatText(report: Report): string {
  const lines: string[] = [];

  for (const component of report.components) {
    lines.push(`${component.name} (${component.source})`);

    if (component.findings.length === 0) {
      lines.push("  ok");
      continue;
    }

    for (const finding of component.findings) {
      const prop = finding.prop ? ` ${finding.prop}` : "";
      lines.push(
        `  ${finding.severity} ${finding.ruleId}${prop}: ${finding.message}`,
      );
    }
  }

  const { checked, errors, warnings } = report.summary;
  lines.push("");
  lines.push(
    `Checked ${checked} · ${plural(errors, "error")} · ${plural(warnings, "warning")}`,
  );
  lines.push("");

  return lines.join("\n");
}

function plural(count: number, word: string): string {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}
