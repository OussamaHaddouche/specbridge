import fs from "node:fs";
import path from "node:path";

export function findContractPaths(
  rootPath: string,
  pattern: string,
): string[] {
  const matches = fs.globSync(pattern, { cwd: rootPath });

  return matches
    .map((match) => path.join(rootPath, match))
    .sort((left, right) => left.localeCompare(right));
}

export function componentNameFromContractPath(contractPath: string): string {
  const fileName = path.basename(contractPath);
  return fileName.replace(/\.contract\.json$/i, "");
}
