import React from 'react';
import { Play } from 'lucide-react';

interface ApiDocument {
  id: string;
  title: string;
  path: string;
  category: string;
}

interface ApiTestPanelProps {
  selectedApi: ApiDocument | null;
}

const ApiTestPanel: React.FC<ApiTestPanelProps> = ({ selectedApi }) => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Play className="w-5 h-5 mr-2" />
        API 테스트
      </h2>

      {selectedApi ? (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">요청 설정</h3>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded mr-2">
                  POST
                </span>
                <code className="text-sm font-mono">{selectedApi.path}</code>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">서버 환경</label>
                  <select className="w-full p-2 border border-gray-300 rounded-md text-sm">
                    <option value="test">테스트 환경 (tbgw.settlebank.co.kr)</option>
                    <option value="prod">운영 환경 (gw.settlebank.co.kr)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">요청 본문 (JSON)</label>
                  <textarea
                    className="w-full h-32 p-3 border border-gray-300 rounded-md text-sm font-mono"
                    placeholder="요청 예시가 없습니다."
                  />
                </div>

                <button className="w-full bg-hecto-500 hover:bg-hecto-600 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center focus:outline-none">
                  <Play className="w-4 h-4 mr-2" />
                  API 실행
                </button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">응답 결과</h3>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
              <div className="text-sm text-gray-400 mb-2">응답을 받으려면 API를 실행하세요</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <Play className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">API를 선택하면 테스트할 수 있습니다</p>
        </div>
      )}
    </div>
  );
};

export default ApiTestPanel;
