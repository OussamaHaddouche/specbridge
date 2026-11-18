# Project config

DsLint reads `dslint.config.json` from the project root.

The file sets where contracts live, which TypeScript config to use, and how strict the run is.

Component files are not listed here. Each contract points at its file with `resolve`. See [resolve.md](./resolve.md).

## Example

`dslint.config.json`:

```json
{
  "contracts": "contracts/**/*.contract.json",
  "typescript": {
    "tsconfig": "tsconfig.json"
  },
  "rules": {
    "DSL105": "warning",
    "DSL106": "warning"
  },
  "failOn": "error"
}
```

## Fields

| Field | Required | Default | Meaning |
| --- | --- | --- | --- |
| `contracts` | Yes | (none) | Glob for contract files |
| `typescript.tsconfig` | No | `tsconfig.json` | TypeScript config used to read types |
| `rules` | No | see [rules.md](./rules.md) | Override severity per rule ID (`error` or `warning`) |
| `failOn` | No | `error` | Severities at this level or above fail the run |

`contracts` has no default. If it is missing, DsLint exits with code `2`.

## Paths and defaults

- Paths and globs resolve from the project root (the directory that contains `dslint.config.json`)
- If you omit `typescript`, DsLint uses `tsconfig.json`
- If you omit `failOn`, warnings are reported but do not fail the run

Contract files: [contract-format.md](./contract-format.md).  
How components are resolved: [resolve.md](./resolve.md).  
Rule IDs: [rules.md](./rules.md).
