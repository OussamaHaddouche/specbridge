# Contract format

Contracts are JSON files validated with Zod. `check` accepts only this format.

## Principles

- Describe the public agreement: component identity, props, values, tokens, required examples
- Avoid implementation details (hooks, CSS Modules, internal folder layout)
- The contract is the source of truth for public API expectations

## Shape

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
    },
    "size": {
      "kind": "string-union",
      "values": ["sm", "md", "lg"],
      "required": false,
      "default": "md"
    },
    "disabled": {
      "kind": "boolean",
      "required": false,
      "default": false
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

## Fields

| Field | Role |
|---|---|
| `schemaVersion` | Version of the contract language |
| `component.source` | Source file for the TypeScript analyzer |
| `component.propsType` | Named props type to resolve |
| `props.*.kind` | e.g. `string-union`, `boolean`, and other primitives as needed |
| `tokens` | CSS custom properties used by token checks |
| `stories` | Required CSF export names |

## Config

```json
{
  "contracts": "contracts/**/*.json",
  "typescript": {
    "tsconfig": "tsconfig.json",
    "include": ["src/**/*.{ts,tsx}"]
  },
  "tokens": {
    "cssFiles": ["src/styles/tokens.css"],
    "mode": "css-custom-properties"
  },
  "storybook": {
    "stories": ["src/**/*.stories.ts", "src/**/*.stories.tsx"]
  },
  "rules": {
    "SPB105": "warning",
    "SPB301": "warning"
  },
  "failOn": "error"
}
```
