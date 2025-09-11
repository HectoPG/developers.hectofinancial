import React from 'react';

interface ConfigCardProps {
  title: string;
  type: string;
  description: string;
  value: string;
  note?: string;
  required?: boolean;
  className?: string;
}

const ConfigCard: React.FC<ConfigCardProps> = ({
  title,
  type,
  description,
  value,
  note,
  required = false,
  className = ""
}) => {
  return (
    <div className={`border-b border-gray-100 py-2 ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        {/* 설정 이름과 타입 */}
        <div className="lg:col-span-1">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <code className="text-xs font-mono font-semibold text-gray-900 bg-gray-100 px-1.5 py-0.5 rounded">
                {title}
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
        
        {/* 설명과 값 */}
        <div className="lg:col-span-2">
          <div className="text-xs text-gray-700 leading-relaxed mb-2">
            {description}
          </div>
          
          {/* 값 표시 */}
          <div className="mb-2">
            <div className="text-xs text-gray-500 font-medium mb-1">값:</div>
            <code className="text-xs bg-gray-800 text-gray-200 px-1.5 py-0.5 rounded font-mono">
              {value}
            </code>
          </div>
          
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

export default ConfigCard;
