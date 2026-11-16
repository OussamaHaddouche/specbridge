import { createFinding, type Finding } from "../findings/create-finding";
import { defaultRules } from "../schema/config/options/rules";
import { type Config } from "../schema/config/config.schema";
import { type ContractV1 } from "../schema/contract/contract.schema";
import { type CodeProp, type CodeProps } from "./extract-props";

type ContractProp = ContractV1["props"][string];
type Rules = Config["rules"];

function isValuesContractProp(
  prop: ContractProp,
): prop is Extract<ContractProp, { values: string[] }> {
  return "values" in prop;
}

function describeCodeProp(codeProp: CodeProp): unknown {
  switch (codeProp.kind) {
    case "primitive":
      return { type: codeProp.type };
    case "values":
      return { values: codeProp.values };
    case "unknown":
      return { kind: codeProp.kind };
    default: {
      const _exhaustive: never = codeProp;
      return _exhaustive;
    }
  }
}

function compareOneProp(
  propName: string,
  contractProp: ContractProp,
  codeProp: CodeProp,
  rules: Rules,
): Finding[] {
  const findings: Finding[] = [];

  if (contractProp.required !== codeProp.required) {
    findings.push(
      createFinding(
        {
          ruleId: "SPB103",
          prop: propName,
          message: `Required mismatch for prop "${propName}".`,
          expected: contractProp.required,
          actual: codeProp.required,
        },
        rules,
      ),
    );
  }

  if (isValuesContractProp(contractProp)) {
    if (codeProp.kind !== "values") {
      findings.push(
        createFinding(
          {
            ruleId: "SPB102",
            prop: propName,
            message: `Type mismatch for prop "${propName}".`,
            expected: { values: contractProp.values },
            actual: describeCodeProp(codeProp),
          },
          rules,
        ),
      );
      return findings;
    }

    for (const value of contractProp.values) {
      if (!codeProp.values.includes(value)) {
        findings.push(
          createFinding(
            {
              ruleId: "SPB104",
              prop: propName,
              message: `Allowed value "${value}" is missing in code.`,
              expected: contractProp.values,
              actual: codeProp.values,
            },
            rules,
          ),
        );
      }
    }

    for (const value of codeProp.values) {
      if (!contractProp.values.includes(value)) {
        findings.push(
          createFinding(
            {
              ruleId: "SPB106",
              prop: propName,
              message: `Value "${value}" is allowed in code but not listed in the contract.`,
              expected: contractProp.values,
              actual: codeProp.values,
            },
            rules,
          ),
        );
      }
    }

    return findings;
  }

  if (codeProp.kind !== "primitive" || codeProp.type !== contractProp.type) {
    findings.push(
      createFinding(
        {
          ruleId: "SPB102",
          prop: propName,
          message: `Type mismatch for prop "${propName}".`,
          expected: { type: contractProp.type },
          actual: describeCodeProp(codeProp),
        },
        rules,
      ),
    );
  }

  return findings;
}

export function compareProps(
  contractProps: ContractV1["props"],
  codeProps: CodeProps,
  rules: Rules = defaultRules,
): Finding[] {
  const findings: Finding[] = [];

  for (const [propName, contractProp] of Object.entries(contractProps)) {
    const codeProp = codeProps[propName];

    if (!codeProp) {
      findings.push(
        createFinding(
          {
            ruleId: "SPB101",
            prop: propName,
            message: `Prop "${propName}" is listed in the contract but missing in code.`,
            expected: propName,
          },
          rules,
        ),
      );
      continue;
    }

    findings.push(...compareOneProp(propName, contractProp, codeProp, rules));
  }

  for (const propName of Object.keys(codeProps)) {
    if (contractProps[propName] === undefined) {
      findings.push(
        createFinding(
          {
            ruleId: "SPB105",
            prop: propName,
            message: `Prop "${propName}" exists in code but is not listed in the contract.`,
            actual: propName,
          },
          rules,
        ),
      );
    }
  }

  return findings;
}
