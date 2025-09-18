import { type ApiDocument, type ApiCategory } from '../config/apiDocumentation';

// MDX 파일에서 API 정보를 자동으로 스캔하는 유틸리티
export const scanApiDocuments = async (): Promise<ApiCategory[]> => {
  // Vite의 glob import를 사용해서 모든 MDX 파일 스캔
  const modules = import.meta.glob('../docs/api/**/*.mdx', { eager: true });

  const categories: Map<string, ApiCategory> = new Map();

  for (const [filePath, module] of Object.entries(modules)) {
    try {
      // 파일 경로에서 정보 추출: ../docs/api/pg/credit-card/01-card-payment.mdx
      const pathParts = filePath.split('/');
      const categoryId = pathParts[3]; // 'pg'
      const subcategoryId = pathParts[4]; // 'credit-card'
      const fileName = pathParts[5].replace('.mdx', ''); // '01-card-payment'

      // MDX에서 export된 apiInfo 가져오기
      const apiInfo = (module as any)?.apiInfo;

      if (!apiInfo) {
        console.warn(`No apiInfo found in ${filePath}`);
        continue;
      }

      // 파일명에서 순서 추출 (01-, 02- 등)
      const orderMatch = fileName.match(/^(\d+)-/);
      const order = orderMatch ? parseInt(orderMatch[1]) : 999;

      // URL 경로 생성
      const docPath = `/docs/api/${categoryId}/${subcategoryId}/${fileName}`;

      // ApiDocument 생성
      const document: ApiDocument = {
        id: fileName,
        title: apiInfo.title,
        path: docPath,
        category: getCategoryName(categoryId),
        subcategory: getSubcategoryName(subcategoryId),
        description: apiInfo.description,
        order: order
      };

      // 카테고리가 없으면 생성
      if (!categories.has(categoryId)) {
        categories.set(categoryId, {
          id: categoryId,
          name: getCategoryName(categoryId),
          description: getCategoryDescription(categoryId),
          icon: getCategoryIcon(categoryId),
          color: getCategoryColor(categoryId),
          subcategories: []
        });
      }

      const category = categories.get(categoryId)!;

      // 서브카테고리 찾기 또는 생성
      let subcategory = category.subcategories.find(sub => sub.id === subcategoryId);
      if (!subcategory) {
        subcategory = {
          id: subcategoryId,
          name: getSubcategoryName(subcategoryId),
          documents: []
        };
        category.subcategories.push(subcategory);
      }

      // 문서 추가
      subcategory.documents.push(document);

    } catch (error) {
      console.warn(`Failed to process ${filePath}:`, error);
    }
  }

  // 정렬 및 반환
  const result = Array.from(categories.values());

  // 각 카테고리의 서브카테고리와 문서들을 정렬
  result.forEach(category => {
    category.subcategories.forEach(subcategory => {
      subcategory.documents.sort((a, b) => (a.order || 999) - (b.order || 999));
    });
  });

  return result;
};

// 카테고리 ID를 이름으로 변환
function getCategoryName(categoryId: string): string {
  const names: Record<string, string> = {
    'pg': 'PG 결제',
    'ezauth': '내통장결제',
    'ezcp': '간편현금결제',
    'whitelabel': '화이트라벨'
  };
  return names[categoryId] || categoryId;
}

// 카테고리 설명
function getCategoryDescription(categoryId: string): string {
  const descriptions: Record<string, string> = {
    'pg': 'PG 결제 관련 API 문서',
    'ezauth': '내통장결제 관련 API 문서',
    'ezcp': '간편현금결제 관련 API 문서',
    'whitelabel': '화이트라벨 관련 API 문서'
  };
  return descriptions[categoryId] || `${categoryId} 관련 API 문서`;
}

// 카테고리 아이콘
function getCategoryIcon(categoryId: string): string {
  const icons: Record<string, string> = {
    'pg': 'CreditCard',
    'ezauth': 'Banknote',
    'ezcp': 'Wallet',
    'whitelabel': 'Store'
  };
  return icons[categoryId] || 'FileText';
}

// 카테고리 색상
function getCategoryColor(categoryId: string): string {
  const colors: Record<string, string> = {
    'pg': 'orange',
    'ezauth': 'blue',
    'ezcp': 'green',
    'whitelabel': 'purple'
  };
  return colors[categoryId] || 'gray';
}

// 서브카테고리 이름
function getSubcategoryName(subcategoryId: string): string {
  const names: Record<string, string> = {
    'credit-card': '신용카드',
    'virtual-account': '가상계좌',
    'transaction-management': '거래관리',
    'bank-transfer': '계좌이체',
    'account-inquiry': '계좌조회',
    'payment': '결제',
    'transfer': '송금',
    'integration': '통합'
  };
  return names[subcategoryId] || subcategoryId.replace('-', ' ');
}