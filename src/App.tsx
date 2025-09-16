import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { MDXProvider } from '@mdx-js/react'
import { Analytics } from '@vercel/analytics/react'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import DocsPage from './pages/DocsPage'
import BlogPage from './pages/BlogPage'
import BlogDetailPage from './pages/BlogDetailPage'
import ApiDocsPage from './pages/ApiDocsPage'
import ParameterCard from './components/ParameterCard'
import ConfigCard from './components/ConfigCard'
import FeatureGrid from './components/FeatureGrid'
import NextSteps from './components/NextSteps'
import TestScenario from './components/TestScenario'
import ErrorGuide from './components/ErrorGuide'
import DocumentFooter from './components/DocumentFooter'
import ScrollToTop from './components/ScrollToTop'
import EnhancedCodeBlock from './components/EnhancedCodeBlock'
import CreditCardCarousel from './components/CreditCardCarousel'
import { Link as LinkIcon } from 'lucide-react'

const generateId = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s가-힣]/g, '')
    .replace(/\s+/g, '-')
    .trim()
}

const createHeadingComponent = (Tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6', className: string) => {
  return (props: any) => {
    const id = props.id || generateId(props.children?.toString() || '')
    const copyLink = () => {
      const url = `${window.location.origin}${window.location.pathname}#${id}`
      navigator.clipboard.writeText(url)
    }
    
    return (
      <Tag id={id} className={`${className} group relative`} {...props}>
        <span className="flex items-center">
          {props.children}
          <button
            onClick={copyLink}
            className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded focus:outline-none"
            title="링크 복사"
          >
            <LinkIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        </span>
      </Tag>
    )
  }
}

const mdxComponents = {
  h1: createHeadingComponent('h1', 'text-3xl font-bold mb-4 text-gray-900'),
  h2: createHeadingComponent('h2', 'text-2xl font-semibold mb-3 mt-8 text-gray-900'),
  h3: createHeadingComponent('h3', 'text-xl font-semibold mb-3 mt-6 text-gray-800'),
  h4: createHeadingComponent('h4', 'text-lg font-semibold mb-2 mt-5 text-gray-800'),
  h5: createHeadingComponent('h5', 'text-base font-semibold mb-2 mt-4 text-gray-800'),
  h6: createHeadingComponent('h6', 'text-sm font-semibold mb-2 mt-3 text-gray-800'),
  p: (props: any) => <p className="mb-4 text-gray-600 leading-relaxed text-base" {...props} />,
  code: (props: any) => <code className="bg-slate-100 text-rose-600 px-1 py-0.5 rounded text-sm font-mono font-medium" {...props} />,
  pre: (props: any) => <EnhancedCodeBlock {...props} />,
  table: (props: any) => (
    <div className="overflow-x-auto mb-6 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg bg-white text-sm" {...props} />
    </div>
  ),
  thead: (props: any) => <thead className="bg-gray-50" {...props} />,
  tbody: (props: any) => <tbody className="bg-white divide-y divide-gray-100" {...props} />,
  tr: (props: any) => <tr className="hover:bg-gray-50 transition-colors" {...props} />,
  th: (props: any) => <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider" {...props} />,
  td: (props: any) => <td className="px-4 py-3 text-sm text-gray-900" {...props} />,
  ul: (props: any) => <ul className="list-disc list-inside mb-4 text-gray-700 space-y-1 text-sm" {...props} />,
  ol: (props: any) => <ol className="list-decimal list-inside mb-4 text-gray-700 space-y-1 text-sm" {...props} />,
  li: (props: any) => <li className="leading-relaxed text-sm" {...props} />,
  blockquote: (props: any) => <blockquote className="border-l-4 border-hecto-400 pl-4 py-3 italic text-gray-600 mb-4 bg-hecto-50 rounded-r-lg text-sm leading-relaxed" {...props} />,
  a: (props: any) => <a className="text-hecto-600 hover:text-hecto-800 underline decoration-2 underline-offset-2 transition-colors focus:outline-none" {...props} />,
  ParameterCard,
  ConfigCard,
  FeatureGrid,
  NextSteps,
  TestScenario,
  ErrorGuide,
  DocumentFooter,
  CreditCardCarousel,
}

function App() {
  return (
    <MDXProvider components={mdxComponents}>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/api-docs" element={<ApiDocsPage />} />
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:id" element={<BlogDetailPage />} />
                <Route path="/docs/:category" element={<DocsPage />} />
                <Route path="/docs/:category/:page" element={<DocsPage />} />
              </Routes>
            </Layout>
          } />
        </Routes>
        <Analytics />
      </Router>
    </MDXProvider>
  )
}

export default App