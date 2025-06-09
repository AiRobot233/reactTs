import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";
import { createHtmlPlugin } from 'vite-plugin-html';

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  let ev = loadEnv(mode, process.cwd());
  return {
    plugins: [
      react(),
      createHtmlPlugin({
        inject: {
          data: {
            title: ev.VITE_APP_TITLE,
          },
        },
      }),
    ],
    base: ev.VITE_APP_ENV === 'development' ? './' : './',
    server: {//配置代理
      host: '0.0.0.0',
      port: 5000,
      proxy: {
        "/api": {
          target: ev.VITE_BASIC_URL_KEY,//服务器地址
          changeOrigin: true,//允许同源策略
          rewrite: (path) => path.replace(/^\/api/, "")
        },
      },
    },
    resolve: {
      alias: {
        '@':  path.join(__dirname, "./src") // path记得引入
      }
    }
  }
})
