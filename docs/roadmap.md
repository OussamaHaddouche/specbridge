# Roadmap

## Phase 0: Contracts

- [x] Finish the contract file format and examples
- [x] Finish the project config shape
- [x] Document how components are resolved (`resolve` required; no auto-discovery)
- [x] Define how findings are structured

## Phase 1: First useful checker

- [ ] CLI + shared library packages
- [ ] Load contracts and resolve components via `resolve`
- [ ] Compare TypeScript props to contracts
- [ ] Print results in the terminal and as JSON
- [ ] Markdown report

## Phase 2: CI

- [ ] GitHub Actions example
- [ ] SARIF output for code scanning UIs
- [ ] Configurable failure thresholds

## Phase 3: Runtime checks

- [ ] Optional Playwright checks
- [ ] Explicit selectors, styles, roles, and interactions

## Phase 4: Import and authoring help

- [ ] Generate SpecBridge contracts from other sources
- [ ] Early Figma (or similar) export path
- [ ] Helpers that draft contracts from TypeScript
- [ ] Diff two contract versions

## First public demo

- [ ] Small example React library with at least three contracted components
- [ ] Deliberate mismatches that the rules catch
- [ ] Passing and failing runs with the right exit codes
- [ ] Tests in CI
- [ ] Short demo and known limits

## Still open

- Final package and tooling choices
- How small the first demo can be while still feeling real
