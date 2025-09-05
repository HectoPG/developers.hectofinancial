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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        {/* 파라미터 이름과 타입 */}
        <div className="lg:col-span-1">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <code className="text-xs font-mono font-semibold text-gray-900 bg-gray-100 px-1.5 py-0.5 rounded">
                {name}
              </code>
              {required && (
                <span className="text-xs text-red-600 font-medium">required</span>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs">
              <span className="text-gray-500">Type:</span>
              <code className="font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-xs">
                {type}
              </code>
            </div>
          </div>
        </div>
        
        {/* 설명과 추가 정보 */}
        <div className="lg:col-span-2">
          <div className="text-xs text-gray-700 leading-relaxed mb-2">
            {description}
          </div>
          
          {/* 사용 가능한 값들 */}
          {values && values.length > 0 && (
            <div className="mb-2">
              <div className="text-xs text-gray-500 font-medium mb-1">허용값:</div>
              <div className="flex flex-wrap gap-0.5">
                {values.map((value, index) => (
                  <code key={index} className="text-xs bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded font-mono">
                    {value}
                  </code>
                ))}
              </div>
            </div>
          )}
          
          {/* 예시 */}
          {example && (
            <div className="mb-2">
              <div className="text-xs text-gray-500 font-medium mb-1">예시:</div>
              <code className="text-xs bg-gray-800 text-gray-200 px-1.5 py-0.5 rounded font-mono">
                "{example}"
              </code>
            </div>
          )}
          
          {/* 참고사항 */}
          {note && (
            <div className="mt-2 p-2 bg-amber-50 border-l-2 border-amber-300 rounded-r text-xs">
              <div className="flex items-start gap-1">
                <span className="text-amber-600 text-xs mt-0.5">ℹ️</span>
                <div className="text-amber-800">
                  {note}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParameterCard;
