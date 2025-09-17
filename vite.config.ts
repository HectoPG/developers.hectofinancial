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
