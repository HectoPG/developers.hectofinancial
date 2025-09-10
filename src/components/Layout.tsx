import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, FileText, Layers, Home, ChevronDown, BookOpen, Search, ChevronUp } from 'lucide-react'
import clsx from 'clsx'
import TableOfContents from './TableOfContents'
import ServiceSidebar from './ServiceSidebar'
import SearchModal from './SearchModal'
import { getNavigationCategories } from '../config/documentation'
import { getIcon } from '../utils/icons'

// 중앙화된 설정에서 네비게이션 생성
const generateNavigation = () => {
  const categories = getNavigationCategories()
  
  return [
    { name: '홈', href: '/', icon: Home },
    { 
      name: '서비스', 
      href: '/services', 
      icon: Layers, 
      description: '결제 서비스',
      children: categories.map(category => ({
        name: category.name,
        href: category.href,
        description: category.description,
        icon: getIcon(category.icon)
      }))
    },
    { name: 'API 문서', href: '/api-docs', icon: BookOpen, description: '인터랙티브 API 문서' },
    { name: '블로그', href: '/blog', icon: FileText, description: '기술 블로그 및 소식' },
  ]
}

const navigation = generateNavigation()


interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [mobileExpandedItems, setMobileExpandedItems] = useState<string[]>([])
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
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
    setMobileExpandedItems([])
    setMobileSidebarOpen(false)
  }, [location.pathname])

  // Toggle mobile menu item expansion
  const toggleMobileExpanded = (itemName: string) => {
    setMobileExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    )
  }

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
      <header className={clsx(
        "fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100"
      )}>
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
                // 서비스 페이지인지 확인 (docs로 시작하는 경로)
                const isServicePage = location.pathname.startsWith('/docs/')
                const isServiceMenu = item.name === '서비스'
                
                return (
                  <div key={item.name} className="relative">
                    {item.children ? (
                      // Dropdown menu item
                      <div>
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                          className={clsx(
                        isActive || (isServicePage && isServiceMenu)
                          ? 'text-hecto-600'
                          : 'text-gray-700 hover:text-hecto-600 hover:bg-gray-50',
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
                        <div className={clsx(
                          'absolute top-full left-0 mt-1 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 transition-all duration-300 ease-out overflow-hidden',
                          activeDropdown === item.name ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        )}>
                          <div className="py-2">
                              {item.children.map((child) => {
                                return (
                                  <Link
                                    key={child.name}
                                    to={child.href}
                                    className={clsx(
                                      location.pathname === child.href || location.pathname.startsWith(child.href + '/')
                                        ? 'bg-gray-50 text-hecto-600' 
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-hecto-600',
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
                        
                      </div>
                    ) : (
                      // Regular menu item
                      <Link
                        to={item.href}
                        className={clsx(
                          isActive
                            ? 'text-hecto-600' 
                            : 'text-gray-700 hover:text-hecto-600 hover:bg-gray-50',
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
        <div className={clsx(
          "md:hidden border-t border-gray-200 bg-white transition-all duration-500 ease-out overflow-hidden",
          mobileMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        )}>
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
                // 서비스 페이지인지 확인 (docs로 시작하는 경로)
                const isServicePage = location.pathname.startsWith('/docs/')
                const isServiceMenu = item.name === '서비스'
                
                return (
                  <div key={item.name}>
                    {item.children ? (
                      // Mobile dropdown menu
                      <div>
                        <button
                          onClick={() => toggleMobileExpanded(item.name)}
                          className={clsx(
                            'w-full flex items-center justify-between px-3 py-3 text-base font-medium transition-colors focus:outline-none',
                            isActive || (isServicePage && isServiceMenu)
                              ? 'text-hecto-600'
                              : 'text-gray-700 hover:bg-gray-50'
                          )}
                        >
                          <div className="text-left">
                            <div>{item.name}</div>
                            {item.description && (
                              <div className="text-sm text-gray-500 mt-1">{item.description}</div>
                            )}
                          </div>
                          <ChevronDown 
                            className={clsx(
                              'h-4 w-4 transition-transform duration-200',
                              mobileExpandedItems.includes(item.name) ? 'rotate-180' : ''
                            )} 
                          />
                        </button>
                        
                        {/* Mobile submenu */}
                        <div className={clsx(
                          'overflow-hidden transition-all duration-300 ease-in-out',
                          mobileExpandedItems.includes(item.name) ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
                        )}>
                          <div className="ml-6 mt-1 space-y-1">
                            {item.children.map((child) => {
                              // 서비스 하위 메뉴인 경우 해당 서비스의 첫 번째 문서로 이동
                              const servicePath = child.href === '/docs/pg' ? '/docs/pg/01-getting-started' :
                                                child.href === '/docs/ezauth' ? '/docs/ezauth' :
                                                child.href === '/docs/ezcp' ? '/docs/ezcp' :
                                                child.href === '/docs/whitelabel' ? '/docs/whitelabel' :
                                                child.href;
                              
                              return (
                                <Link
                                  key={child.name}
                                  to={servicePath}
                                  className={clsx(
                                    location.pathname === child.href || location.pathname.startsWith(child.href + '/')
                                      ? 'bg-gray-50 text-hecto-600' 
                                      : 'text-gray-600 hover:bg-gray-50 hover:text-hecto-600',
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
                      </div>
                    ) : (
                      // Regular mobile menu item
                      <Link
                        to={item.href}
                        className={clsx(
                          isActive
                            ? 'bg-hecto-100 text-hecto-900' 
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
      </header>

      {/* Main content */}
      <main className="pt-16">
        {isServicePage ? (
          <div className="fixed inset-0 top-16 flex flex-col">
            {/* Mobile Sidebar Toggle */}
            <div className="lg:hidden flex items-center justify-between px-4 py-1 bg-white z-20">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                  className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-all duration-200 focus:outline-none"
                >
                  {mobileSidebarOpen ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-2" />
                      목록
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-2" />
                      목록
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {/* Mobile Sidebar Content */}
            <div className={clsx(
              "lg:hidden bg-white border-b border-gray-200 transition-all duration-500 ease-out overflow-hidden",
              mobileSidebarOpen ? "max-h-[700px] opacity-100" : "max-h-0 opacity-0"
            )}>
              <div className="pb-4 px-4">
                <ServiceSidebar />
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-1 min-h-0">
              {/* Service Sidebar - Desktop */}
              <div className="hidden lg:block w-64 h-full overflow-y-auto bg-white border-r border-gray-200 z-10 fixed left-0 top-16">
                <ServiceSidebar />
              </div>
              
              
              
              {/* Content Area - Scrollable */}
              <div className="flex-1 min-w-0 lg:ml-64 lg:mr-56 overflow-y-auto docs-scrollbar">
                <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
                  {/* Documentation Content */}
                  <div className="w-full overflow-x-hidden">
                    {children}
                  </div>
                </div>
              </div>
              
              {/* Table of Contents - Desktop */}
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