import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, FileText, CreditCard, Banknote, Layers, Home, ChevronDown, ChevronRight } from 'lucide-react'
import clsx from 'clsx'

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
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [pgMenuOpen, setPgMenuOpen] = useState(false)
  const location = useLocation()

  // PG 경로에 있으면 자동으로 메뉴 열기
  const isPgPath = location.pathname.startsWith('/docs/pg')
  
  // PG 메뉴 열림 상태 관리
  const shouldShowPgSubmenu = pgMenuOpen || isPgPath

  // 서브메뉴 클릭 시 드롭다운 닫기
  const handleSubmenuClick = () => {
    console.log('Submenu clicked, closing dropdown')
    setPgMenuOpen(false)
    setSidebarOpen(false)
  }

  // PG 메뉴 클릭 핸들러
  const handlePgMenuClick = () => {
    console.log('PG menu clicked, navigating to /docs/pg')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile sidebar */}
      <div className={clsx(
        'fixed inset-0 flex z-40 md:hidden',
        sidebarOpen ? 'block' : 'hidden'
      )}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white bg-gray-600 hover:bg-gray-700 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <Link to="/" className="flex-shrink-0 flex items-center px-4 mb-6 hover:opacity-80 transition-opacity">
              <img src="/site-mark.svg" alt="헥토파이낸셜 로고" className="h-8" />
            </Link>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/')
                
                return (
                  <div key={item.name}>
                    {item.children ? (
                      // PG 메뉴 (드롭다운)
                      <div>
                        <div className="flex">
                          <Link
                            to={item.href}
                            className={clsx(
                              isActive
                                ? 'bg-hecto-100 text-hecto-900' 
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                              'group flex items-center flex-1 px-2 py-2 text-base font-medium rounded-l-md'
                            )}
                            onClick={() => {
                              handlePgMenuClick()
                              setSidebarOpen(false)
                            }}
                          >
                            <Icon className="mr-4 h-6 w-6" />
                            <div>
                              <div>{item.name}</div>
                              {item.description && (
                                <div className="text-sm text-gray-500">{item.description}</div>
                              )}
                            </div>
                          </Link>
                          <button
                            onClick={() => setPgMenuOpen(!pgMenuOpen)}
                            className={clsx(
                              isActive
                                ? 'bg-hecto-100 text-hecto-900 hover:bg-hecto-200' 
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                              'px-3 py-2 rounded-r-md border-l border-gray-200'
                            )}
                          >
                            {shouldShowPgSubmenu ? (
                              <ChevronDown className="h-5 w-5" />
                            ) : (
                              <ChevronRight className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                        
                        {/* PG 서브메뉴 */}
                        {shouldShowPgSubmenu && (
                          <div className="mt-1 ml-6 space-y-1">
                            {item.children.map((child) => (
                              <Link
                                key={child.name}
                                to={child.href}
                                className={clsx(
                                  location.pathname === child.href
                                    ? 'bg-hecto-50 text-hecto-700 border-l-2 border-hecto-400' 
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:border-l-2 hover:border-gray-300',
                                  'group flex items-center px-3 py-2 text-sm font-medium rounded-r-md'
                                )}
                                onClick={handleSubmenuClick}
                              >
                                <div>
                                  <div>{child.name}</div>
                                  {child.description && (
                                    <div className="text-xs text-gray-500">{child.description}</div>
                                  )}
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      // 일반 메뉴
                      <Link
                        to={item.href}
                        className={clsx(
                          isActive
                            ? 'bg-hecto-100 text-hecto-900' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                          'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                        )}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <Icon className="mr-4 h-6 w-6" />
                        <div>
                          <div>{item.name}</div>
                          {item.description && (
                            <div className="text-sm text-gray-500">{item.description}</div>
                          )}
                        </div>
                      </Link>
                    )}
                  </div>
                )
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white shadow-lg">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <Link to="/" className="flex items-center flex-shrink-0 px-4 mb-6 hover:opacity-80 transition-opacity">
              <img src="/site-mark.svg" alt="헥토파이낸셜 로고" className="h-8" />
            </Link>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/')
                
                return (
                  <div key={item.name}>
                    {item.children ? (
                      // PG 메뉴 (드롭다운)
                      <div>
                        <div className="flex">
                          <Link
                            to={item.href}
                            className={clsx(
                              isActive
                                ? 'bg-hecto-50 text-hecto-900 border-r-2 border-hecto-400' 
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:border-r-2 hover:border-gray-300',
                              'group flex items-center flex-1 px-2 py-3 text-sm font-medium rounded-l-md transition-all duration-200'
                            )}
                            onClick={handlePgMenuClick}
                          >
                            <Icon className="mr-3 h-6 w-6" />
                            <div>
                              <div>{item.name}</div>
                              {item.description && (
                                <div className="text-xs text-gray-500">{item.description}</div>
                              )}
                            </div>
                          </Link>
                          <button
                            onClick={() => setPgMenuOpen(!pgMenuOpen)}
                            className={clsx(
                              isActive
                                ? 'bg-hecto-50 text-hecto-900 hover:bg-hecto-100 border-r-2 border-hecto-400' 
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:border-r-2 hover:border-gray-300',
                              'px-3 py-3 rounded-r-md border-l border-gray-200 transition-all duration-200'
                            )}
                          >
                            {shouldShowPgSubmenu ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        
                        {/* PG 서브메뉴 */}
                        {shouldShowPgSubmenu && (
                          <div className="mt-1 ml-4 space-y-1">
                            {item.children.map((child) => (
                              <Link
                                key={child.name}
                                to={child.href}
                                className={clsx(
                                  location.pathname === child.href
                                    ? 'bg-hecto-100 text-hecto-800 border-r-2 border-hecto-500' 
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700 hover:border-r-2 hover:border-gray-300',
                                  'group flex items-center px-3 py-2 text-xs font-medium rounded-l-md transition-all duration-200'
                                )}
                                onClick={() => setPgMenuOpen(false)}
                              >
                                <div className="w-2 h-2 bg-current rounded-full mr-3 opacity-50"></div>
                                <div>
                                  <div>{child.name}</div>
                                  {child.description && (
                                    <div className="text-xs text-gray-400 mt-0.5">{child.description}</div>
                                  )}
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      // 일반 메뉴
                      <Link
                        to={item.href}
                        className={clsx(
                          isActive
                            ? 'bg-hecto-50 text-hecto-900 border-r-2 border-hecto-400' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:border-r-2 hover:border-gray-300',
                          'group flex items-center px-2 py-3 text-sm font-medium rounded-l-md transition-all duration-200'
                        )}
                      >
                        <Icon className="mr-3 h-6 w-6" />
                        <div>
                          <div>{item.name}</div>
                          {item.description && (
                            <div className="text-xs text-gray-500">{item.description}</div>
                          )}
                        </div>
                      </Link>
                    )}
                  </div>
                )
              })}
            </nav>
          </div>
        </div>
      </div>

      <div className="md:pl-64 flex flex-col flex-1">
        {/* Top bar for mobile */}
        <div className="sticky top-0 z-10 md:hidden bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              type="button"
              className="h-10 w-10 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-hecto-400 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
              <img src="/site-mark.svg" alt="헥토파이낸셜 로고" className="h-6" />
            </Link>
            <div className="w-10"></div> {/* Spacer for balance */}
          </div>
        </div>
        
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
