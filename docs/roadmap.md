# Roadmap

## Phase 0 — Contract

- [ ] Finalize contract shape (Zod) and fixtures
- [ ] Define finding and severity types
- [ ] Document TypeScript resolution limits for v1

## Phase 1 — API auditor

- [ ] `packages/cli` + `packages/core`
- [ ] Load and validate contracts
- [ ] Resolve exports and props types; compare against contract
- [ ] Console and JSON reporters

## Phase 2 — Tokens and Storybook

- [ ] CSS custom-property declaration checks (SPB201)
- [ ] CSF story export checks (SPB301)
- [ ] Markdown reporter

## Phase 3 — CI

- [ ] GitHub Actions example
- [ ] SARIF output
- [ ] Configurable failure thresholds

## Phase 4 — Runtime

- [ ] Optional Storybook + Playwright checks
- [ ] Explicit selectors, computed styles, roles, interactions

## Phase 5 — Importers and authoring

- [ ] Import path that writes SpecBridge JSON
- [ ] Figma (or similar) export prototype
- [ ] Scaffold / draft-from-TypeScript helpers
- [ ] Contract diffing

## First public demo

- [ ] Example React library with at least three contracted components
- [ ] Intentional mismatches covered by implemented rules
- [ ] Passing and failing fixtures with correct exit codes
- [ ] Tests in CI
- [ ] Short demo and documented limitations
