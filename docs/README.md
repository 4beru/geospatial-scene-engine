# geospatial-scene-engine · docs

The documentation site, <https://4beru.github.io/geospatial-scene-engine/>:
[Astro Starlight](https://starlight.astro.build), pages in Markdown with live
demos, every page also as Markdown for LLMs (`llms.txt`, Copy page).
How it is put together — pages, demos, links, the look, the deploy — is in
the repository's [AGENTS.md](../AGENTS.md#documentation-docs).

The root library retains the package name `three-map-terrain` for compatibility.
This checkout is not a separately published npm release. The docs use the local
library, a package of the same pnpm
workspace (`workspace:*`), so build the library first:

```bash
# repository root
pnpm install && pnpm build

# this folder
pnpm dev         # http://localhost:4321/geospatial-scene-engine/ (a fresh content cache;
                 # replaces a dev server already running)
pnpm typecheck   # astro check: pages, components, demos
pnpm build       # astro check + the site in dist/ (validates internal links)
```

The examples are not part of `pnpm dev`: on GitHub Pages they are built on
their own and copied to `dist/examples/` (`.github/workflows/gh-pages.yml`).
