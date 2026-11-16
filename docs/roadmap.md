# Roadmap

## Phase 0: Contracts

- [x] Finish the contract file format and examples
- [x] Finish the project config shape
- [x] Document how components are resolved (`resolve` required; no auto-discovery)
- [x] Define how findings are structured

## Phase 1: First useful checker

- [x] CLI + shared library packages
- [x] Load contracts and resolve components via `resolve`
- [x] Compare TypeScript props to contracts
- [x] Print results in the terminal and as JSON
- [ ] Markdown report

[v0.1.0](https://github.com/OussamaHaddouche/specbridge/releases/tag/v0.1.0) covers the checked items above (`@specbridge/cli` 0.1.0, `@specbridge/core` 0.2.0). Packages run from this monorepo; they are not on npm yet.

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

- How to build and publish the packages to npm
- How small the first demo can be while still feeling real
