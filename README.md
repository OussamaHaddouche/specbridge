# SpecBridge

**Blueprint · not implemented yet**

SpecBridge turns design-system expectations into executable contracts, so component API and token drift get caught in development and CI instead of manual review.

Primary target: **React + TypeScript** component libraries. The core stays framework-agnostic so other adapters can follow.

Not a pixel-perfect Figma comparison tool. First job: catch mismatches in component APIs, supported values, design-token declarations, and documented Storybook examples.

## Problem

A design system has two representations of each component:

1. **Contract** — variants, sizes, states, tokens, and examples the team agrees on
2. **Implementation** — what the code actually exports and supports

Those drift. SpecBridge makes the contract machine-readable and the check repeatable.

## How it works

```
SpecBridge contracts (JSON)
        │
        ▼
   SpecBridge check
    │         │         │
    ▼         ▼         ▼
 TypeScript  Tokens   Stories
    │         │         │
    └──── unified findings ────┐
         CLI · Markdown · SARIF
```

Audits read a single SpecBridge contract format. The contract is the source of truth for the public API: missing contract values are errors; undocumented public props are warnings by default. Design-tool or Storybook integrations, when added, emit SpecBridge JSON rather than teaching `check` new formats.

## Scope

| In scope | Out of scope |
|---|---|
| Prop names, requiredness, primitive types, string unions | Pixel-perfect Figma ↔ browser diffs |
| CSS custom-property existence | Proving a token is applied in every style path |
| Required Storybook story exports | Supporting every CSS-in-JS system |
| CLI + CI reports (JSON, Markdown, SARIF) | Every frontend framework on day one |
| Read-only audits | Replacing TypeScript, ESLint, or visual regression |

## Contract

```json
{
  "schemaVersion": 1,
  "component": {
    "name": "Button",
    "exportName": "Button",
    "source": "src/components/Button/Button.tsx",
    "propsType": "ButtonProps"
  },
  "props": {
    "variant": {
      "kind": "string-union",
      "values": ["primary", "secondary", "danger"],
      "required": false,
      "default": "primary"
    }
  },
  "tokens": [
    {
      "name": "color.action.primary",
      "cssVariable": "--color-action-primary",
      "requiredInImplementation": true
    }
  ],
  "stories": ["Primary", "Secondary", "Danger", "Disabled"]
}
```

See [`docs/contract-format.md`](docs/contract-format.md).

## Checks

| Area | Rules |
|---|---|
| Component API vs TypeScript | SPB001–SPB105 |
| Token declarations | SPB201 |
| Storybook exports | SPB301 |
| Runtime assertions | SPB401 |

Severity is configurable. Warnings do not fail CI by default.

See [`docs/rules.md`](docs/rules.md).

## CLI

```bash
pnpm specbridge check
pnpm specbridge check --format json --output .specbridge/report.json
pnpm specbridge check --format sarif --output .specbridge/report.sarif
```

Exit codes: `0` ok · `1` threshold violations · `2` config/analysis failure

## Repository

```
packages/
  cli/
  core/
examples/
  react-component-library/
docs/
```

Planned stack: TypeScript, Node, pnpm, Commander, ts-morph, Zod, Vitest; Playwright for later runtime checks.

## Roadmap

| Now | Next | Later |
|---|---|---|
| Contract schema + fixtures | Token + Storybook static checks | Runtime Storybook/Playwright checks |
| TypeScript API auditor + CLI | CI example + SARIF | Design-tool importers |
| Console + JSON reports | Markdown reports | Scaffold / draft helpers |

See [`docs/roadmap.md`](docs/roadmap.md).

## Contributing

Blueprint only. Rule proposals should include the problem caught, passing and failing fixtures, expected finding (ID + severity), and known false-positive risks.

## License

MIT — see [`LICENSE`](LICENSE).
