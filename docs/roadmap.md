# Roadmap

Personal project. Packages stay in this monorepo. No npm publish.

## Done

**v0.1.0**: contract format, config, resolve, findings, CLI + core, TypeScript props checks, text and JSON output.

**v0.2.0**: Markdown report (`--format markdown`).

**v0.3.0**: parameter-default checks (SPB107); `@specbridge/core` 0.3.0.

## Next: packages

Ship these before the showcase:

- [ ] Richer prop shapes: nested objects, function props, index signatures where useful
- [ ] Clearer resolve for common React patterns (`forwardRef`, better props-type errors)
- [ ] Broader defaults where SpecBridge can prove a value; drop or implement SPB401 for real
- [ ] CLI: `--help`, optional `--config` / project root override
- [ ] Authoring: draft a contract from TypeScript; diff two contract versions

## Then: showcase

Show the checker working in-repo:

- [ ] Small React example with a few contracted components
- [ ] Deliberate mismatches the rules catch
- [ ] Docs walkthrough: setup, pass run, fail run, exit codes
- [ ] GitHub Actions that runs the example (pass and fail paths)
- [ ] Known limits called out in the docs

## Later

Only if the showcase needs it:

- [ ] Configurable failure thresholds beyond `failOn`
