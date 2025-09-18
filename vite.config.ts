import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import rehypePrism from 'rehype-prism-plus'
import rehypeMdxCodeProps from 'rehype-mdx-code-props'
// @ts-ignore
import mdxFrontmatterPlugin from './plugins/vite-mdx-frontmatter.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    mdxFrontmatterPlugin(), // frontmatter를 apiInfo로 자동 export
    {
      enforce: 'pre',
      ...mdx({
        providerImportSource: '@mdx-js/react',
        remarkPlugins: [remarkGfm, remarkFrontmatter],
        rehypePlugins: [rehypePrism, rehypeMdxCodeProps],
      })
    },
    react()
  ],
  server: {
    proxy: {
      // 테스트 환경 API 프록시
      '/api/test': {
        target: 'https://tbgw.settlebank.co.kr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/test/, ''),
        secure: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      },
      // 운영 환경 API 프록시
      '/api/prod': {
        target: 'https://gw.settlebank.co.kr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/prod/, ''),
        secure: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  preview: {
    port: 3000,
    strictPort: true
  }
})
