import React, { useEffect, useCallback } from 'react';
import { Copy, Check } from 'lucide-react';
import { type ApiInfo } from '../types/api';
import { useApiDoc } from '../contexts/ApiDocContext';

interface ApiRequestFormProps {
  apiInfo: ApiInfo | null;
  currentApiPath: string | null;
}

const ApiRequestForm: React.FC<ApiRequestFormProps> = ({ apiInfo, currentApiPath }) => {
  const {
    parameters,
    requestBody,
    setRequestBody,
    selectedEnvironment,
    setSelectedEnvironment
  } = useApiDoc();

  const [copied, setCopied] = React.useState(false);


  // Content-Type별 요청 본문 생성 함수
  const generateRequestBody = useCallback((contentType: string) => {
    const params: Record<string, string> = {};
    const data: Record<string, string> = {};

    Object.values(parameters).forEach((param) => {
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
  }, [parameters]);

  // 파라미터 변경 시 요청 본문 업데이트
  useEffect(() => {
    const contentType = apiInfo?.contentType || 'application/json';
    const body = generateRequestBody(contentType);
    setRequestBody(body);
  }, [parameters, apiInfo?.contentType, generateRequestBody, setRequestBody]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('복사 실패:', error);
    }
  };

  // cURL 명령어 생성
  const generateCurlCommand = () => {
    const url = getCurrentUrl();
    const method = apiInfo?.method || 'POST';
    const contentType = apiInfo?.contentType || 'application/json';

    let curl = `curl -X ${method} "${url}"`;
    curl += ` \\\n  -H "Content-Type: ${contentType}"`;
    curl += ` \\\n  -H "Accept: application/json"`;

    if (requestBody && requestBody.trim()) {
      if (contentType.includes('application/x-www-form-urlencoded')) {
        curl += ` \\\n  -d "${requestBody}"`;
      } else {
        curl += ` \\\n  -d '${requestBody}'`;
      }
    }

    return curl;
  };

  // HTML Form 코드 생성 (Payment Form인 경우)
  const generateHtmlFormCode = () => {
    const url = getCurrentUrl();
    const formData = new URLSearchParams(requestBody);
    
    // 파라미터들을 알파벳 순으로 정렬
    const sortedParams = Array.from(formData.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    
    const lines = [
      '<!DOCTYPE html>',
      '<html lang="ko">',
      '<head>',
      '    <meta charset="UTF-8">',
      '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
      '    <title>결제하기</title>',
      '</head>',
      '<body>',
      '    <form method="POST" action="' + url + '" target="_blank">'
    ];
    
    // 파라미터들 추가
    for (const [key, value] of sortedParams) {
      lines.push(`        <input type="hidden" name="${key}" value="${value}" />`);
    }
    
    // 버튼 추가
    lines.push('        <button type="submit" style="');
    lines.push('            background-color: #ff6b35;');
    lines.push('            color: white;');
    lines.push('            padding: 12px 24px;');
    lines.push('            border: none;');
    lines.push('            border-radius: 6px;');
    lines.push('            font-size: 16px;');
    lines.push('            font-weight: bold;');
    lines.push('            cursor: pointer;');
    lines.push('            margin-top: 20px;');
    lines.push('        ">');
    lines.push('            결제창 호출');
    lines.push('        </button>');
    lines.push('    </form>');
    lines.push('</body>');
    lines.push('</html>');
    
    return lines.join('\n');
  };

  const getCurrentUrl = () => {
    if (apiInfo && apiInfo.testUrl && apiInfo.prodUrl) {
      return selectedEnvironment === 'test' ? apiInfo.testUrl : apiInfo.prodUrl;
    }
    // currentApiPath가 있으면 기본 URL 사용
    if (currentApiPath) {
      return selectedEnvironment === 'test'
        ? 'https://tbgw.settlebank.co.kr' + currentApiPath
        : 'https://gw.settlebank.co.kr' + currentApiPath;
    }
    // 기본값
    return selectedEnvironment === 'test'
      ? 'https://tbgw.settlebank.co.kr/api/endpoint'
      : 'https://gw.settlebank.co.kr/api/endpoint';
  };

  return (
    <div className="space-y-4">
      {/* API 기본 정보 */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">API 정보</h3>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="space-y-3">
            {/* Method와 Path */}
            <div className="flex items-center">
              <span className={`text-xs px-2 py-1 rounded mr-3 font-medium ${
                (apiInfo?.method || 'POST') === 'POST'
                  ? 'bg-green-100 text-green-700'
                  : (apiInfo?.method || 'POST') === 'GET'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-purple-100 text-purple-700'
              }`}>
                {apiInfo?.method || 'POST'}
              </span>
              <code className="text-sm font-mono flex-1 break-all bg-gray-50 px-2 py-1 rounded">
                {apiInfo?.path || currentApiPath}
              </code>
            </div>


            {/* API Title & Description */}
            {apiInfo && (
              <div className="pt-2 border-t border-gray-100">
                <h4 className="font-medium text-gray-900 text-sm">{apiInfo.title}</h4>
                {apiInfo.description && (
                  <p className="text-xs text-gray-600 mt-1">{apiInfo.description}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 요청 설정 */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">요청 설정</h3>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
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

            {/* 선택된 환경 URL만 표시 */}
            <div className="mt-2">
              <div className="flex items-center text-xs">
                {/* <span className={`inline-block w-3 h-3 rounded-full mr-2 border ${
                  selectedEnvironment === 'test'
                    ? 'bg-orange-500 border-orange-600'
                    : 'bg-green-500 border-green-600'
                }`}></span> */}
                <code className={`px-2 py-1 rounded text-xs font-mono ${
                  selectedEnvironment === 'test' ? 'bg-orange-50' : 'bg-green-50'
                }`}>
                  {getCurrentUrl()}
                </code>
              </div>
            </div>
          </div>

          {/* HTTP Header */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">HTTP Header</label>
            <div className="bg-gray-50 border border-gray-200 rounded p-3 text-xs">
              <div className="font-mono">
                <span className="text-gray-600">Content-Type:</span> {apiInfo?.contentType || 'application/json'}
              </div>
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

          {/* cURL 명령어 또는 HTML Form 코드 */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">
                {apiInfo?.isPaymentForm ? 'HTML Form 코드' : 'cURL 명령어'}
              </label>
              <button
                onClick={() => copyToClipboard(apiInfo?.isPaymentForm ? generateHtmlFormCode() : generateCurlCommand())}
                className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
              >
                {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                복사
              </button>
            </div>
            <div className="bg-gray-900 text-gray-100 p-3 rounded-md text-xs font-mono overflow-x-auto">
              <pre className="whitespace-pre" style={{ 
                whiteSpace: 'pre',
                lineHeight: '1.4'
              }}>
                {apiInfo?.isPaymentForm ? generateHtmlFormCode() : generateCurlCommand()}
              </pre>
            </div>
            {apiInfo?.isPaymentForm && (
              <p className="text-xs text-gray-500 mt-2">
                💡 이 HTML 코드를 웹페이지에 삽입하면 결제창이 팝업으로 열립니다.
              </p>
            )}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiRequestForm;