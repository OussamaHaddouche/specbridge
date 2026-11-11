# Contract format

A contract is a JSON file that answers: **what did we agree this component supports?**

One contract per component. The file name is the component name:

- `Button.contract.json` → Button
- `TextField.contract.json` → TextField

Put them in a folder such as `contracts/`. Project config tells SpecBridge where that folder is — see [config.md](./config.md).

Every contract must include a **`resolve`** block so SpecBridge knows which file, export, and props type to check. There is no automatic component search.

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

## Resolve

| Field | Meaning |
|---|---|
| `source` | Path to the component file (from the project root) |
| `exportName` | Export name in that file |
| `propsType` | TypeScript props type to read |

All three fields are required. Details: [resolve.md](./resolve.md).

## Props

Each entry under `props` is one public prop.

**Enumerated strings** — list the allowed values:

```json
"variant": {
  "values": ["primary", "secondary", "danger"],
  "required": false,
  "default": "primary"
}
```

**Simple types** — use `type`:

```json
"disabled": {
  "type": "boolean",
  "required": false,
  "default": false
}
```

Allowed `type` values in v1: `boolean`, `string`, `number`.

| Field | Meaning |
|---|---|
| `values` | Allowed string choices |
| `type` | `boolean`, `string`, or `number` |
| `required` | Must callers pass this prop? |
| `default` | Documented default |

Use either `values` or `type`, not both on the same prop.

## Project config

Where contracts live, TypeScript settings, and rule severity live in **`specbridge.config.json`** at the project root.

Full shape, required fields, and defaults: [config.md](./config.md).  
How resolve works: [resolve.md](./resolve.md).
