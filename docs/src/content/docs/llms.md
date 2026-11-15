---
title: LLMs
description: The documentation for AI assistants — every page as Markdown, llms.txt and llms-full.txt, Copy page and Open in Claude or ChatGPT, the type declarations of your version.
---

These pages are written for people and coding agents alike. Every one of them is also plain Markdown, the whole site is one file, and the package's types document every export of the version you installed.

## Every page as Markdown

Add `.md` to a page's address: [`/geospatial-scene-engine/materials/`](/geospatial-scene-engine/materials/) is also [`/geospatial-scene-engine/materials.md`](/geospatial-scene-engine/materials.md). The Markdown is the rendered page flattened — components become their text, a live demo becomes its code — and each page points to it with `<link rel="alternate" type="text/markdown">`, so agents that look for it find it.

Above every title, **Copy page** puts that Markdown on the clipboard; its menu also opens it as text, or in a new chat in ChatGPT, Claude, Gemini, GitHub Copilot or Perplexity.

## llms.txt and llms-full.txt

Following [llmstxt.org](https://llmstxt.org):

| File                                                       | What                                                                      | For                                                                       |
| ---------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| [`/llms.txt`](/geospatial-scene-engine/llms.txt)           | The index: the library in a sentence, then every page with its summary    | An agent that fetches what it needs — give it this address                |
| [`/llms-full.txt`](/geospatial-scene-engine/llms-full.txt) | Every page in one Markdown file, in the order of the guide (about 100 KB) | A model with a long context, a tool that indexes docs by URL, offline use |

The guide comes first in both, the reference after it. Prompts that work:

```text
Read https://4beru.github.io/geospatial-scene-engine/llms.txt, then add
OpenStreetMap buildings and roads to the map in src/scene.ts.
```

```text
Using https://4beru.github.io/geospatial-scene-engine/layers/vegetation.md,
plant orchards with low trees on my map.
```

## The API of your version

These pages describe the geospatial-scene-engine checkout, which is not a separately published npm release. Build the local workspace with `pnpm build` and read `dist/index.d.ts` for its API. The compatible package name and imports remain `three-map-terrain`. If using the upstream npm library instead, read `node_modules/three-map-terrain/dist/index.d.ts` for the version actually installed. An agent unsure of an option's name or a signature should read the matching declarations before guessing.

## The agent skill

For agents that load skills — Claude Code, Codex, Cursor and many more — [the skill](/geospatial-scene-engine/skill/) is this documentation's essentials in one file: the model, recipes, pitfalls, and where to read more. One command installs it:

```bash
npx skills add 4beru/geospatial-scene-engine
```
