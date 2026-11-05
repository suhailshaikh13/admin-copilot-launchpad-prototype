import { defineConfig } from '@playwright/test'
import { existsSync } from 'node:fs'

const systemChromePath = '/usr/local/bin/google-chrome'

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:5173',
    ...(existsSync(systemChromePath) ? { channel: 'chrome' as const } : {}),
  },
  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: true,
  },
})
