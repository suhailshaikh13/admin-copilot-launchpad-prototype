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
          target: env.AWS_ENDPOINT_URL_BEDROCK_RUNTIME,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/chat/, '/model/global.anthropic.claude-sonnet-4-6/invoke-with-response-stream'),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('Authorization', `Bearer ${env.AWS_BEARER_TOKEN_BEDROCK}`)
            })
          }
        }
      }
    }
  }
})
