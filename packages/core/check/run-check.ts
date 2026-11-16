import path from "node:path";
import { loadConfig } from "../loader/config.loader";
import { loadContract } from "../loader/contract.loader";
import { createProgram } from "../typescript/create-program";
import { checkContract } from "./check-contract";
import {
  componentNameFromContractPath,
  findContractPaths,
} from "./find-contracts";
import { buildReport, type Report } from "./report";

export function runCheck(rootPath: string): Report {
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

  return buildReport(components);
}
