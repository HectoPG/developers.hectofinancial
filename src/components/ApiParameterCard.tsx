import React from 'react';
import clsx from 'clsx';
import { useApiTest } from '../contexts/ApiTestContext';

interface ApiParameterCardProps {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example?: string;
  note?: string;
  values?: string[];
  className?: string;
  // 입력 기능 관련 props
  inputType?: 'text' | 'number' | 'email' | 'password' | 'textarea';
  defaultValue?: string;
  placeholder?: string;
  fixed?: boolean; // 고정값 여부 (수정 불가)
  onChange?: (name: string, value: string) => void;
  // 섹션 구분
  section?: 'params' | 'data'; // 어떤 섹션에 속하는지
}

const ApiParameterCard: React.FC<ApiParameterCardProps> = ({
  name,
  type,
  required,
  description,
  example,
  note,
  values,
  className = "",
  // 입력 기능 관련 props
  inputType = 'text',
  defaultValue,
  placeholder,
  fixed = false,
  onChange,
  // 섹션 구분
  section
}) => {
  // Context가 없을 때를 대비한 fallback
  let updateParameter: ((name: string, value: string, type: string, required: boolean, section?: 'params' | 'data') => void) | null = null;
  let hasContext = false;
  
  try {
    const context = useApiTest();
    updateParameter = context.updateParameter;
    hasContext = true;
    
  } catch (error) {
    // Context가 없으면 전역 상태 사용
    updateParameter = (name: string, value: string, type: string, required: boolean, section?: 'params' | 'data') => {
      // 전역 상태에 저장
      if (typeof window !== 'undefined') {
        if (!(window as any).globalApiParameters) {
          (window as any).globalApiParameters = {};
        }
        (window as any).globalApiParameters[name] = { name, value, type, required, section };
        
        // 커스텀 이벤트 발생시켜 ApiTestPanel에 알림
        window.dispatchEvent(new CustomEvent('apiParameterChanged', {
          detail: { name, value, type, required, section }
        }));
      }
    };
    hasContext = true; // 전역 상태를 사용할 수 있으므로 true로 설정
  }

  const [inputValue, setInputValue] = React.useState(defaultValue || example || '');

  // 초기값을 Context에 등록
  React.useEffect(() => {
    const initialValue = defaultValue || example || '';
    
    if (initialValue && updateParameter && hasContext) {
      updateParameter(name, initialValue, type, required, section || undefined);
      
      // 초기값도 전역 상태에 등록
      if (typeof window !== 'undefined') {
        if (!(window as any).globalApiParameters) {
          (window as any).globalApiParameters = {};
        }
        (window as any).globalApiParameters[name] = { name, value: initialValue, type, required, section };
        
        // 초기값 등록 시에도 이벤트 발생
        window.dispatchEvent(new CustomEvent('apiParameterChanged', {
          detail: { name, value: initialValue, type, required, section }
        }));
      }
    }
  }, [name, defaultValue, example, type, required, updateParameter, hasContext, section]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    updateParameter?.(name, value, type, required, section || undefined);
    
    // Context를 사용하더라도 전역 상태도 업데이트
    if (typeof window !== 'undefined') {
      if (!(window as any).globalApiParameters) {
        (window as any).globalApiParameters = {};
      }
      (window as any).globalApiParameters[name] = { name, value, type, required, section };
      
      // 커스텀 이벤트 발생시켜 ApiTestPanel에 알림
      window.dispatchEvent(new CustomEvent('apiParameterChanged', {
        detail: { name, value, type, required, section }
      }));
    }
    
    onChange?.(name, value);
  };
  return (
    <div className={`border-b border-gray-100 py-3 ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* 파라미터 이름, 타입, 필수 - 한 줄에 */}
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
        
        {/* 입력 박스와 추가 정보 */}
        <div className="lg:col-span-1">
          <div className="space-y-1">
            {/* 입력 박스 */}
            {inputType === 'textarea' ? (
              <textarea
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={placeholder || example || ''}
                disabled={fixed}
                className={clsx(
                  'w-full text-xs border rounded px-2 py-1 font-mono resize-none',
                  fixed 
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200' 
                    : 'bg-white text-gray-900 border-gray-300 focus:border-hecto-500 focus:ring-1 focus:ring-hecto-500'
                )}
                rows={2}
              />
            ) : (
              <input
                type={inputType}
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={placeholder || example || ''}
                disabled={fixed}
                className={clsx(
                  'w-full text-xs border rounded px-2 py-1 font-mono',
                  fixed 
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200' 
                    : 'bg-white text-gray-900 border-gray-300 focus:border-hecto-500 focus:ring-1 focus:ring-hecto-500'
                )}
              />
            )}
            
            {/* 허용값 표시 */}
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

export default ApiParameterCard;
