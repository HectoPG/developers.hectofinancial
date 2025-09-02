import { useParams, Link } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ArrowLeft, FileText, ExternalLink } from 'lucide-react'

// 미리 정의된 lazy 컴포넌트들
const PgGettingStarted = lazy(() => import('../docs/pg/01-getting-started.mdx'))
const PgCreditCard = lazy(() => import('../docs/pg/02-credit-card.mdx'))
const PgVirtualAccount = lazy(() => import('../docs/pg/03-virtual-account.mdx'))
const PgBankTransfer = lazy(() => import('../docs/pg/04-bank-transfer.mdx'))
const PgMobilePayment = lazy(() => import('../docs/pg/05-mobile-payment.mdx'))
const PgGiftCard = lazy(() => import('../docs/pg/06-gift-card.mdx'))
const PgPointDamoa = lazy(() => import('../docs/pg/07-point-damoa.mdx'))
const PgSimplePayment = lazy(() => import('../docs/pg/08-simple-payment.mdx'))
const PgTransactionManagement = lazy(() => import('../docs/pg/09-transaction-management.mdx'))
const PgDeveloperReference = lazy(() => import('../docs/pg/10-developer-reference.mdx'))
const EzAuth = lazy(() => import('../docs/ezauth/hecto_financial_ezauth.mdx'))
const EzCp = lazy(() => import('../docs/ezcp/hecto_financial_ezcp.mdx'))
const WhiteLabel = lazy(() => import('../docs/whitelabel/hecto_financial_whitelabel.mdx'))

// 동적으로 MDX 컴포넌트를 선택하는 함수
const getMdxComponent = (category: string, page?: string) => {
  // 페이지가 지정된 경우 해당 페이지를 로드
  if (page) {
    switch (`${category}/${page}`) {
      case 'pg/getting-started':
        return PgGettingStarted
      case 'pg/credit-card':
        return PgCreditCard
      case 'pg/virtual-account':
        return PgVirtualAccount
      case 'pg/bank-transfer':
        return PgBankTransfer
      case 'pg/mobile-payment':
        return PgMobilePayment
      case 'pg/gift-card':
        return PgGiftCard
      case 'pg/point-damoa':
        return PgPointDamoa
      case 'pg/simple-payment':
        return PgSimplePayment
      case 'pg/transaction-management':
        return PgTransactionManagement
      case 'pg/developer-reference':
        return PgDeveloperReference
      default:
        return null
    }
  }
  
  // 기본 카테고리 페이지
  switch (category) {
    case 'pg':
      return PgGettingStarted
    case 'ezauth':
      return EzAuth
    case 'ezcp':
      return EzCp
    case 'whitelabel':
      return WhiteLabel
    default:
      return null
  }
}

const categoryNames: Record<string, string> = {
  pg: 'PG 결제',
  ezauth: '내통장결제',
  ezcp: '간편현금결제',
  whitelabel: '화이트라벨',
}

const categoryDescriptions: Record<string, string> = {
  pg: '신용카드 결제 서비스 연동 가이드',
  ezauth: '간편 계좌 결제 서비스 연동 가이드',
  ezcp: '현금 결제 서비스 연동 가이드',
  whitelabel: '통합 결제 서비스 연동 가이드',
}

const categoryColors: Record<string, string> = {
  pg: 'bg-hecto-400',
  ezauth: 'bg-green-500',
  ezcp: 'bg-purple-500',
  whitelabel: 'bg-hecto-600',
}

export default function DocsPage() {
  const { category, page } = useParams<{ category: string; page?: string }>()
  
  // 디버깅을 위한 로그
  console.log('DocsPage render:', { category, page })
  
  if (!category) {
    return (
      <div className="text-center py-16">
        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">카테고리를 찾을 수 없습니다</h1>
        <p className="text-gray-600 mb-6">올바른 문서 카테고리를 선택해주세요.</p>
        <Link 
          to="/" 
          className="inline-flex items-center px-4 py-2 bg-hecto-400 text-white rounded-lg hover:bg-hecto-500 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          홈으로 돌아가기
        </Link>
      </div>
    )
  }

  const MdxComponent = getMdxComponent(category, page)
  
  // 컴포넌트 로딩 상태 로그
  console.log('MDX Component:', MdxComponent ? 'Found' : 'Not found', { category, page })
  
  if (!MdxComponent) {
    return (
      <div className="text-center py-16">
        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">문서를 찾을 수 없습니다</h1>
        <p className="text-gray-600 mb-6">요청하신 카테고리의 문서가 존재하지 않습니다.</p>
        <Link 
          to="/" 
          className="inline-flex items-center px-4 py-2 bg-hecto-400 text-white rounded-lg hover:bg-hecto-500 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          홈으로 돌아가기
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link 
          to="/" 
          className="inline-flex items-center text-hecto-600 hover:text-hecto-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          홈으로 돌아가기
        </Link>
      </div>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
        <div className="flex items-start">
          <div className={`${categoryColors[category]} p-4 rounded-xl mr-6`}>
            <FileText className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {categoryNames[category] || category}
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              {categoryDescriptions[category]}
            </p>
            <div className="flex items-center gap-4">
              <div className={`h-1 w-20 ${categoryColors[category]} rounded`}></div>
              <span className="text-sm text-gray-500">개발자 문서</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="prose prose-lg max-w-none p-8">
          <Suspense 
            key={`${category}-${page || 'default'}`}
            fallback={
              <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hecto-400 mb-4"></div>
                <p className="text-gray-600">문서를 불러오는 중...</p>
              </div>
            }
          >
            <MdxComponent key={`mdx-${category}-${page || 'default'}`} />
          </Suspense>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 bg-gray-50 rounded-xl p-6 text-center">
        <p className="text-gray-600 mb-4">더 자세한 정보가 필요하신가요?</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#"
            className="inline-flex items-center px-4 py-2 bg-hecto-400 text-white rounded-lg hover:bg-hecto-500 transition-colors"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            API 레퍼런스
          </a>
          <a
            href="#"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors"
          >
            고객센터 문의
          </a>
        </div>
      </div>
    </div>
  )
}
