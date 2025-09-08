import { useState, useEffect, useRef } from 'react'

interface CountUpProps {
  end: number
  duration?: number
  start?: number
  suffix?: string
  prefix?: string
  className?: string
}

export default function CountUp({ 
  end, 
  duration = 2000, 
  start = 0, 
  suffix = '', 
  prefix = '',
  className = ''
}: CountUpProps) {
  const [count, setCount] = useState(start)
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      // easeOutCubic 이징 함수
      const easeOutCubic = 1 - Math.pow(1 - progress, 3)
      const currentCount = start + (end - start) * easeOutCubic
      
      setCount(Math.floor(currentCount))
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [isVisible, end, start, duration])

  // 숫자 포맷팅 (천 단위 콤마)
  const formatNumber = (num: number): string => {
    if (num >= 100000000) { // 1억 이상
      return (num / 100000000).toFixed(1) + '억'
    } else if (num >= 10000) { // 1만 이상
      return (num / 10000).toFixed(0) + '만'
    } else if (num >= 1000) { // 1천 이상
      return (num / 1000).toFixed(0) + '천'
    }
    return num.toLocaleString()
  }

  return (
    <span ref={elementRef} className={className}>
      {prefix}{formatNumber(count)}{suffix}
    </span>
  )
}
