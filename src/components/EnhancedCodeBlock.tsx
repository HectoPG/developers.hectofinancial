import React, { useState } from 'react'
import { Copy, Check } from 'lucide-react'

// 언어에서 파일명 추론하는 함수
const getFilenameFromLanguage = (language: string): string => {
  const languageToFilename: { [key: string]: string } = {
    javascript: 'script.js',
    typescript: 'script.ts',
    jsx: 'Component.jsx',
    tsx: 'Component.tsx',
    html: 'index.html',
    css: 'style.css',
    scss: 'style.scss',
    python: 'script.py',
    java: 'Main.java',
    c: 'main.c',
    cpp: 'main.cpp',
    'c++': 'main.cpp',
    rust: 'main.rs',
    go: 'main.go',
    php: 'index.php',
    ruby: 'script.rb',
    bash: 'script.sh',
    shell: 'script.sh',
    sh: 'script.sh',
    json: 'data.json',
    yaml: 'config.yaml',
    yml: 'config.yml',
    sql: 'query.sql',
    dockerfile: 'Dockerfile',
    markdown: 'README.md',
    md: 'README.md'
  }
  
  return languageToFilename[language.toLowerCase()] || `code.${language}`
}

// 복사 버튼 컴포넌트
const CopyButton = ({ codeElement }: { codeElement: any }) => {
  const [copied, setCopied] = useState(false)
  
  // React 요소에서 텍스트 추출
  const extractText = (children: React.ReactNode): string => {
    if (typeof children === 'string') return children
    if (typeof children === 'number') return children.toString()
    if (React.isValidElement(children)) return extractText((children.props as any).children)
    if (Array.isArray(children)) return children.map(extractText).join('')
    return ''
  }
  
  const handleCopy = async () => {
    try {
      const text = extractText(codeElement.props.children)
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('복사 실패:', err)
    }
  }
  
  return (
    <button
      onClick={handleCopy}
      className={`hecto-copy-button ${copied ? 'copied' : ''}`}
      title={copied ? '복사됨!' : '코드 복사'}
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
    </button>
  )
}

// 향상된 코드 블록 컴포넌트
interface EnhancedCodeBlockProps {
  children: React.ReactNode
  filename?: string
  [key: string]: any
}

export default function EnhancedCodeBlock(props: EnhancedCodeBlockProps) {
  const { filename, children, ...restProps } = props
  const codeElement = children
  
  // 언어 코드 블록인지 확인
  if (codeElement && typeof codeElement === 'object' && React.isValidElement(codeElement)) {
    const { className, filename: codeFilename } = (codeElement.props as any)
    
    if (className && className.startsWith('language-')) {
      // 언어 추출
      const language = className.replace('language-', '').split(' ')[0]
      
      // 파일명: pre의 filename 또는 code의 filename 또는 언어에서 추론
      const displayFilename = filename || codeFilename || getFilenameFromLanguage(language)
      
      return (
        <div className="hecto-code-block-container">
          {/* 파일명 헤더 */}
          <div className="hecto-code-header">
            <span className="hecto-code-filename">{displayFilename}</span>
            <CopyButton codeElement={codeElement} />
          </div>
          
          {/* 코드 렌더링 */}
          <div className="hecto-code-content">
            <pre {...restProps}>
              {codeElement}
            </pre>
          </div>
        </div>
      )
    }
  }
  
  return <pre {...props} />
}
