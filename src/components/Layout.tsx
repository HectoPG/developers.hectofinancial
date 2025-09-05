import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, FileText, CreditCard, Banknote, Layers, Home, ChevronDown } from 'lucide-react'
import clsx from 'clsx'
import TableOfContents from './TableOfContents'

const navigation = [
  { name: '홈', href: '/', icon: Home },
  { 
    name: 'PG 결제', 
    href: '/docs/pg', 
    icon: CreditCard, 
    description: '신용카드 결제 서비스',
    children: [
      { name: '시작하기', href: '/docs/pg', description: '개요 및 기본 설정' },
      { name: '신용카드', href: '/docs/pg/credit-card', description: '신용카드 결제' },
      { name: '가상계좌', href: '/docs/pg/virtual-account', description: '가상계좌 발급 및 입금' },
      { name: '계좌이체', href: '/docs/pg/bank-transfer', description: '실시간 계좌이체' },
      { name: '휴대폰 결제', href: '/docs/pg/mobile-payment', description: '휴대폰 소액결제' },
      { name: '상품권 결제', href: '/docs/pg/gift-card', description: '각종 상품권 결제' },
      { name: '포인트 다모아', href: '/docs/pg/point-damoa', description: '포인트 결제 서비스' },
      { name: '간편결제', href: '/docs/pg/simple-payment', description: '페이코, 카카오페이 등' },
      { name: '거래 조회 및 관리', href: '/docs/pg/transaction-management', description: '거래대사, 정산대사' },
      { name: '개발자 참조', href: '/docs/pg/developer-reference', description: '에러코드, 카드사 코드' },
    ]
  },
  { name: '내통장결제', href: '/docs/ezauth', icon: Banknote, description: '간편 계좌 결제 서비스' },
  { name: '간편현금결제', href: '/docs/ezcp', icon: FileText, description: '현금 결제 서비스' },
  { name: '화이트라벨', href: '/docs/whitelabel', icon: Layers, description: '통합 결제 서비스' },
]

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const location = useLocation()
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 문서 페이지인지 확인
  const isDocsPage = location.pathname.startsWith('/docs')

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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
              <img src="/site-mark.svg" alt="헥토파이낸셜 로고" className="h-8" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1" ref={dropdownRef}>
              {navigation.map((item) => {
                const Icon = item.icon
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
                              ? 'text-hecto-600 bg-hecto-50' 
                              : 'text-gray-700 hover:text-hecto-600 hover:bg-gray-50',
                            'flex items-center px-4 py-2 text-base font-medium rounded-md transition-all duration-200'
                          )}
                        >
                          <Icon className="mr-2 h-5 w-5" />
                          {item.name}
                          <ChevronDown className={clsx(
                            'ml-2 h-4 w-4 transition-transform duration-200',
                            activeDropdown === item.name ? 'rotate-180' : ''
                          )} />
                        </button>
                        
                        {/* Dropdown menu */}
                        {activeDropdown === item.name && (
                          <div className="absolute top-full left-0 mt-1 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                            <div className="py-2">
                              {item.children.map((child) => (
                                <Link
                                  key={child.name}
                                  to={child.href}
                                  className={clsx(
                                    location.pathname === child.href
                                      ? 'bg-hecto-50 text-hecto-700 border-l-4 border-hecto-400' 
                                      : 'text-gray-700 hover:bg-gray-50 hover:text-hecto-600',
                                    'block px-4 py-3 transition-all duration-200'
                                  )}
                                >
                                  <div className="font-medium">{child.name}</div>
                                  {child.description && (
                                    <div className="text-sm text-gray-500 mt-1">{child.description}</div>
                                  )}
                                </Link>
                              ))}
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
                            ? 'text-hecto-600 bg-hecto-50' 
                            : 'text-gray-700 hover:text-hecto-600 hover:bg-gray-50',
                          'flex items-center px-4 py-2 text-base font-medium rounded-md transition-all duration-200'
                        )}
                      >
                        <Icon className="mr-2 h-5 w-5" />
                        {item.name}
                      </Link>
                    )}
                  </div>
                )
              })}
            </nav>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
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
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/')
                
                return (
                  <div key={item.name}>
                    <Link
                      to={item.href}
                      className={clsx(
                        isActive
                          ? 'bg-hecto-100 text-hecto-900 border-l-4 border-hecto-400' 
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                        'flex items-center px-3 py-3 text-base font-medium transition-all duration-200'
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon className="mr-3 h-6 w-6" />
                      <div>
                        <div>{item.name}</div>
                        {item.description && (
                          <div className="text-sm text-gray-500 mt-1">{item.description}</div>
                        )}
                      </div>
                    </Link>
                    
                    {/* Mobile submenu */}
                    {item.children && isActive && (
                      <div className="ml-6 mt-1 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            to={child.href}
                            className={clsx(
                              location.pathname === child.href
                                ? 'bg-hecto-50 text-hecto-700 border-l-2 border-hecto-400' 
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-700',
                              'block px-3 py-2 text-sm font-medium transition-all duration-200'
                            )}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <div>{child.name}</div>
                            {child.description && (
                              <div className="text-xs text-gray-500 mt-1">{child.description}</div>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main>
        {isDocsPage ? (
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
            <div className="flex gap-8">
              {/* Documentation Content */}
              <div className="flex-1">
                {children}
              </div>
              
              {/* Table of Contents - Desktop only */}
              <div className="hidden xl:block w-64">
                <TableOfContents />
              </div>
            </div>
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  )
}