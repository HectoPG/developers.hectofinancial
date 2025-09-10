import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    {
      enforce: 'pre',
      ...mdx({
        providerImportSource: '@mdx-js/react',
        remarkPlugins: [remarkGfm, remarkFrontmatter],
        rehypePlugins: [],
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
