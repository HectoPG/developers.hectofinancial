import { scanApiDocuments } from '../utils/apiDocumentScanner';

// API 문서 설정 중앙 관리
export interface ApiDocument {
  id: string;
  title: string;
  path: string;
  category: string;
  subcategory: string;
  description?: string;
  order?: number;
}

export interface ApiSubcategory {
  id: string;
  name: string;
  documents: ApiDocument[];
}

export interface ApiCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  subcategories: ApiSubcategory[];
}

// 자동 스캔된 API 문서 설정 (캐시)
let apiDocumentationConfig: ApiCategory[] | null = null;

// API 문서 설정 가져오기 (자동 스캔)
export const getApiDocumentationConfig = async (): Promise<ApiCategory[]> => {
  if (apiDocumentationConfig === null) {
    apiDocumentationConfig = await scanApiDocuments();
  }
  return apiDocumentationConfig;
};

// 동기 버전 (이미 로드된 경우)
export const getApiDocumentationConfigSync = (): ApiCategory[] => {
  if (apiDocumentationConfig === null) {
    console.warn('API documentation config not loaded yet. Call getApiDocumentationConfig() first.');
    return [];
  }
  return apiDocumentationConfig;
};

// 유틸리티 함수들
export const getAllApiDocuments = async (): Promise<ApiDocument[]> => {
  const config = await getApiDocumentationConfig();
  const allDocs: ApiDocument[] = [];

  config.forEach(category => {
    category.subcategories.forEach(subcategory => {
      allDocs.push(...subcategory.documents);
    });
  });

  return allDocs.sort((a, b) => (a.order || 0) - (b.order || 0));
};

// 동기 버전 (이미 로드된 경우)
export const getAllApiDocumentsSync = (): ApiDocument[] => {
  const config = getApiDocumentationConfigSync();
  const allDocs: ApiDocument[] = [];

  config.forEach(category => {
    category.subcategories.forEach(subcategory => {
      allDocs.push(...subcategory.documents);
    });
  });

  return allDocs.sort((a, b) => (a.order || 0) - (b.order || 0));
};

export const getApiCategoryByPath = async (path: string): Promise<ApiCategory | null> => {
  const config = await getApiDocumentationConfig();
  return config.find(category =>
    category.subcategories.some(sub =>
      sub.documents.some(doc => path.startsWith(doc.path))
    )
  ) || null;
};

export const getApiDocumentByPath = async (path: string): Promise<ApiDocument | null> => {
  const allDocs = await getAllApiDocuments();
  return allDocs.find(doc => doc.path === path) || null;
};

// 동기 버전들 (이미 로드된 경우)
export const getApiCategoryByPathSync = (path: string): ApiCategory | null => {
  const config = getApiDocumentationConfigSync();
  return config.find(category =>
    category.subcategories.some(sub =>
      sub.documents.some(doc => path.startsWith(doc.path))
    )
  ) || null;
};

export const getApiDocumentByPathSync = (path: string): ApiDocument | null => {
  const allDocs = getAllApiDocumentsSync();
  return allDocs.find(doc => doc.path === path) || null;
};

export const getApiSubcategoryByPath = (path: string): ApiSubcategory | null => {
  const config = getApiDocumentationConfigSync();
  for (const category of config) {
    for (const subcategory of category.subcategories) {
      if (subcategory.documents.some(doc => path.startsWith(doc.path))) {
        return subcategory;
      }
    }
  }
  return null;
};
