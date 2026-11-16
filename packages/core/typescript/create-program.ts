import path from "node:path";
import ts from "typescript";
import { fatalError } from "../loader/fatal-error";

export type TypeScriptProject = {
  program: ts.Program;
  checker: ts.TypeChecker;
};

type CreateProgramOptions = {
  rootPath: string;
  tsconfigPath: string;
};

export function createProgram({
  rootPath,
  tsconfigPath,
}: CreateProgramOptions): TypeScriptProject {
  const configPath = path.isAbsolute(tsconfigPath)
    ? tsconfigPath
    : path.join(rootPath, tsconfigPath);

  const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
  if (configFile.error) {
    const message = ts.flattenDiagnosticMessageText(
      configFile.error.messageText,
      "\n",
    );
    throw fatalError(
      "TSCONFIG_INVALID",
      `Could not read TypeScript config at ${configPath}: ${message}`,
    );
  }

  const parsed = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    rootPath,
    undefined,
    configPath,
  );

  if (parsed.errors.length > 0) {
    const message = parsed.errors
      .map((error) => ts.flattenDiagnosticMessageText(error.messageText, "\n"))
      .join("\n");
    throw fatalError(
      "TSCONFIG_INVALID",
      `Invalid TypeScript config at ${configPath}: ${message}`,
    );
  }

  const program = ts.createProgram({
    rootNames: parsed.fileNames,
    options: parsed.options,
  });

  return {
    program,
    checker: program.getTypeChecker(),
  };
}
