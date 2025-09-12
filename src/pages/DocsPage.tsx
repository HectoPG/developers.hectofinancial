import { useParams, useLocation } from 'react-router-dom'
import React, { lazy, Suspense, useEffect } from 'react'
import { FileText } from 'lucide-react'
import { documentationConfig } from '../config/documentation'
import Breadcrumb from '../components/Breadcrumb'

// 동적으로 MDX 컴포넌트를 생성하는 함수
const createMdxComponent = (category: string, page?: string) => {
  try {
    // 문서 설정에서 해당 문서 찾기
    const categoryConfig = documentationConfig.find(cat => cat.id === category);
    if (!categoryConfig) return null;

    let documentItem;
    if (page) {
      // URL 파라미터에서 파일명 추출 (예: 01-getting-started -> getting-started)
      const pageId = page.replace(/^\d+-/, ''); // 앞의 숫자와 대시 제거
      
      // 특정 페이지 찾기 (ID로 먼저 찾고, 없으면 파일명으로 찾기)
      documentItem = categoryConfig.documents.find(doc => 
        doc.id === pageId || 
        doc.path.includes(page) ||
        doc.path.includes(pageId)
      );
    } else {
      // 첫 번째 문서 사용
      documentItem = categoryConfig.documents[0];
    }

    if (!documentItem) {
      // documentItem을 찾지 못한 경우, 직접 경로로 시도
      if (page) {
        const directPath = `/docs/${category}/${page}`;
        const importPath = directPath.replace('/docs/', '../docs/') + '.mdx';
        
        return lazy((): Promise<{ default: React.ComponentType<any> }> => {
          const modules = import.meta.glob('../docs/**/*.mdx');
          const modulePath = importPath.replace('../docs/', '../docs/');
          
          if (modules[modulePath]) {
                        return (modules[modulePath] as () => Promise<{ default: React.ComponentType<any> }>)().catch(() => {
              return { default: () => (
                <div className="text-center py-16">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">문서를 로드할 수 없습니다</h2>
                  <p className="text-gray-600">요청하신 문서를 찾을 수 없습니다.</p>
                </div>
              )};
            });
                      } else {
                        return Promise.resolve({ default: () => (
              <div className="text-center py-16">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">문서를 로드할 수 없습니다</h2>
                <p className="text-gray-600">요청하신 문서를 찾을 수 없습니다.</p>
              </div>
            )});
          }
        });
      }
      return null;
    }

    // 동적으로 import 경로 생성
    const importPath = documentItem.path.replace('/docs/', '../docs/') + '.mdx';
    
    // 동적으로 lazy 컴포넌트 생성
    return lazy((): Promise<{ default: React.ComponentType<any> }> => {
      // Vite의 import.meta.glob을 사용하여 동적 import
      const modules = import.meta.glob('../docs/**/*.mdx');
      const modulePath = importPath.replace('../docs/', '../docs/');
      
      if (modules[modulePath]) {
                    return (modules[modulePath] as () => Promise<{ default: React.ComponentType<any> }>)().catch(() => {
          return { default: () => (
            <div className="text-center py-16">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">문서를 로드할 수 없습니다</h2>
              <p className="text-gray-600">요청하신 문서를 찾을 수 없습니다.</p>
            </div>
          )};
        });
      } else {
        return Promise.resolve({ default: () => (
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">문서를 로드할 수 없습니다</h2>
            <p className="text-gray-600">요청하신 문서를 찾을 수 없습니다.</p>
          </div>
        )});
      }
    });
  } catch (error) {
    return null;
  }
}


// 중앙화된 설정에서 카테고리 설명 가져오기


export default function DocsPage() {
  const { category, page } = useParams<{ category: string; page?: string }>()
  const location = useLocation()

  // URL 해시를 처리하여 해당 헤딩으로 스크롤
  useEffect(() => {
    const handleHashScroll = () => {
      const hash = location.hash.replace('#', '')
      if (hash) {
        // 컴포넌트가 로드된 후 스크롤 실행
        setTimeout(() => {
          const element = document.getElementById(hash)
          if (element) {
            // 서비스 페이지에서는 메인 콘텐츠 영역을 스크롤
            const contentArea = document.querySelector('.flex-1.min-w-0.lg\\:ml-64.lg\\:mr-56.overflow-y-auto')
            if (contentArea) {
              const elementPosition = element.offsetTop - 20 // 약간의 여백
              contentArea.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
              })
            }
          }
        }, 500) // MDX 컴포넌트 로딩을 위한 지연
      }
    }

    handleHashScroll()
  }, [location.hash, category, page])
  
  if (!category) {
    return (
      <div className="text-center py-16">
        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">카테고리를 찾을 수 없습니다</h1>
        <p className="text-gray-600 mb-6">올바른 문서 카테고리를 선택해주세요.</p>
      </div>
    )
  }

  const MdxComponent = createMdxComponent(category, page)
  
  
  if (!MdxComponent) {
    return (
      <div className="text-center py-16">
        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">문서를 찾을 수 없습니다</h1>
        <p className="text-gray-600 mb-6">요청하신 카테고리의 문서가 존재하지 않습니다.</p>
      </div>
    )
  }

  return (
    <div className="w-full">

      {/* Breadcrumb */}
      <Breadcrumb />
      
      {/* Content */}
      <div>
        <Suspense 
          key={`${category}-${page || 'default'}`}
          fallback={
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hecto-400 mb-4"></div>
              <p className="text-gray-600">문서를 불러오는 중...</p>
            </div>
          }
        >
          <MdxComponent key={`mdx-${category}-${page || 'default'}`} />
        </Suspense>
      </div>

    </div>
  )
}
