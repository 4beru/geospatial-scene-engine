import { existsSync } from 'node:fs'
import { readdir, readFile, stat } from 'node:fs/promises'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const site = new URL('https://4beru.github.io/geospatial-scene-engine/')
const entries = [
  'index.html',
  'examples/react/index.html',
  'examples/basic/index.html'
]
const obsolete =
  /(?:https?:\/\/)?(?:whidrubeld\.github\.io|(?:github\.com|raw\.githubusercontent\.com)\/whidrubeld)\/|(?<![\w/-])\/three-map-terrain\//

/** Check the final artifact, including examples, before publishing it. */
export async function checkPages(root) {
  const errors = []
  const files = await readdir(root, { recursive: true })
  for (const entry of ['.nojekyll', ...entries]) {
    if (!existsSync(join(root, entry))) errors.push(`Missing ${entry}`)
  }

  let checked = 0
  for (const file of files) {
    if (!/\.(?:html|md|txt|xml|css|js)$/.test(file)) continue
    const content = await readFile(join(root, file), 'utf8')
    if (obsolete.test(content))
      errors.push(`${file}: inherited repository or site URL`)
    if (!file.endsWith('.html')) continue
    checked++
    if (
      entries.slice(0, 2).includes(file) &&
      !/<link\b[^>]*rel=["']stylesheet["']/.test(content)
    ) {
      errors.push(`${file}: no stylesheet linked`)
    }
    const page = new URL(file.replace(/index\.html$/, ''), site)
    for (const match of content.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)) {
      const value = match[1].replaceAll('&amp;', '&')
      const target = new URL(value, page)
      if (target.origin !== site.origin) continue
      if (!target.pathname.startsWith(site.pathname)) {
        errors.push(`${file}: URL outside project base: ${value}`)
        continue
      }
      let asset = join(
        root,
        decodeURIComponent(target.pathname.slice(site.pathname.length))
      )
      try {
        if ((await stat(asset)).isDirectory()) asset = join(asset, 'index.html')
        if (!existsSync(asset)) throw new Error('not found')
      } catch {
        errors.push(`${file}: missing local target: ${value}`)
      }
    }
  }
  if (errors.length) throw new Error(errors.join('\n'))
  return checked
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '../docs/dist')
  const checked = await checkPages(root)
  console.log(
    `Pages artifact OK: ${checked} HTML pages, assets and repository URLs checked (${relative(process.cwd(), root)}).`
  )
}
