import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { MDXProvider } from '@mdx-js/react'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import DocsPage from './pages/DocsPage'
import ParameterCard from './components/ParameterCard'

const mdxComponents = {
  h1: (props: any) => <h1 className="text-4xl font-bold mb-6 text-gray-900" {...props} />,
  h2: (props: any) => <h2 className="text-3xl font-semibold mb-4 mt-8 text-gray-800" {...props} />,
  h3: (props: any) => <h3 className="text-2xl font-semibold mb-3 mt-6 text-gray-800" {...props} />,
  p: (props: any) => <p className="mb-4 text-gray-700 leading-relaxed" {...props} />,
  code: (props: any) => <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono" {...props} />,
  pre: (props: any) => <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4" {...props} />,
  table: (props: any) => (
    <div className="overflow-x-auto mb-6">
      <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg" {...props} />
    </div>
  ),
  thead: (props: any) => <thead className="bg-gray-50" {...props} />,
  tbody: (props: any) => <tbody className="bg-white divide-y divide-gray-200" {...props} />,
  tr: (props: any) => <tr className="hover:bg-gray-50" {...props} />,
  th: (props: any) => <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200" {...props} />,
  td: (props: any) => <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-100" {...props} />,
  ul: (props: any) => <ul className="list-disc list-inside mb-4 text-gray-700" {...props} />,
  ol: (props: any) => <ol className="list-decimal list-inside mb-4 text-gray-700" {...props} />,
  li: (props: any) => <li className="mb-1" {...props} />,
  blockquote: (props: any) => <blockquote className="border-l-4 border-hecto-400 pl-4 italic text-gray-600 mb-4" {...props} />,
  a: (props: any) => <a className="text-hecto-600 hover:text-hecto-800 underline" {...props} />,
  ParameterCard,
}

function App() {
  return (
    <MDXProvider components={mdxComponents}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/docs/:category" element={<DocsPage />} />
            <Route path="/docs/:category/:page" element={<DocsPage />} />
          </Routes>
        </Layout>
      </Router>
    </MDXProvider>
  )
}

export default App