import path from "node:path";
import ts from "typescript";

function samePath(left: string, right: string): boolean {
  return (
    path.normalize(left).toLowerCase() === path.normalize(right).toLowerCase()
  );
}

export function getSourceFile(
  program: ts.Program,
  sourcePath: string,
): ts.SourceFile | undefined {
  return (
    program.getSourceFile(sourcePath) ??
    program
      .getSourceFiles()
      .find((sourceFile) => samePath(sourceFile.fileName, sourcePath))
  );
}
