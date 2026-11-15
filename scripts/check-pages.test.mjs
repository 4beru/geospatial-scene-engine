import assert from 'node:assert/strict'
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { test } from 'node:test'

import { checkPages } from './check-pages.mjs'

const base = '/geospatial-scene-engine/'
const home = `<link rel="stylesheet" href="${base}_astro/site.css"><a href="${base}examples/react/?place=lausanne">Demo</a>`

async function fixture(t, overrides = {}) {
  const root = await mkdtemp(join(tmpdir(), 'check-pages-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  const files = {
    '.nojekyll': '',
    'index.html': home,
    '_astro/site.css': 'body { color: black }',
    'examples/react/index.html':
      '<link rel="stylesheet" href="./assets/app.css"><script src="./assets/app.js"></script>',
    'examples/react/assets/app.css': 'canvas { display: block }',
    'examples/react/assets/app.js': '',
    'examples/basic/index.html': '<script src="./bundle.js"></script>',
    'examples/basic/bundle.js': '',
    ...overrides
  }
  for (const [file, content] of Object.entries(files)) {
    if (content === null) continue
    await mkdir(dirname(join(root, file)), { recursive: true })
    await writeFile(join(root, file), content)
  }
  return root
}

test('accepts project-base docs, relative demo assets, query strings and external credits', async (t) => {
  const root = await fixture(t, {
    'index.html':
      home + '<a href="https://www.openstreetmap.org/copyright">Credits</a>',
    'skill.md':
      'skills/three-map-terrain/SKILL.md and node_modules/three-map-terrain/dist/index.d.ts'
  })
  assert.equal(await checkPages(root), 3)
})

test('rejects CSS served outside the project base', async (t) => {
  const root = await fixture(t, {
    'index.html':
      '<link rel="stylesheet" href="/three-map-terrain/_astro/site.css">'
  })
  await assert.rejects(checkPages(root), /URL outside project base/)
})

test('accepts Astro standalone 404 canonical URL while checking its assets', async (t) => {
  const root = await fixture(t, {
    '404.html': `<link rel="canonical" href="https://4beru.github.io${base}404/"><link rel="stylesheet" href="${base}_astro/site.css">`
  })
  assert.equal(await checkPages(root), 4)
  await rm(join(root, '_astro/site.css'))
  await assert.rejects(checkPages(root), /404.html: missing local target/)
})

test('rejects a missing stylesheet asset', async (t) => {
  const root = await fixture(t, { '_astro/site.css': null })
  await assert.rejects(checkPages(root), /missing local target/)
})

test('rejects an omitted example or .nojekyll marker', async (t) => {
  const root = await fixture(t, {
    '.nojekyll': null,
    'examples/basic/index.html': null
  })
  await assert.rejects(
    checkPages(root),
    /Missing \.nojekyll[\s\S]*Missing examples\/basic\/index.html/
  )
})

test('rejects inherited URLs in published Markdown and redirects', async (t) => {
  const root = await fixture(t, {
    'llms.txt': 'https://whidrubeld.github.io/three-map-terrain/',
    'index.html':
      home +
      "<script>location.replace('/three-map-terrain/examples/react/')</script>"
  })
  await assert.rejects(checkPages(root), /inherited repository or site URL/)
})

test('requires an actual linked stylesheet on the docs and React entrypoints', async (t) => {
  const root = await fixture(t, {
    'examples/react/index.html': '<h1>Unstyled</h1>'
  })
  await assert.rejects(checkPages(root), /no stylesheet linked/)
})
