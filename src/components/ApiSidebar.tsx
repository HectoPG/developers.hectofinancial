import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { type ApiDocument, getApiDocumentationConfig } from '../config/apiDocumentation';

interface ApiSidebarProps {
  onMobileClose?: () => void;
}

const ApiSidebar: React.FC<ApiSidebarProps> = ({ onMobileClose }) => {
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set());
  const [expandedSubcategories, setExpandedSubcategories] = useState<Set<string>>(new Set());
  const [apiConfig, setApiConfig] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // API 설정 로드
  useEffect(() => {
    const loadApiConfig = async () => {
      try {
        const config = await getApiDocumentationConfig();
        setApiConfig(config);
      } catch (error) {
        console.error('Failed to load API config:', error);
      } finally {
        setLoading(false);
      }
    };

    loadApiConfig();
  }, []);

  // 토글 함수들
  const toggleService = (serviceName: string) => {
    setExpandedServices(prev => {
      const newSet = new Set(prev);
      if (newSet.has(serviceName)) {
        newSet.delete(serviceName);
      } else {
        newSet.add(serviceName);
      }
      return newSet;
    });
  };

  const toggleSubcategory = (subcategoryKey: string) => {
    setExpandedSubcategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(subcategoryKey)) {
        newSet.delete(subcategoryKey);
      } else {
        newSet.add(subcategoryKey);
      }
      return newSet;
    });
  };
  
  // API 선택 시 URL 변경
  const handleApiSelect = (api: ApiDocument) => {
    navigate(api.path);
    onMobileClose?.();
  };

  // 현재 경로에 따라 자동으로 펼치기
  useEffect(() => {
    if (loading || apiConfig.length === 0) return;

    const currentPath = location.pathname;

    // API 문서 페이지인지 확인
    if (currentPath.startsWith('/docs/api')) {
      // 현재 경로에서 서비스와 서브카테고리 추출
      const pathParts = currentPath.split('/').filter(Boolean);

      if (pathParts.length >= 4) {
        // 특정 API 문서 페이지
        const serviceName = pathParts[2]; // 'pg'
        const subcategoryName = pathParts[3]; // 'credit-card', 'virtual-account' 등

        // 서비스 펼치기
        if (serviceName) {
          setExpandedServices(prev => new Set([...prev, serviceName]));
        }

        // 서브카테고리 펼치기
        if (subcategoryName) {
          const subcategoryKey = `${serviceName}-${subcategoryName}`;
          setExpandedSubcategories(prev => new Set([...prev, subcategoryKey]));
        }
      } else if (pathParts.length === 3 && pathParts[2] === 'api') {
        // /docs/api 페이지 - 첫 번째 API의 위치로 자동 펼치기
        const firstCategory = apiConfig[0];
        if (firstCategory) {
          const serviceName = firstCategory.id;
          const firstSubcategory = firstCategory.subcategories[0];

          if (firstSubcategory) {
            // 서비스 펼치기
            setExpandedServices(prev => new Set([...prev, serviceName]));

            // 서브카테고리 펼치기
            const subcategoryKey = `${serviceName}-${firstSubcategory.id}`;
            setExpandedSubcategories(prev => new Set([...prev, subcategoryKey]));
          }
        }
      }
    }
  }, [location.pathname, loading, apiConfig]);
  
  // 로딩 중이면 로딩 표시
  if (loading) {
    return (
      <div className="p-4">
        <div className="text-center text-gray-500">
          <div className="animate-pulse">API 목록 로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {apiConfig.map((category) => {
        const isServiceExpanded = expandedServices.has(category.id);
        // 현재 URL이 이 카테고리에 속하는지 확인
        const isServiceActive = location.pathname.startsWith('/docs/api') &&
          category.subcategories.some((sub: any) =>
            sub.documents.some((api: any) => location.pathname === api.path)
          );

        return (
          <div key={category.id} className="mb-4">
            {/* 1단계: 카테고리 (PG 결제) */}
            <button
              onClick={() => toggleService(category.id)}
              className={clsx(
                'w-full flex items-center justify-between px-2 py-1.5 text-sm font-medium rounded-md transition-colors focus:outline-none',
                isServiceActive || isServiceExpanded
                  ? 'text-hecto-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <div className="flex items-center">
                {category.name}
              </div>
              {isServiceExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>

            {isServiceExpanded && (
              <div className="mt-1 ml-4 space-y-2">
                {category.subcategories.map((subcategory: any) => {
                  const subcategoryKey = `${category.id}-${subcategory.id}`;
                  const isSubcategoryExpanded = expandedSubcategories.has(subcategoryKey);
                  // 현재 URL이 이 서브카테고리에 속하는지 확인
                  const isSubcategoryActive = subcategory.documents.some((api: any) => location.pathname === api.path);

                  return (
                    <div key={subcategoryKey}>
                      {/* 2단계: 서브카테고리 (신용카드, 가상계좌 등) */}
                      <button
                        onClick={() => toggleSubcategory(subcategoryKey)}
                        className={clsx(
                          'w-full flex items-center justify-between px-2 py-1.5 text-sm rounded-md transition-colors focus:outline-none',
                          isSubcategoryActive || isSubcategoryExpanded
                            ? 'text-hecto-600 font-medium'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        )}
                      >
                        <div className="flex items-center">
                          {subcategory.name}
                        </div>
                        {isSubcategoryExpanded ? (
                          <ChevronDown className="h-3 w-3" />
                        ) : (
                          <ChevronRight className="h-3 w-3" />
                        )}
                      </button>

                      {isSubcategoryExpanded && (
                        <div className="mt-1 ml-4 space-y-1">
                          {/* 3단계: 개별 API */}
                          {subcategory.documents.map((api: any) => {
                            // 현재 URL이 이 API와 일치하는지 확인
                            const isApiActive = location.pathname === api.path;

                            return (
                              <button
                                key={api.id}
                                onClick={() => handleApiSelect(api)}
                                className={clsx(
                                  'w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors focus:outline-none',
                                  isApiActive
                                    ? 'text-hecto-600 font-medium'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                )}
                            >
                              {api.title}
                            </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ApiSidebar;
