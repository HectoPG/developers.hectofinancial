import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, FileText, CreditCard, Banknote, Layers, Home, ChevronDown, BookOpen, Search } from 'lucide-react'
import clsx from 'clsx'
import TableOfContents from './TableOfContents'
import ServiceSidebar from './ServiceSidebar'
import SearchModal from './SearchModal'

const navigation = [
  { name: '홈', href: '/', icon: Home },
  { 
    name: '서비스', 
    href: '/services', 
    icon: Layers, 
    description: '결제 서비스',
    children: [
      { name: 'PG 결제', href: '/docs/pg', description: '신용카드, 간편결제, 가상계좌 등', icon: CreditCard },
      { name: '내통장결제', href: '/docs/ezauth', description: '실시간 계좌이체 서비스', icon: Banknote },
      { name: '간편현금결제', href: '/docs/ezcp', description: '현금 결제 서비스', icon: FileText },
      { name: '화이트라벨', href: '/docs/whitelabel', description: '통합 결제 서비스', icon: Layers },
    ]
  },
  { name: 'API 문서', href: '/api-docs', icon: BookOpen, description: '인터랙티브 API 문서' },
  { name: '블로그', href: '/blog', icon: FileText, description: '기술 블로그 및 소식' },
]


interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const location = useLocation()
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 서비스 페이지인지 확인
  const isServicePage = location.pathname.startsWith('/docs/')

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close dropdown when route changes
  useEffect(() => {
    setActiveDropdown(null)
    setMobileMenuOpen(false)
  }, [location.pathname])

  // 키보드 단축키 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K 또는 Cmd+K로 검색 모달 열기
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setSearchModalOpen(true)
      }
      // Escape로 검색 모달 닫기
      if (e.key === 'Escape') {
        setSearchModalOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-50">
        <div className="w-full pl-6 pr-4">
          <div className="flex justify-start items-center h-16 space-x-8">
            {/* Logo */}
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
              <img src="/site-mark.svg" alt="헥토파이낸셜" className="h-8" /> 
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1 flex-1" ref={dropdownRef}>
              {navigation.map((item) => {
                const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/')
                
                return (
                  <div key={item.name} className="relative">
                    {item.children ? (
                      // Dropdown menu item
                      <div>
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                          className={clsx(
                            isActive
                              ? 'text-orange-600 bg-orange-50' 
                              : 'text-gray-700 hover:text-orange-600 hover:bg-gray-50',
                            'flex items-center px-4 py-2 text-base font-medium rounded-md transition-all duration-200 focus:outline-none'
                          )}
                        >
                          {item.name}
                          <ChevronDown className={clsx(
                            'ml-2 h-4 w-4 transition-transform duration-200',
                            activeDropdown === item.name ? 'rotate-180' : ''
                          )} />
                        </button>
                        
                        {/* Dropdown menu */}
                        {activeDropdown === item.name && (
                          <div className="absolute top-full left-0 mt-1 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                            <div className="py-2">
                              {item.children.map((child) => {
                                return (
                                  <Link
                                    key={child.name}
                                    to={child.href}
                                    className={clsx(
                                      location.pathname === child.href || location.pathname.startsWith(child.href + '/')
                                        ? 'bg-orange-50 text-orange-700' 
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-orange-600',
                                      'block px-4 py-3 transition-all duration-200 focus:outline-none'
                                    )}
                                  >
                                    <div className="font-medium">{child.name}</div>
                                    {child.description && (
                                      <div className="text-sm text-gray-500 mt-1">{child.description}</div>
                                    )}
                                  </Link>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      // Regular menu item
                      <Link
                        to={item.href}
                        className={clsx(
                          isActive
                            ? 'text-orange-600 bg-orange-50' 
                            : 'text-gray-700 hover:text-orange-600 hover:bg-gray-50',
                          'flex items-center px-4 py-2 text-base font-medium rounded-md transition-all duration-200 focus:outline-none'
                        )}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                )
              })}
            </nav>

            {/* Search Button */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="hidden md:flex items-center px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors focus:outline-none"
              title="검색 (Ctrl+K)"
            >
              <Search className="h-4 w-4 mr-2" />
              <span className="hidden lg:inline">검색</span>
              <kbd className="hidden lg:inline ml-2 px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">⌘K</kbd>
            </button>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg">
              {/* Mobile Search Button */}
              <button
                onClick={() => {
                  setSearchModalOpen(true)
                  setMobileMenuOpen(false)
                }}
                className="w-full flex items-center px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors focus:outline-none"
              >
                <Search className="h-5 w-5 mr-3" />
                검색
              </button>
              {navigation.map((item) => {
                const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/')
                
                return (
                  <div key={item.name}>
                    {item.children ? (
                      // Mobile dropdown menu
                      <div>
                        <div
                          className={clsx(
                            isActive
                              ? 'bg-orange-100 text-orange-900' 
                              : 'text-gray-700',
                            'px-3 py-3 text-base font-medium'
                          )}
                        >
                          <div>{item.name}</div>
                          {item.description && (
                            <div className="text-sm text-gray-500 mt-1">{item.description}</div>
                          )}
                        </div>
                        
                        {/* Mobile submenu */}
                        <div className="ml-6 mt-1 space-y-1">
                          {item.children.map((child) => {
                            return (
                              <Link
                                key={child.name}
                                to={child.href}
                                className={clsx(
                                  location.pathname === child.href || location.pathname.startsWith(child.href + '/')
                                    ? 'bg-orange-50 text-orange-700' 
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-700',
                                  'block px-3 py-2 text-sm font-medium transition-all duration-200 focus:outline-none'
                                )}
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                <div>{child.name}</div>
                                {child.description && (
                                  <div className="text-xs text-gray-500 mt-1">{child.description}</div>
                                )}
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    ) : (
                      // Regular mobile menu item
                      <Link
                        to={item.href}
                        className={clsx(
                          isActive
                            ? 'bg-orange-100 text-orange-900' 
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                          'block px-3 py-3 text-base font-medium transition-all duration-200 focus:outline-none'
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <div>{item.name}</div>
                        {item.description && (
                          <div className="text-sm text-gray-500 mt-1">{item.description}</div>
                        )}
                      </Link>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="pt-16">
        {isServicePage ? (
          <div className="fixed inset-0 top-16 flex flex-col">
            {/* Main Content Area */}
            <div className="flex flex-1 min-h-0">
              {/* Service Sidebar - Fixed to left */}
              <div className="hidden lg:block w-64 h-full overflow-y-auto bg-white border-r border-gray-200 z-10 fixed left-0 top-16">
                <ServiceSidebar />
              </div>
              
              {/* Content Area - Scrollable */}
              <div className="flex-1 min-w-0 lg:ml-64 lg:mr-56 overflow-y-auto scrollbar-hide hover:scrollbar-show">
                <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
                  {/* Documentation Content */}
                  <div className="w-full overflow-x-hidden">
                    {children}
                  </div>
                </div>
              </div>
              
              {/* Table of Contents - Fixed to right edge */}
              <div className="hidden lg:block w-56 h-full overflow-y-auto bg-white border-l border-gray-200 z-10 fixed right-0 top-16">
                <TableOfContents />
              </div>
            </div>
            
          </div>
        ) : (
          <div className="min-h-screen">
            {children}
          </div>
        )}
      </main>
      
      {/* Footer - Only for home page */}
      {location.pathname === '/' && (
        <footer className="bg-gray-50 border-t border-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center text-sm text-gray-600">
              <div className="mb-2">
                <strong>(주)헥토파이낸셜</strong> (06220) 서울특별시 강남구 테헤란로 34길 6, 9~10층 (역삼동, 태광타워)
              </div>
              <div className="mb-2">
                사업자등록번호 : 101-81-63383 | TEL. 1688-5130 | FAX. 02-6008-5158 | E-mail. info_F@hecto.co.kr
              </div>
              <div className="text-gray-500">
                Copyrightⓒ Hecto Financial Co., Ltd. All Rights Reserved.
              </div>
            </div>
          </div>
        </footer>
      )}

      {/* Search Modal */}
      <SearchModal 
        isOpen={searchModalOpen} 
        onClose={() => setSearchModalOpen(false)} 
      />
    </div>
  )
}