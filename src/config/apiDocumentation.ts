// API 문서 설정 중앙 관리
export interface ApiDocument {
  id: string;
  title: string;
  path: string;
  category: string;
  subcategory: string;
  description?: string;
  order?: number;
}

export interface ApiSubcategory {
  id: string;
  name: string;
  documents: ApiDocument[];
}

export interface ApiCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  subcategories: ApiSubcategory[];
}

// API 문서 카테고리 설정
export const apiDocumentationConfig: ApiCategory[] = [
  {
    id: 'pg',
    name: 'PG 결제',
    description: 'PG 결제 관련 API 문서',
    icon: 'CreditCard',
    color: 'orange',
    subcategories: [
      {
        id: 'credit-card',
        name: '신용카드',
        documents: [
          {
            id: 'card-payment-ui',
            title: '신용카드 결제 (UI)',
            path: '/docs/api/pg/credit-card/01-card-payment-ui',
            category: 'PG 결제',
            subcategory: '신용카드',
            description: '신용카드 UI 결제 API',
            order: 1
          },
          {
            id: 'card-payment-non-ui',
            title: '신용카드 결제 (Non-UI)',
            path: '/docs/api/pg/credit-card/02-card-payment-non-ui',
            category: 'PG 결제',
            subcategory: '신용카드',
            description: '신용카드 Non-UI 결제 API',
            order: 2
          },
          {
            id: 'card-billkey-payment',
            title: '신용카드 빌키 결제',
            path: '/docs/api/pg/credit-card/03-card-billkey-payment',
            category: 'PG 결제',
            subcategory: '신용카드',
            description: '신용카드 빌키를 이용한 결제 API',
            order: 3
          },
          {
            id: 'card-billkey-issue',
            title: '신용카드 빌키 발급',
            path: '/docs/api/pg/credit-card/04-card-billkey-issue',
            category: 'PG 결제',
            subcategory: '신용카드',
            description: '신용카드 빌키 발급 API',
            order: 4
          },
          {
            id: 'card-billkey-delete',
            title: '신용카드 빌키 삭제',
            path: '/docs/api/pg/credit-card/05-card-billkey-delete',
            category: 'PG 결제',
            subcategory: '신용카드',
            description: '신용카드 빌키 삭제 API',
            order: 5
          },
          {
            id: 'card-cancel',
            title: '신용카드 취소',
            path: '/docs/api/pg/credit-card/06-card-cancel',
            category: 'PG 결제',
            subcategory: '신용카드',
            description: '신용카드 결제 취소 API',
            order: 6
          }
        ]
      },
      {
        id: 'virtual-account',
        name: '가상계좌',
        documents: [
          {
            id: 'virtual-account-create',
            title: '가상계좌 발급',
            path: '/docs/api/pg/virtual-account/04-virtual-account',
            category: 'PG 결제',
            subcategory: '가상계좌',
            description: '가상계좌 발급 API',
            order: 1
          }
        ]
      },
      {
        id: 'transaction-management',
        name: '거래관리',
        documents: [
          {
            id: 'payment-cancel',
            title: '결제 취소',
            path: '/docs/api/pg/transaction-management/03-payment-cancel',
            category: 'PG 결제',
            subcategory: '거래관리',
            description: '결제 취소 API',
            order: 1
          },
          {
            id: 'transaction-inquiry',
            title: '거래 조회',
            path: '/docs/api/pg/transaction-management/05-transaction-inquiry',
            category: 'PG 결제',
            subcategory: '거래관리',
            description: '거래 조회 API',
            order: 2
          }
        ]
      }
    ]
  }
];

// 유틸리티 함수들
export const getAllApiDocuments = (): ApiDocument[] => {
  const allDocs: ApiDocument[] = [];
  
  apiDocumentationConfig.forEach(category => {
    category.subcategories.forEach(subcategory => {
      allDocs.push(...subcategory.documents);
    });
  });
  
  return allDocs.sort((a, b) => (a.order || 0) - (b.order || 0));
};

export const getApiCategoryByPath = (path: string): ApiCategory | null => {
  return apiDocumentationConfig.find(category => 
    category.subcategories.some(sub => 
      sub.documents.some(doc => path.startsWith(doc.path))
    )
  ) || null;
};

export const getApiDocumentByPath = (path: string): ApiDocument | null => {
  const allDocs = getAllApiDocuments();
  return allDocs.find(doc => doc.path === path) || null;
};

export const getApiSubcategoryByPath = (path: string): ApiSubcategory | null => {
  for (const category of apiDocumentationConfig) {
    for (const subcategory of category.subcategories) {
      if (subcategory.documents.some(doc => path.startsWith(doc.path))) {
        return subcategory;
      }
    }
  }
  return null;
};
