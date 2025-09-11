// 블로그 설정 중앙 관리
export interface BlogPost {
  id: string
  slug: string
  title: string
  description: string
  date: string
  readTime: string
  category: string
  featured: boolean
  tags: string[]
  icon: string
  thumbnail?: string
  order?: number
}

/*
블로그 포스트 설정
새로운 블로그 포스트 추가 방법
src/config/blog.ts 파일에서 blogConfig 배열에 새 항목 추가
*/
export const blogConfig: BlogPost[] = [
  {
    id: "01-sample-article-1",
    slug: "01-sample-article-1",
    title: "헥토파이낸셜 PG 서비스 시작하기",
    description: "헥토파이낸셜 전자결제(PG) 서비스 연동을 위한 첫 번째 단계를 알아보세요.",
    date: "2024-12-05",
    readTime: "5분",
    category: "가이드",
    featured: true, // 추천글 설정
    tags: ["PG", "시작하기", "가이드"],
    icon: "BookOpen",
    thumbnail: "/images/blog/sample-stamp.jpg",
    order: 1
  },
  {
    id: "02-sample-article-2",
    slug: "02-sample-article-2",
    title: "헥토파이낸셜 결제 보안 가이드",
    description: "안전한 결제 시스템 구축을 위한 보안 베스트 프랙티스를 알아보세요.",
    date: "2024-11-28",
    readTime: "8분",
    category: "보안",
    featured: true,
    tags: ["보안", "PG", "암호화"],
    icon: "Shield",
    thumbnail: "/images/blog/sample-stamp.jpg",
    order: 2
  },
  {
    id: "03-sample-article-3",
    slug: "03-sample-article-3",
    title: "헥토파이낸셜 결과통보 URL 설정 가이드",
    description: "Server-to-Server 결과 통보를 위한 notiUrl 설정 방법을 알아보세요.",
    date: "2024-11-20",
    readTime: "6분",
    category: "기술",
    featured: false,
    tags: ["결과통보", "notiUrl", "서버통신"],
    icon: "Zap",
    thumbnail: "/images/blog/sample-stamp.jpg",
    order: 3
  }
]

// 카테고리별 색상 설정
export const categoryColors: Record<string, { bg: string; border: string; icon: string }> = {
  '가이드': { bg: 'bg-white', border: 'border-gray-100', icon: 'text-hecto-500' },
  '보안': { bg: 'bg-white', border: 'border-gray-100', icon: 'text-red-500' },
  '기술': { bg: 'bg-white', border: 'border-gray-100', icon: 'text-blue-500' },
  '업데이트': { bg: 'bg-white', border: 'border-gray-100', icon: 'text-green-500' },
  '소식': { bg: 'bg-white', border: 'border-gray-100', icon: 'text-purple-500' }
}

// 유틸리티 함수들
export function getFeaturedPosts(posts: BlogPost[]): BlogPost[] {
  return posts.filter(post => post.featured)
}

export function getLatestPosts(posts: BlogPost[], limit: number = 3): BlogPost[] {
  return posts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
}

export function getPostsByCategory(posts: BlogPost[], category: string): BlogPost[] {
  return posts.filter(post => post.category === category)
}

export function getPostsByTag(posts: BlogPost[], tag: string): BlogPost[] {
  return posts.filter(post => post.tags.includes(tag))
}
