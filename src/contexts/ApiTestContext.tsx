import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

interface ParameterValue {
  name: string;
  value: string;
  type: string;
  required: boolean;
  section?: 'params' | 'data';
}

interface ApiTestContextType {
  parameterValues: Record<string, ParameterValue>;
  updateParameter: (name: string, value: string, type: string, required: boolean, section?: 'params' | 'data') => void;
  getParameterValues: () => Record<string, string>;
  getParameterValuesBySection: () => { params: Record<string, string>; data: Record<string, string> };
  clearParameters: () => void;
  // 실시간 업데이트를 위한 콜백
  onParameterChange?: (values: { params: Record<string, string>; data: Record<string, string> }) => void;
  setOnParameterChange: (callback: (values: { params: Record<string, string>; data: Record<string, string> }) => void) => void;
}

const ApiTestContext = createContext<ApiTestContextType | undefined>(undefined);

interface ApiTestProviderProps {
  children: ReactNode;
}

export const ApiTestProvider: React.FC<ApiTestProviderProps> = ({ children }) => {
  const [parameterValues, setParameterValues] = useState<Record<string, ParameterValue>>({});
  const [onParameterChange, setOnParameterChange] = useState<((values: { params: Record<string, string>; data: Record<string, string> }) => void) | undefined>();

  const updateParameter = useCallback((name: string, value: string, type: string, required: boolean, section?: 'params' | 'data') => {
    setParameterValues(prev => ({
      ...prev,
      [name]: { name, value, type, required, section }
    }));
  }, []);

  // parameterValues가 변경될 때마다 콜백 호출
  useEffect(() => {
    if (onParameterChange) {
      const params: Record<string, string> = {};
      const data: Record<string, string> = {};
      
      Object.values(parameterValues).forEach(param => {
        if (param.value.trim()) {
          if (param.section === 'params') {
            params[param.name] = param.value;
          } else if (param.section === 'data') {
            data[param.name] = param.value;
          } else {
            // section이 지정되지 않은 경우 기본적으로 data에 포함
            data[param.name] = param.value;
          }
        }
      });
      
      onParameterChange({ params, data });
    }
  }, [parameterValues, onParameterChange]);

  const getParameterValues = useCallback(() => {
    const values: Record<string, string> = {};
    Object.values(parameterValues).forEach(param => {
      if (param.value.trim()) {
        values[param.name] = param.value;
      }
    });
    return values;
  }, [parameterValues]);

  const getParameterValuesBySection = useCallback(() => {
    const params: Record<string, string> = {};
    const data: Record<string, string> = {};
    
    Object.values(parameterValues).forEach(param => {
      if (param.value.trim()) {
        if (param.section === 'params') {
          params[param.name] = param.value;
        } else if (param.section === 'data') {
          data[param.name] = param.value;
        } else {
          // section이 지정되지 않은 경우 기본적으로 data에 포함
          data[param.name] = param.value;
        }
      }
    });
    
    return { params, data };
  }, [parameterValues]);

  const clearParameters = useCallback(() => {
    setParameterValues({});
  }, []);

  return (
    <ApiTestContext.Provider value={{
      parameterValues,
      updateParameter,
      getParameterValues,
      getParameterValuesBySection,
      clearParameters,
      onParameterChange,
      setOnParameterChange
    }}>
      {children}
    </ApiTestContext.Provider>
  );
};

export const useApiTest = () => {
  const context = useContext(ApiTestContext);
  if (context === undefined) {
    throw new Error('useApiTest must be used within an ApiTestProvider');
  }
  return context;
};
