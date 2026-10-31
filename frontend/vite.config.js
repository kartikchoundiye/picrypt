import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Custom plugin to display deployed frontend URL in terminal
function deploymentInfoPlugin() {
  return {
    name: 'deployment-info-plugin',
    configureServer(server) {
      server.httpServer?.once('listening', () => {
        setTimeout(() => {
          console.log('  \x1b[36m➜\x1b[0m  \x1b[1mDeployed Frontend (Vercel)\x1b[0m: \x1b[34mhttps://picrypt-tau.vercel.app/\x1b[0m\n')
        }, 100)
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    deploymentInfoPlugin(),
  ],
})
