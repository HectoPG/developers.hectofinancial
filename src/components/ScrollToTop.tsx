import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // 페이지 이동 시 최상단으로 스크롤
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // 부드러운 스크롤 애니메이션
    })
  }, [pathname])

  return null
}
