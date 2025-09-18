// API 관련 타입 정의

export interface ApiDocument {
  id?: string;
  title: string;
  path: string;
  filePath?: string;
}

export interface ApiInfo {
  title: string;
  description: string;
  category: string;
  path: string;
  method: string;
  testUrl: string;
  prodUrl: string;
  contentType?: string;
  isPaymentForm?: boolean; // Form submit 방식으로 팝업 호출 여부
}

export interface ParameterValue {
  name: string;
  value: string;
  type: string;
  required: boolean;
  section?: 'params' | 'data';
}

export interface ApiResponse {
  status: number;
  statusText: string;
  data: any;
  headers: Record<string, string>;
}

export interface ApiError extends Error {
  status?: number;
  statusText?: string;
  response?: any;
}

// 전역 window 객체 타입 확장
declare global {
  interface Window {
    apiData?: {
      selectedApi?: ApiDocument;
      parameters?: Record<string, ParameterValue>;
    };
  }
}

export {};