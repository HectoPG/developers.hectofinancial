import { BookOpen, Shield, Zap, Code, Settings, HelpCircle } from 'lucide-react'

export interface BlogPost {
  id: string
  title: string
  description: string
  date: string
  readTime: string
  category: string
  featured: boolean
  tags: string[]
  icon: string
  slug: string
  thumbnail?: string
  content?: string
}

export interface BlogPostWithIcon extends BlogPost {
  iconComponent: any
  bgColor: string
  borderColor: string
  iconColor: string
}

// 아이콘 매핑
const iconMap: Record<string, any> = {
  BookOpen,
  Shield,
  Zap,
  Code,
  Settings,
  HelpCircle
}

// 카테고리별 색상 매핑
const categoryColors: Record<string, { bg: string; border: string; icon: string }> = {
  '가이드': { bg: 'bg-white', border: 'border-gray-100', icon: 'text-hecto-500' },
  '보안': { bg: 'bg-white', border: 'border-gray-100', icon: 'text-red-500' },
  '기술': { bg: 'bg-white', border: 'border-gray-100', icon: 'text-blue-500' },
  '업데이트': { bg: 'bg-white', border: 'border-gray-100', icon: 'text-green-500' },
  '소식': { bg: 'bg-white', border: 'border-gray-100', icon: 'text-purple-500' }
}

/**
 * MDX 파일에서 frontmatter를 파싱합니다
 */
export function parseFrontmatter(content: string): Partial<BlogPost> {
  const frontmatterRegex = /^---\s*\n(.*?)\n---\s*\n(.*)$/s
  const match = content.match(frontmatterRegex)
  
  if (!match) {
    return {}
  }
  
  const frontmatterContent = match[1]
  const frontmatter: Partial<BlogPost> = {}
  
  // YAML 파싱 (간단한 버전)
  const lines = frontmatterContent.split('\n')
  for (const line of lines) {
    const [key, ...valueParts] = line.split(':')
    if (key && valueParts.length > 0) {
      const value = valueParts.join(':').trim()
      const cleanKey = key.trim()
      
      if (cleanKey === 'tags') {
        // 배열 파싱
        const arrayMatch = value.match(/\[(.*?)\]/)
        if (arrayMatch) {
          frontmatter.tags = arrayMatch[1]
            .split(',')
            .map(tag => tag.trim().replace(/"/g, ''))
        }
      } else if (cleanKey === 'featured') {
        frontmatter.featured = value === 'true'
      } else {
        (frontmatter as any)[cleanKey] = value.replace(/"/g, '')
      }
    }
  }
  
  return frontmatter
}

/**
 * 파일명에서 slug를 추출합니다
 */
export function extractSlugFromFilename(filename: string): string {
  return filename.replace(/\.mdx?$/, '')
}

/**
 * 블로그 포스트에 아이콘과 스타일을 추가합니다
 */
export function enhanceBlogPost(post: BlogPost): BlogPostWithIcon {
  const iconComponent = iconMap[post.icon] || BookOpen
  const colors = categoryColors[post.category] || categoryColors['가이드']
  
  return {
    ...post,
    iconComponent,
    bgColor: colors.bg,
    borderColor: colors.border,
    iconColor: colors.icon
  }
}

/**
 * 블로그 포스트들을 날짜순으로 정렬합니다
 */
export function sortPostsByDate(posts: BlogPost[]): BlogPost[] {
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
