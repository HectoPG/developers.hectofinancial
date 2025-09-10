import { useState, useEffect } from 'react'
import type { BlogPostWithIcon } from '../utils/blogUtils'
import { enhanceBlogPost } from '../utils/blogUtils'
import { 
  blogConfig, 
  getFeaturedPosts, 
  getLatestPosts 
} from '../config/blog'

export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPostWithIcon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      // 설정 파일에서 블로그 데이터 로드
      const blogPosts = blogConfig

      // 아이콘/스타일 추가
      const enhancedPosts = blogPosts.map(enhanceBlogPost)
      
      setPosts(enhancedPosts)
    } catch (err) {
      setError(err instanceof Error ? err.message : '블로그 포스트를 로드하는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  const featuredPosts = getFeaturedPosts(blogConfig).map(enhanceBlogPost)
  const latestPosts = getLatestPosts(blogConfig, 3).map(enhanceBlogPost)

  return {
    posts,
    featuredPosts,
    latestPosts,
    loading,
    error
  }
}
