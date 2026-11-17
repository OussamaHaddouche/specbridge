# How SpecBridge resolves a component

SpecBridge does not search the repo for components. Each contract names the file, export, and props type to check.

## Required resolve block

Every contract includes a `resolve` section:

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
    }
  }
}
```

| Field | Required | Meaning |
| --- | --- | --- |
| `source` | Yes | Path to the component file, from the project root |
| `exportName` | Yes | Export SpecBridge should use in that file |
| `propsType` | Yes | TypeScript props type SpecBridge should read |

There are no fallbacks. SpecBridge does not guess `ButtonProps` or infer props from `forwardRef`.

## Resolve steps

1. Take the component name from the contract file: `Button.contract.json` → Button (used in findings and reports).
2. Read `resolve` from the contract.
3. Open `resolve.source`.
4. Find the export named `resolve.exportName`.
5. Read the type named `resolve.propsType`.

After resolve succeeds, SpecBridge compares that props type to the contract. When the contract sets `default`, it also compares parameter defaults on the export. See [What SpecBridge compares in v1](#what-specbridge-compares-in-v1).

## When resolve fails

| What happened | Result |
| --- | --- |
| `resolve` missing or incomplete | Error SPB001 |
| `source` file not found | Error SPB001 |
| `exportName` not found in that file | Error SPB001 |
| `propsType` not found or could not be read | Error SPB002 |

## What SpecBridge compares in v1

- Which props exist
- Which props are required
- Booleans, strings, and numbers
- Lists of allowed string values
- Contract `default` vs parameter defaults on the named export (string / number / boolean literals)

## Limits in v1

- Very complex TypeScript types
- Catch-all / index-signature props
- Nested object or function props as first-class contract fields
- React `defaultProps`, JSDoc `@default`, or non-literal default expressions
