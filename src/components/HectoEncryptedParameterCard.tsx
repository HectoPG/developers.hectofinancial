import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { useApiDoc } from '../contexts/ApiDocContext';
import { Hash } from 'lucide-react';
import CryptoJS from 'crypto-js';

interface HectoEncryptedParameterCardProps {
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
  isHashField?: boolean; // 이 필드가 해시 필드인지 (pktHash)
  encryptionKey?: string; // 암호화 키
  hashKey?: string; // 해시 키
}

// 헥토파이낸셜 실제 암호화 방식 구현 (AES-256/ECB/PKCS5Padding + Base64)
const hectoEncrypt = (text: string, key: string): string => {
  try {
    // 키를 32바이트로 맞춤 (AES-256)
    const keyBytes = CryptoJS.enc.Utf8.parse(key.padEnd(32, '0').substring(0, 32));
    
    // AES-256/ECB/PKCS5Padding 암호화
    const encrypted = CryptoJS.AES.encrypt(text, keyBytes, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    
    // Base64 인코딩 (CryptoJS 프리픽스 제거)
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  } catch (error) {
    console.error('암호화 오류:', error);
    return text; // 암호화 실패시 원본 반환
  }
};

const hectoDecrypt = (encryptedText: string, key: string): string => {
  try {
    // 키를 32바이트로 맞춤 (AES-256)
    const keyBytes = CryptoJS.enc.Utf8.parse(key.padEnd(32, '0').substring(0, 32));
    
    // Base64 디코딩
    const ciphertext = CryptoJS.enc.Base64.parse(encryptedText);
    
    // AES-256/ECB/PKCS5Padding 복호화
    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: ciphertext },
      keyBytes,
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      }
    );
    
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('복호화 오류:', error);
    return encryptedText; // 복호화 실패시 원본 반환
  }
};

// SHA-256 해시 생성
const generateHash = (input: string): string => {
  return CryptoJS.SHA256(input).toString(); // Hex 인코딩 (기본값)
};

// PG 서비스 해시 생성 (신용카드 결제 UI)
const generatePGHash = (mchtId: string, method: string, mchtTrdNo: string, 
                       trdDt: string, trdTm: string, trdAmt: string, hashKey: string): string => {
  const input = mchtId + method + mchtTrdNo + trdDt + trdTm + trdAmt + hashKey;
  return generateHash(input);
};


const HectoEncryptedParameterCard: React.FC<HectoEncryptedParameterCardProps> = ({
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
  isHashField = false,
  encryptionKey = "pgSettle30y739r82jtd709yOfZ2yK5K", // PG 테스트용 암호화키
  hashKey = "ST1009281328226982205" // PG 테스트용 해시키 (실제로는 상점별 고유값)
}) => {
  const location = useLocation();
  const [plainValue, setPlainValue] = useState('');
  const [encryptedValue, setEncryptedValue] = useState('');
  const [isGeneratingHash, setIsGeneratingHash] = useState(false);

  // ApiDocContext 사용 (optional)
  let updateParameter: ((name: string, value: string, type: string, required: boolean, section?: 'params' | 'data') => void) | null = null;
  let hasContext = false;
  let parameters: Record<string, any> = {};

  try {
    const context = useApiDoc();
    updateParameter = context.updateParameter;
    hasContext = true;
    parameters = context.parameters;
  } catch (error) {
    // Context가 없는 경우 (MDX에서 사용될 때) 아무것도 하지 않음
    updateParameter = () => {};
    hasContext = false;
    parameters = {};
  }

  const [inputValue, setInputValue] = useState('');

  // 초기값을 Context에 등록
  React.useEffect(() => {
    if (isHashField) {
      // 해시 필드인 경우 빈 값으로 초기화하고 Context에 등록
      setInputValue('');
      if (updateParameter && hasContext) {
        updateParameter(name, '', type, required, section);
      }
      return;
    }
    
    const initialValue = defaultValue || example || '';
    setInputValue(initialValue);
    
    if (isEncrypted && initialValue) {
      // 초기값이 암호화된 값인지 확인
      try {
        const decrypted = hectoDecrypt(initialValue, encryptionKey);
        if (decrypted !== initialValue && decrypted.length > 0) {
          setPlainValue(decrypted);
          setEncryptedValue(initialValue);
        } else {
          // 평문인 경우 암호화
          const encrypted = hectoEncrypt(initialValue, encryptionKey);
          setPlainValue(initialValue);
          setEncryptedValue(encrypted);
        }
      } catch {
        setPlainValue(initialValue);
        setEncryptedValue(initialValue);
      }
    }

    if (initialValue && updateParameter && hasContext) {
      if (isEncrypted) {
        // 암호화 필드인 경우, 초기값을 암호화해서 Context에 전달
        const encrypted = hectoEncrypt(initialValue, encryptionKey);
        updateParameter(name, encrypted, type, required, section);
      } else {
        updateParameter(name, initialValue, type, required, section);
      }
    }
  }, [name, defaultValue, example, type, required, updateParameter, section, location.pathname, hasContext, isEncrypted, encryptionKey, isHashField]);

  // 해시 필드인 경우, 다른 파라미터 값이 변경될 때마다 자동으로 해시 재계산
  React.useEffect(() => {
    if (isHashField && hasContext) {
      // 페이지 로드 시 초기 해시 생성
      generateAutoHash();
    }
  }, [isHashField, hasContext, location.pathname]);

  // parameters 변경 감지하여 해시 재계산
  React.useEffect(() => {
    if (isHashField && hasContext) {
      generateAutoHash(); // 즉시 실행
    }
  }, [isHashField, hasContext, location.pathname, JSON.stringify(parameters)]); // parameters 변경 감지

  const handleInputChange = (value: string) => {
    setInputValue(value);
    
    if (isEncrypted) {
      // 암호화 필드: 입력값을 암호화해서 전달
      const encrypted = hectoEncrypt(value, encryptionKey);
      setEncryptedValue(encrypted);
      setPlainValue(value);
      if (hasContext) {
        updateParameter?.(name, encrypted, type, required, section);
      }
    } else {
      if (hasContext) {
        updateParameter?.(name, value, type, required, section);
      }
    }
    
    onChange?.(name, value);
  };



  // 해시 자동 생성 (pktHash 필드인 경우)
  const generateAutoHash = async () => {
    if (!isHashField || !hasContext) return;
    
    setIsGeneratingHash(true);
    try {
      // parameters에서 직접 값들을 가져와서 해시 생성
      // parameters 구조: { [name]: { name, value, type, required, section } }
      const mchtId = parameters?.mchtId?.value || '';
      const method = parameters?.method?.value || 'card';
      const mchtTrdNo = parameters?.mchtTrdNo?.value || '';
      const trdDt = parameters?.trdDt?.value || '';
      const trdTm = parameters?.trdTm?.value || '';
      
      // trdAmt는 해시 생성 시 평문을 사용해야 함 (암호화된 값이 아닌 원본 값)
      let trdAmt = parameters?.trdAmt?.value || '';
      
      // trdAmt가 암호화된 값인지 확인하고 평문으로 변환
      if (trdAmt && trdAmt.includes('=') && trdAmt.length > 10) {
        // 암호화된 값으로 보이면 복호화 시도
        try {
          const decrypted = hectoDecrypt(trdAmt, encryptionKey);
          if (decrypted && decrypted !== trdAmt) {
            trdAmt = decrypted;
          }
        } catch (error) {
          // 복호화 실패시 원본 값 사용
        }
      }
      
      // 디버깅: 실제 사용된 값들 확인
      console.log('해시 생성용 실제 값들:', { mchtId, method, mchtTrdNo, trdDt, trdTm, trdAmt, hashKey });
      const inputString = mchtId + method + mchtTrdNo + trdDt + trdTm + trdAmt + hashKey;
      console.log('해시 입력 문자열:', inputString);
      
      // 모든 필수 값이 있을 때만 해시 생성
      if (mchtId && mchtTrdNo && trdDt && trdTm && trdAmt) {
        const generatedHash = generatePGHash(mchtId, method, mchtTrdNo, trdDt, trdTm, trdAmt, hashKey);
        console.log('생성된 해시:', generatedHash);
        setInputValue(generatedHash);
        if (hasContext) {
          updateParameter?.(name, generatedHash, type, required, section);
        }
      }
    } catch (error) {
      console.error('해시 생성 오류:', error);
    } finally {
      setIsGeneratingHash(false);
    }
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
            {isHashField && (
              <span className="text-[8px] text-green-600 bg-green-50 px-0.5 py-0.5 rounded font-mono">
                SHA256
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
            {isHashField && (
              <span className="text-green-600 font-medium ml-1">※SHA-256 해시</span>
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
                  disabled={fixed || isHashField}
                  className={clsx(
                    'w-full text-xs border rounded px-2 py-1 font-mono resize-none pr-8',
                    fixed || isHashField
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200' 
                      : 'bg-white text-gray-900 border-gray-300 focus:border-hecto-500 focus:ring-1 focus:ring-hecto-500'
                  )}
                  rows={2}
                />
              ) : (
              <input
                type={inputType === 'password' ? 'password' : 'text'}
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={placeholder || example || ''}
                disabled={fixed || isHashField}
                className={clsx(
                  'w-full text-xs border rounded px-2 py-1 font-mono pr-8',
                  fixed || isHashField
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200' 
                    : 'bg-white text-gray-900 border-gray-300 focus:border-hecto-500 focus:ring-1 focus:ring-hecto-500'
                )}
              />
              )}
              
              {/* 암호화 관련 버튼들 */}
              {!fixed && (
                <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex gap-1">
                  {isHashField && (
                    <button
                      type="button"
                      onClick={generateAutoHash}
                      disabled={isGeneratingHash}
                      className="p-1 text-green-600 hover:text-green-700 transition-colors disabled:opacity-50"
                      title="해시 자동 생성"
                    >
                      <Hash size={12} />
                    </button>
                  )}
                </div>
              )}
            </div>
            
            {/* 암호화/해시 상태 표시 */}
            {(isEncrypted || isHashField) && (
              <div className="flex items-center gap-2 text-xs">
                {isHashField && (
                  <span className="px-1.5 py-0.5 rounded font-mono bg-green-100 text-green-700">
                    SHA-256
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
            <div className="text-purple-800">
              <strong>암호화된 값:</strong>
              <br />
              <code className="text-[10px] font-mono bg-purple-100 px-1 py-0.5 rounded break-all">
                {encryptedValue}
              </code>
            </div>
          </div>
        </div>
      )}
      
      {/* 해시 관련 안내 */}
      {isHashField && (
        <div className="mt-1.5 p-1.5 bg-green-50 border-l-2 border-green-300 rounded-r text-xs">
          <div className="flex items-start gap-1.5">
            <span className="text-green-600 mt-0.5">🔐</span>
            <div className="text-green-800">
              <strong>헥토파이낸셜 SHA-256 해시:</strong> 상점아이디 + 결제수단 + 상점주문번호 + 요청일자 + 요청시간 + 거래금액(평문) + 해시키
              <br />
              <span className="text-green-600">
                테스트키: {hashKey.substring(0, 10)}...
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HectoEncryptedParameterCard;
