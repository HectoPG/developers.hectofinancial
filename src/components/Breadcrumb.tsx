import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { documentationConfig } from '../config/documentation';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

const Breadcrumb: React.FC = () => {
  const location = useLocation();
  
  const getBreadcrumbItems = (): BreadcrumbItem[] => {
    const path = location.pathname;
    const items: BreadcrumbItem[] = [];
    
    // 항상 '서비스'로 시작
    items.push({ label: '서비스', href: '/' });
    
    // docs 경로 분석
    if (path.startsWith('/docs/')) {
      const pathParts = path.split('/').filter(Boolean);
      // pathParts: ['docs', 'pg', '02-credit-card'] 형태
      
      if (pathParts.length >= 2) {
        const categoryId = pathParts[1]; // 'pg'
        const category = documentationConfig.find(cat => cat.id === categoryId);
        
        if (category) {
          // 카테고리 추가 (예: 'PG 결제')
          items.push({ 
            label: category.name, 
            href: category.path 
          });
          
          // 특정 문서 페이지인 경우
          if (pathParts.length >= 3) {
            const documentPath = pathParts[2]; // '02-credit-card'
            const document = category.documents.find(doc => 
              doc.path.includes(documentPath) || 
              doc.id === documentPath.replace(/^\d+-/, '')
            );
            
            if (document) {
              items.push({ 
                label: document.title 
                // 현재 페이지이므로 href 없음
              });
            }
          }
        }
      }
    } else if (path === '/docs/api' || path.startsWith('/docs/api/')) {
      items.push({ label: 'API 문서' });
    } else if (path.startsWith('/blog')) {
      items.push({ label: '블로그' });
      
      // 특정 블로그 포스트인 경우
      if (path !== '/blog') {
        items.push({ label: '포스트' });
      }
    }
    
    return items;
  };
  
  const breadcrumbItems = getBreadcrumbItems();
  
  // 홈페이지에서는 breadcrumb을 표시하지 않음
  if (location.pathname === '/') {
    return null;
  }
  
  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-500 mb-6">
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-gray-400" />
          )}
          {item.href ? (
            <Link 
              to={item.href}
              className="hover:text-gray-700 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-700 font-medium">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
