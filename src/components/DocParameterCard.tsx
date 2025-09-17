import React from 'react';

interface DocParameterCardProps {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example?: string;
  note?: string;
  values?: string[];
  className?: string;
}

const DocParameterCard: React.FC<DocParameterCardProps> = ({
  name,
  type,
  required,
  description,
  example,
  note,
  values,
  className = "",
}) => {
  return (
    <div className={`border-b border-gray-100 py-3 ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* 파라미터 이름, 타입, 필수 */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-1 flex-nowrap">
            <code className="text-xs font-mono font-semibold text-gray-900 bg-gray-100 px-1.5 py-0.5 rounded">
              {name}
            </code>
            <code className="text-[8px] font-mono text-blue-600 bg-blue-50 px-0.5 py-0.5 rounded">
              {type}
            </code>
            {required && (
              <span className="text-[10px] text-red-600 font-medium whitespace-nowrap">*</span>
            )}
          </div>
        </div>
        
        {/* 설명 - 한 줄로 요약 */}
        <div className="lg:col-span-2">
          <div className="text-xs text-gray-700 leading-snug">
            {description}
          </div>
        </div>
        
        {/* 추가 정보 */}
        <div className="lg:col-span-1">
          <div className="space-y-1">
            {note && (
              <div className="text-xs text-blue-600 bg-blue-50 p-1.5 rounded">{note}</div>
            )}
            
            {values && values.length > 0 && (
              <div className="text-xs">
                <div className="font-medium text-gray-500 mb-1">가능한 값:</div>
                <ul className="text-gray-600 space-y-0.5">
                  {values.map((val, index) => (
                    <li key={index} className="text-xs">{val}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {example && (
              <div className="text-xs">
                <div className="font-medium text-gray-500 mb-1">예시:</div>
                <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded font-mono text-gray-800">
                  {example}
                </code>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocParameterCard;
