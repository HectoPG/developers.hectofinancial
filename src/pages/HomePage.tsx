import { Link } from 'react-router-dom'
import { CreditCard, Banknote, FileText, Layers, ArrowRight } from 'lucide-react'

const services = [
  {
    name: 'PG 결제',
    description: '신용카드 결제 서비스 연동 가이드',
    href: '/docs/pg',
    icon: CreditCard,
    color: 'bg-hecto-400',
  },
  {
    name: '내통장결제',
    description: '간편 계좌 결제 서비스 연동 가이드',
    href: '/docs/ezauth',
    icon: Banknote,
    color: 'bg-green-500',
  },
  {
    name: '간편현금결제',
    description: '현금 결제 서비스 연동 가이드',
    href: '/docs/ezcp',
    icon: FileText,
    color: 'bg-purple-500',
  },
  {
    name: '화이트라벨',
    description: '통합 결제 서비스 연동 가이드',
    href: '/docs/whitelabel',
    icon: Layers,
    color: 'bg-hecto-600',
  },
]

export default function HomePage() {
  return (
    <div className="py-8 md:py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-hecto-400 rounded-2xl mb-6">
          <span className="text-white font-bold text-2xl">H</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          헥토파이낸셜 개발자 가이드
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          안전하고 간편한 결제 서비스 연동을 위한<br />
          완전한 API 문서와 개발 가이드를 제공합니다
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/docs/pg"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-hecto-400 hover:bg-hecto-500 transition-colors duration-200"
          >
            빠른 시작하기
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <a
            href="#services"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            서비스 둘러보기
          </a>
        </div>
      </div>

      {/* Services Section */}
      <div id="services" className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">결제 서비스</h2>
          <p className="text-lg text-gray-600">다양한 결제 서비스 중에서 필요한 서비스를 선택하세요</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <Link
                key={service.name}
                to={service.href}
                className="group relative bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-200 hover:-translate-y-1"
              >
                <div className="flex items-start mb-6">
                  <div className={`${service.color} p-4 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-hecto-600 mb-2 transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{service.description}</p>
                  </div>
                </div>
                <div className="flex items-center text-hecto-600 group-hover:text-hecto-700 font-medium">
                  <span className="text-sm">문서 보기</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-hecto-50 to-hecto-100 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300 -z-10"></div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Getting Started Section */}
      <div className="bg-gradient-to-r from-hecto-50 to-hecto-100 rounded-2xl p-8 md:p-12 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">시작하기</h2>
          <p className="text-lg text-gray-600">3단계로 간단하게 결제 서비스를 연동하세요</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="relative">
              <div className="bg-hecto-400 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              {/* Connection line */}
              <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-hecto-200 -translate-x-1/2"></div>
            </div>
            <h3 className="font-semibold text-gray-900 mb-3 text-lg">서비스 선택</h3>
            <p className="text-gray-600">PG, 내통장결제, 간편현금결제, 화이트라벨 중 필요한 서비스를 선택하세요</p>
          </div>
          
          <div className="text-center">
            <div className="relative">
              <div className="bg-hecto-400 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-hecto-200 -translate-x-1/2"></div>
            </div>
            <h3 className="font-semibold text-gray-900 mb-3 text-lg">API 문서 확인</h3>
            <p className="text-gray-600">상세한 연동 가이드와 API 명세서를 통해 개발 방법을 확인하세요</p>
          </div>
          
          <div className="text-center">
            <div className="bg-hecto-400 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-white font-bold text-xl">3</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-3 text-lg">연동 개발</h3>
            <p className="text-gray-600">제공된 예시 코드와 샘플을 활용하여 빠르게 연동을 완료하세요</p>
          </div>
        </div>
        
        <div className="text-center mt-10">
          <Link
            to="/docs/pg"
            className="inline-flex items-center px-8 py-4 bg-white text-hecto-600 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-hecto-200 hover:border-hecto-300"
          >
            지금 시작하기
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
