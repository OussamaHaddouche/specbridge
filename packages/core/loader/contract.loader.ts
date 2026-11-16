import fs from "node:fs";
import { ZodError } from "zod";
import {
  contractSchemaV1,
  type ContractV1,
} from "../schema/contract/contract.schema";
import { fatalError, isErrnoException } from "./fatal-error";

export function loadContract(contractPath: string): ContractV1 {
  try {
    const raw: unknown = JSON.parse(fs.readFileSync(contractPath, "utf8"));
    return contractSchemaV1.parse(raw);
  } catch (error) {
    if (isErrnoException(error) && error.code === "ENOENT") {
      throw fatalError(
        "CONTRACT_NOT_FOUND",
        `Contract file not found: ${contractPath}`,
      );
    }

    if (error instanceof SyntaxError) {
      throw fatalError(
        "CONTRACT_INVALID",
        `Contract file is not valid JSON: ${contractPath}`,
      );
    }

    if (error instanceof ZodError) {
      throw fatalError("CONTRACT_INVALID", error.message);
    }

    const message =
      error instanceof Error ? error.message : "Unknown contract error";
    throw fatalError("CONTRACT_INVALID", message);
  }
}
