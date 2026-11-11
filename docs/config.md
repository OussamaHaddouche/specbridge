# Project config

SpecBridge reads **`specbridge.config.json`** from the project root by default.

This file tells SpecBridge where contracts live, how to load TypeScript types, and how strict the run should be.

Component files are **not** discovered from config. Each contract points at its file via `resolve` — see [resolve.md](./resolve.md).

## Example

`specbridge.config.json`:

```json
{
  "contracts": "contracts/**/*.contract.json",
  "typescript": {
    "tsconfig": "tsconfig.json"
  },
  "rules": {
    "SPB105": "warning",
    "SPB106": "warning"
  },
  "failOn": "error"
}
```

## Fields

| Field | Required | Default | Meaning |
|---|---|---|---|
| `contracts` | Yes | — | Glob for contract files |
| `typescript.tsconfig` | No | `tsconfig.json` | TypeScript config used to read types |
| `rules` | No | see [rules.md](./rules.md) | Override severity per rule ID (`error` or `warning`) |
| `failOn` | No | `error` | Severities at this level or above fail the run |

There is **no default** for `contracts`. If it is missing, SpecBridge cannot run (exit code `2`).

## Notes

- Paths and globs are resolved from the project root (the directory that contains `specbridge.config.json`).
- Omitting `typescript` is fine; SpecBridge uses `tsconfig.json`.
- Omitting `failOn` is fine; warnings are reported but do not fail the run unless you change that.

Contract files: [contract-format.md](./contract-format.md).  
How components are resolved: [resolve.md](./resolve.md).  
Rule IDs: [rules.md](./rules.md).
