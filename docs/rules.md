# Rules

Each mismatch SpecBridge finds has an ID, a short message, and a severity.

| ID     | Meaning                                                                                                    | Default |
| ------ | ---------------------------------------------------------------------------------------------------------- | ------- |
| SPB001 | SpecBridge could not resolve the component (`resolve` missing/incomplete, file missing, or export missing) | Error   |
| SPB002 | SpecBridge could not read the props type named in `resolve.propsType`                                      | Error   |
| SPB101 | The contract lists a prop that the code does not have                                                      | Error   |
| SPB102 | The prop’s type in code does not match the contract                                                        | Error   |
| SPB103 | Required vs optional does not match                                                                        | Error   |
| SPB104 | An allowed value from the contract is missing in code                                                      | Error   |
| SPB105 | The code has a public prop the contract never mentioned                                                    | Warning |
| SPB106 | The code allows a string value the contract never listed                                                   | Warning |
| SPB401 | A runtime check failed                                                                                     | Error   |

## How severity affects CI

- **Error**: fails CI by default
- **Warning**: shown, but does not fail CI by default

You can change this in project config (`rules` and `failOn` in [config.md](./config.md)).

## Finding fields

Concrete JSON fields for findings and the full report: [findings.md](./findings.md).

## Examples

The contract says `variant` may be `primary`, `secondary`, or `danger`.  
The code only allows `primary` and `secondary`.  
SpecBridge reports SPB104.

The contract lists those same three values.  
The code also allows `ghost`.  
SpecBridge reports SPB106.
