# Rules

| Rule ID | Description | Default severity |
|---|---|---|
| SPB001 | Component export is missing | Error |
| SPB002 | Props type cannot be resolved | Error |
| SPB101 | Contract prop missing from implementation | Error |
| SPB102 | Prop type does not match contract | Error |
| SPB103 | Requiredness does not match contract | Error |
| SPB104 | Contract union value missing in implementation | Error |
| SPB105 | Implementation exposes an undocumented prop | Warning |
| SPB201 | Expected CSS token is not declared | Error |
| SPB301 | Required Storybook story is missing | Warning |
| SPB401 | Runtime assertion failed | Error |

## Severity

- Errors fail CI when `failOn` is `"error"` (default)
- Warnings do not fail CI by default
- Per-rule severity is configurable in project config

## Findings

Each finding includes rule ID, severity, component name, message, expected vs actual when relevant, and file location when available.

## Example

Contract requires `variant: "primary" | "secondary" | "danger"`. Implementation omits `danger` → **SPB104** at the props type location.
