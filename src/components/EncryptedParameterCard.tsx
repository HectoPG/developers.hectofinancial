import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { useApiDoc } from '../contexts/ApiDocContext';
import { Eye, EyeOff, Lock, Unlock } from 'lucide-react';

interface EncryptedParameterCardProps {
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
  // 암호화 관련
  isEncrypted?: boolean; // 이 필드가 암호화 필드인지
  encryptionKey?: string; // 암호화 키 (기본값: "testkey123")
}

// 간단한 AES 암호화/복호화 함수 (실제 환경에서는 더 안전한 방법 사용)
const simpleEncrypt = (text: string, key: string): string => {
  // 실제 환경에서는 crypto-js나 다른 라이브러리 사용
  // 여기서는 간단한 Base64 인코딩으로 시뮬레이션
  const combined = text + key;
  return btoa(combined);
};

const simpleDecrypt = (encryptedText: string, key: string): string => {
  try {
    const decoded = atob(encryptedText);
    return decoded.replace(key, '');
  } catch {
    return encryptedText; // 복호화 실패시 원본 반환
  }
};

const EncryptedParameterCard: React.FC<EncryptedParameterCardProps> = ({
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
  section,
  // 암호화 관련
  isEncrypted = false,
  encryptionKey = "testkey123"
}) => {
  const location = useLocation();
  const [showEncrypted, setShowEncrypted] = useState(false);
  const [isEncryptedMode, setIsEncryptedMode] = useState(true);
  const [plainValue, setPlainValue] = useState('');
  const [encryptedValue, setEncryptedValue] = useState('');

  // ApiDocContext 사용 (optional)
  let updateParameter: ((name: string, value: string, type: string, required: boolean, section?: 'params' | 'data') => void) | null = null;
  let hasContext = false;

  try {
    const context = useApiDoc();
    updateParameter = context.updateParameter;
    hasContext = true;
  } catch (error) {
    // Context가 없는 경우 (MDX에서 사용될 때) 아무것도 하지 않음
    updateParameter = () => {};
    hasContext = false;
  }

  const [inputValue, setInputValue] = useState(defaultValue || example || '');

  // 초기값을 Context에 등록
  React.useEffect(() => {
    const initialValue = defaultValue || example || '';
    setInputValue(initialValue);
    
    if (isEncrypted && initialValue) {
      // 초기값이 암호화된 값인지 확인
      try {
        const decrypted = simpleDecrypt(initialValue, encryptionKey);
        if (decrypted !== initialValue) {
          setPlainValue(decrypted);
          setEncryptedValue(initialValue);
        } else {
          // 평문인 경우 암호화
          const encrypted = simpleEncrypt(initialValue, encryptionKey);
          setPlainValue(initialValue);
          setEncryptedValue(encrypted);
        }
      } catch {
        setPlainValue(initialValue);
        setEncryptedValue(initialValue);
      }
    }

    if (initialValue && updateParameter && hasContext) {
      updateParameter(name, initialValue, type, required, section);
    }
  }, [name, defaultValue, example, type, required, updateParameter, section, location.pathname, hasContext, isEncrypted, encryptionKey]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    
    if (isEncrypted) {
      if (isEncryptedMode) {
        // 암호화 모드: 입력값을 암호화
        const encrypted = simpleEncrypt(value, encryptionKey);
        setEncryptedValue(encrypted);
        setPlainValue(value);
        if (hasContext) {
          updateParameter?.(name, encrypted, type, required, section);
        }
      } else {
        // 평문 모드: 입력값을 그대로 사용
        setPlainValue(value);
        if (hasContext) {
          updateParameter?.(name, value, type, required, section);
        }
      }
    } else {
      if (hasContext) {
        updateParameter?.(name, value, type, required, section);
      }
    }
    
    onChange?.(name, value);
  };

  const toggleEncryptionMode = () => {
    setIsEncryptedMode(!isEncryptedMode);
    if (isEncryptedMode) {
      // 암호화 모드에서 평문 모드로: 암호화된 값을 평문으로 변환
      const decrypted = simpleDecrypt(encryptedValue, encryptionKey);
      setPlainValue(decrypted);
      setInputValue(decrypted);
      if (hasContext) {
        updateParameter?.(name, decrypted, type, required, section);
      }
    } else {
      // 평문 모드에서 암호화 모드로: 평문을 암호화
      const encrypted = simpleEncrypt(plainValue, encryptionKey);
      setEncryptedValue(encrypted);
      setInputValue(encrypted);
      if (hasContext) {
        updateParameter?.(name, encrypted, type, required, section);
      }
    }
  };

  const toggleShowEncrypted = () => {
    setShowEncrypted(!showEncrypted);
  };

  return (
    <div className={`border-b border-gray-100 py-3 ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* 파라미터 이름, 타입, 필수 - 한 줄에 */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-1 flex-nowrap">
            {section && (
              <span className="text-gray-400 text-xs mr-1">└</span>
            )}
            <code className="text-xs font-mono font-semibold text-gray-900 bg-gray-100 px-1.5 py-0.5 rounded">
              {name}
            </code>
            <code className="text-[8px] font-mono text-blue-600 bg-blue-50 px-0.5 py-0.5 rounded">
              {type}
            </code>
            {required && (
              <span className="text-[10px] text-red-600 font-medium whitespace-nowrap">*</span>
            )}
            {isEncrypted && (
              <span className="text-[8px] text-purple-600 bg-purple-50 px-0.5 py-0.5 rounded font-mono">
                AES
              </span>
            )}
          </div>
        </div>
        
        {/* 설명 - 한 줄로 요약 */}
        <div className="lg:col-span-2">
          <div className="text-xs text-gray-700 leading-snug">
            {description}
            {isEncrypted && (
              <span className="text-purple-600 font-medium ml-1">※AES 암호화</span>
            )}
          </div>
        </div>
        
        {/* 입력 박스와 추가 정보 */}
        <div className="lg:col-span-1">
          <div className="space-y-1">
            {/* 입력 박스 */}
            <div className="relative">
              {inputType === 'textarea' ? (
                <textarea
                  value={inputValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder={placeholder || example || ''}
                  disabled={fixed}
                  className={clsx(
                    'w-full text-xs border rounded px-2 py-1 font-mono resize-none pr-8',
                    fixed 
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200' 
                      : 'bg-white text-gray-900 border-gray-300 focus:border-hecto-500 focus:ring-1 focus:ring-hecto-500'
                  )}
                  rows={2}
                />
              ) : (
                <input
                  type={inputType === 'password' || (isEncrypted && !showEncrypted) ? 'password' : 'text'}
                  value={inputValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder={placeholder || example || ''}
                  disabled={fixed}
                  className={clsx(
                    'w-full text-xs border rounded px-2 py-1 font-mono pr-8',
                    fixed 
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200' 
                      : 'bg-white text-gray-900 border-gray-300 focus:border-hecto-500 focus:ring-1 focus:ring-hecto-500'
                  )}
                />
              )}
              
              {/* 암호화 관련 버튼들 */}
              {isEncrypted && !fixed && (
                <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex gap-1">
                  <button
                    type="button"
                    onClick={toggleShowEncrypted}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    title={showEncrypted ? "암호화된 값 숨기기" : "암호화된 값 보기"}
                  >
                    {showEncrypted ? <EyeOff size={12} /> : <Eye size={12} />}
                  </button>
                  <button
                    type="button"
                    onClick={toggleEncryptionMode}
                    className={clsx(
                      "p-1 transition-colors",
                      isEncryptedMode 
                        ? "text-purple-600 hover:text-purple-700" 
                        : "text-gray-400 hover:text-gray-600"
                    )}
                    title={isEncryptedMode ? "평문 모드로 전환" : "암호화 모드로 전환"}
                  >
                    {isEncryptedMode ? <Lock size={12} /> : <Unlock size={12} />}
                  </button>
                </div>
              )}
            </div>
            
            {/* 암호화 상태 표시 */}
            {isEncrypted && (
              <div className="flex items-center gap-2 text-xs">
                <span className={clsx(
                  "px-1.5 py-0.5 rounded font-mono",
                  isEncryptedMode 
                    ? "bg-purple-100 text-purple-700" 
                    : "bg-green-100 text-green-700"
                )}>
                  {isEncryptedMode ? "암호화됨" : "평문"}
                </span>
                {isEncryptedMode && encryptedValue && (
                  <span className="text-gray-500">
                    {encryptedValue.substring(0, 20)}...
                  </span>
                )}
              </div>
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
      
      {/* 암호화 관련 안내 */}
      {isEncrypted && (
        <div className="mt-1.5 p-1.5 bg-purple-50 border-l-2 border-purple-300 rounded-r text-xs">
          <div className="flex items-start gap-1.5">
            <span className="text-purple-600 mt-0.5">🔒</span>
            <div className="text-purple-800">
              <strong>암호화 필드:</strong> 이 필드는 AES 암호화가 필요합니다. 
              {isEncryptedMode ? " 현재 암호화 모드입니다." : " 현재 평문 모드입니다."}
              <br />
              <span className="text-purple-600">
                키: {encryptionKey} (테스트용)
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EncryptedParameterCard;
