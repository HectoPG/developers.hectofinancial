import { useState, useEffect, useRef } from 'react'
import { Search, X, FileText, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import FlexSearch from 'flexsearch'
import { getAllDocuments, getCategoryByPath } from '../config/documentation'

// MDX 파일들을 동적으로 import
const mdxModules = import.meta.glob('../docs/**/*.mdx', { as: 'raw' })

interface SearchResult {
  id: string
  title: string
  content: string
  path: string
  category: string
  type: 'page' | 'heading'
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

// 중앙화된 문서 설정에서 구조 가져오기
const documentStructure = getAllDocuments()

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [allDocuments, setAllDocuments] = useState<SearchResult[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const searchIndex = useRef<any>(null)

  // MDX 파일의 원본 내용을 파싱하는 함수
  const parseMdxContent = (mdxContent: any): string => {
    // mdxContent가 문자열이 아닌 경우 처리
    if (typeof mdxContent !== 'string') {
      console.warn('MDX content is not a string:', typeof mdxContent, mdxContent);
      return '';
    }
    
    // MDX에서 텍스트만 추출 (마크다운 문법 제거)
    let text = mdxContent
      // MDX 컴포넌트 파라미터 추출 (예: <Component title="제목" description="설명">)
      .replace(/<(\w+)[^>]*title\s*=\s*["']([^"']*)["'][^>]*>/g, '$2 ')
      .replace(/<(\w+)[^>]*description\s*=\s*["']([^"']*)["'][^>]*>/g, '$2 ')
      .replace(/<(\w+)[^>]*label\s*=\s*["']([^"']*)["'][^>]*>/g, '$2 ')
      .replace(/<(\w+)[^>]*name\s*=\s*["']([^"']*)["'][^>]*>/g, '$2 ')
      // 코드 블록 내용 추출 (코드 블록은 제거하되 내용은 검색 가능하게)
      .replace(/```[\w]*\n([\s\S]*?)```/g, (_, codeContent) => {
        // 코드 블록 내의 주석과 문자열만 추출
        const comments = codeContent.match(/\/\/.*$/gm) || []
        const strings = codeContent.match(/["'][^"']*["']/g) || []
        return [...comments, ...strings].join(' ')
      })
      // 인라인 코드 내용 추출
      .replace(/`([^`]*)`/g, '$1')
      // 헤딩 마크다운 제거 (텍스트는 남김)
      .replace(/^#{1,6}\s+(.+)$/gm, '$1')
      // 링크 마크다운 제거 (텍스트만 남김)
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      // 이미지 마크다운 제거 (alt 텍스트는 남김)
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
      // 볼드/이탤릭 마크다운 제거
      .replace(/\*\*([^*]*)\*\*/g, '$1')
      .replace(/\*([^*]*)\*/g, '$1')
      .replace(/__([^_]*)__/g, '$1')
      .replace(/_([^_]*)_/g, '$1')
      // 리스트 마크다운 제거 (텍스트는 남김)
      .replace(/^[\s]*[-*+]\s+(.+)$/gm, '$1')
      .replace(/^[\s]*\d+\.\s+(.+)$/gm, '$1')
      // 인용문 마크다운 제거 (텍스트는 남김)
      .replace(/^>\s+(.+)$/gm, '$1')
      // 수평선 제거
      .replace(/^[-*_]{3,}$/gm, '')
      // HTML 태그 제거 (텍스트는 남김)
      .replace(/<[^>]*>([^<]*)<\/[^>]*>/g, '$1')
      .replace(/<[^>]*\/>/g, '')
      // 여러 공백을 하나로
      .replace(/\s+/g, ' ')
      .trim()
    
    return text
  }

  // 동적으로 문서 메타데이터를 생성하는 함수
  const generateDocumentMetadata = async (): Promise<SearchResult[]> => {
    const results: SearchResult[] = []
    
    for (const doc of documentStructure) {
      let content = `${doc.title} 관련 문서입니다.`
      
      // MDX 파일 경로 생성
      const mdxPath = doc.path.replace('/docs/', '../docs/') + '.mdx'
      const mdxKey = Object.keys(mdxModules).find(key => key.includes(mdxPath.replace('../docs/', '')))
      
      if (mdxKey && mdxModules[mdxKey]) {
        try {
          // MDX 파일의 원본 내용 가져오기
          const mdxModule = await mdxModules[mdxKey]()
          let mdxContent = '';
          
          // MDX 모듈에서 원본 내용 추출
          if (typeof mdxModule === 'string') {
            mdxContent = mdxModule;
          } else if (mdxModule && typeof mdxModule === 'object') {
            // MDX 모듈 객체에서 원본 내용 찾기
            const moduleObj = mdxModule as any;
            mdxContent = moduleObj.default?.__content || moduleObj.__content || '';
          }
          
          if (mdxContent) {
            const parsedContent = parseMdxContent(mdxContent)
            
            if (parsedContent && parsedContent.length > 50) {
              content = parsedContent.length > 500 ? parsedContent.substring(0, 500) + '...' : parsedContent
            }
          }
        } catch (error) {
          console.warn(`Failed to load MDX content for ${doc.path}:`, error)
        }
      } else {
        // MDX 파일이 없으면 현재 페이지의 DOM에서 추출
        const isCurrentPage = window.location.pathname === doc.path
        if (isCurrentPage) {
          const mainContent = document.querySelector('main')
          if (mainContent) {
            const textElements = mainContent.querySelectorAll('p, li, td, th, div:not(.code-block):not(.highlight):not(.navigation):not(.button)')
            const allText: string[] = []
            
            textElements.forEach(element => {
              const text = element.textContent?.trim()
              if (text && text.length > 10 && !text.match(/^[{}[\]();\s]*$/)) {
                allText.push(text)
              }
            })
            
            if (allText.length > 0) {
              const fullContent = allText.join(' ')
              content = fullContent.length > 500 ? fullContent.substring(0, 500) + '...' : fullContent
            }
          }
        }
      }
      
      results.push({
        id: doc.path.replace(/\//g, '-').replace(/^-/, ''),
        title: doc.title,
        content: content,
        path: doc.path,
        category: doc.category,
        type: 'page' as const
      })
    }
    
    return results
  }

  // 실제 헤딩들을 수집하는 함수
  const collectHeadings = () => {
    const headings: SearchResult[] = []
    
    // 모든 헤딩 요소 찾기
    const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    
    headingElements.forEach((heading) => {
      // 네비게이션이나 헤더의 헤딩은 제외
      if (heading.closest('header') || heading.closest('nav')) return
      
      const id = heading.id || heading.textContent?.toLowerCase().replace(/\s+/g, '-') || ''
      const text = heading.textContent?.trim() || ''
      const level = parseInt(heading.tagName.substring(1))
      
      if (text && level <= 3) {
        // 현재 페이지 경로 가져오기
        const currentPath = window.location.pathname
        const category = getCategoryFromPath(currentPath)
        
        headings.push({
          id: id,
          title: text,
          content: `"${text}" 섹션으로 이동`,
          path: `${currentPath}#${id}`,
          category: category,
          type: 'heading'
        })
      }
    })
    
    return headings
  }

  // 경로에서 카테고리 추출 (중앙화된 설정 사용)
  const getCategoryFromPath = (path: string): string => {
    const category = getCategoryByPath(path)
    return category?.name || '기타'
  }

  // FlexSearch 인덱스 초기화
  useEffect(() => {
    const initializeSearch = async () => {
      searchIndex.current = new FlexSearch.Index({
        tokenize: 'forward',
        resolution: 3
      })

      // 동적으로 생성된 문서 메타데이터와 실제 헤딩들을 합쳐서 인덱싱
      const documentMetadata = await generateDocumentMetadata()
      const headings = collectHeadings()
      const allDocs = [...documentMetadata, ...headings]
      setAllDocuments(allDocs)

      allDocs.forEach((doc, index) => {
        searchIndex.current?.add(index, `${doc.title} ${doc.content} ${doc.category}`)
      })
    }

    initializeSearch()
  }, [])

  // 검색 실행
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    if (searchIndex.current) {
      const searchResults = searchIndex.current.search(query)
      const foundResults = searchResults.map((index: number) => {
        const doc = allDocuments[index]
        if (!doc) return null
        
        // 검색어가 포함된 부분을 찾아서 하이라이트용으로 반환
        const searchLower = query.toLowerCase()
        const contentLower = doc.content.toLowerCase()
        
        // 내용에서 검색어가 포함된 부분 찾기
        let highlightedContent = doc.content
        if (contentLower.includes(searchLower)) {
          const startIndex = contentLower.indexOf(searchLower)
          const endIndex = startIndex + query.length
          const before = doc.content.substring(0, startIndex)
          const match = doc.content.substring(startIndex, endIndex)
          const after = doc.content.substring(endIndex)
          highlightedContent = `${before}<mark class="bg-yellow-200 px-1 rounded">${match}</mark>${after}`
        }
        
        return {
          ...doc,
          content: highlightedContent
        }
      }).filter(Boolean)
      
      setResults(foundResults)
      setSelectedIndex(0)
    }
  }, [query, allDocuments])

  // 모달이 열릴 때 입력 필드에 포커스 및 애니메이션 처리
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      if (inputRef.current) {
        inputRef.current.focus()
      }
    } else {
      setIsVisible(false)
    }
  }, [isOpen])

  // 키보드 이벤트 처리
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault()
      window.location.href = results[selectedIndex].path
      onClose()
    }
  }

  if (!isOpen && !isVisible) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* 배경 오버레이 */}
      <div 
        className="fixed inset-0 transition-all duration-300"
        onClick={onClose}
      />
      
      {/* 검색 모달 */}
      <div className="flex min-h-full items-start justify-center p-4 pt-16">
        <div className={`relative w-full max-w-2xl transform transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}>
          <div className="bg-white rounded-lg shadow-xl border border-gray-200">
            {/* 검색 입력 필드 */}
            <div className="flex items-center px-4 py-3 border-b border-gray-200">
              <Search className="h-5 w-5 text-gray-400 mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="현금영수증, 정산 API 등 궁금한 내용을 입력해보세요"
                className="flex-1 text-lg outline-none placeholder-gray-400"
              />
              <button
                onClick={onClose}
                className="ml-3 p-1 hover:bg-gray-100 rounded transition-colors focus:outline-none"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            {/* 검색 결과 */}
            <div className="max-h-96 overflow-y-auto">
              {query.trim() && results.length === 0 && (
                <div className="px-4 py-8 text-center text-gray-500">
                  <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>검색 결과가 없습니다</p>
                </div>
              )}

              {query.trim() && results.length > 0 && (
                <div className="py-2">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    검색 결과 ({results.length})
                  </div>
                  {results.map((result, index) => (
                    <Link
                      key={result.id}
                      to={result.path}
                      onClick={onClose}
                      className={`block px-4 py-3 hover:bg-gray-50 transition-colors ${
                        index === selectedIndex ? 'bg-hecto-50 border-r-2 border-hecto-400' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center mb-1">
                            <FileText className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                            <span className="font-medium text-gray-900 truncate">
                              {result.title}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500 mb-1">
                            {result.category}
                          </div>
                          <p 
                            className="text-sm text-gray-600 line-clamp-2"
                            dangerouslySetInnerHTML={{ __html: result.content }}
                          />
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400 ml-2 flex-shrink-0" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {!query.trim() && (
                <div className="py-4">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    추천 페이지
                  </div>
                  {allDocuments.slice(0, 4).map((doc) => (
                    <Link
                      key={doc.id}
                      to={doc.path}
                      onClick={onClose}
                      className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center mb-1">
                            <FileText className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                            <span className="font-medium text-gray-900 truncate">
                              {doc.title}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {doc.category}
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400 ml-2 flex-shrink-0" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 하단 도움말 */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">↑↓</kbd>
                    <span className="ml-1">선택</span>
                  </span>
                  <span className="flex items-center">
                    <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">Enter</kbd>
                    <span className="ml-1">이동</span>
                  </span>
                </div>
                <span className="flex items-center">
                  <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">Esc</kbd>
                  <span className="ml-1">닫기</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
