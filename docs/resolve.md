# How SpecBridge resolves a component

SpecBridge does not search the repo for components. Every contract must say exactly which file, export, and props type to check.

That keeps checks predictable: no guessed matches, no almost-right file.

## Required resolve block

Each contract includes a `resolve` section:

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

## Step by step

1. Take the component name from the contract file: `Button.contract.json` → Button (used in findings and reports).
2. Read `resolve` from the contract.
3. Open `resolve.source`.
4. Find the export named `resolve.exportName`.
5. Read the type named `resolve.propsType`.

After resolve succeeds, SpecBridge compares that props type—and the export’s parameter defaults when the contract sets `default`—to the contract. Details below.

## When resolve fails

| What happened | Result |
| --- | --- |
| `resolve` missing or incomplete | Error SPB001 |
| `source` file not found | Error SPB001 |
| `exportName` not found in that file | Error SPB001 |
| `propsType` not found or could not be read | Error SPB002 |

## What v1 can compare

- which props exist
- which props are required
- booleans, strings, and numbers
- lists of allowed string values
- contract `default` vs parameter defaults on the named export (string / number / boolean literals)

## What v1 does not fully support yet

- very complex TypeScript types
- catch-all / index-signature props
- nested object or function props as first-class contract fields
- React `defaultProps`, JSDoc `@default`, or non-literal default expressions
