import React from 'react';
import { Play } from 'lucide-react';
import { type ApiInfo } from '../types/api';
import { useApiDoc } from '../contexts/ApiDocContext';

interface ApiResponsePanelProps {
  apiInfo: ApiInfo | null;
  onApiCall: () => Promise<void>;
}

const ApiResponsePanel: React.FC<ApiResponsePanelProps> = ({ apiInfo, onApiCall }) => {
  const {
    apiResponse,
    apiError,
    isLoading,
    requestBody
  } = useApiDoc();


  const handleApiCall = async () => {
    if (!apiInfo || !requestBody.trim()) {
      return;
    }

    try {
      await onApiCall();
    } catch (error) {
      console.error('API 호출 오류:', error);
    }
  };

  return (
    <div className="space-y-4">
      {/* API 호출 버튼 */}
      <button
        onClick={handleApiCall}
        disabled={isLoading || !apiInfo || !requestBody.trim()}
        className={`w-full font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center focus:outline-none ${
          isLoading || !apiInfo || !requestBody.trim()
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-hecto-600 hover:bg-hecto-700 text-white'
        }`}
      >
        <Play className="w-4 h-4 mr-2" />
        {isLoading ? 'API 호출 중...' : 'API 호출'}
      </button>

      {/* 응답 결과 */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">응답 결과</h3>
        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg min-h-32 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="text-sm text-gray-400 text-center">
              API 호출 중...
            </div>
          ) : apiError ? (
            <div className="text-sm text-red-400">
              <div className="font-medium mb-2">오류 발생:</div>
              <pre className="whitespace-pre-wrap">{apiError.message}</pre>
            </div>
          ) : apiResponse ? (
            <div className="text-sm">
              <div className="font-medium mb-2 text-green-400">성공:</div>
              <pre className="whitespace-pre-wrap">
                {typeof apiResponse === 'string'
                  ? apiResponse
                  : JSON.stringify(apiResponse, null, 2)
                }
              </pre>
            </div>
          ) : (
            <div className="text-sm text-gray-400 text-center">
              API를 호출하면 응답 결과가 여기에 표시됩니다.
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default ApiResponsePanel;