# Rules

Each mismatch SpecBridge finds has an ID, a short message, and a severity.

| ID | Meaning | Default |
| --- | --- | --- |
| SPB001 | SpecBridge could not resolve the component (`resolve` missing/incomplete, file missing, or export missing) | Error |
| SPB002 | SpecBridge could not read the props type named in `resolve.propsType` | Error |
| SPB101 | The contract lists a prop that the code does not have | Error |
| SPB102 | The prop’s type in code does not match the contract | Error |
| SPB103 | Required vs optional does not match | Error |
| SPB104 | An allowed value from the contract is missing in code | Error |
| SPB105 | The code has a public prop the contract never mentioned | Warning |
| SPB106 | The code allows a string value the contract never listed | Warning |
| SPB107 | The contract `default` is missing in code, or differs from the parameter default | Error |
| SPB401 | Reserved for a runtime check (not implemented yet) | Error |

## How severity affects CI

- **Error**: fails the run by default
- **Warning**: shown, but does not fail the run by default

Change this with `rules` and `failOn` in [config.md](./config.md).

## Finding fields

JSON fields for findings and the full report: [findings.md](./findings.md).

## Examples

The contract says `variant` may be `primary`, `secondary`, or `danger`.  
The code only allows `primary` and `secondary`.  
SpecBridge reports SPB104.

The contract lists those same three values.  
The code also allows `ghost`.  
SpecBridge reports SPB106.

The contract says `variant` defaults to `primary`.  
The export destructures `{ variant = "secondary" }` (or has no parameter default).  
SpecBridge reports SPB107.
