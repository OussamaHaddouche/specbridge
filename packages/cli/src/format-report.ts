import type { Report } from "@dslint/core";

export function formatReport(
  report: Report,
  format: "text" | "json" | "markdown",
): string {
  switch (format) {
    case "json":
      return `${JSON.stringify(report, null, 2)}\n`;
    case "text":
      return formatText(report);
    case "markdown":
      return formatMarkdown(report);
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

  lines.push("");
  lines.push(summaryLine(report));
  lines.push("");

  return lines.join("\n");
}

function formatMarkdown(report: Report): string {
  const lines: string[] = ["# DsLint report", ""];

  for (const component of report.components) {
    lines.push(`## ${component.name}`);
    lines.push("");
    lines.push(`\`${component.source}\``);
    lines.push("");

    if (component.findings.length === 0) {
      lines.push("- ok");
      lines.push("");
      continue;
    }

    for (const finding of component.findings) {
      const prop = finding.prop ? ` \`${finding.prop}\`` : "";
      lines.push(
        `- **${finding.severity}** \`${finding.ruleId}\`${prop}: ${finding.message}`,
      );
    }
    lines.push("");
  }

  lines.push(summaryLine(report));
  lines.push("");

  return lines.join("\n");
}

function summaryLine(report: Report): string {
  const { checked, errors, warnings } = report.summary;
  return `Checked ${checked} · ${plural(errors, "error")} · ${plural(warnings, "warning")}`;
}

function plural(count: number, word: string): string {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}
