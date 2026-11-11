# SpecBridge

**Blueprint · not built yet**

SpecBridge checks that your design-system components still match what the team agreed on.

Example: the team agreed `Button` has variants `primary`, `secondary`, and `danger`. Someone removes `danger` from the TypeScript props. SpecBridge fails the check and points at the mismatch — in local development or CI — before that drift ships.

It is built first for **React + TypeScript** component libraries.

## What you do

1. Write a small contract file per component, named after it (`Button.contract.json`), including a `resolve` block that points at the file, export, and props type.
2. Add `specbridge.config.json` at the project root and point it at your contracts.
3. Run `specbridge check`.

SpecBridge reads the props type you named, and compares it to the contract.

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

- check `Button` / `ButtonProps` in `src/components/Button/Button.tsx`
- `variant` may be `primary`, `secondary`, or `danger`
- `disabled` is an optional boolean

More detail: [docs/contract-format.md](docs/contract-format.md).

## What SpecBridge reports

If the code no longer matches the contract, you get a clear finding, for example:

- the component could not be resolved from `resolve`
- a prop from the contract is missing in code
- an allowed value like `danger` disappeared
- a public prop exists in code but not in the contract (warning by default)

Rule list: [docs/rules.md](docs/rules.md).  
Findings / JSON report: [docs/findings.md](docs/findings.md).  
Project config: [docs/config.md](docs/config.md).  
How resolve works: [docs/resolve.md](docs/resolve.md).

## Planned commands

```bash
pnpm specbridge check
pnpm specbridge check --format json --output .specbridge/report.json
```

- `0` — all good
- `1` — mismatches that should fail the build
- `2` — SpecBridge could not run the check (bad config, and similar)

## What this is not

- Not a Figma pixel comparison tool
- Not a replacement for TypeScript, ESLint, or visual regression
- Not trying to support every UI framework on day one

## Status

Docs and product shape only. Implementation comes next.

See the phased plan in [docs/roadmap.md](docs/roadmap.md).

## License

MIT — see [LICENSE](LICENSE).
