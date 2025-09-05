import React from 'react';

interface ParameterCardProps {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example?: string;
  note?: string;
  values?: string[];
  className?: string;
}

const ParameterCard: React.FC<ParameterCardProps> = ({
  name,
  type,
  required,
  description,
  example,
  note,
  values,
  className = ""
}) => {
  return (
    <div className={`mb-6 p-6 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow ${className}`}>
      {/* 파라미터 헤더 - 이미지와 동일한 레이아웃 */}
      <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 mb-3">
        <h3 className="text-lg font-semibold text-gray-900 m-0">
          {name}
        </h3>
        <div className="flex items-center gap-2">
          <span className={`text-sm px-2 py-0.5 rounded-sm font-medium ${
            required 
              ? 'text-red-600 bg-red-50 border border-red-200' 
              : 'text-gray-500 bg-gray-100'
          }`}>
            {required ? '필수' : '선택'}
          </span>
          <span className="text-gray-400 font-light">·</span>
          <span className="text-gray-600 text-sm font-mono">
            {type}
          </span>
        </div>
      </div>
      
      {/* 설명 텍스트 - 이미지와 같은 색상과 줄간격 */}
      <div className="text-gray-700 leading-relaxed text-sm mb-4">
        {description}
      </div>
      
      {/* 사용 가능한 값들 */}
      {values && values.length > 0 && (
        <div className="mb-4">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
            사용 가능한 값
          </span>
          <div className="space-y-1">
            {values.map((value, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-hecto-400 rounded-full mt-2 flex-shrink-0"></span>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono text-gray-800">
                  {value}
                </code>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* 예시 코드 */}
      {example && (
        <div className="mb-3">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
            예시
          </span>
          <pre className="bg-white border border-gray-200 px-4 py-3 rounded-md text-sm font-mono text-gray-800 overflow-x-auto shadow-sm">
            <code>"{example}"</code>
          </pre>
        </div>
      )}
      
      {/* 추가 정보 노트 */}
      {note && (
        <div className="mt-4 p-4 bg-hecto-50 border-l-4 border-hecto-400 rounded-r-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-hecto-500 text-sm">💡</span>
            </div>
            <div className="ml-2">
              <p className="text-sm text-hecto-800 font-medium">
                참고사항
              </p>
              <p className="text-sm text-hecto-700 mt-1">
                {note}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParameterCard;
