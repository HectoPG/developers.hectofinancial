import React, { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Play } from 'lucide-react';
import { type ApiDocument, type ApiInfo } from '../types/api';
import { useApiDoc } from '../contexts/ApiDocContext';
import ApiRequestForm from './ApiRequestForm';
import ApiResponsePanel from './ApiResponsePanel';

interface ApiTestPanelProps {
  key?: string;
}

const ApiTestPanel: React.FC<ApiTestPanelProps> = () => {
  const location = useLocation();
  const {
    selectedApi,
    setSelectedApi,
    apiInfo,
    setApiInfo,
    setApiResponse,
    setApiError,
    setIsLoading,
    resetParameters,
    requestBody,
    selectedEnvironment
  } = useApiDoc();


  // 현재 경로에서 API 정보 추출
  const currentApi = useMemo((): ApiDocument | null => {
    if (selectedApi) {
      return selectedApi;
    }

    const currentPath = location.pathname;
    if (currentPath.startsWith('/docs/api/')) {
      const pathParts = currentPath.split('/').filter(Boolean);

      if (pathParts.length >= 5) {
        const serviceName = pathParts[2];
        const subcategoryName = pathParts[3];
        const fileName = pathParts[4];

        return {
          title: fileName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          path: currentPath,
          filePath: `../docs/api/${serviceName}/${subcategoryName}/${fileName}.mdx`
        };
      }
    }
    return null;
  }, [selectedApi, location.pathname]);

  // API 정보 로드 (동적 로딩)
  useEffect(() => {
    if (!currentApi) {
      setApiInfo(null);
      return;
    }

    const loadApiInfo = async () => {
      setIsLoading(true);
      try {
        const modules = import.meta.glob('../docs/api/**/*.mdx');
        const modulePath = currentApi.path.replace('/docs/', '../docs/') + '.mdx';

        if (modules[modulePath]) {
          const moduleLoader = modules[modulePath] as () => Promise<{
            default: React.ComponentType;
            apiInfo?: ApiInfo;
          }>;

          const module = await moduleLoader();

          if (module.apiInfo) {
            setApiInfo({
              ...module.apiInfo,
              contentType: module.apiInfo.contentType || 'application/json'
            });
          } else {
            throw new Error('No apiInfo export found in module');
          }
        } else {
          throw new Error(`Module not found: ${modulePath}`);
        }
      } catch (error) {
        console.error('API 정보 로드 실패:', error);
        setApiInfo({
          title: currentApi.title,
          description: '',
          category: '',
          path: currentApi.path,
          method: 'POST',
          testUrl: 'https://tbgw.settlebank.co.kr' + currentApi.path,
          prodUrl: 'https://gw.settlebank.co.kr' + currentApi.path,
          contentType: 'application/json'
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadApiInfo();
  }, [currentApi, setApiInfo, setIsLoading]);

  // 경로 변경 시 파라미터 초기화
  useEffect(() => {
    resetParameters();
  }, [location.pathname, resetParameters]);

  // 선택된 API 설정
  useEffect(() => {
    if (currentApi && currentApi !== selectedApi) {
      setSelectedApi(currentApi);
    }
  }, [currentApi, selectedApi, setSelectedApi]);


  // API 호출 함수
  const handleApiCall = async () => {
    if (!apiInfo || !requestBody.trim()) {
      return;
    }

    // isPaymentForm이 true인 경우 form submit 방식으로 팝업 호출
    if (apiInfo.isPaymentForm) {
      handlePaymentFormSubmit();
      return;
    }

    // 다른 API들은 일반 fetch 호출
    setIsLoading(true);
    setApiError(null);

    try {
      const url = selectedEnvironment === 'test' ? apiInfo.testUrl : apiInfo.prodUrl;
      const response = await fetch(url, {
        method: apiInfo.method,
        headers: {
          'Content-Type': apiInfo.contentType || 'application/json',
        },
        body: requestBody
      });

      const result = await response.json();
      setApiResponse(result);
    } catch (error) {
      setApiError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  // 결제창 호출을 위한 form submit 함수 (팝업)
  const handlePaymentFormSubmit = () => {
    if (!apiInfo) return;

    const url = selectedEnvironment === 'test' ? apiInfo.testUrl : apiInfo.prodUrl;
    
    // Form 데이터 파싱
    const formData = new URLSearchParams(requestBody);
    
    // 팝업 창 크기 설정
    const popupWidth = 800;
    const popupHeight = 600;
    const left = (window.screen.width - popupWidth) / 2;
    const top = (window.screen.height - popupHeight) / 2;
    
    // 팝업 창 열기
    const popup = window.open('', 'paymentPopup', 
      `width=${popupWidth},height=${popupHeight},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );
    
    if (!popup) {
      alert('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.');
      return;
    }
    
    // 동적으로 form 생성
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = url;
    form.target = 'paymentPopup';
    form.style.display = 'none';

    // 파라미터들을 hidden input으로 추가
    for (const [key, value] of formData.entries()) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    }

    // form을 DOM에 추가하고 submit
    document.body.appendChild(form);
    form.submit();
    
    // form 제거
    document.body.removeChild(form);
  };

  // API가 선택되지 않은 경우
  if (!currentApi) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Play className="w-5 h-5 mr-2" />
          API 테스트
        </h2>
        <div className="text-gray-500 text-center py-8">
          API 문서를 선택해주세요.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Play className="w-5 h-5 mr-2" />
        API 테스트
      </h2>

      <div className="space-y-4">
        <ApiRequestForm
          apiInfo={apiInfo}
          currentApiPath={currentApi.path}
        />
        <ApiResponsePanel
          apiInfo={apiInfo}
          onApiCall={handleApiCall}
        />
      </div>
    </div>
  );
};

export default ApiTestPanel;
