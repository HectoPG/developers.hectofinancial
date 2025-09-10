import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, ArrowRight, Code } from 'lucide-react'
import { useBlogPosts } from '../hooks/useBlogPosts'

const BlogPage: React.FC = () => {
  const { featuredPosts, latestPosts, loading, error } = useBlogPosts()

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hecto-500 mx-auto mb-4"></div>
          <p className="text-gray-600">블로그 포스트를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">오류가 발생했습니다: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-hecto-500 text-white rounded-lg hover:bg-hecto-600 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              블로그
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              헥토파이낸셜 개발자 블로그입니다. 
              기술 아티클과 소식을 확인해보세요.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 추천 글 섹션 */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">추천 글</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPosts.map((post) => {
              const IconComponent = post.iconComponent
              return (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className={`${post.bgColor} ${post.borderColor} border rounded-2xl p-6 hover:shadow-md transition-all duration-200 group shadow-sm`}
                >
                  <div className="flex items-center mb-4">
                    <div className={`p-2 rounded-xl bg-hecto-100 ${post.iconColor}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-600">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-hecto-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {post.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {post.date}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {post.readTime}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* 최신 아티클 섹션 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">최신 아티클</h2>
          <div className="space-y-6">
            {latestPosts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-all duration-200 group flex flex-col sm:flex-row shadow-sm"
              >
                <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                  <div className="w-full sm:w-48 h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center border border-gray-200 overflow-hidden">
                    {post.thumbnail ? (
                      <img 
                        src={post.thumbnail} 
                        alt={post.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          const nextElement = e.currentTarget.nextElementSibling as HTMLElement
                          if (nextElement) {
                            nextElement.style.display = 'flex'
                          }
                        }}
                      />
                    ) : null}
                    <div className="w-full h-full flex items-center justify-center" style={{ display: post.thumbnail ? 'none' : 'flex' }}>
                      <Code className="w-8 h-8 text-gray-500" />
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="inline-block bg-hecto-100 text-hecto-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-hecto-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {post.description}
                  </p>
                  <div className="flex items-center text-xs text-gray-500">
                    <div className="flex items-center mr-4">
                      <Calendar className="w-3 h-3 mr-1" />
                      {post.date}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default BlogPage
