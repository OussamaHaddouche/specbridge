import ts from "typescript";
import { compareProps } from "../compare/compare-props";
import { extractParamDefaults } from "../compare/extract-param-defaults";
import { extractProps, type CodeProps } from "../compare/extract-props";
import { type Config } from "../schema/config/config.schema";
import { type ContractV1 } from "../schema/contract/contract.schema";
import { resolveComponent } from "../resolver/component.resolver";
import { type ReportComponent } from "./report";

type CheckContractOptions = {
  rootPath: string;
  program: ts.Program;
  checker: ts.TypeChecker;
  name: string;
  rules: Config["rules"];
};

function mergeParamDefaults(
  codeProps: CodeProps,
  defaults: Record<string, string | number | boolean>,
): CodeProps {
  const merged: CodeProps = { ...codeProps };

  for (const [propName, value] of Object.entries(defaults)) {
    const codeProp = merged[propName];
    if (codeProp !== undefined) {
      merged[propName] = { ...codeProp, default: value };
    }
  }

  return merged;
}

export function checkContract(
  contract: ContractV1,
  { rootPath, program, checker, name, rules }: CheckContractOptions,
): ReportComponent {
  const resolved = resolveComponent(contract.resolve, {
    rootPath,
    program,
    checker,
    rules,
  });

  if (!resolved.ok) {
    return {
      name,
      source: contract.resolve.source,
      findings: [resolved.finding],
    };
  }

  const codeProps = extractProps({
    program,
    checker,
    sourcePath: resolved.component.sourcePath,
    propsType: resolved.component.propsType,
  });

  const paramDefaults = extractParamDefaults({
    program,
    checker,
    sourcePath: resolved.component.sourcePath,
    exportName: resolved.component.exportName,
  });

  return {
    name,
    source: contract.resolve.source,
    findings: compareProps(
      contract.props,
      mergeParamDefaults(codeProps, paramDefaults),
      rules,
    ),
  };
}
