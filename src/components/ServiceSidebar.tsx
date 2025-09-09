import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, CreditCard, Banknote, FileText, Layers } from 'lucide-react'
import clsx from 'clsx'

const serviceNavigation = [
  { 
    name: 'PG 결제', 
    href: '/docs/pg', 
    icon: CreditCard,
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

interface ServiceSidebarProps {
  className?: string
}

export default function ServiceSidebar({ className }: ServiceSidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(['PG 결제'])
  const location = useLocation()

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    )
  }

  // 현재 경로에 따라 자동으로 펼치기
  useEffect(() => {
    serviceNavigation.forEach(service => {
      if (service.children && service.children.some(child => location.pathname.startsWith(child.href))) {
        setExpandedItems(prev => prev.includes(service.name) ? prev : [...prev, service.name])
      }
    })
  }, [location.pathname])

  return (
    <div className={clsx('w-full h-full overflow-y-auto scrollbar-hide hover:scrollbar-show', className)}>
      <div className="p-4">
        <nav className="space-y-2">
          {serviceNavigation.map((service) => {
            const Icon = service.icon
            const isActive = location.pathname === service.href || location.pathname.startsWith(service.href + '/')
            const isExpanded = expandedItems.includes(service.name)
            
            return (
              <div key={service.name}>
                {service.children ? (
                  // Service with children
                  <div>
                    <button
                      onClick={() => toggleExpanded(service.name)}
                      className={clsx(
                        'w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none',
                        isActive 
                          ? 'bg-orange-50 text-orange-700' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      )}
                    >
                      <div className="flex items-center">
                        <Icon className="h-5 w-5 mr-3" />
                        {service.name}
                      </div>
                      <ChevronDown 
                        className={clsx(
                          'h-4 w-4 transition-transform duration-200',
                          isExpanded ? 'rotate-180' : ''
                        )} 
                      />
                    </button>
                    
                    {/* Children */}
                    {isExpanded && (
                      <div className="mt-1 ml-8 space-y-1">
                        {service.children.map((child) => (
                          <Link
                            key={child.name}
                            to={child.href}
                            className={clsx(
                              'block px-3 py-2 text-sm rounded-md transition-colors focus:outline-none',
                              location.pathname === child.href
                                ? 'bg-orange-100 text-orange-800 font-medium'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            )}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  // Service without children
                  <Link
                    to={service.href}
                    className={clsx(
                      'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none',
                      isActive 
                        ? 'bg-orange-50 text-orange-700' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {service.name}
                  </Link>
                )}
              </div>
            )
          })}
        </nav>
      </div>
    </div>
  )
}