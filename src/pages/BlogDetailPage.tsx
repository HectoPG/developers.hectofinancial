import React, { Suspense, lazy } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react'

// 블로그 포스트 메타데이터
const blogPosts = [
  {
    id: '01-sample-article-1',
    title: '헥토파이낸셜 PG 서비스 시작하기',
    description: '헥토파이낸셜 전자결제(PG) 서비스 연동을 위한 첫 번째 단계를 알아보세요.',
    date: '2024-12-05',
    readTime: '5분',
    category: '가이드',
    file: '01-sample-article-1.mdx'
  },
  {
    id: '02-sample-article-2',
    title: '헥토파이낸셜 결제 보안 가이드',
    description: '안전한 결제 시스템 구축을 위한 보안 베스트 프랙티스를 알아보세요.',
    date: '2024-11-28',
    readTime: '8분',
    category: '보안',
    file: '02-sample-article-2.mdx'
  },
  {
    id: '03-sample-article-3',
    title: '헥토파이낸셜 결과통보 URL 설정 가이드',
    description: 'Server-to-Server 결과 통보를 위한 notiUrl 설정 방법을 알아보세요.',
    date: '2024-11-20',
    readTime: '6분',
    category: '기술',
    file: '03-sample-article-3.mdx'
  }
]

const BlogDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  
  // 해당 ID의 블로그 포스트 찾기
  const blogPost = blogPosts.find(post => post.id === id)
  
  if (!blogPost) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">블로그 포스트를 찾을 수 없습니다</h1>
          <Link 
            to="/blog" 
            className="inline-flex items-center text-hecto-600 hover:text-hecto-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            블로그로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  // MDX 컴포넌트 동적 로드
  const MDXComponent = lazy(() => 
    import(`../docs/blog/${blogPost.file}`).catch(() => ({
      default: () => (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">콘텐츠를 불러올 수 없습니다</h2>
          <p className="text-gray-600">MDX 파일을 찾을 수 없습니다.</p>
        </div>
      )
    }))
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link 
            to="/blog" 
            className="inline-flex items-center text-hecto-600 hover:text-hecto-800 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            블로그로 돌아가기
          </Link>
          
          <div className="mb-6">
            <span className="inline-block bg-hecto-100 text-hecto-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
              {blogPost.category}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {blogPost.title}
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              {blogPost.description}
            </p>
            
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {blogPost.date}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {blogPost.readTime}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <Suspense fallback={
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hecto-600 mx-auto mb-4"></div>
              <p className="text-gray-600">콘텐츠를 불러오는 중...</p>
            </div>
          }>
            <MDXComponent />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default BlogDetailPage
