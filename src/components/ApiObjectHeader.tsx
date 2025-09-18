import React from 'react';

interface ApiObjectHeaderProps {
  name: string;
  type?: string;
  description?: string;
}

// MDX에서 블록 레벨로 인식되도록 단일 요소로 구성
const ApiObjectHeader: React.FC<ApiObjectHeaderProps> = ({
  name,
  type = 'object',
  description
}) => {
  return (
    <span className="mb-4 mt-6 block">
      <span className="flex items-center gap-3 mb-2 block">
        <span className="text-lg font-semibold text-gray-900 m-0">
          {name}
        </span>
        <code className="text-[8px] font-mono text-blue-600 bg-blue-50 px-0.5 py-0.5 rounded">
          {type}
        </code>
      </span>
      {description && (
        <span className="text-gray-600 text-sm mt-1 mb-0 block">
          {description}
        </span>
      )}
    </span>
  );
};

export default ApiObjectHeader;