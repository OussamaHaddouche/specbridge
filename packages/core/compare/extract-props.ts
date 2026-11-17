import ts from "typescript";
import { getSourceFile } from "../typescript/get-source-file";

export type CodeProp =
  | {
      kind: "primitive";
      type: "string" | "number" | "boolean";
      required: boolean;
      default?: string | number | boolean;
    }
  | {
      kind: "values";
      values: string[];
      required: boolean;
      default?: string | number | boolean;
    }
  | {
      kind: "unknown";
      required: boolean;
      default?: string | number | boolean;
    };

export type CodeProps = Record<string, CodeProp>;

function isStringLiteralType(type: ts.Type): type is ts.StringLiteralType {
  return (type.flags & ts.TypeFlags.StringLiteral) !== 0;
}

function isBooleanLiteralType(type: ts.Type): boolean {
  return (type.flags & ts.TypeFlags.BooleanLiteral) !== 0;
}

function classifyNonUnion(type: ts.Type, required: boolean): CodeProp {
  if (isStringLiteralType(type)) {
    return {
      kind: "values",
      values: [type.value],
      required,
    };
  }

  if (
    (type.flags & ts.TypeFlags.Boolean) !== 0 ||
    isBooleanLiteralType(type)
  ) {
    return { kind: "primitive", type: "boolean", required };
  }

  if ((type.flags & ts.TypeFlags.String) !== 0) {
    return { kind: "primitive", type: "string", required };
  }

  if ((type.flags & ts.TypeFlags.Number) !== 0) {
    return { kind: "primitive", type: "number", required };
  }

  return { kind: "unknown", required };
}

function classifyType(type: ts.Type, required: boolean): CodeProp {
  if (!type.isUnion()) {
    const hadUndefined = (type.flags & ts.TypeFlags.Undefined) !== 0;
    if (hadUndefined) {
      return { kind: "unknown", required: false };
    }
    return classifyNonUnion(type, required);
  }

  const members = type.types.filter(
    (member) => (member.flags & ts.TypeFlags.Undefined) === 0,
  );
  const hadUndefined = members.length !== type.types.length;
  const isRequired = required && !hadUndefined;

  if (members.length === 0) {
    return { kind: "unknown", required: false };
  }

  if (members.length === 1) {
    return classifyNonUnion(members[0]!, isRequired);
  }

  if (members.every(isStringLiteralType)) {
    return {
      kind: "values",
      values: members.map((member) => member.value),
      required: isRequired,
    };
  }

  if (members.every(isBooleanLiteralType)) {
    return { kind: "primitive", type: "boolean", required: isRequired };
  }

  return { kind: "unknown", required: isRequired };
}

function isPropRequired(symbol: ts.Symbol): boolean {
  return (symbol.flags & ts.SymbolFlags.Optional) === 0;
}

type ExtractPropsOptions = {
  program: ts.Program;
  checker: ts.TypeChecker;
  sourcePath: string;
  propsType: string;
};

export function extractProps({
  program,
  checker,
  sourcePath,
  propsType,
}: ExtractPropsOptions): CodeProps {
  const sourceFile = getSourceFile(program, sourcePath);
  if (!sourceFile) {
    throw new Error(`Source file not in TypeScript program: ${sourcePath}`);
  }

  const symbol = checker.resolveName(
    propsType,
    sourceFile,
    ts.SymbolFlags.Type,
    false,
  );
  if (!symbol) {
    throw new Error(`Props type not found: ${propsType}`);
  }

  const type = checker.getDeclaredTypeOfSymbol(symbol);
  const props: CodeProps = {};

  for (const property of checker.getPropertiesOfType(type)) {
    const propertyType = checker.getTypeOfSymbolAtLocation(
      property,
      property.valueDeclaration ?? sourceFile,
    );

    props[property.getName()] = classifyType(
      propertyType,
      isPropRequired(property),
    );
  }

  return props;
}
