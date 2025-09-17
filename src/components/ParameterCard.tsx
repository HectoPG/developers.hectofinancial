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
    <div className={`border-b border-gray-100 py-2 ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        {/* 파라미터 이름, 타입, 필수 - 한 줄에 */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <code className="text-xs font-mono font-semibold text-gray-900 bg-gray-100 px-1.5 py-0.5 rounded">
              {name}
            </code>
            <code className="text-xs font-mono text-blue-600 bg-blue-50 px-1 py-0.5 rounded">
              {type}
            </code>
            {required && (
              <span className="text-xs text-red-600 font-medium bg-red-50 px-1 py-0.5 rounded">필수</span>
            )}
          </div>
        </div>
        
        {/* 설명 - 한 줄로 요약 */}
        <div className="lg:col-span-2">
          <div className="text-xs text-gray-700 leading-snug">
            {description}
          </div>
        </div>
        
        {/* 예시와 추가 정보 - 인라인으로 배치 */}
        <div className="lg:col-span-1">
          <div className="space-y-0.5">
            {example && (
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500">예시:</span>
                <code className="text-xs bg-gray-800 text-gray-200 px-1 py-0.5 rounded font-mono">
                  {example}
                </code>
              </div>
            )}
            
            {values && values.length > 0 && (
              <div className="flex flex-wrap gap-0.5">
                {values.slice(0, 2).map((value, index) => (
                  <code key={index} className="text-xs bg-gray-100 text-gray-800 px-1 py-0.5 rounded font-mono">
                    {value}
                  </code>
                ))}
                {values.length > 2 && (
                  <span className="text-xs text-gray-500">+{values.length - 2}개</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* 참고사항은 별도 행으로 (필요시에만) */}
      {note && (
        <div className="mt-1.5 p-1.5 bg-amber-50 border-l-2 border-amber-300 rounded-r text-xs">
          <div className="flex items-start gap-1.5">
            <span className="text-amber-600 mt-0.5">ℹ️</span>
            <div className="text-amber-800">
              {note}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParameterCard;
