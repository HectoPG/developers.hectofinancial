import React, { useState, useEffect, Suspense } from 'react';
import { Play, FileText } from 'lucide-react';
import Layout from '../components/Layout';
import ApiSidebar from '../components/ApiSidebar';
import ApiTestPanel from '../components/ApiTestPanel';

// API 문서 타입 정의
interface ApiDocument {
  id: string;
  title: string;
  path: string;
  category: string;
  subcategory: string;
}

const ApiDocsPage: React.FC = () => {
  const [selectedApi, setSelectedApi] = useState<ApiDocument | null>(null);
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set(['PG 결제']));
  const [expandedSubcategories, setExpandedSubcategories] = useState<Set<string>>(new Set(['PG 결제-신용카드']));
  const [ApiComponent, setApiComponent] = useState<React.ComponentType | null>(null);
  const [loading, setLoading] = useState(true);

  // API 문서 목록 (정적 정의) - 3단계 구조
  const apiDocuments: ApiDocument[] = [
    {
      id: 'card-payment',
      title: '신용카드 결제',
      path: '/docs/api/pg/01-card-payment',
      category: 'PG 결제',
      subcategory: '신용카드'
    },
    {
      id: 'card-auth',
      title: '신용카드 빌키 발급',
      path: '/docs/api/pg/02-card-auth',
      category: 'PG 결제',
      subcategory: '신용카드'
    },
    {
      id: 'payment-cancel',
      title: '결제 취소',
      path: '/docs/api/pg/03-payment-cancel',
      category: 'PG 결제',
      subcategory: '거래관리'
    },
    {
      id: 'virtual-account',
      title: '가상계좌 채번',
      path: '/docs/api/pg/04-virtual-account',
      category: 'PG 결제',
      subcategory: '가상계좌'
    },
    {
      id: 'transaction-inquiry',
      title: '거래 상태 조회',
      path: '/docs/api/pg/05-transaction-inquiry',
      category: 'PG 결제',
      subcategory: '거래관리'
    }
  ];

  // 첫 번째 API를 기본 선택
  useEffect(() => {
    if (apiDocuments.length > 0 && !selectedApi) {
      setSelectedApi(apiDocuments[0]);
    }
    setLoading(false);
  }, []);

  // 선택된 API가 변경될 때 컴포넌트 로드
  useEffect(() => {
    const loadApiComponent = async () => {
      if (!selectedApi) return;
      
      setLoading(true);
      try {
        const modules = import.meta.glob('../docs/api/**/*.mdx');
        const modulePath = selectedApi.path.replace('/docs/', '../docs/') + '.mdx';
        
        if (modules[modulePath]) {
          const module = await (modules[modulePath] as () => Promise<{ default: React.ComponentType }>)();
          setApiComponent(() => module.default);
        }
      } catch (error) {
        console.error('API 컴포넌트 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadApiComponent();
  }, [selectedApi]);

  // 드롭다운 토글 함수
  const toggleService = (serviceName: string) => {
    const newExpanded = new Set(expandedServices);
    if (newExpanded.has(serviceName)) {
      newExpanded.delete(serviceName);
    } else {
      newExpanded.add(serviceName);
    }
    setExpandedServices(newExpanded);
  };

  const toggleSubcategory = (subcategoryKey: string) => {
    const newExpanded = new Set(expandedSubcategories);
    if (newExpanded.has(subcategoryKey)) {
      newExpanded.delete(subcategoryKey);
    } else {
      newExpanded.add(subcategoryKey);
    }
    setExpandedSubcategories(newExpanded);
  };

  const leftSidebar = (closeMobileSidebar: () => void) => (
    <ApiSidebar
      apiDocuments={apiDocuments}
      selectedApi={selectedApi}
      expandedServices={expandedServices}
      expandedSubcategories={expandedSubcategories}
      onApiSelect={setSelectedApi}
      onToggleService={toggleService}
      onToggleSubcategory={toggleSubcategory}
      onMobileClose={closeMobileSidebar}
    />
  );

  const rightSidebar = <ApiTestPanel selectedApi={selectedApi} />;

  return (
    <Layout 
      leftSidebar={leftSidebar} 
      rightSidebar={rightSidebar}
      mobileSidebarTitle="API 목록"
    >
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4 animate-pulse" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">API 문서 로딩 중...</h3>
            <p className="text-gray-500">문서를 불러오고 있습니다.</p>
          </div>
        </div>
      ) : ApiComponent ? (
        <Suspense fallback={
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4 animate-pulse" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">문서 로딩 중...</h3>
            </div>
          </div>
        }>
          <ApiComponent />
        </Suspense>
      ) : (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <Play className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">API를 선택하세요</h3>
            <p className="text-gray-500">왼쪽에서 테스트하고 싶은 API를 선택해주세요.</p>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ApiDocsPage;