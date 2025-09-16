import React from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

interface ApiDocument {
  id: string;
  title: string;
  path: string;
  category: string;
  subcategory: string;
}

interface ApiSidebarProps {
  apiDocuments: ApiDocument[];
  selectedApi: ApiDocument | null;
  expandedServices: Set<string>;
  expandedSubcategories: Set<string>;
  onApiSelect: (api: ApiDocument) => void;
  onToggleService: (serviceName: string) => void;
  onToggleSubcategory: (subcategoryKey: string) => void;
  onMobileClose?: () => void;
}

const ApiSidebar: React.FC<ApiSidebarProps> = ({
  apiDocuments,
  selectedApi,
  expandedServices,
  expandedSubcategories,
  onApiSelect,
  onToggleService,
  onToggleSubcategory,
  onMobileClose,
}) => {
  // API 문서를 카테고리 > 서브카테고리별로 그룹화
  const apiGroups = apiDocuments.reduce((groups, api) => {
    const category = api.category;
    const subcategory = api.subcategory;
    
    if (!groups[category]) {
      groups[category] = {};
    }
    if (!groups[category][subcategory]) {
      groups[category][subcategory] = [];
    }
    groups[category][subcategory].push(api);
    return groups;
  }, {} as Record<string, Record<string, ApiDocument[]>>);

  return (
    <div className="p-4">
      {Object.entries(apiGroups).map(([categoryName, subcategories]) => {
        const isServiceExpanded = expandedServices.has(categoryName);
        
        return (
          <div key={categoryName} className="mb-4">
            {/* 1단계: 카테고리 (PG 결제) */}
            <button
              onClick={() => onToggleService(categoryName)}
              className={clsx(
                'w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none',
                'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
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
                  
                  return (
                    <div key={subcategoryKey}>
                      {/* 2단계: 서브카테고리 (신용카드, 가상계좌 등) */}
                      <button
                        onClick={() => onToggleSubcategory(subcategoryKey)}
                        className={clsx(
                          'w-full flex items-center justify-between px-2 py-1.5 text-xs font-medium rounded transition-colors focus:outline-none',
                          'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
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
                          {apis.map((api) => (
                            <button
                              key={api.id}
                              onClick={() => {
                                onApiSelect(api);
                                onMobileClose?.();
                              }}
                              className={clsx(
                                'w-full text-left p-2 rounded border transition-all focus:outline-none',
                                selectedApi?.id === api.id
                                  ? 'bg-hecto-50 border-hecto-200 text-hecto-900'
                                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-xs">{api.title}</span>
                                <span className="bg-green-100 text-green-700 text-xs px-1.5 py-0.5 rounded">
                                  POST
                                </span>
                              </div>
                            </button>
                          ))}
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
