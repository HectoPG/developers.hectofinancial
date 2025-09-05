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

        const id = heading.id || `heading-${index}`
        if (!heading.id) {
          heading.id = id
        }

        const level = parseInt(heading.tagName.substring(1))
        const text = heading.textContent?.trim() || ''

        // 파라미터 관련 헤딩 제외 (ParameterCard 컴포넌트 내부나 파라미터 관련 텍스트)
        const isParameterHeading = heading.closest('[data-parameter]') || 
                                  text.includes('파라미터') || 
                                  text.includes('Parameters') ||
                                  text.includes('parameter')

        // 빈 텍스트나 파라미터 관련 헤딩은 제외
        if (text && !isParameterHeading) {
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
          }
        })
      },
      {
        rootMargin: '-100px 0px -80% 0px',
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
      const headerHeight = 80 // 고정 헤더 높이
      const elementPosition = element.offsetTop - headerHeight
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      })
    }
  }

  if (toc.length === 0) {
    return null
  }

  return (
    <div className={clsx('sticky top-24', className)}>
      <div className="p-4 max-h-[calc(100vh-120px)] overflow-hidden hover:overflow-y-auto">
        <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center whitespace-nowrap">
          <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          목차
        </h4>
        <nav className="space-y-1">
          {toc.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToHeading(item.id)}
              className={clsx(
                'block w-full text-left py-2 px-3 text-sm rounded transition-colors whitespace-nowrap overflow-hidden text-ellipsis',
                item.level === 1 && 'font-semibold',
                item.level === 2 && 'pl-4',
                item.level === 3 && 'pl-6',
                item.level === 4 && 'pl-8',
                item.level >= 5 && 'pl-10',
                activeId === item.id
                  ? 'bg-hecto-50 text-hecto-700 border-l-2 border-hecto-400'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
              title={item.text} // 전체 텍스트를 툴팁으로 표시
            >
              {item.text}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}