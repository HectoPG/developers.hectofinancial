import { Link } from 'react-router-dom'
import { CreditCard, Banknote, FileText, Layers, ArrowRight, Zap, Shield, BookOpen, Users, CheckCircle, ExternalLink, Calendar } from 'lucide-react'
import CountUp from '../components/CountUp'

const services = [
  {
    name: 'PG 결제',
    description: '신용카드, 간편결제, 가상계좌까지 모든 결제 수단 지원',
    href: '/docs/pg',
    icon: CreditCard,
    color: 'bg-blue-500',
    features: ['신용카드 결제', '간편결제', '가상계좌', '해외카드']
  },
  {
    name: '내통장결제',
    description: '실시간 계좌이체로 빠르고 안전한 결제 서비스',
    href: '/docs/ezauth',
    icon: Banknote,
    color: 'bg-green-500',
    features: ['실시간 이체', '계좌 인증', '잔액 조회', 'API 연동']
  },
  {
    name: '간편현금결제',
    description: '현금 결제를 더욱 간편하게 처리하는 솔루션',
    href: '/docs/ezcp',
    icon: FileText,
    color: 'bg-purple-500',
    features: ['현금영수증', '세금계산서', '간편 정산', '리포트']
  },
  {
    name: '화이트라벨',
    description: '통합 결제 서비스로 모든 결제를 한 번에 관리',
    href: '/docs/whitelabel',
    icon: Layers,
    color: 'bg-hecto-500',
    features: ['통합 대시보드', '멀티 결제', '브랜딩', '커스텀 UI']
  },
]

const news = [
  {
    title: '헥토파이낸셜 개발자 문서 사이트 오픈',
    description: 'PG, 내통장결제, 간편현금결제, 화이트라벨 서비스의 통합 개발자 가이드를 제공합니다.',
    date: '2025.09.05',
    category: '오픈',
    href: '/blog'
  },
  {
    title: 'PG 결제 서비스 연동 가이드 업데이트',
    description: '신용카드, 가상계좌, 계좌이체 등 모든 결제 수단의 상세한 연동 방법을 확인하세요.',
    date: '2025.09.05',
    category: '가이드',
    href: '/docs/pg'
  },
  {
    title: '내통장결제(ezauth) API 문서 공개',
    description: '실시간 계좌이체와 계좌 인증을 위한 ezauth 서비스 연동 방법을 알아보세요.',
    date: '2025.09.05',
    category: 'API',
    href: '/docs/ezauth'
  }
]

const stats = [
  { label: '누적 거래액', value: 1000000000000, unit: '원', suffix: '+' },
  { label: '연동 기업', value: 10000, unit: '개', suffix: '+' },
  { label: '일 거래량', value: 1000000, unit: '건', suffix: '+' },
  { label: '서비스 가동률', value: 100, unit: '%' }
]

export default function HomePage() {
  return (
    <div className="space-y-0">
      {/* Hero Section - Corporate Style */}
      <section className="relative bg-white py-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-hecto-50 opacity-60"></div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <img 
                src="/logo.svg" 
                alt="헥토파이낸셜 로고" 
                className="mx-auto h-12 md:h-16 w-auto"
              />
            </div>
            <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto leading-relaxed">
              헥토파이낸셜의 결제 서비스로 고객에게 최상의 결제 경험을 제공하세요.<br />
              빠른 연동부터 안정적인 운영까지 모든 것을 지원합니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/docs/pg"
                className="inline-flex items-center px-8 py-3 text-base font-semibold text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
                style={{ backgroundColor: '#ff9566' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f07a42' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ff9566' }}
              >
                개발 시작하기
                <ArrowRight className="ml-3 h-5 w-5" />
              </Link>
              <a
                href="#services"
                className="inline-flex items-center px-8 py-3 text-base font-semibold bg-white hover:bg-gray-50 border-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                style={{ color: '#e6652a', borderColor: '#ffc199' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ffb089' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#ffc199' }}
              >
                서비스 둘러보기
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-8" style={{ backgroundColor: '#ff9566' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                  <CountUp 
                    end={stat.value}
                    duration={2500}
                    suffix={stat.suffix || ''}
                    className="text-2xl md:text-3xl font-bold text-white"
                  />
                  <span className="text-white opacity-80 text-lg ml-1">{stat.unit}</span>
                </div>
                <div className="text-white opacity-90 font-medium text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              서비스 안내
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              다양한 결제 방식을 하나의 플랫폼에서 통합 관리할 수 있습니다
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <div
                  key={service.name}
                  className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl p-6 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-center mb-4">
                    <div 
                      className="p-3 rounded-xl mr-3"
                      style={{ backgroundColor: '#ffb089' }}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {service.name}
                      </h3>
                      <p className="text-sm text-gray-600">{service.description}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="grid grid-cols-2 gap-2">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-hecto-500 mr-2" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Link
                    to={service.href}
                    className="inline-flex items-center text-hecto-600 hover:text-hecto-700 font-semibold transition-colors"
                  >
                    자세히 보기
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Why Hecto Financial
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              안정성과 편의성을 모두 갖춘 결제 서비스로 고객의 성공을 지원합니다
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl p-6 transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">금융권 보안</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  금융위원회 인증과 PCI DSS 준수로 최고 수준의 보안을 보장합니다.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl p-6 transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                  <Zap className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">빠른 정산</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  실시간 정산 시스템으로 매출을 즉시 확인하고 관리할 수 있습니다.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl p-6 transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">전문 지원</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  24시간 전담 지원팀이 연동부터 운영까지 모든 과정을 도와드립니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                최신 소식
              </h2>
              <p className="text-lg text-gray-600">
                헥토파이낸셜의 새로운 소식을 확인하세요
              </p>
            </div>
            <Link
              to="/news"
              className="hidden md:inline-flex items-center text-hecto-600 hover:text-hecto-700 font-semibold transition-colors"
            >
              전체 보기
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {news.map((item, index) => (
              <article key={index} className="group cursor-pointer">
                <Link to={item.href} className="block">
                  <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 h-full">
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-hecto-100 text-hecto-800">
                        {item.category}
                      </span>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        {item.date}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-hecto-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-3">
                      {item.description}
                    </p>
                    <div className="flex items-center text-hecto-600 group-hover:text-hecto-700 font-medium">
                      <span className="text-sm">더 읽기</span>
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
          
          <div className="text-center mt-8 md:hidden">
            <Link
              to="/news"
              className="inline-flex items-center text-hecto-600 hover:text-hecto-700 font-semibold transition-colors"
            >
              전체 소식 보기
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 bg-gradient-to-r from-hecto-500 to-hecto-600">
        <div className="max-w-4xl mx-auto text-center px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            지금 바로 시작하세요
          </h2>
          <p className="text-lg text-hecto-100 mb-6 max-w-2xl mx-auto">
            헥토파이낸셜과 함께 성장하는 비즈니스를 경험해보세요.<br />
            전문 상담을 통해 최적의 결제 솔루션을 제안해드립니다.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/docs/pg"
              className="inline-flex items-center px-6 py-3 text-base font-semibold bg-white hover:bg-gray-50 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              style={{ color: '#e6652a' }}
            >
              <BookOpen className="mr-3 h-5 w-5" />
              개발 문서 보기
            </Link>
            <a
              href="mailto:business@hectofinancial.com"
              className="inline-flex items-center px-6 py-3 text-base font-semibold text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 border-2"
              style={{ backgroundColor: '#e6652a', borderColor: '#ffb089' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#cc5722' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#e6652a' }}
            >
              상담 문의하기
              <ArrowRight className="ml-3 h-5 w-5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}