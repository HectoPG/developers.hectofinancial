import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import { type ApiDocument, apiDocumentationConfig } from '../config/apiDocumentation';

interface ApiSidebarProps {
  expandedServices: Set<string>;
  expandedSubcategories: Set<string>;
  onApiSelect: (api: ApiDocument) => void;
  onToggleService: (serviceName: string) => void;
  onToggleSubcategory: (subcategoryKey: string) => void;
  onMobileClose?: () => void;
}

const ApiSidebar: React.FC<ApiSidebarProps> = ({
  expandedServices,
  expandedSubcategories,
  onApiSelect,
  onToggleService,
  onToggleSubcategory,
  onMobileClose,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // API 선택 시 URL 변경
  const handleApiSelect = (api: ApiDocument) => {
    // path에서 자동으로 URL 생성: /docs/api/pg/credit-card/01-card-payment
    navigate(api.path);
    onApiSelect(api);
    onMobileClose?.();
  };
  
  // 정적 설정에서 API 그룹 가져오기
  const apiGroups = apiDocumentationConfig.reduce((groups, category) => {
    groups[category.name] = {};
    category.subcategories.forEach(subcategory => {
      groups[category.name][subcategory.name] = subcategory.documents;
    });
    return groups;
  }, {} as Record<string, Record<string, ApiDocument[]>>);

  return (
    <div className="p-4">
      {Object.entries(apiGroups).map(([categoryName, subcategories]) => {
        const isServiceExpanded = expandedServices.has(categoryName);
        // 현재 URL이 이 카테고리에 속하는지 확인
        const isServiceActive = location.pathname.startsWith('/docs/api') && 
          Object.values(subcategories).some(apis => 
            apis.some(api => location.pathname === api.path)
          );
        
        return (
          <div key={categoryName} className="mb-4">
            {/* 1단계: 카테고리 (PG 결제) */}
            <button
              onClick={() => onToggleService(categoryName)}
              className={clsx(
                'w-full flex items-center justify-between px-2 py-1.5 text-sm font-medium rounded-md transition-colors focus:outline-none',
                isServiceActive || isServiceExpanded
                  ? 'text-hecto-600' 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <div className="flex items-center">
                {categoryName}
              </div>
              <ChevronDown 
                className={clsx(
                  'h-4 w-4 transition-transform duration-200',
                  isServiceExpanded ? 'rotate-180' : ''
                )} 
              />
            </button>
            
            {isServiceExpanded && (
              <div className="mt-1 ml-4 space-y-2">
                {Object.entries(subcategories).map(([subcategoryName, apis]) => {
                  const subcategoryKey = `${categoryName}-${subcategoryName}`;
                  const isSubcategoryExpanded = expandedSubcategories.has(subcategoryKey);
                  // 현재 URL이 이 서브카테고리에 속하는지 확인
                  const isSubcategoryActive = apis.some(api => location.pathname === api.path);
                  
                  return (
                    <div key={subcategoryKey}>
                      {/* 2단계: 서브카테고리 (신용카드, 가상계좌 등) */}
                      <button
                        onClick={() => onToggleSubcategory(subcategoryKey)}
                        className={clsx(
                          'w-full flex items-center justify-between px-2 py-1.5 text-sm rounded-md transition-colors focus:outline-none',
                          isSubcategoryActive || isSubcategoryExpanded
                            ? 'text-hecto-600 font-medium' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        )}
                      >
                        <div className="flex items-center">
                          {subcategoryName}
                        </div>
                        <ChevronDown 
                          className={clsx(
                            'h-3 w-3 transition-transform duration-200',
                            isSubcategoryExpanded ? 'rotate-180' : ''
                          )} 
                        />
                      </button>
                      
                      {isSubcategoryExpanded && (
                        <div className="mt-1 ml-4 space-y-1">
                          {/* 3단계: 개별 API */}
                          {apis.map((api) => {
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
