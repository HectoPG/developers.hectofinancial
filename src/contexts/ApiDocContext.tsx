import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { type ApiDocument, type ApiInfo, type ParameterValue } from '../types/api';

interface ApiDocContextType {
  // API 선택 관련
  selectedApi: ApiDocument | null;
  setSelectedApi: (api: ApiDocument | null) => void;

  // API 정보 관련
  apiInfo: ApiInfo | null;
  setApiInfo: (info: ApiInfo | null) => void;

  // 파라미터 관리
  parameters: Record<string, ParameterValue>;
  updateParameter: (name: string, value: string, type: string, required: boolean, section?: 'params' | 'data') => void;
  resetParameters: () => void;

  // 요청/응답 관리
  requestBody: string;
  setRequestBody: (body: string) => void;
  apiResponse: any;
  setApiResponse: (response: any) => void;
  apiError: Error | null;
  setApiError: (error: Error | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // 환경 설정
  selectedEnvironment: 'test' | 'prod';
  setSelectedEnvironment: (env: 'test' | 'prod') => void;
}

const ApiDocContext = createContext<ApiDocContextType | undefined>(undefined);

export const useApiDoc = (): ApiDocContextType => {
  const context = useContext(ApiDocContext);
  if (context === undefined) {
    throw new Error('useApiDoc must be used within an ApiDocProvider');
  }
  return context;
};

interface ApiDocProviderProps {
  children: ReactNode;
}

export const ApiDocProvider: React.FC<ApiDocProviderProps> = ({ children }) => {
  // API 선택 관련 상태
  const [selectedApi, setSelectedApi] = useState<ApiDocument | null>(null);
  const [apiInfo, setApiInfo] = useState<ApiInfo | null>(null);

  // 파라미터 관리 상태
  const [parameters, setParameters] = useState<Record<string, ParameterValue>>({});

  // 요청/응답 관리 상태
  const [requestBody, setRequestBody] = useState<string>('');
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [apiError, setApiError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 환경 설정 상태
  const [selectedEnvironment, setSelectedEnvironment] = useState<'test' | 'prod'>('test');

  // 파라미터 업데이트 함수
  const updateParameter = useCallback((
    name: string,
    value: string,
    type: string,
    required: boolean,
    section?: 'params' | 'data'
  ) => {
    setParameters(prev => {
      const newParams = {
        ...prev,
        [name]: { name, value, type, required, section }
      };
      return newParams;
    });
  }, []);

  // 파라미터 초기화 함수
  const resetParameters = useCallback(() => {
    setParameters({});
    setRequestBody('');
    setApiResponse(null);
    setApiError(null);
  }, []);

  const value: ApiDocContextType = {
    // API 선택 관련
    selectedApi,
    setSelectedApi,
    apiInfo,
    setApiInfo,

    // 파라미터 관리
    parameters,
    updateParameter,
    resetParameters,

    // 요청/응답 관리
    requestBody,
    setRequestBody,
    apiResponse,
    setApiResponse,
    apiError,
    setApiError,
    isLoading,
    setIsLoading,

    // 환경 설정
    selectedEnvironment,
    setSelectedEnvironment,
  };

  return (
    <ApiDocContext.Provider value={value}>
      {children}
    </ApiDocContext.Provider>
  );
};