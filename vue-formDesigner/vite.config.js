import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // console.log('yy3 ', id);
          if(id.includes('node_modules')) {
            return 'vendor'
          }
        }
      }
    }
  },
  // base: '/autoDeploy/'
  base: process.env.NODE_ENV === 'production' 
    ? '/autoDeploy/'  // 替换为你的仓库名
    : '/',
})
