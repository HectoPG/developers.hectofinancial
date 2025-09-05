import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, ArrowRight, BookOpen, Code, Shield, Zap } from 'lucide-react'

const BlogPage: React.FC = () => {
  // 추천 글 데이터 (샘플)
  const featuredPosts = [
    {
      id: "01-sample-article-1",
      title: "헥토파이낸셜 PG 서비스 시작하기",
      description: "헥토파이낸셜 전자결제(PG) 서비스 연동을 위한 첫 번째 단계를 알아보세요.",
      date: "2024-12-05",
      readTime: "5분",
      category: "가이드",
      icon: BookOpen,
      bgColor: "bg-hecto-50",
      borderColor: "border-hecto-200",
      iconColor: "text-hecto-600"
    },
    {
      id: "02-sample-article-2",
      title: "헥토파이낸셜 결제 보안 가이드",
      description: "안전한 결제 시스템 구축을 위한 보안 베스트 프랙티스를 알아보세요.",
      date: "2024-11-28",
      readTime: "8분",
      category: "보안",
      icon: Shield,
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      iconColor: "text-emerald-600"
    },
    {
      id: "03-sample-article-3",
      title: "헥토파이낸셜 결과통보 URL 설정 가이드",
      description: "Server-to-Server 결과 통보를 위한 notiUrl 설정 방법을 알아보세요.",
      date: "2024-11-20",
      readTime: "6분",
      category: "기술",
      icon: Zap,
      bgColor: "bg-violet-50",
      borderColor: "border-violet-200",
      iconColor: "text-violet-600"
    }
  ]

  // 최신 아티클 데이터 (샘플)
  const latestPosts = [
    {
      id: "01-sample-article-1",
      title: "헥토파이낸셜 PG 서비스 시작하기",
      description: "헥토파이낸셜 전자결제(PG) 서비스 연동을 위한 첫 번째 단계를 알아보세요.",
      date: "2024-12-05",
      readTime: "5분",
      category: "가이드",
      thumbnail: "/api/placeholder/300/200"
    },
    {
      id: "02-sample-article-2",
      title: "헥토파이낸셜 결제 보안 가이드",
      description: "안전한 결제 시스템 구축을 위한 보안 베스트 프랙티스를 알아보세요.",
      date: "2024-11-28",
      readTime: "8분",
      category: "보안",
      thumbnail: "/api/placeholder/300/200"
    },
    {
      id: "03-sample-article-3",
      title: "헥토파이낸셜 결과통보 URL 설정 가이드",
      description: "Server-to-Server 결과 통보를 위한 notiUrl 설정 방법을 알아보세요.",
      date: "2024-11-20",
      readTime: "6분",
      category: "기술",
      thumbnail: "/api/placeholder/300/200"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-hecto-50 to-white border-b border-gray-200">
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
              const IconComponent = post.icon
              return (
                <Link
                  key={post.id}
                  to={`/blog/${post.id}`}
                  className={`${post.bgColor} ${post.borderColor} border rounded-xl p-6 hover:shadow-lg transition-all duration-200 group`}
                >
                  <div className="flex items-center mb-4">
                    <div className={`p-2 rounded-lg ${post.bgColor} ${post.iconColor}`}>
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
                to={`/blog/${post.id}`}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all duration-200 group flex flex-col sm:flex-row"
              >
                <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                  <div className="w-full sm:w-48 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border border-gray-200">
                    <Code className="w-8 h-8 text-gray-500" />
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
