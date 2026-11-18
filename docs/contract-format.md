# Contract format

A contract is a JSON file that records which public props a component is supposed to support.

Use one file per component. Name it after the component:

- `Button.contract.json` → Button
- `TextField.contract.json` → TextField

Put contracts in a folder such as `contracts/`. Project config points DsLint at that folder. See [config.md](./config.md).

Every contract needs a `resolve` block: file, export, and props type. DsLint does not search for components on its own.

## Full example

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
    "size": {
      "values": ["sm", "md", "lg"],
      "required": false,
      "default": "md"
    },
    "disabled": {
      "type": "boolean",
      "required": false,
      "default": false
    },
    "label": {
      "type": "string",
      "required": true
    }
  }
}
```

## Resolve fields

| Field | Meaning |
| --- | --- |
| `source` | Path to the component file (from the project root) |
| `exportName` | Export name in that file |
| `propsType` | TypeScript props type to read |

All three fields are required. Details: [resolve.md](./resolve.md).

## Props

Each entry under `props` is one public prop.

For enumerated strings, list the allowed values:

```json
"variant": {
  "values": ["primary", "secondary", "danger"],
  "required": false,
  "default": "primary"
}
```

For a primitive, use `type`:

```json
"disabled": {
  "type": "boolean",
  "required": false,
  "default": false
}
```

Allowed `type` values in v1: `boolean`, `string`, `number`.

| Field | Meaning |
| --- | --- |
| `values` | Allowed string choices |
| `type` | `boolean`, `string`, or `number` |
| `required` | Whether callers must pass this prop |
| `default` | Parameter default DsLint expects on the export |

If you set `default`, DsLint compares it to a string, number, or boolean parameter default on `resolve.exportName` (DSL107). Omit `default` to skip that check. Only destructured parameter defaults count. React `defaultProps` and non-literal expressions do not.

Use either `values` or `type`, not both on the same prop.

## Project settings

Contracts location, TypeScript settings, and rule severity live in `dslint.config.json` at the project root.

Full shape: [config.md](./config.md).  
How resolve works: [resolve.md](./resolve.md).
