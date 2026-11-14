import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Локалдык иштетүүдө /api/chat'ты Vercel'деги функциядай эле чакырабыз
function localApi(): Plugin {
  return {
    name: 'local-api',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res) => {
        try {
          const mod = await server.ssrLoadModule('/api/chat.ts')
          const chunks: Buffer[] = []
          for await (const c of req) chunks.push(c as Buffer)
          const headers = new Headers()
          for (const [k, v] of Object.entries(req.headers)) if (typeof v === 'string') headers.set(k, v)
          const request = new Request('http://localhost/api/chat', {
            method: req.method,
            headers,
            body: req.method === 'POST' ? Buffer.concat(chunks) : undefined,
          })
          const response: Response = await mod.POST(request)
          res.statusCode = response.status
          response.headers.forEach((v, k) => res.setHeader(k, v))
          if (response.body) {
            const reader = response.body.getReader()
            for (;;) {
              const { done, value } = await reader.read()
              if (done) break
              res.write(value)
            }
          }
          res.end()
        } catch (e) {
          res.statusCode = 500
          res.end(String(e))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), localApi()],
})
