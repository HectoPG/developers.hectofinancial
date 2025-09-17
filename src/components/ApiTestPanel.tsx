import React, { useState, useEffect, useCallback } from 'react';
import { Play, Copy, Check } from 'lucide-react';
import { useApiTest } from '../contexts/ApiTestContext';
import { type ApiDocument } from '../config/apiDocumentation';

interface ApiInfo {
  title: string;
  description: string;
  category: string;
  path: string;
  method: string;
  testUrl: string;
  prodUrl: string;
  contentType?: string;
}


interface ApiTestPanelProps {
  selectedApi: ApiDocument | null;
}

const ApiTestPanel: React.FC<ApiTestPanelProps> = ({ selectedApi }) => {
  const { getParameterValuesBySection } = useApiTest();
  const [apiInfo, setApiInfo] = useState<ApiInfo | null>(null);
  const [selectedEnvironment, setSelectedEnvironment] = useState<'test' | 'prod'>('test');
  const [requestBody, setRequestBody] = useState<string>('');
  const [response] = useState<string>('');
  const [loading] = useState(false);
  const [copied, setCopied] = useState(false);

  // API 문서에서 자동으로 export된 apiInfo 가져오기
  useEffect(() => {
    const fetchApiInfo = async () => {
      if (!selectedApi) return;
      
      try {
        
                // MDX 모듈에서 자동으로 export된 apiInfo 가져오기
                const modules = import.meta.glob('../docs/api/**/*.mdx');
                // path에서 자동으로 modulePath 생성
                const modulePath = selectedApi.path.replace('/docs/', '../docs/') + '.mdx';
        
        
        if (modules[modulePath]) {
          const module = await (modules[modulePath] as () => Promise<{ 
            default: React.ComponentType; 
            apiInfo?: ApiInfo; 
          }>)();
          
          if (module.apiInfo) {
            // Content-Type이 없으면 기본값 설정
            const apiInfoWithContentType = {
              ...module.apiInfo,
              contentType: module.apiInfo.contentType || 'application/x-www-form-urlencoded'
            };
            setApiInfo(apiInfoWithContentType);
          } else {
            throw new Error('No apiInfo export found in module');
          }
        } else {
          console.warn('Module not found:', modulePath);
          throw new Error(`Module not found: ${modulePath}`);
        }
      } catch (error) {
        console.error('API 정보 로드 실패:', error);
        // 에러 발생 시 기본값 사용
        setApiInfo({
          title: selectedApi.title,
          description: '',
          category: '',
          path: '',
          method: 'POST',
          testUrl: '',
          prodUrl: ''
        });
      }
    };

    fetchApiInfo();
  }, [selectedApi]);

  // Content-Type별 요청 본문 생성 함수
  const generateRequestBody = useCallback((contentType: string) => {
    const globalParams = (window as any)?.globalApiParameters || {};
    const params: Record<string, string> = {};
    const data: Record<string, string> = {};
    
    Object.values(globalParams).forEach((param: any) => {
      if (param.value && param.value.trim()) {
        if (param.section === 'params') {
          params[param.name] = param.value;
        } else if (param.section === 'data') {
          data[param.name] = param.value;
        } else {
          // section이 지정되지 않은 경우 기본적으로 data에 포함
          data[param.name] = param.value;
        }
      }
    });

    if (contentType?.includes('application/x-www-form-urlencoded')) {
      // Form Data 형태로 변환
      const allParams = { ...params, ...data };
      const formData = new URLSearchParams();
      Object.entries(allParams).forEach(([key, value]) => {
        formData.append(key, value);
      });
      return formData.toString();
    } else {
      // JSON 형태 (기본값)
      const requestBody = { params, data };
      return JSON.stringify(requestBody, null, 2);
    }
  }, []);

  // 전역 상태에서 섹션별 값 가져오는 함수
  const updateRequestBodyFromGlobalState = useCallback(() => {
    const contentType = apiInfo?.contentType || 'application/json';
    const body = generateRequestBody(contentType);
    setRequestBody(body);
  }, [apiInfo?.contentType, generateRequestBody]);

  // ParameterCard 입력값들을 Content-Type에 따라 변환
  useEffect(() => {
    if (apiInfo) {
      updateRequestBodyFromGlobalState();
    }
  }, [selectedApi, apiInfo, updateRequestBodyFromGlobalState]); // updateRequestBodyFromGlobalState 의존성 추가

  // 실시간 파라미터 변경 감지 (이벤트 기반)
  useEffect(() => {
    // 커스텀 이벤트 리스너 등록
    const handleParameterChange = () => {
      updateRequestBodyFromGlobalState();
    };

    window.addEventListener('apiParameterChanged', handleParameterChange);

    return () => {
      window.removeEventListener('apiParameterChanged', handleParameterChange);
    };
  }, [updateRequestBodyFromGlobalState]); // updateRequestBodyFromGlobalState 의존성 추가

  // 초기값 설정을 별도 useEffect로 분리
  useEffect(() => {
    // ParameterCard들이 렌더링된 후에 초기값을 가져오도록 지연
    const timer = setTimeout(() => {
      updateRequestBodyFromGlobalState();
    }, 100);

    return () => clearTimeout(timer);
  }, [selectedApi, updateRequestBodyFromGlobalState]); // updateRequestBodyFromGlobalState 의존성 추가



  const handleApiCall = async () => {
    // API 호출 기능은 아직 지원하지 않습니다.
    console.log('API 호출 기능은 현재 개발 중입니다.');
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('복사 실패:', error);
    }
  };

  const getCurrentUrl = () => {
    if (apiInfo) {
      return selectedEnvironment === 'test' ? apiInfo.testUrl : apiInfo.prodUrl;
    }
    // selectedApi가 있으면 기본 URL 사용
    if (selectedApi) {
      return selectedEnvironment === 'test' 
        ? 'https://tbgw.settlebank.co.kr' + (selectedApi.path || '/api/endpoint')
        : 'https://gw.settlebank.co.kr' + (selectedApi.path || '/api/endpoint');
    }
    // 기본값
    return selectedEnvironment === 'test' 
      ? 'https://tbgw.settlebank.co.kr/api/endpoint'
      : 'https://gw.settlebank.co.kr/api/endpoint';
  };
  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Play className="w-5 h-5 mr-2" />
        API 테스트
      </h2>

      <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">요청 설정</h3>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <span className={`text-xs px-2 py-1 rounded mr-2 ${
                  (apiInfo?.method || 'POST') === 'POST' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {apiInfo?.method || 'POST'}
                </span>
                <code className="text-sm font-mono flex-1 break-all">{apiInfo?.path || selectedApi?.path || '/api/endpoint'}</code>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">서버 환경</label>
                  <select 
                    value={selectedEnvironment}
                    onChange={(e) => setSelectedEnvironment(e.target.value as 'test' | 'prod')}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="test">테스트 환경</option>
                    <option value="prod">운영 환경</option>
                  </select>
                  <div className="mt-1 text-xs text-gray-500">
                    URL: <code className="bg-gray-100 px-1 rounded">{getCurrentUrl()}</code>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-medium text-gray-700">
                      요청 본문 ({apiInfo?.contentType?.includes('application/x-www-form-urlencoded') ? 'Form Data' : 'JSON'})
                    </label>
                    <button
                      onClick={() => copyToClipboard(requestBody)}
                      className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
                    >
                      {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                      {copied ? '복사됨' : '복사'}
                    </button>
                  </div>
                  <div className="mb-2 text-xs text-gray-500">
                    <strong>Content-Type:</strong> {apiInfo?.contentType || 'application/json'}
                  </div>
                  <textarea
                    value={requestBody}
                    onChange={(e) => setRequestBody(e.target.value)}
                    className="w-full h-32 p-3 border border-gray-300 rounded-md text-sm font-mono resize-none"
                    placeholder={
                      apiInfo?.contentType?.includes('application/x-www-form-urlencoded') 
                        ? "ParameterCard에서 입력한 값들이 자동으로 Form Data로 변환됩니다."
                        : "ParameterCard에서 입력한 값들이 자동으로 JSON으로 변환됩니다."
                    }
                  />
                </div>

                <button 
                  onClick={handleApiCall}
                  disabled={true}
                  className="w-full bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center focus:outline-none cursor-not-allowed"
                >
                  <Play className="w-4 h-4 mr-2" />
                  API 호출 (아직 지원하지 않음)
                </button>
                <div className="text-xs text-gray-500 text-center mt-2">
                  API 호출 기능은 현재 개발 중입니다.
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">응답 결과</h3>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg min-h-32">
              <div className="text-sm text-gray-400 text-center">
                API 호출 기능이 지원되면 응답 결과가 여기에 표시됩니다.
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default ApiTestPanel;
