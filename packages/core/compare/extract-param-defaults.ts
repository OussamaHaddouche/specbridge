import ts from "typescript";
import { getSourceFile } from "../typescript/get-source-file";

export type ParamDefaults = Record<string, string | number | boolean>;

type ExtractParamDefaultsOptions = {
  program: ts.Program;
  checker: ts.TypeChecker;
  sourcePath: string;
  exportName: string;
};

function literalValue(
  node: ts.Expression,
): string | number | boolean | undefined {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text;
  }

  if (ts.isNumericLiteral(node)) {
    return Number(node.text);
  }

  if (
    ts.isPrefixUnaryExpression(node) &&
    node.operator === ts.SyntaxKind.MinusToken &&
    ts.isNumericLiteral(node.operand)
  ) {
    return -Number(node.operand.text);
  }

  if (node.kind === ts.SyntaxKind.TrueKeyword) {
    return true;
  }

  if (node.kind === ts.SyntaxKind.FalseKeyword) {
    return false;
  }

  return undefined;
}

function bindingPropName(element: ts.BindingElement): string | undefined {
  if (element.propertyName !== undefined) {
    if (ts.isIdentifier(element.propertyName)) {
      return element.propertyName.text;
    }
    return undefined;
  }

  if (ts.isIdentifier(element.name)) {
    return element.name.text;
  }

  return undefined;
}

function defaultsFromBindingPattern(
  pattern: ts.ObjectBindingPattern,
): ParamDefaults {
  const defaults: ParamDefaults = {};

  for (const element of pattern.elements) {
    if (element.dotDotDotToken !== undefined || element.initializer === undefined) {
      continue;
    }

    const propName = bindingPropName(element);
    if (propName === undefined) {
      continue;
    }

    const value = literalValue(element.initializer);
    if (value !== undefined) {
      defaults[propName] = value;
    }
  }

  return defaults;
}

function callableFromDeclaration(
  declaration: ts.Declaration,
): ts.SignatureDeclaration | undefined {
  if (ts.isFunctionDeclaration(declaration)) {
    return declaration;
  }

  if (
    ts.isVariableDeclaration(declaration) &&
    declaration.initializer !== undefined
  ) {
    const { initializer } = declaration;
    if (ts.isArrowFunction(initializer) || ts.isFunctionExpression(initializer)) {
      return initializer;
    }
  }

  return undefined;
}

function findExportCallable(
  checker: ts.TypeChecker,
  sourceFile: ts.SourceFile,
  exportName: string,
): ts.SignatureDeclaration | undefined {
  const moduleSymbol = checker.getSymbolAtLocation(sourceFile);
  if (!moduleSymbol) {
    return undefined;
  }

  const exportSymbol = checker
    .getExportsOfModule(moduleSymbol)
    .find((symbol) => symbol.getName() === exportName);
  if (!exportSymbol) {
    return undefined;
  }

  let symbol = exportSymbol;
  if ((symbol.flags & ts.SymbolFlags.Alias) !== 0) {
    symbol = checker.getAliasedSymbol(symbol);
  }

  for (const declaration of symbol.getDeclarations() ?? []) {
    const callable = callableFromDeclaration(declaration);
    if (callable !== undefined) {
      return callable;
    }
  }

  return undefined;
}

export function extractParamDefaults({
  program,
  checker,
  sourcePath,
  exportName,
}: ExtractParamDefaultsOptions): ParamDefaults {
  const sourceFile = getSourceFile(program, sourcePath);
  if (!sourceFile) {
    throw new Error(`Source file not in TypeScript program: ${sourcePath}`);
  }

  const callable = findExportCallable(checker, sourceFile, exportName);
  if (!callable) {
    return {};
  }

  const firstParam = callable.parameters[0];
  if (!firstParam || !ts.isObjectBindingPattern(firstParam.name)) {
    return {};
  }

  return defaultsFromBindingPattern(firstParam.name);
}
