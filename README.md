# SpecBridge

**v0.3.0** · runs from this monorepo (not on npm)

SpecBridge checks that your React + TypeScript design-system components still match the props your team wrote down in contracts.

If the team agreed `Button` has variants `primary`, `secondary`, and `danger`, and someone drops `danger` from the TypeScript props, `specbridge check` fails and names the mismatch before that change ships.

## What you do

1. Add one contract file per component (`Button.contract.json`) with a `resolve` block (file, export, props type).
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

Findings include cases such as:

- SpecBridge could not resolve the component from `resolve`
- A prop in the contract is missing in code
- An allowed value such as `danger` disappeared
- Code exposes a public prop the contract never listed (warning by default)

See [docs/rules.md](docs/rules.md), [docs/findings.md](docs/findings.md), [docs/config.md](docs/config.md), and [docs/resolve.md](docs/resolve.md).

## Commands

After `pnpm install` at the repo root:

```bash
pnpm specbridge check
pnpm specbridge check --format json --output .specbridge/report.json
pnpm specbridge check --format markdown --output .specbridge/report.md
```

| Code | Meaning |
| --- | --- |
| `0` | No failing findings (per `failOn`) |
| `1` | Failing findings |
| `2` | SpecBridge could not run (bad config, and similar) |

## Scope

SpecBridge does not compare Figma pixels, replace TypeScript or ESLint, or run visual regression. v1 targets React + TypeScript component libraries.

## Status

[v0.3.0](https://github.com/OussamaHaddouche/specbridge/releases/tag/v0.3.0) ships `@specbridge/cli` 0.2.0 and `@specbridge/core` 0.3.0. It loads contracts, resolves components, compares TypeScript props and parameter defaults, and prints text, JSON, or Markdown.

Next work is listed in [docs/roadmap.md](docs/roadmap.md): package gaps first, then an in-repo showcase.

## License

MIT. See [LICENSE](LICENSE).
