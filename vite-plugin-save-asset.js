import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export function saveAssetPlugin() {
  return {
    name: 'save-asset-plugin',
    configureServer(server) {
      server.middlewares.use('/__save-asset', async (req, res, next) => {
        if (req.method !== 'POST') return next()

        const chunks = []
        req.on('data', chunk => chunks.push(chunk))
        req.on('end', () => {
          try {
            const body = JSON.parse(Buffer.concat(chunks).toString())
            const { data, filename } = body
            if (!data) {
              res.statusCode = 400
              res.end('Missing data')
              return
            }

            const matches = data.match(/^data:image\/(png|jpeg|jpg|webp|gif|svg\+xml);base64,(.+)$/)
            if (!matches) {
              res.statusCode = 400
              res.end('Invalid image data')
              return
            }

            const buffer = Buffer.from(matches[2], 'base64')
            const assetDir = path.resolve(__dirname, 'src/assets/logo')
            if (!fs.existsSync(assetDir)) {
              fs.mkdirSync(assetDir, { recursive: true })
            }

            fs.writeFileSync(path.join(assetDir, filename || 'logo.png'), buffer)

            res.statusCode = 200
            res.end(JSON.stringify({ ok: true }))
          } catch (err) {
            console.error('Failed to save asset:', err)
            res.statusCode = 500
            res.end('Error')
          }
        })
      })
    },
  }
}
