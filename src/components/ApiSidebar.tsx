import React from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

interface ApiDocument {
  id: string;
  title: string;
  path: string;
  category: string;
}

interface ApiSidebarProps {
  apiDocuments: ApiDocument[];
  selectedApi: ApiDocument | null;
  expandedServices: Set<string>;
  onApiSelect: (api: ApiDocument) => void;
  onToggleService: (serviceName: string) => void;
  onMobileClose?: () => void;
}

const ApiSidebar: React.FC<ApiSidebarProps> = ({
  apiDocuments,
  selectedApi,
  expandedServices,
  onApiSelect,
  onToggleService,
  onMobileClose,
}) => {
  // API 문서를 카테고리별로 그룹화
  const apiGroups = apiDocuments.reduce((groups, api) => {
    const category = api.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(api);
    return groups;
  }, {} as Record<string, ApiDocument[]>);

  return (
    <div className="p-4">
      {Object.entries(apiGroups).map(([categoryName, apis]) => {
        const isServiceExpanded = expandedServices.has(categoryName);
        
        return (
          <div key={categoryName} className="mb-4">
            <button
              onClick={() => onToggleService(categoryName)}
              className={clsx(
                'w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none',
                'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
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
              <div className="mt-1 ml-4 space-y-1">
                {apis.map((api) => (
                  <button
                    key={api.id}
                    onClick={() => {
                      onApiSelect(api);
                      onMobileClose?.();
                    }}
                    className={clsx(
                      'w-full text-left p-3 rounded-lg border transition-all focus:outline-none',
                      selectedApi?.id === api.id
                        ? 'bg-hecto-50 border-hecto-200 text-hecto-900'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{api.title}</span>
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                        POST
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-1">{api.path}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ApiSidebar;
