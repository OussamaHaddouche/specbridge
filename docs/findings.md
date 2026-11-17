# Findings and reports

`specbridge check` produces findings (one mismatch each), grouped by component in a report.

Rule meanings and default severities: [rules.md](./rules.md).

## Finding

One finding is one mismatch. Under a component in the report it does not repeat the component name or source path.

```json
{
  "ruleId": "SPB104",
  "severity": "error",
  "prop": "variant",
  "message": "Allowed value \"danger\" is missing in code.",
  "expected": ["primary", "secondary", "danger"],
  "actual": ["primary", "secondary"]
}
```

| Field | Required | Meaning |
| --- | --- | --- |
| `ruleId` | Yes | Rule ID, such as `SPB104` |
| `severity` | Yes | `error` or `warning` (after config overrides) |
| `message` | Yes | Human-readable summary |
| `prop` | No | Prop name when the mismatch is about a prop |
| `expected` | No | What the contract (or resolve) required |
| `actual` | No | What the code has |

`expected` and `actual` are JSON values (string, number, boolean, array, and similar), not forced to strings.

For resolve failures (SPB001 / SPB002), omit `prop` when it does not apply.

v1 does not require line or column locations.

## Report

JSON output (`--format json`) groups findings by component:

```json
{
  "schemaVersion": 1,
  "toolVersion": "0.1.0",
  "summary": {
    "checked": 3,
    "errors": 1,
    "warnings": 1
  },
  "components": [
    {
      "name": "Button",
      "source": "src/components/Button/Button.tsx",
      "findings": [
        {
          "ruleId": "SPB104",
          "severity": "error",
          "prop": "variant",
          "message": "Allowed value \"danger\" is missing in code.",
          "expected": ["primary", "secondary", "danger"],
          "actual": ["primary", "secondary"]
        }
      ]
    },
    {
      "name": "TextField",
      "source": "src/components/TextField/TextField.tsx",
      "findings": []
    }
  ]
}
```

| Field | Meaning |
| --- | --- |
| `schemaVersion` | Report shape version |
| `toolVersion` | SpecBridge version that produced the report |
| `summary.checked` | Contracts checked in this run |
| `summary.errors` | Finding count with severity `error` |
| `summary.warnings` | Finding count with severity `warning` |
| `components` | One entry per checked contract |
| `components[].name` | Component name from the contract file name |
| `components[].source` | Path from `resolve.source` |
| `components[].findings` | Findings for that component (may be empty) |

A clean run uses the same shape: every checked component is listed with `"findings": []`, and error and warning counts are zero.

## Exit codes and output

| Code | Meaning | Report file |
| --- | --- | --- |
| `0` | No failing findings (per `failOn`) | Written when you pass `--output` |
| `1` | Failing findings | Written when you pass `--output` |
| `2` | SpecBridge could not run (bad config, and similar) | Not written; explain on stderr |

Terminal text and Markdown (`--format markdown`) also group by component and map from this shape.
