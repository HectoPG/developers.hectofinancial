import React, { useState, useEffect } from 'react';
import { ChevronDown, Play, Zap } from 'lucide-react';
import clsx from 'clsx';
import * as yaml from 'yaml';

const ApiDocsPage: React.FC = () => {
  const [swaggerSpec, setSwaggerSpec] = useState<any>(null);
  const [selectedApi, setSelectedApi] = useState<string>('');
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Swagger YAML 로드
  useEffect(() => {
    fetch('/api/swagger.yaml')
      .then(response => response.text())
      .then(yamlText => {
        try {
          const spec = yaml.parse(yamlText);
          setSwaggerSpec(spec);
        } catch (error) {
          console.error('YAML 파싱 오류:', error);
        // 빈 스펙으로 설정
        setSwaggerSpec({ paths: {} });
        }
      })
      .catch(error => {
        console.error('Swagger YAML 로드 오류:', error);
        // 빈 스펙으로 설정
        setSwaggerSpec({ paths: {} });
      });
  }, []);

  // Swagger 스펙에서 API 그룹 생성
  const generateApiGroups = (spec: any) => {
    if (!spec || !spec.paths) {
      return {};
    }

    const apiGroups: any = {};

    // Swagger paths에서 API 정보 추출
    Object.entries(spec.paths).forEach(([path, pathItem]: [string, any]) => {
      Object.entries(pathItem).forEach(([method, operation]: [string, any]) => {
        if (['get', 'post', 'put', 'delete', 'patch'].includes(method.toLowerCase())) {
          const apiInfo = {
            path,
            method: method.toUpperCase(),
            title: operation.summary || path.split('/').pop()?.replace('.do', '') || 'API',
            description: operation.description || 'API 설명이 없습니다.',
            tags: operation.tags || ['기타']
          };

          // tags를 기반으로 카테고리 생성
          const tags = operation.tags || ['기타'];
          tags.forEach((tag: string) => {
            if (!apiGroups[tag]) {
              apiGroups[tag] = {};
            }

            // API 경로에서 자동으로 세부 카테고리명 추출
            const pathParts = path.split('/');
            const lastPart = pathParts[pathParts.length - 1] || '';
            const apiName = lastPart.replace('.do', '').replace('API', '');
            
            // API 이름을 기반으로 카테고리명 생성
            let subCategory = '기타';
            if (apiName) {
              // API 이름을 그대로 카테고리명으로 사용하거나, 간단한 변환
              subCategory = apiName
                .replace(/^API/, '')
                .replace(/([A-Z])/g, ' $1')
                .trim()
                .replace(/^./, str => str.toUpperCase());
            }

            if (!apiGroups[tag][subCategory]) {
              apiGroups[tag][subCategory] = [];
            }

            apiGroups[tag][subCategory].push(apiInfo);
          });
        }
      });
    });

    return apiGroups;
  };

  const apiGroups = generateApiGroups(swaggerSpec);

  // 선택된 API 정보 가져오기
  const getSelectedApiInfo = () => {
    if (!swaggerSpec || !swaggerSpec.paths || !selectedApi) {
      return null;
    }

    const pathItem = swaggerSpec.paths[selectedApi];
    if (!pathItem) return null;

    // 첫 번째 HTTP 메소드의 정보 가져오기
    const methods = Object.keys(pathItem).filter(method => 
      ['get', 'post', 'put', 'delete', 'patch'].includes(method.toLowerCase())
    );
    
    if (methods.length > 0) {
      const method = methods[0];
      const operation = pathItem[method];
      return {
        path: selectedApi,
        method: method.toUpperCase(),
        title: operation.summary || selectedApi.split('/').pop()?.replace('.do', '') || 'API',
        description: operation.description || 'API 설명이 없습니다.'
      };
    }
    return null;
  };

  const selectedApiInfo = getSelectedApiInfo();

  // 선택된 API의 파라미터 정보 추출
  const getApiParameters = (apiPath: string) => {
    if (!swaggerSpec || !swaggerSpec.paths || !swaggerSpec.paths[apiPath]) {
      return [];
    }

    const pathItem = swaggerSpec.paths[apiPath];
    const parameters: any[] = [];

    // 각 HTTP 메소드에서 파라미터 추출
    Object.entries(pathItem).forEach(([method, operation]: [string, any]) => {
      if (['get', 'post', 'put', 'delete', 'patch'].includes(method.toLowerCase())) {
        // requestBody에서 스키마 추출
        if (operation.requestBody && operation.requestBody.content) {
          const content = operation.requestBody.content['application/json'];
          if (content && content.schema) {
            const schema = content.schema;
            
            // $ref 참조인 경우 components에서 스키마 가져오기
            if (schema.$ref) {
              const refPath = schema.$ref.replace('#/', '').split('/');
              let refSchema = swaggerSpec;
              for (const path of refPath) {
                refSchema = refSchema[path];
              }
              
              if (refSchema && refSchema.properties) {
                // params와 data 객체의 properties 추출
                Object.entries(refSchema.properties).forEach(([parentKey, parentSchema]: [string, any]) => {
                  if (parentSchema.properties) {
                    Object.entries(parentSchema.properties).forEach(([paramName, paramSchema]: [string, any]) => {
                      const fullParamName = `${parentKey}.${paramName}`;
                      const isRequired = refSchema.required && refSchema.required.includes(parentKey) && 
                                       parentSchema.required && parentSchema.required.includes(paramName);
                      
                      parameters.push({
                        name: fullParamName,
                        type: paramSchema.type || 'string',
                        required: isRequired,
                        description: paramSchema.description || '',
                        example: paramSchema.example || ''
                      });
                    });
                  }
                });
              }
            }
          }
        }
      }
    });

    return parameters;
  };

  const apiParameters = selectedApi ? getApiParameters(selectedApi) : [];

  // 선택된 API의 요청/응답 예시 추출
  const getApiExamples = (apiPath: string) => {
    if (!swaggerSpec || !swaggerSpec.paths || !swaggerSpec.paths[apiPath]) {
      return { request: null, response: null };
    }

    const pathItem = swaggerSpec.paths[apiPath];
    let requestExample = null;
    let responseExample = null;

    // 각 HTTP 메소드에서 예시 추출
    Object.entries(pathItem).forEach(([method, operation]: [string, any]) => {
      if (['get', 'post', 'put', 'delete', 'patch'].includes(method.toLowerCase())) {
        // 요청 예시 추출
        if (operation.requestBody && operation.requestBody.content) {
          const content = operation.requestBody.content['application/json'];
          if (content && content.examples) {
            // 첫 번째 예시 사용
            const exampleKey = Object.keys(content.examples)[0];
            if (exampleKey) {
              requestExample = content.examples[exampleKey].value;
            }
          }
        }

        // 응답 예시 추출
        if (operation.responses && operation.responses['200']) {
          const response = operation.responses['200'];
          if (response.content && response.content['application/json']) {
            const content = response.content['application/json'];
            if (content.examples) {
              // 첫 번째 예시 사용
              const exampleKey = Object.keys(content.examples)[0];
              if (exampleKey) {
                responseExample = content.examples[exampleKey].value;
              }
            }
          }
        }
      }
    });

    return { request: requestExample, response: responseExample };
  };

  const apiExamples = selectedApi ? getApiExamples(selectedApi) : { request: null, response: null };

  // 드롭다운 토글 함수들
  const toggleService = (serviceName: string) => {
    const newExpanded = new Set(expandedServices);
    if (newExpanded.has(serviceName)) {
      newExpanded.delete(serviceName);
    } else {
      newExpanded.add(serviceName);
    }
    setExpandedServices(newExpanded);
  };

  const toggleCategory = (categoryKey: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryKey)) {
      newExpanded.delete(categoryKey);
    } else {
      newExpanded.add(categoryKey);
    }
    setExpandedCategories(newExpanded);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* 왼쪽 사이드바 - API 목록 */}
        <div className="w-64 bg-white border-r border-gray-200 h-[calc(100vh-80px)] overflow-y-auto scrollbar-hide hover:scrollbar-show">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">API 목록</h2>
            
            {Object.entries(apiGroups).map(([serviceName, categories]: [string, any]) => {
              const isServiceExpanded = expandedServices.has(serviceName);
              
              return (
                <div key={serviceName} className="mb-4">
                  <button
                    onClick={() => toggleService(serviceName)}
                    className={clsx(
                      'w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none',
                      'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <div className="flex items-center">
                      {serviceName}
                    </div>
                    <ChevronDown 
                      className={clsx(
                        'h-4 w-4 transition-transform duration-200',
                        isServiceExpanded ? 'rotate-180' : ''
                      )} 
                    />
                  </button>
                  
                  {isServiceExpanded && (
                    <div className="mt-1 ml-8 space-y-1">
                      {Object.entries(categories).map(([categoryName, apis]: [string, any]) => {
                        const categoryKey = `${serviceName}-${categoryName}`;
                        const isCategoryExpanded = expandedCategories.has(categoryKey);
                        
                        return (
                          <div key={categoryName} className="mb-3">
                            <button
                              onClick={() => toggleCategory(categoryKey)}
                              className={clsx(
                                'w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors focus:outline-none',
                                'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                              )}
                            >
                              <div className="flex items-center">
                                {categoryName}
                              </div>
                              <ChevronDown 
                                className={clsx(
                                  'h-4 w-4 transition-transform duration-200',
                                  isCategoryExpanded ? 'rotate-180' : ''
                                )} 
                              />
                            </button>
                            
                            {isCategoryExpanded && (
                              <div className="mt-1 ml-8 space-y-1">
                                {apis.map((api: any, index: number) => (
                                  <button
                                    key={index}
                                    onClick={() => setSelectedApi(api.path)}
                                    className={clsx(
                                      'w-full text-left p-3 rounded-lg border transition-all focus:outline-none',
                                      selectedApi === api.path
                                        ? 'bg-hecto-50 border-hecto-200 text-hecto-900'
                                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                    )}
                                  >
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="font-medium text-sm">{api.title}</span>
                                      <span className={clsx(
                                        'text-xs px-2 py-1 rounded',
                                        api.method === 'POST' 
                                          ? 'bg-green-100 text-green-700' 
                                          : 'bg-blue-100 text-blue-700'
                                      )}>
                                        {api.method}
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-500 truncate mt-1">{api.path}</p>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 가운데 영역 - 문서 내용 */}
        <div className="flex-1 bg-white">
          {selectedApi ? (
            <div className="h-full">
              {/* 문서 헤더 */}
              <div className="border-b border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedApiInfo?.title || 'API 문서'}
                </h2>
                <p className="text-gray-600">
                  {selectedApiInfo?.description || 'API 설명이 없습니다.'}
                </p>
                <div className="mt-2 flex items-center">
                  <span className={`text-xs px-2 py-1 rounded mr-2 ${
                    selectedApiInfo?.method === 'POST' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {selectedApiInfo?.method}
                  </span>
                  <span className="text-sm font-mono text-gray-500">{selectedApiInfo?.path}</span>
                </div>
              </div>

              {/* 문서 콘텐츠 */}
              <div className="p-6 h-[calc(100vh-180px)] overflow-y-auto">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">요청 정보</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded mr-2">POST</span>
                        <code className="text-sm font-mono">{selectedApi}</code>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">요청 파라미터</h3>
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden max-h-96 overflow-y-auto">
                      <table className="min-w-full">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">파라미터</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">타입</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">필수</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">설명</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {apiParameters.map((param: any, index: number) => (
                            <tr key={index}>
                              <td className="px-4 py-2 text-sm font-mono">{param.name}</td>
                              <td className="px-4 py-2 text-sm text-gray-600">{param.type}</td>
                              <td className={`px-4 py-2 text-sm ${
                                param.required 
                                  ? 'text-red-600' 
                                  : 'text-gray-500'
                              }`}>
                                {param.required ? '필수' : '선택'}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-600">
                                {param.description || '설명이 없습니다.'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">응답 예시</h3>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                      {apiExamples.response 
                        ? JSON.stringify(apiExamples.response, null, 2)
                        : '응답 예시가 없습니다.'
                      }
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Play className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">API를 선택하세요</h3>
                <p className="text-gray-500">왼쪽에서 테스트하고 싶은 API를 선택해주세요.</p>
              </div>
            </div>
          )}
        </div>

        {/* 오른쪽 사이드바 - 테스트 */}
        <div className="w-80 bg-gray-50 border-l border-gray-200 h-[calc(100vh-80px)] overflow-y-auto">
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
                          className="w-full h-32 p-3 border border-gray-300 rounded-md text-sm font-mono"
                          placeholder={apiExamples.request 
                            ? JSON.stringify(apiExamples.request, null, 2)
                            : '요청 예시가 없습니다.'
                          }
                        />
                      </div>
                      
                      <button className="w-full bg-hecto-500 hover:bg-hecto-600 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center focus:outline-none">
                        <Zap className="w-4 h-4 mr-2" />
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
        </div>
      </div>
    </div>
  );
};

export default ApiDocsPage;