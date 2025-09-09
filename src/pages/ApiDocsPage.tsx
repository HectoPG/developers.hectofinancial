import React, { useState, useEffect } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import { ChevronRight, Play, Code, FileText, Zap } from 'lucide-react';

const ApiDocsPage: React.FC = () => {
  const [swaggerSpec, setSwaggerSpec] = useState<any>(null);
  const [selectedApi, setSelectedApi] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'docs' | 'test'>('docs');

  useEffect(() => {
    // Swagger 스펙 로드
    fetch('/api/swagger.yaml')
      .then(response => response.text())
      .then(yamlText => {
        // 간단한 YAML 파싱 (실제로는 yaml 라이브러리 사용 권장)
        const spec = {
          openapi: "3.0.0",
          info: {
            title: "헥토파이낸셜 API",
            version: "1.0.0"
          },
          paths: {
            "/spay/APICardActionPay.do": {
              post: {
                summary: "신용카드 결제",
                tags: ["결제 API"],
                description: "신용카드 결제 및 빌키 결제 API"
              }
            },
            "/spay/APICardAuth.do": {
              post: {
                summary: "신용카드 빌키 발급",
                tags: ["결제 API"],
                description: "신용카드 빌키 발급 API"
              }
            },
            "/spay/APICancel.do": {
              post: {
                summary: "결제 취소",
                tags: ["취소 API"],
                description: "결제 취소 API"
              }
            },
            "/spay/APIVBank.do": {
              post: {
                summary: "가상계좌 채번",
                tags: ["가상계좌 API"],
                description: "가상계좌 발급 API"
              }
            },
            "/spay/APITrdStatInq.do": {
              post: {
                summary: "거래 상태 조회",
                tags: ["거래 관리 API"],
                description: "실시간 거래 상태 조회 API"
              }
            }
          }
        };
        setSwaggerSpec(spec);
      });
  }, []);

  const apiGroups = {
    "결제 API": [
      { path: "/spay/APICardActionPay.do", method: "POST", title: "신용카드 결제", description: "신용카드 결제 및 빌키 결제" },
      { path: "/spay/APICardAuth.do", method: "POST", title: "신용카드 빌키 발급", description: "빌키 발급 API" }
    ],
    "취소 API": [
      { path: "/spay/APICancel.do", method: "POST", title: "결제 취소", description: "결제 취소 및 환불" }
    ],
    "가상계좌 API": [
      { path: "/spay/APIVBank.do", method: "POST", title: "가상계좌 채번", description: "가상계좌 발급 및 관리" }
    ],
    "거래 관리 API": [
      { path: "/spay/APITrdStatInq.do", method: "POST", title: "거래 상태 조회", description: "실시간 거래 조회" }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* 왼쪽 사이드바 - API 리스트 */}
        <div className="w-80 bg-white border-r border-gray-200 h-[calc(100vh-80px)] overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">API 목록</h2>
            
            {Object.entries(apiGroups).map(([groupName, apis]) => (
              <div key={groupName} className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <span className="mr-2">
                    {groupName === "결제 API" && "🔧"}
                    {groupName === "취소 API" && "❌"}
                    {groupName === "가상계좌 API" && "🏦"}
                    {groupName === "거래 관리 API" && "📊"}
                  </span>
                  {groupName}
                </h3>
                <div className="space-y-1">
                  {apis.map((api, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedApi(api.path)}
                      className={`w-full text-left p-3 rounded-lg border transition-all focus:outline-none ${
                        selectedApi === api.path
                          ? 'bg-orange-50 border-orange-200 text-orange-900'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{api.title}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          api.method === 'POST' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {api.method}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{api.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 가운데 메인 콘텐츠 */}
        <div className="flex-1 bg-white">
          {selectedApi ? (
            <div className="h-full">
              {/* 탭 헤더 */}
              <div className="border-b border-gray-200">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('docs')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors focus:outline-none ${
                      activeTab === 'docs'
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <FileText className="inline w-4 h-4 mr-2" />
                    문서
                  </button>
                  <button
                    onClick={() => setActiveTab('test')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors focus:outline-none ${
                      activeTab === 'test'
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Play className="inline w-4 h-4 mr-2" />
                    테스트
                  </button>
                </div>
              </div>

              {/* 탭 콘텐츠 */}
              <div className="p-6 h-[calc(100vh-180px)] overflow-y-auto">
                {activeTab === 'docs' ? (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      {apiGroups[Object.keys(apiGroups).find(group => 
                        apiGroups[group].some(api => api.path === selectedApi)
                      )!].find(api => api.path === selectedApi)?.title}
                    </h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">요청 정보</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded mr-2">POST</span>
                            <code className="text-sm font-mono">{selectedApi}</code>
                          </div>
                          <p className="text-sm text-gray-600">
                            {apiGroups[Object.keys(apiGroups).find(group => 
                              apiGroups[group].some(api => api.path === selectedApi)
                            )!].find(api => api.path === selectedApi)?.description}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">요청 파라미터</h3>
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                          <table className="min-w-full">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">파라미터</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">타입</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">필수</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">설명</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              <tr>
                                <td className="px-4 py-2 text-sm font-mono">mchtId</td>
                                <td className="px-4 py-2 text-sm text-gray-600">string</td>
                                <td className="px-4 py-2 text-sm text-red-600">필수</td>
                                <td className="px-4 py-2 text-sm text-gray-600">상점 ID</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-2 text-sm font-mono">mchtTrdNo</td>
                                <td className="px-4 py-2 text-sm text-gray-600">string</td>
                                <td className="px-4 py-2 text-sm text-red-600">필수</td>
                                <td className="px-4 py-2 text-sm text-gray-600">주문번호</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-2 text-sm font-mono">trdAmt</td>
                                <td className="px-4 py-2 text-sm text-gray-600">string</td>
                                <td className="px-4 py-2 text-sm text-red-600">필수</td>
                                <td className="px-4 py-2 text-sm text-gray-600">결제금액</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">응답 예시</h3>
                        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "resultCode": "0000",
  "resultMsg": "성공",
  "trdNo": "20231215143022001",
  "mchtTrdNo": "ORDER20231215143022",
  "trdAmt": "1000"
}`}
                        </pre>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">API 테스트</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">요청 설정</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center mb-4">
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded mr-2">POST</span>
                            <code className="text-sm font-mono">{selectedApi}</code>
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
                                className="w-full h-40 p-3 border border-gray-300 rounded-md text-sm font-mono"
                                placeholder={`{
  "mchtId": "nxca_jt_il",
  "mchtTrdNo": "ORDER20231215143022",
  "trdDt": "20231215",
  "trdTm": "143022",
  "trdAmt": "1000",
  "method": "card",
  "pktHash": "생성된해시값"
}`}
                              />
                            </div>
                            
                            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center focus:outline-none">
                              <Zap className="w-4 h-4 mr-2" />
                              API 실행
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">응답 결과</h3>
                        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
                          <div className="text-sm text-gray-400 mb-2">응답을 받으려면 API를 실행하세요</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Code className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">API를 선택하세요</h3>
                <p className="text-gray-500">왼쪽에서 테스트하고 싶은 API를 선택해주세요.</p>
              </div>
            </div>
          )}
        </div>

        {/* 오른쪽 사이드바 - 추가 정보 */}
        <div className="w-80 bg-gray-50 border-l border-gray-200 h-[calc(100vh-80px)] overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">추가 리소스</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">📚 문서</h3>
                <ul className="space-y-1 text-sm">
                  <li><a href="/docs/pg/01-getting-started" className="text-orange-600 hover:underline">PG 결제 시작하기</a></li>
                  <li><a href="/docs/pg/02-credit-card" className="text-orange-600 hover:underline">신용카드 결제</a></li>
                  <li><a href="/docs/pg/03-virtual-account" className="text-orange-600 hover:underline">가상계좌 결제</a></li>
                  <li><a href="/docs/pg/09-transaction-management" className="text-orange-600 hover:underline">거래 관리</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">🛠️ 지원</h3>
                <ul className="space-y-1 text-sm">
                  <li><a href="/docs/pg/10-developer-reference" className="text-orange-600 hover:underline">개발자 참조</a></li>
                  <li><a href="/docs/ezauth/hecto_financial_ezauth" className="text-orange-600 hover:underline">내통장결제</a></li>
                  <li><a href="/docs/ezcp/hecto_financial_ezcp" className="text-orange-600 hover:underline">간편현금결제</a></li>
                  <li><a href="/docs/whitelabel/hecto_financial_whitelabel" className="text-orange-600 hover:underline">화이트라벨</a></li>
                </ul>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h3 className="text-sm font-medium text-blue-900 mb-2">💡 팁</h3>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• 테스트 환경에서 먼저 테스트하세요</li>
                  <li>• 모든 민감정보는 암호화하세요</li>
                  <li>• HTTPS를 사용하세요</li>
                  <li>• 응답 코드를 확인하세요</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDocsPage;
