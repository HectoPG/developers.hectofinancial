import { useState, useEffect, useRef } from 'react'
import { Search, X, FileText, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import FlexSearch from 'flexsearch'

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

// 문서 데이터 (실제로는 동적으로 생성될 예정)
const documentData: SearchResult[] = [
  {
    id: 'pg-getting-started',
    title: '시작하기',
    content: '헥토파이낸셜 전자결제(PG) 서비스에 오신 것을 환영합니다! 이 가이드를 통해 빠르고 안전하게 결제 서비스를 연동할 수 있습니다.',
    path: '/docs/pg',
    category: 'PG 결제',
    type: 'page'
  },
  {
    id: 'pg-overview',
    title: '개요',
    content: '헥토파이낸셜 전자결제(PG) 서비스는 신용카드, 실시간 계좌이체, 가상계좌, 휴대폰 결제, 상품권 결제 등 다양한 온라인 결제수단을 제공합니다.',
    path: '/docs/pg#개요',
    category: 'PG 결제',
    type: 'heading'
  },
  {
    id: 'pg-credit-card',
    title: '신용카드 결제',
    content: '신용카드 결제 연동 가이드입니다. 카드사별 특화 기능과 보안 요구사항을 확인하세요.',
    path: '/docs/pg/credit-card',
    category: 'PG 결제',
    type: 'page'
  },
  {
    id: 'pg-virtual-account',
    title: '가상계좌 결제',
    content: '가상계좌 발급 및 입금 확인 방법에 대한 상세 가이드입니다.',
    path: '/docs/pg/virtual-account',
    category: 'PG 결제',
    type: 'page'
  },
  {
    id: 'ezauth-guide',
    title: '내통장결제 연동',
    content: '실시간 계좌이체 서비스인 내통장결제 연동 방법을 안내합니다.',
    path: '/docs/ezauth',
    category: '내통장결제',
    type: 'page'
  },
  {
    id: 'ezcp-guide',
    title: '간편현금결제 연동',
    content: '현금 결제 서비스인 간편현금결제 연동 방법을 안내합니다.',
    path: '/docs/ezcp',
    category: '간편현금결제',
    type: 'page'
  },
  {
    id: 'whitelabel-guide',
    title: '화이트라벨 연동',
    content: '통합 결제 서비스인 화이트라벨 연동 방법을 안내합니다.',
    path: '/docs/whitelabel',
    category: '화이트라벨',
    type: 'page'
  },
  {
    id: 'api-docs',
    title: 'API 문서',
    content: '인터랙티브 API 문서에서 모든 API를 한눈에 보고 테스트해보세요.',
    path: '/api-docs',
    category: 'API',
    type: 'page'
  }
]

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const searchIndex = useRef<FlexSearch.Index<SearchResult>>()

  // FlexSearch 인덱스 초기화
  useEffect(() => {
    searchIndex.current = new FlexSearch.Index({
      tokenize: 'forward',
      threshold: 1,
      resolution: 3,
      depth: 2
    })

    // 문서 데이터 인덱싱
    documentData.forEach((doc, index) => {
      searchIndex.current?.add(index, `${doc.title} ${doc.content} ${doc.category}`)
    })
  }, [])

  // 검색 실행
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    if (searchIndex.current) {
      const searchResults = searchIndex.current.search(query)
      const foundResults = searchResults.map(index => documentData[index]).filter(Boolean)
      setResults(foundResults)
      setSelectedIndex(0)
    }
  }, [query])

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
                        index === selectedIndex ? 'bg-orange-50 border-r-2 border-orange-400' : ''
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
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {result.content}
                          </p>
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
                  {documentData.slice(0, 4).map((doc) => (
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
