// 문서화 설정 중앙 관리
export interface DocumentItem {
  id: string
  title: string
  path: string
  category: string
  description?: string
  icon?: string
  order?: number
}

export interface CategoryConfig {
  id: string
  name: string
  description: string
  icon: string
  path: string
  color: string
  documents: DocumentItem[]
}

// 문서 카테고리 설정
export const documentationConfig: CategoryConfig[] = [
  {
    id: 'pg',
    name: 'PG 결제',
    description: '',
    icon: 'CreditCard',
    path: '/docs/pg',
    color: 'orange',
    documents: [
      {
        id: 'getting-started',
        title: '시작하기',
        path: '/docs/pg/01-getting-started',
        category: 'PG 결제',
        description: '헥토파이낸셜 전자결제(PG) 서비스 연동 가이드',
        order: 1
      },
      {
        id: 'credit-card',
        title: '신용카드 결제',
        path: '/docs/pg/02-credit-card',
        category: 'PG 결제',
        description: '신용카드 결제 연동 가이드',
        order: 2
      },
      {
        id: 'virtual-account',
        title: '가상계좌 결제',
        path: '/docs/pg/03-virtual-account',
        category: 'PG 결제',
        description: '가상계좌 발급 및 입금 확인',
        order: 3
      },
      {
        id: 'bank-transfer',
        title: '계좌이체 결제',
        path: '/docs/pg/04-bank-transfer',
        category: 'PG 결제',
        description: '실시간 계좌이체 결제 연동',
        order: 4
      },
      {
        id: 'mobile-payment',
        title: '휴대폰 결제',
        path: '/docs/pg/05-mobile-payment',
        category: 'PG 결제',
        description: '휴대폰 소액결제 연동',
        order: 5
      },
      {
        id: 'gift-card',
        title: '상품권 결제',
        path: '/docs/pg/06-gift-card',
        category: 'PG 결제',
        description: '상품권 결제 연동',
        order: 6
      },
      {
        id: 'point-damoa',
        title: '포인트 다모아',
        path: '/docs/pg/07-point-damoa',
        category: 'PG 결제',
        description: '포인트 다모아 연동',
        order: 7
      },
      {
        id: 'simple-payment',
        title: '간편결제',
        path: '/docs/pg/08-simple-payment',
        category: 'PG 결제',
        description: '간편결제 연동',
        order: 8
      },
      {
        id: 'transaction-management',
        title: '거래 관리',
        path: '/docs/pg/09-transaction-management',
        category: 'PG 결제',
        description: '거래 조회 및 관리 기능',
        order: 9
      },
      {
        id: 'developer-reference',
        title: '개발자 참조',
        path: '/docs/pg/10-developer-reference',
        category: 'PG 결제',
        description: 'API 참조 및 개발 가이드',
        order: 10
      }
    ]
  },
  {
    id: 'ezauth',
    name: '내통장결제',
    description: '',
    icon: 'Banknote',
    path: '/docs/ezauth',
    color: 'blue',
    documents: [
      {
        id: 'ezauth-guide',
        title: '내통장결제 연동',
        path: '/docs/ezauth/hecto_financial_ezauth',
        category: '내통장결제',
        description: '실시간 계좌이체 서비스 연동 방법',
        order: 1
      }
    ]
  },
  {
    id: 'ezcp',
    name: '간편현금결제',
    description: '',
    icon: 'FileText',
    path: '/docs/ezcp',
    color: 'green',
    documents: [
      {
        id: 'ezcp-guide',
        title: '간편현금결제 연동',
        path: '/docs/ezcp/hecto_financial_ezcp',
        category: '간편현금결제',
        description: '현금 결제 서비스 연동 방법',
        order: 1
      }
    ]
  },
  {
    id: 'whitelabel',
    name: '화이트라벨',
    description: '',
    icon: 'Layers',
    path: '/docs/whitelabel',
    color: 'purple',
    documents: [
      {
        id: 'whitelabel-guide',
        title: '화이트라벨 연동',
        path: '/docs/whitelabel/hecto_financial_whitelabel',
        category: '화이트라벨',
        description: '통합 결제 서비스 연동 방법',
        order: 1
      }
    ]
  }
]

// API 문서 설정
export const apiDocsConfig: DocumentItem = {
  id: 'api-docs',
  title: 'API 문서',
  path: '/api-docs',
  category: 'API',
  description: '인터랙티브 API 문서에서 모든 API를 한눈에 보고 테스트해보세요'
}

// 유틸리티 함수들
export const getAllDocuments = (): DocumentItem[] => {
  const allDocs: DocumentItem[] = []
  
  documentationConfig.forEach(category => {
    allDocs.push(...category.documents)
  })
  
  allDocs.push(apiDocsConfig)
  
  return allDocs.sort((a, b) => (a.order || 0) - (b.order || 0))
}

export const getCategoryByPath = (path: string): CategoryConfig | null => {
  return documentationConfig.find(category => path.startsWith(category.path)) || null
}

export const getDocumentByPath = (path: string): DocumentItem | null => {
  const allDocs = getAllDocuments()
  return allDocs.find(doc => doc.path === path) || null
}

export const getCategoryDescription = (categoryId: string): string => {
  const category = documentationConfig.find(cat => cat.id === categoryId)
  return category?.description || ''
}

// 네비게이션용 카테고리 정보
export const getNavigationCategories = () => {
  return documentationConfig.map(category => ({
    name: category.name,
    href: category.path,
    description: category.description,
    icon: category.icon,
    children: category.documents.map(doc => ({
      name: doc.title,
      href: doc.path,
      description: doc.description || `${doc.title} 관련 문서`
    }))
  }))
}
