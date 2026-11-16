import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadContract } from "./contract.loader";
import { FatalLoadError } from "./fatal-error";

const fixturesDir = path.join(import.meta.dirname, "__fixtures__", "contract");

const validContractDir = path.join(fixturesDir, "valid");
const invalidContractDir = path.join(fixturesDir, "invalid");

function expectContractInvalid(contractPath: string) {
  try {
    loadContract(contractPath);
    expect.unreachable();
  } catch (error) {
    expect(error).toBeInstanceOf(FatalLoadError);
    expect(error).toMatchObject({ code: "CONTRACT_INVALID" });
  }
}

describe("loadContract", () => {
  it("parses a valid contract file", () => {
    const contract = loadContract(
      path.join(validContractDir, "Button.contract.json"),
    );

    expect(contract.schemaVersion).toBe(1);
    expect(contract.resolve).toEqual({
      source: "src/components/Button/Button.tsx",
      exportName: "Button",
      propsType: "ButtonProps",
    });
    expect(contract.props.variant).toEqual({
      values: ["primary", "secondary", "danger"],
      required: false,
      default: "primary",
    });
    expect(contract.props.label).toEqual({
      type: "string",
      required: true,
    });
  });

  it("throws CONTRACT_INVALID when a prop has both type and values", () => {
    expectContractInvalid(
      path.join(invalidContractDir, "both-type-and-values.contract.json"),
    );
  });

  it("throws CONTRACT_INVALID when a prop has neither type nor values", () => {
    expectContractInvalid(
      path.join(invalidContractDir, "neither-type-nor-values.contract.json"),
    );
  });

  it("throws CONTRACT_INVALID when default is not one of values", () => {
    expectContractInvalid(
      path.join(invalidContractDir, "default-not-in-values.contract.json"),
    );
  });

  it("throws CONTRACT_INVALID when default does not match type", () => {
    expectContractInvalid(
      path.join(invalidContractDir, "default-wrong-type.contract.json"),
    );
  });

  it("throws CONTRACT_INVALID when values is empty", () => {
    expectContractInvalid(
      path.join(invalidContractDir, "empty-values.contract.json"),
    );
  });

  it("throws CONTRACT_INVALID when a required resolve field is missing", () => {
    expectContractInvalid(
      path.join(invalidContractDir, "missing-required-property.contract.json"),
    );
  });

  it("throws CONTRACT_INVALID when an unknown property is present", () => {
    expectContractInvalid(
      path.join(invalidContractDir, "unknown-property.contract.json"),
    );
  });

  it("throws CONTRACT_NOT_FOUND when the file does not exist", () => {
    try {
      loadContract(path.join(fixturesDir, "does-not-exist.json"));
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(FatalLoadError);
      expect(error).toMatchObject({ code: "CONTRACT_NOT_FOUND" });
    }
  });
});
