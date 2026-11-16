import fs from "node:fs";
import { ZodError } from "zod";
import {
  configSchema,
  defaultConfig,
  userConfigSchema,
  type Config,
  type UserConfig,
} from "../schema/config/config.schema";
import { fatalError, isErrnoException } from "./fatal-error";

function mergeConfig(userConfig: UserConfig): Config {
  return configSchema.parse({
    ...defaultConfig,
    ...userConfig,
    rules: {
      ...defaultConfig.rules,
      ...userConfig.rules,
    },
    typescript: {
      ...defaultConfig.typescript,
      ...userConfig.typescript,
    },
  });
}

export function loadConfig(configPath: string): Config {
  try {
    const raw: unknown = JSON.parse(fs.readFileSync(configPath, "utf8"));
    const user = userConfigSchema.parse(raw);
    return mergeConfig(user);
  } catch (error) {
    if (isErrnoException(error) && error.code === "ENOENT") {
      throw fatalError(
        "CONFIG_NOT_FOUND",
        `Config file not found: ${configPath}`,
      );
    }

    if (error instanceof SyntaxError) {
      throw fatalError(
        "CONFIG_INVALID",
        `Config file is not valid JSON: ${configPath}`,
      );
    }

    if (error instanceof ZodError) {
      throw fatalError("CONFIG_INVALID", error.message);
    }

    const message =
      error instanceof Error ? error.message : "Unknown config error";
    throw fatalError("CONFIG_INVALID", message);
  }
}
