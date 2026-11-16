export type CheckArgs = {
  format: "text" | "json";
  output: string | undefined;
};

export type ParseArgsResult =
  | { ok: true; value: CheckArgs }
  | { ok: false; message: string };

export function parseArgs(argv: string[]): ParseArgsResult {
  const [command, ...rest] = argv;

  if (command === undefined) {
    return { ok: false, message: "Missing command. Try: specbridge check" };
  }

  if (command !== "check") {
    return { ok: false, message: `Unknown command: ${command}` };
  }

  let format: CheckArgs["format"] = "text";
  let output: string | undefined;

  for (let i = 0; i < rest.length; i += 1) {
    const arg = rest[i];

    switch (arg) {
      case "--format": {
        const value = rest[i + 1];
        if (value !== "text" && value !== "json") {
          return {
            ok: false,
            message: "Invalid --format. Use text or json.",
          };
        }
        format = value;
        i += 1;
        break;
      }
      case "--output": {
        const value = rest[i + 1];
        if (value === undefined) {
          return { ok: false, message: "Missing value for --output" };
        }
        output = value;
        i += 1;
        break;
      }
      default:
        return { ok: false, message: `Unknown option: ${arg}` };
    }
  }

  return { ok: true, value: { format, output } };
}
