// Pre-renders the page into dist/index.html so search engines and link previews see real content.
// Runs after `vite build` (see the "build" script in package.json). The browser still mounts the app normally.
import { createServer } from 'vite'
import { readFile, writeFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const indexPath = resolve(root, 'dist/index.html')

const server = await createServer({
  root,
  appType: 'custom',
  logLevel: 'error',
  server: { middlewareMode: true },
})
try {
  const { render } = await server.ssrLoadModule('/src/entry-server.js')
  const appHtml = await render()
  const template = await readFile(indexPath, 'utf8')
  if (!template.includes('<div id="app"></div>')) throw new Error('dist/index.html has no empty <div id="app"></div> to fill')
  await writeFile(indexPath, template.replace('<div id="app"></div>', `<div id="app">${appHtml}</div>`))
  console.log(`prerendered dist/index.html (${appHtml.length} chars of HTML)`)
} finally {
  await server.close()
}
