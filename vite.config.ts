import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), svgr()],
    server: {
      proxy: {
        '/api/chat': {
          target: env.VITE_BEDROCK_ENDPOINT,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/chat/, `/model/${env.VITE_BEDROCK_MODEL || 'us.anthropic.claude-sonnet-4-20250514-v1:0'}/invoke-with-response-stream`),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('Authorization', `Bearer ${env.VITE_BEDROCK_TOKEN}`)
            })
          }
        }
      }
    }
  }
})
