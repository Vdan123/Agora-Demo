// Plugins
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import ViteFonts from 'unplugin-fonts/vite'
import { viteExternalsPlugin } from 'vite-plugin-externals'
import Compression from 'vite-plugin-compression';
import vueJsx from '@vitejs/plugin-vue-jsx';
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';


// import { sentryVitePlugin } from "@sentry/vite-plugin";
// import { visualizer } from 'rollup-plugin-visualizer';
// Utilities
import { fileURLToPath, URL } from 'url';

import { resolve } from 'path';
import { defineConfig, loadEnv } from "vite";


export default defineConfig(async ({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''))
  return {
    plugins: [
      vue({
        template: { transformAssetUrls }
      }),
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
      vuetify({
        autoImport: true,
        styles: { configFile: 'src/styles/settings.scss' }
      }),
      ViteFonts({
        google: {
          families: [{
            name: 'Roboto',
            styles: 'wght@100;300;400;500;700;900',
          }],
        },
      }),
      viteExternalsPlugin({
        'agora-electron-sdk': 'commonjs2 agora-electron-sdk',
        "agora-rdc-core": "commonjs2 agora-rdc-core"
      }),
      Compression({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz',
        compressionOptions: { level: 9 },
        deleteOriginFile: false
      }),
      vueJsx(),
      Components({
        resolvers: [
          AntDesignVueResolver({
            importStyle: false, // css in js
          }),
        ],
      }),
      // visualizer({
      //   open: true,
      //   gzipSize: true, // 展示gzip之后的大小
      //   brotliSize: true, // 如果需要，也可以展示brotli压缩后的大小
      //   template: 'treemap'
      // }),
      // sentryVitePlugin({
      //   org: "readyrun-robot",
      //   project: "goal-go",
      //   telemetry: false,
      //   authToken: process.env.VITE_SENTRY_AUTH_TOKEN
      // }),
    ],
    define: {
      'process.env': {}
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
      extensions: [
        '.js',
        '.json',
        '.jsx',
        '.mjs',
        '.ts',
        '.tsx',
        '.vue',
      ],
    },
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          liveClassroom: resolve(__dirname, 'live-classroom/index.html'),
        },
        output: {
          manualChunks (id) {
            if (id.includes("node_modules")) {
              // 让每个插件都打包成独立的文件
              return id.toString().split("node_modules/")[1].split("/")[0].toString();
            }
          }
        }
      },

      sourcemap: process.env.MODE !== 'production'
    },
    server: {
      port: 1024,
      proxy: {
        '/api': {
          target: 'https://goalgo-dev.narcissu.tech/api', // 目标 API 服务器
          changeOrigin: true,
          secure: false,
          rewrite: path => path.replace(/^\/api/, '') // 重写路径：移除/api
        }
      }
    },
  }
})
