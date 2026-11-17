# SpecBridge

**v0.1.0** · runnable from this monorepo (not on npm yet)

SpecBridge checks that design-system components still match what the team agreed on. It targets React + TypeScript component libraries first.

Example: the team agreed `Button` has variants `primary`, `secondary`, and `danger`. Someone removes `danger` from the TypeScript props. SpecBridge fails the check and points at the mismatch, in local development or CI, before that drift ships.

## What you do

1. Write one contract file per component, named after it (`Button.contract.json`), with a `resolve` block that points at the file, export, and props type.
2. Add `specbridge.config.json` at the project root and point it at your contracts.
3. Run `specbridge check`.

SpecBridge reads the props type you named and compares it to the contract.

## What a contract looks like

`contracts/Button.contract.json`:

```json
{
  "schemaVersion": 1,
  "resolve": {
    "source": "src/components/Button/Button.tsx",
    "exportName": "Button",
    "propsType": "ButtonProps"
  },
  "props": {
    "variant": {
      "values": ["primary", "secondary", "danger"],
      "required": false,
      "default": "primary"
    },
    "disabled": {
      "type": "boolean",
      "required": false,
      "default": false
    }
  }
}
```

That file means:

- Check `Button` / `ButtonProps` in `src/components/Button/Button.tsx`
- `variant` may be `primary`, `secondary`, or `danger`
- `disabled` is an optional boolean

More detail: [docs/contract-format.md](docs/contract-format.md).

## What SpecBridge reports

When code no longer matches the contract, you get a finding such as:

- the component could not be resolved from `resolve`
- a prop from the contract is missing in code
- an allowed value like `danger` disappeared
- a public prop exists in code but not in the contract (warning by default)

Rule list: [docs/rules.md](docs/rules.md).  
Findings / JSON report: [docs/findings.md](docs/findings.md).  
Project config: [docs/config.md](docs/config.md).  
How resolve works: [docs/resolve.md](docs/resolve.md).

## Commands

After `pnpm install` at the repo root:

```bash
pnpm specbridge check
pnpm specbridge check --format json --output .specbridge/report.json
```

| Code | Meaning |
| --- | --- |
| `0` | No failing findings (per `failOn`) |
| `1` | Failing findings |
| `2` | SpecBridge could not run (bad config, and similar) |

Findings / JSON report: [docs/findings.md](docs/findings.md).

## What this is not

- Not a Figma pixel comparison tool
- Not a replacement for TypeScript, ESLint, or visual regression
- Not trying to support every UI framework on day one

## Status

[v0.1.0](https://github.com/OussamaHaddouche/specbridge/releases/tag/v0.1.0) includes `@specbridge/cli` 0.1.0 and `@specbridge/core` 0.2.0. SpecBridge loads contracts, resolves components, compares TypeScript props, and prints text or JSON.

Next up is an in-repo showcase: a small React example, docs walkthrough, and CI. See [docs/roadmap.md](docs/roadmap.md).

## License

MIT. See [LICENSE](LICENSE).
