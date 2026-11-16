import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadConfig } from "./config.loader";
import { FatalLoadError } from "./fatal-error";

const fixturesDir = path.join(import.meta.dirname, "__fixtures__", "config");

const validConfigDir = path.join(fixturesDir, "valid");
const invalidConfigDir = path.join(fixturesDir, "invalid");

describe("loadConfig", () => {
  it("parses a valid config file and fills defaults", () => {
    const config = loadConfig(
      path.join(validConfigDir, "specbridge.config.json"),
    );

    expect(config.contracts).toBe("contracts/**/*.contract.json");
    expect(config.typescript).toEqual({ tsconfig: "tsconfig.json" });
    expect(config.failOn).toBe("error");
    expect(config.rules.SPB105).toBe("error");
    expect(config.rules.SPB001).toBe("error");
  });

  it("throws CONFIG_INVALID when required contracts is missing", () => {
    try {
      loadConfig(
        path.join(
          invalidConfigDir,
          "missing-required-property.specbridge.config.json",
        ),
      );
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(FatalLoadError);
      expect(error).toMatchObject({ code: "CONFIG_INVALID" });
    }
  });

  it("throws CONFIG_INVALID when a rule id does not exist", () => {
    try {
      loadConfig(
        path.join(invalidConfigDir, "unknown-rule.specbridge.config.json"),
      );
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(FatalLoadError);
      expect(error).toMatchObject({ code: "CONFIG_INVALID" });
    }
  });

  it("throws CONFIG_INVALID when failOn has an invalid value", () => {
    try {
      loadConfig(
        path.join(invalidConfigDir, "invalid-failOn.specbridge.config.json"),
      );
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(FatalLoadError);
      expect(error).toMatchObject({ code: "CONFIG_INVALID" });
    }
  });

  it("throws CONFIG_INVALID when an unknown property is present", () => {
    try {
      loadConfig(
        path.join(
          invalidConfigDir,
          "unknown-property.specbridge.config.json",
        ),
      );
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(FatalLoadError);
      expect(error).toMatchObject({ code: "CONFIG_INVALID" });
    }
  });

  it("throws CONFIG_NOT_FOUND when the file does not exist", () => {
    try {
      loadConfig(path.join(fixturesDir, "does-not-exist.json"));
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(FatalLoadError);
      expect(error).toMatchObject({ code: "CONFIG_NOT_FOUND" });
    }
  });
});
