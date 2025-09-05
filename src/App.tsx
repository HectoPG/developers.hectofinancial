import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { MDXProvider } from '@mdx-js/react'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import DocsPage from './pages/DocsPage'
import BlogPage from './pages/BlogPage'
import BlogDetailPage from './pages/BlogDetailPage'
import ParameterCard from './components/ParameterCard'
import FeatureGrid from './components/FeatureGrid'
import NextSteps from './components/NextSteps'
import TestScenario from './components/TestScenario'
import ErrorGuide from './components/ErrorGuide'
import DocumentFooter from './components/DocumentFooter'

// 헤딩에서 ID 생성하는 함수
const generateId = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s가-힣]/g, '') // 특수문자 제거, 한글 유지
    .replace(/\s+/g, '-') // 공백을 대시로 변경
    .trim()
}

const mdxComponents = {
  h1: (props: any) => {
    const id = props.id || generateId(props.children?.toString() || '')
    return <h1 id={id} className="text-xl font-bold mb-3 text-gray-900" {...props} />
  },
  h2: (props: any) => {
    const id = props.id || generateId(props.children?.toString() || '')
    return <h2 id={id} className="text-lg font-semibold mb-2 mt-5 text-gray-900" {...props} />
  },
  h3: (props: any) => {
    const id = props.id || generateId(props.children?.toString() || '')
    return <h3 id={id} className="text-base font-semibold mb-2 mt-3 text-gray-800" {...props} />
  },
  h4: (props: any) => {
    const id = props.id || generateId(props.children?.toString() || '')
    return <h4 id={id} className="text-base font-semibold mb-2 mt-3 text-gray-800" {...props} />
  },
  h5: (props: any) => {
    const id = props.id || generateId(props.children?.toString() || '')
    return <h5 id={id} className="text-sm font-semibold mb-2 mt-3 text-gray-800" {...props} />
  },
  h6: (props: any) => {
    const id = props.id || generateId(props.children?.toString() || '')
    return <h6 id={id} className="text-xs font-semibold mb-1 mt-2 text-gray-800" {...props} />
  },
  p: (props: any) => <p className="mb-2 text-gray-700 leading-relaxed text-xs" {...props} />,
  code: (props: any) => <code className="bg-gray-100 px-2 py-1 rounded-md text-sm font-mono text-hecto-700" {...props} />,
  pre: (props: any) => <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4 border border-gray-200 shadow-sm text-xs" {...props} />,
  table: (props: any) => (
    <div className="overflow-x-auto mb-4 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg bg-white text-xs" {...props} />
    </div>
  ),
  thead: (props: any) => <thead className="bg-gray-50" {...props} />,
  tbody: (props: any) => <tbody className="bg-white divide-y divide-gray-100" {...props} />,
  tr: (props: any) => <tr className="hover:bg-gray-50 transition-colors" {...props} />,
  th: (props: any) => <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider" {...props} />,
  td: (props: any) => <td className="px-3 py-2 text-xs text-gray-900" {...props} />,
  ul: (props: any) => <ul className="list-disc list-inside mb-3 text-gray-700 space-y-0.5 text-xs" {...props} />,
  ol: (props: any) => <ol className="list-decimal list-inside mb-3 text-gray-700 space-y-0.5 text-xs" {...props} />,
  li: (props: any) => <li className="leading-relaxed text-xs" {...props} />,
  blockquote: (props: any) => <blockquote className="border-l-4 border-hecto-400 pl-3 py-2 italic text-gray-600 mb-3 bg-hecto-50 rounded-r-lg text-xs" {...props} />,
  a: (props: any) => <a className="text-hecto-600 hover:text-hecto-800 underline decoration-2 underline-offset-2 transition-colors" {...props} />,
  ParameterCard,
  FeatureGrid,
  NextSteps,
  TestScenario,
  ErrorGuide,
  DocumentFooter,
}

function App() {
  return (
    <MDXProvider components={mdxComponents}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogDetailPage />} />
            <Route path="/docs/:category" element={<DocsPage />} />
            <Route path="/docs/:category/:page" element={<DocsPage />} />
          </Routes>
        </Layout>
      </Router>
    </MDXProvider>
  )
}

export default App