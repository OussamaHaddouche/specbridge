import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import { createFinding, type Finding } from "../findings/create-finding";
import { type Config } from "../schema/config/config.schema";
import { defaultRules } from "../schema/config/options/rules";
import { type ContractV1 } from "../schema/contract/contract.schema";
import { getSourceFile } from "../typescript/get-source-file";

type ResolveComponentOptions = {
  rootPath: string;
  program: ts.Program;
  checker: ts.TypeChecker;
  rules?: Config["rules"];
};

export type ResolvedComponent = {
  sourcePath: string;
  exportName: string;
  propsType: string;
};

export type ResolveComponentResult =
  | { ok: true; component: ResolvedComponent }
  | { ok: false; finding: Finding };

function hasNamedExport(
  checker: ts.TypeChecker,
  sourceFile: ts.SourceFile,
  exportName: string,
): boolean {
  const moduleSymbol = checker.getSymbolAtLocation(sourceFile);
  if (!moduleSymbol) {
    return false;
  }

  return checker
    .getExportsOfModule(moduleSymbol)
    .some((symbol) => symbol.getName() === exportName);
}

function hasPropsType(
  checker: ts.TypeChecker,
  sourceFile: ts.SourceFile,
  propsType: string,
): boolean {
  const symbol = checker.resolveName(
    propsType,
    sourceFile,
    ts.SymbolFlags.Type,
    false,
  );

  if (!symbol) {
    return false;
  }

  checker.getDeclaredTypeOfSymbol(symbol);
  return true;
}

export function resolveComponent(
  resolveOptions: ContractV1["resolve"],
  { rootPath, program, checker, rules = defaultRules }: ResolveComponentOptions,
): ResolveComponentResult {
  const sourcePath = path.join(rootPath, resolveOptions.source);

  if (!fs.existsSync(sourcePath)) {
    return {
      ok: false,
      finding: createFinding(
        {
          ruleId: "DSL001",
          message: `Source file not found: ${resolveOptions.source}`,
          expected: resolveOptions.source,
        },
        rules,
      ),
    };
  }

  const sourceFile = getSourceFile(program, sourcePath);
  if (!sourceFile) {
    return {
      ok: false,
      finding: createFinding(
        {
          ruleId: "DSL001",
          message: `Source file is not part of the TypeScript project: ${resolveOptions.source}`,
          expected: resolveOptions.source,
        },
        rules,
      ),
    };
  }

  if (!hasNamedExport(checker, sourceFile, resolveOptions.exportName)) {
    return {
      ok: false,
      finding: createFinding(
        {
          ruleId: "DSL001",
          message: `Export not found: ${resolveOptions.exportName}`,
          expected: resolveOptions.exportName,
        },
        rules,
      ),
    };
  }

  if (!hasPropsType(checker, sourceFile, resolveOptions.propsType)) {
    return {
      ok: false,
      finding: createFinding(
        {
          ruleId: "DSL002",
          message: `Props type not found: ${resolveOptions.propsType}`,
          expected: resolveOptions.propsType,
        },
        rules,
      ),
    };
  }

  return {
    ok: true,
    component: {
      sourcePath,
      exportName: resolveOptions.exportName,
      propsType: resolveOptions.propsType,
    },
  };
}
