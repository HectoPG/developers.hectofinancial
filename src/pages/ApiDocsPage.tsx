import React, { useState, useEffect, Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Play, FileText } from 'lucide-react';
import { getAllApiDocuments, getApiDocumentByPath, getApiDocumentationConfig, type ApiDocument } from '../config/apiDocumentation';
import { useApiDoc } from '../contexts/ApiDocContext';


const ApiDocsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setApiInfo } = useApiDoc();

  // 상태 관리
  const [apiDocuments, setApiDocuments] = useState<ApiDocument[]>([]);
  const [selectedApi, setSelectedApi] = useState<ApiDocument | null>(null);
  const [ApiComponent, setApiComponent] = useState<React.ComponentType | null>(null);
  const [loading, setLoading] = useState(false);

  // API 문서 목록을 비동기로 로드
  useEffect(() => {
    const loadApiDocuments = async () => {
      try {
        // 먼저 스캔을 완료한 후 문서 목록을 가져옴
        const docs = await getAllApiDocuments();
        setApiDocuments(docs);
      } catch (error) {
        console.error('Failed to load API documents:', error);
        setApiDocuments([]);
      }
    };

    loadApiDocuments();
  }, []);

  // URL에 따라 API 선택
  useEffect(() => {
    const selectApiByPath = async () => {
      if (apiDocuments.length > 0) {
        // 현재 URL로 특정 API 찾기
        const targetApi = await getApiDocumentByPath(location.pathname);
        
        if (targetApi) {
          setSelectedApi(targetApi);
          setLoading(false);
          return;
        }
        
        // 현재 URL이 /docs/api인 경우 첫 번째 API 선택하고 URL 변경
        if (location.pathname === '/docs/api') {
          const firstApi = apiDocuments[0];
          setSelectedApi(firstApi);
          navigate(firstApi.path, { replace: true }); // URL 변경 (히스토리 대체)
          setLoading(false);
          return;
        }
        
        // 특정 API를 찾지 못한 경우 첫 번째 API 선택
        setSelectedApi(apiDocuments[0]);
      }
      setLoading(false);
    };

    selectApiByPath();
  }, [location.pathname, apiDocuments]);

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
          const module = await (modules[modulePath] as () => Promise<{ default: React.ComponentType; apiInfo?: any }>)();
          setApiComponent(() => module.default);

          // MDX에서 export된 apiInfo를 Context에 설정
          if (module.apiInfo) {
            setApiInfo(module.apiInfo);
          }

          // 페이지 맨 위로 스크롤
          window.scrollTo({ top: 0, behavior: 'smooth' });
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
  }, [selectedApi, setApiInfo]);

  // 전역 상태 설정 제거 - ApiDocContext로 대체됨

  return (
    <>
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
    </>
  );
};

export default ApiDocsPage;