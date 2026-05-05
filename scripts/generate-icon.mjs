import { Resvg } from '@resvg/resvg-js'
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const svg = readFileSync(join(root, 'assets/icon.svg'), 'utf8')

// Generate 1024x1024 icon
const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1024 } })
const png = resvg.render().asPng()
writeFileSync(join(root, 'assets/icon.png'), png)
console.log('✓ icon.png generated (1024×1024)')

// Generate 200x200 splash icon
const resvg2 = new Resvg(svg, { fitTo: { mode: 'width', value: 200 } })
const png2 = resvg2.render().asPng()
writeFileSync(join(root, 'assets/splash-icon.png'), png2)
console.log('✓ splash-icon.png generated (200×200)')
