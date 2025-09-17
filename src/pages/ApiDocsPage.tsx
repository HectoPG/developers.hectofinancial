import React, { useState, useEffect, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import { Play, FileText } from 'lucide-react';
import { getAllApiDocuments, getApiDocumentByPath, type ApiDocument } from '../config/apiDocumentation';
import { ApiTestProvider } from '../contexts/ApiTestContext';


const ApiDocsPage: React.FC = () => {
  const location = useLocation();
  
  // 상태 관리
  const [apiDocuments, setApiDocuments] = useState<ApiDocument[]>([]);
  const [selectedApi, setSelectedApi] = useState<ApiDocument | null>(null);
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set(['PG 결제']));
  const [expandedSubcategories, setExpandedSubcategories] = useState<Set<string>>(new Set(['PG 결제-신용카드']));
  const [ApiComponent, setApiComponent] = useState<React.ComponentType | null>(null);
  const [loading, setLoading] = useState(false);

  // API 문서 목록을 정적 설정에서 로드 (즉시 로드)
  useEffect(() => {
    try {
      const docs = getAllApiDocuments();
      setApiDocuments(docs);
    } catch (error) {
      console.error('Failed to load API documents:', error);
      setApiDocuments([]);
    }
  }, []);

  // URL에 따라 API 선택 또는 첫 번째 API를 기본 선택
  useEffect(() => {
    if (apiDocuments.length > 0) {
      // 현재 URL로 특정 API 찾기
      const targetApi = getApiDocumentByPath(location.pathname);
      
      if (targetApi) {
        setSelectedApi(targetApi);
        setLoading(false);
        return;
      }
      
      // 기본값: 첫 번째 API 선택 (selectedApi가 없을 때만)
      if (!selectedApi) {
        setSelectedApi(apiDocuments[0]);
      }
    }
    setLoading(false);
  }, [location.pathname, apiDocuments]); // selectedApi 의존성 제거

  // 선택된 API가 변경될 때 컴포넌트 로드
  useEffect(() => {
    const loadApiComponent = async () => {
      if (!selectedApi) return;
      
      setLoading(true);
      try {
        const modules = import.meta.glob('../docs/api/**/*.mdx');
        // path에서 자동으로 modulePath 생성
        const modulePath = selectedApi.path.replace('/docs/', '../docs/') + '.mdx';
        
        
        if (modules[modulePath]) {
          const module = await (modules[modulePath] as () => Promise<{ default: React.ComponentType }>)();
          setApiComponent(() => module.default);
        } else {
          console.error('Module not found:', modulePath);
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

  // API 사이드바와 테스트 패널을 Layout에 전달하기 위해 전역 상태로 설정
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 전역 객체에 API 데이터 설정
      (window as any).apiLayoutData = {
        selectedApi,
        expandedServices,
        expandedSubcategories,
        setSelectedApi,
        toggleService,
        toggleSubcategory,
      };
    }
  }, [selectedApi, expandedServices, expandedSubcategories]);

  return (
    <ApiTestProvider>
      {loading || apiDocuments.length === 0 ? (
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
    </ApiTestProvider>
  );
};

export default ApiDocsPage;