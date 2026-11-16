import path from "node:path";
import { loadConfig } from "../loader/config.loader";
import { loadContract } from "../loader/contract.loader";
import type { Config } from "../schema/config/config.schema";
import { createProgram } from "../typescript/create-program";
import { checkContract } from "./check-contract";
import {
  componentNameFromContractPath,
  findContractPaths,
} from "./find-contracts";
import { buildReport, type Report } from "./report";

export type CheckResult = {
  report: Report;
  failed: boolean;
};

export function runCheck(rootPath: string): CheckResult {
  const config = loadConfig(path.join(rootPath, "specbridge.config.json"));
  const contractPaths = findContractPaths(rootPath, config.contracts);
  const { program, checker } = createProgram({
    rootPath,
    tsconfigPath: config.typescript.tsconfig,
  });

  const components = contractPaths.map((contractPath) => {
    const contract = loadContract(contractPath);
    return checkContract(contract, {
      rootPath,
      program,
      checker,
      name: componentNameFromContractPath(contractPath),
      rules: config.rules,
    });
  });

  const report = buildReport(components);
  return {
    report,
    failed: isFailing(report, config.failOn),
  };
}

export function isFailing(
  report: Report,
  failOn: Config["failOn"],
): boolean {
  switch (failOn) {
    case "warning":
      return report.summary.errors > 0 || report.summary.warnings > 0;
    case "error":
      return report.summary.errors > 0;
    default: {
      const _exhaustive: never = failOn;
      return _exhaustive;
    }
  }
}
