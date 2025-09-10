import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import clsx from 'clsx'
import { documentationConfig } from '../config/documentation'

// 중앙화된 설정에서 서비스 네비게이션 생성
const generateServiceNavigation = () => {
  return documentationConfig.map(category => {
    const hasChildren = category.documents.length > 1
    
    if (hasChildren) {
      return {
        name: category.name,
        href: category.path,
        children: category.documents.map(doc => ({
          name: doc.title,
          href: doc.path,
          description: doc.description || `${doc.title} 관련 문서`
        }))
      }
    } else {
      return {
        name: category.name,
        href: category.path,
        description: category.description
      }
    }
  })
}

const serviceNavigation = generateServiceNavigation()

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
    <div className={clsx('w-full h-full', className)}>
      <div className="p-4">
        <nav className="space-y-2">
          {serviceNavigation.map((service) => {
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
                          ? 'text-hecto-600' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      )}
                    >
                      <div className="flex items-center">
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
                    <div className={clsx(
                      'overflow-hidden transition-all duration-300 ease-in-out',
                      isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                    )}>
                      <div className="mt-1 ml-8 space-y-1">
                        {service.children.map((child) => (
                          <Link
                            key={child.name}
                            to={child.href}
                            className={clsx(
                              'block px-3 py-2 text-sm rounded-md transition-colors focus:outline-none',
                              location.pathname === child.href
                                ? 'text-hecto-600 font-medium'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            )}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Service without children
                  <Link
                    to={service.href}
                    className={clsx(
                      'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none',
                                isActive 
                                  ? 'text-hecto-600' 
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
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