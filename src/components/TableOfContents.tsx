import { useState, useEffect } from 'react'
import clsx from 'clsx'

interface TocItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  className?: string
}

export default function TableOfContents({ className }: TableOfContentsProps) {
  const [toc, setToc] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    // 콘텐츠가 로드될 때까지 잠시 기다린 후 헤딩 요소를 찾기
    const updateToc = () => {
      // 메인 콘텐츠 영역의 헤딩만 선택 (네비게이션 제외)
      const contentArea = document.querySelector('main')
      if (!contentArea) return

      const headings = contentArea.querySelectorAll('h1, h2, h3, h4, h5, h6')
      const tocItems: TocItem[] = []

      headings.forEach((heading, index) => {
        // 네비게이션이나 헤더의 헤딩은 제외
        if (heading.closest('header') || heading.closest('nav')) return

        // MDX 컴포넌트 내부의 헤딩은 제외 (순수 마크다운 헤딩만 포함)
        if (heading.closest('[data-exclude-from-toc]') ||
            heading.closest('[data-mdx-component]') || 
            heading.closest('.mdx-component') ||
            heading.closest('div[class*="component"]') ||
            heading.closest('div[class*="grid"]') ||
            heading.closest('div[class*="FeatureGrid"]')) return

        const id = heading.id || `heading-${index}`
        if (!heading.id) {
          heading.id = id
        }

        const level = parseInt(heading.tagName.substring(1))
        const text = heading.textContent?.trim() || ''

        // 빈 텍스트는 제외, h1-h3까지만 포함
        if (text && level <= 3) {
          tocItems.push({ id, text, level })
        }
      })

      setToc(tocItems)
    }

    // 즉시 실행
    updateToc()

    // MutationObserver로 DOM 변경 감지
    const observer = new MutationObserver((mutations) => {
      let shouldUpdate = false
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const addedNodes = Array.from(mutation.addedNodes)
          const removedNodes = Array.from(mutation.removedNodes)
          
          // 헤딩 요소가 추가되거나 제거되었는지 확인
          const hasHeadingChanges = [...addedNodes, ...removedNodes].some(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element
              return element.matches('h1, h2, h3, h4, h5, h6') || 
                     element.querySelector('h1, h2, h3, h4, h5, h6')
            }
            return false
          })
          
          if (hasHeadingChanges) {
            shouldUpdate = true
          }
        }
      })

      if (shouldUpdate) {
        setTimeout(updateToc, 100) // 약간의 지연을 두어 DOM이 완전히 업데이트되도록
      }
    })

    // 메인 콘텐츠 영역 관찰
    const main = document.querySelector('main')
    if (main) {
      observer.observe(main, {
        childList: true,
        subtree: true
      })
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
            
            // 목차에서 해당 항목으로 자동 스크롤
            const tocElement = document.querySelector(`[data-toc-id="${entry.target.id}"]`)
            if (tocElement) {
              tocElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
              })
            }
          }
        })
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: 0
      }
    )

    // 모든 헤딩 요소를 관찰
    toc.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [toc])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      // 서비스 페이지인지 확인 (메인 콘텐츠 영역이 스크롤되는 경우)
      const isServicePage = window.location.pathname.startsWith('/docs/')
      
      if (isServicePage) {
        // 서비스 페이지에서는 메인 콘텐츠 영역을 스크롤
        const contentArea = document.querySelector('.flex-1.min-w-0.lg\\:ml-64.lg\\:mr-56.overflow-y-auto')
        if (contentArea) {
          const elementPosition = element.offsetTop - 20 // 약간의 여백
          contentArea.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
          })
        }
      } else {
        // 일반 페이지에서는 전체 페이지를 스크롤
        const headerHeight = 80 // 고정 헤더 높이
        const elementPosition = element.offsetTop - headerHeight
        
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        })
      }
    }
  }

  if (toc.length === 0) {
    return null
  }

  return (
    <div className={clsx('', className)}>
      <div className="p-4 max-h-[calc(100vh-120px)] overflow-hidden hover:overflow-y-auto">
        <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center whitespace-nowrap">
          목차
        </h4>
        <nav className="space-y-1">
          {toc.map((item) => (
            <div key={item.id} className="relative">
              {/* 수직 선 */}
              {item.level > 1 && (
                <div 
                  className="absolute left-0 top-0 bottom-0 w-px bg-gray-200"
                  style={{
                    left: `${(item.level - 1) * 16}px`,
                    height: '100%'
                  }}
                />
              )}
              
              <button
                onClick={() => scrollToHeading(item.id)}
                data-toc-id={item.id}
                className={clsx(
                  'block w-full text-left py-2 px-3 text-sm rounded transition-colors whitespace-nowrap overflow-hidden text-ellipsis relative z-10 focus:outline-none',
                  item.level === 1 && 'font-semibold pl-3',
                  item.level === 2 && 'pl-7',
                  item.level === 3 && 'pl-11',
                  item.level === 4 && 'pl-15',
                  item.level >= 5 && 'pl-19',
                  activeId === item.id
                    ? 'text-hecto-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
                title={item.text} // 전체 텍스트를 툴팁으로 표시
              >
                {item.text}
              </button>
            </div>
          ))}
        </nav>
      </div>
    </div>
  )
}