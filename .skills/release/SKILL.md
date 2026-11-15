---
name: release
description: Prepare a repository release of geospatial-scene-engine, validate the local workspace and deployed documentation, and distinguish it from the upstream npm package.
metadata:
  internal: true
---

# Repository release

This checkout is `4beru/geospatial-scene-engine`, not a separately published
npm release. It retains the package name and imports `three-map-terrain` for
compatibility. Do not assume this repository is authorized to publish that npm
package, and do not run `npm publish` or trigger an npm publishing workflow.

## 1. Prepare

Compare the intended changes with the last repository tag. Update the relevant
docs, examples and README without renaming the compatible package or altering
license, copyright or author attribution. Only change the version when requested.

## 2. Validate

```bash
pnpm install
pnpm validate
pnpm test:e2e
pnpm --dir examples/basic build
pnpm --dir examples/react build
pnpm --dir docs build
```

Check the examples against the local workspace library with the
`verify-rendering` skill. If visuals changed, refresh and inspect the screenshots.

## 3. Release and deployment

Creating a public tag or GitHub release requires the user's explicit go-ahead.
Use this repository's `master` branch as the release source. Before creating a
release, inspect its workflows and confirm it cannot trigger an unauthorized npm
publication.

Pages deployment builds from `master` and publishes the generated documentation
and examples to `gh-pages`. Verify the documentation at
`https://4beru.github.io/geospatial-scene-engine/` and the React example at
`https://4beru.github.io/geospatial-scene-engine/examples/react/`.

Report the commit or tag, checks actually performed and any deployment blockers.
