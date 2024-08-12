import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://42.192.91.187:9501', // 目标服务器地址
        changeOrigin: true, // 是否改变源地址
        rewrite: (path) => path.replace(/^\/api/, ''), // 重写路径
      },
    },
  },
  resolve: {
    alias: {
      // 这里就是需要配置resolve里的别名
      "@": path.join(__dirname, "./src") // path记得引入
    }
  }
})
