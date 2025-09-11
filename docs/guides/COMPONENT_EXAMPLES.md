# 컴포넌트 사용 예시 모음

이 문서는 헥토파이낸셜 개발자 사이트에서 사용할 수 있는 모든 MDX 컴포넌트의 실제 사용 예시를 제공합니다.

## 1. ParameterCard - API 파라미터 문서화

### 기본 사용법
```mdx
<ParameterCard
  name="merchantId"
  type="string"
  required={true}
  description="가맹점 식별 ID입니다."
  example="HECTO_MERCHANT_001"
/>
```

### 허용값이 있는 경우
```mdx
<ParameterCard
  name="paymentMethod"
  type="string"
  required={true}
  description="결제 수단을 지정합니다."
  values={["CARD", "BANK", "VIRTUAL_ACCOUNT", "MOBILE"]}
  note="대소문자를 구분합니다."
/>
```

### 복잡한 객체 타입
```mdx
<ParameterCard
  name="customer"
  type="object"
  required={false}
  description="고객 정보 객체입니다."
  example='{"name": "홍길동", "email": "test@example.com"}'
  note="이메일은 결제 완료 알림 발송에 사용됩니다."
/>
```

## 2. FeatureGrid - 기능 소개

### 2x2 그리드 (모바일에서는 1열)
```mdx
<FeatureGrid 
  features={[
    {
      icon: "💳",
      title: "신용카드 결제",
      description: "국내외 모든 주요 신용카드 브랜드 지원",
      bgColor: "#fff7f0",
      borderColor: "#ffd9c1",
      iconBgColor: "#ffb089"
    },
    {
      icon: "🏦",
      title: "실시간 계좌이체",
      description: "국내 모든 은행 실시간 이체 지원",
      bgColor: "#fff7f0", 
      borderColor: "#ffd9c1",
      iconBgColor: "#ffb089"
    },
    {
      icon: "📱",
      title: "모바일 최적화",
      description: "모바일 환경에 최적화된 결제 UI",
      bgColor: "#fff7f0",
      borderColor: "#ffd9c1", 
      iconBgColor: "#ffb089"
    },
    {
      icon: "🔒",
      title: "강력한 보안",
      description: "PCI-DSS 인증 기반 안전한 결제",
      bgColor: "#fff7f0",
      borderColor: "#ffd9c1",
      iconBgColor: "#ffb089"
    }
  ]}
/>
```

### 서비스별 특징 소개
```mdx
<FeatureGrid 
  features={[
    {
      icon: "⚡",
      title: "빠른 처리속도",
      description: "평균 0.5초 이내 결제 승인 처리",
      bgColor: "#fff7f0",
      borderColor: "#ffd9c1",
      iconBgColor: "#ffb089"
    },
    {
      icon: "📊",
      title: "실시간 대시보드",
      description: "결제 현황을 실시간으로 모니터링",
      bgColor: "#fff7f0",
      borderColor: "#ffd9c1", 
      iconBgColor: "#ffb089"
    }
  ]}
/>
```

## 3. TestScenario - 테스트 시나리오

### 일반적인 성공/실패 케이스
```mdx
<TestScenario
  successItems={[
    "유효한 카드 정보로 결제 요청",
    "정상적인 승인 응답 수신 (응답코드: 0000)",
    "결제 완료 후 Webhook 정상 수신",
    "고객에게 결제 완료 알림 발송"
  ]}
  failureItems={[
    "잘못된 카드 번호 입력 (응답코드: 1001)", 
    "한도 초과로 인한 승인 거절 (응답코드: 1002)",
    "유효기간 만료 카드 사용 (응답코드: 1003)",
    "네트워크 타임아웃으로 인한 통신 실패"
  ]}
/>
```

### API 연동 테스트 시나리오
```mdx
<TestScenario
  successItems={[
    "정상적인 API 키로 인증 성공",
    "필수 파라미터 모두 포함하여 요청",
    "JSON 형식으로 올바른 응답 수신",
    "응답 데이터 파싱 및 처리 완료"
  ]}
  failureItems={[
    "잘못된 API 키로 인증 실패 (401 Unauthorized)",
    "필수 파라미터 누락으로 요청 실패 (400 Bad Request)", 
    "서버 오류로 인한 요청 실패 (500 Internal Server Error)",
    "요청 타임아웃으로 인한 연결 실패"
  ]}
/>
```

## 4. ErrorGuide - 문제 해결 가이드

### 단순한 텍스트 가이드
```mdx
<ErrorGuide
  title="결제 실패 시 확인사항"
  content={
    <p>
      결제가 실패했을 때는 먼저 카드 정보가 올바른지 확인하고, 
      카드사 한도를 확인한 후 다시 시도해보세요.
    </p>
  }
/>
```

### 목록 형태의 가이드
```mdx
<ErrorGuide
  title="API 연동 시 주의사항"
  content={
    <div>
      <p><strong>다음 사항들을 반드시 확인하세요:</strong></p>
      <ul className="mt-2 space-y-1">
        <li>• API 키가 올바르게 설정되었는지 확인</li>
        <li>• 요청 헤더에 Content-Type: application/json 포함</li>
        <li>• 필수 파라미터가 모두 포함되었는지 확인</li>
        <li>• 개발/운영 환경 URL을 올바르게 사용</li>
      </ul>
    </div>
  }
/>
```

### 코드 예시가 포함된 가이드
```mdx
<ErrorGuide
  title="CORS 오류 해결 방법"
  content={
    <div>
      <p>클라이언트에서 직접 API를 호출할 때 CORS 오류가 발생할 수 있습니다.</p>
      <p className="mt-2"><strong>해결 방법:</strong></p>
      <ol className="mt-2 space-y-1">
        <li>1. 서버 사이드에서 API 호출</li>
        <li>2. 프록시 서버 사용</li>
        <li>3. 헥토파이낸셜에 도메인 등록 요청</li>
      </ol>
    </div>
  }
/>
```

## 5. NextSteps - 다음 단계 안내

### 자동 결제수단 제외 (추천)
```mdx
<NextSteps
  title="다른 결제수단도 확인해보세요"
  excludeTitle="신용카드"
/>
```

### 커스텀 단계 정의
```mdx
<NextSteps
  title="API 연동을 완료하셨나요?"
  steps={[
    {
      href: "/docs/pg/testing",
      icon: "🧪",
      title: "테스트",
      bgColor: "#fff7f0",
      borderColor: "#ffd9c1",
      hoverBorderColor: "#ffb089",
      iconBgColor: "#ffb089", 
      hoverIconBgColor: "#ff9566"
    },
    {
      href: "/docs/pg/go-live",
      icon: "🚀",
      title: "운영배포",
      bgColor: "#fff7f0",
      borderColor: "#ffd9c1",
      hoverBorderColor: "#ffb089", 
      iconBgColor: "#ffb089",
      hoverIconBgColor: "#ff9566"
    },
    {
      href: "/docs/pg/monitoring",
      icon: "📊", 
      title: "모니터링",
      bgColor: "#fff7f0",
      borderColor: "#ffd9c1",
      hoverBorderColor: "#ffb089",
      iconBgColor: "#ffb089",
      hoverIconBgColor: "#ff9566"
    },
    {
      href: "/docs/pg/support",
      icon: "💬",
      title: "지원",
      bgColor: "#fff7f0", 
      borderColor: "#ffd9c1",
      hoverBorderColor: "#ffb089",
      iconBgColor: "#ffb089",
      hoverIconBgColor: "#ff9566"
    }
  ]}
/>
```

## 6. DocumentFooter - 문서 하단 액션

### 기본 사용법 (주요 버튼만)
```mdx
<DocumentFooter
  title="신용카드 결제 연동을 시작해보세요!"
  primaryButton={{
    text: "개발 가이드 보기",
    href: "/docs/pg/credit-card"
  }}
/>
```

### 설명과 보조 버튼 포함
```mdx
<DocumentFooter
  title="이제 모든 준비가 완료되었습니다!"
  description="더 자세한 정보가 필요하시면 API 문서를 확인하거나 고객지원팀에 문의하세요."
  primaryButton={{
    text: "API 문서 보기", 
    href: "/api-docs"
  }}
  secondaryButton={{
    text: "고객지원 문의",
    href: "/support"
  }}
/>
```

### 다른 서비스 연동 유도
```mdx
<DocumentFooter
  title="PG 연동이 완료되었나요?"
  description="헥토파이낸셜의 다른 서비스도 함께 사용해보세요."
  primaryButton={{
    text: "간편현금결제 연동하기",
    href: "/docs/ezcp"
  }}
  secondaryButton={{
    text: "화이트라벨 서비스 보기", 
    href: "/docs/whitelabel"
  }}
/>
```

## 7. 복합 사용 예시

### 완전한 API 문서 페이지
```mdx
---
title: "결제 요청 API"
description: "결제 요청을 위한 API 사용법을 알아보세요."
category: "pg"
---

# 결제 요청 API

결제 요청 API를 사용하여 다양한 결제수단으로 결제를 처리할 수 있습니다.

## 지원하는 결제수단

<FeatureGrid 
  features={[
    {
      icon: "💳",
      title: "신용카드",
      description: "국내외 모든 주요 카드사 지원",
      bgColor: "#fff7f0",
      borderColor: "#ffd9c1",
      iconBgColor: "#ffb089"
    },
    {
      icon: "🏦", 
      title: "계좌이체",
      description: "실시간 계좌이체 및 가상계좌",
      bgColor: "#fff7f0",
      borderColor: "#ffd9c1",
      iconBgColor: "#ffb089"
    }
  ]}
/>

## API 요청

### 엔드포인트
```
POST https://api.hectofinancial.com/v1/payment/request
```

### 요청 파라미터

<ParameterCard
  name="merchantId"
  type="string"
  required={true}
  description="가맹점 식별 ID"
  example="HECTO_MERCHANT_001"
/>

<ParameterCard
  name="amount"
  type="number"
  required={true}
  description="결제 금액 (원 단위)"
  example="10000"
  note="1원 이상의 양수만 입력 가능합니다."
/>

<ParameterCard
  name="paymentMethod"
  type="string"
  required={true}
  description="결제 수단"
  values={["CARD", "BANK", "VIRTUAL_ACCOUNT"]}
/>

### 요청 예시

```javascript filename="payment-request.js"
const paymentData = {
  merchantId: "HECTO_MERCHANT_001",
  amount: 10000,
  paymentMethod: "CARD",
  orderId: "ORDER_" + Date.now(),
  customerInfo: {
    name: "홍길동",
    email: "customer@example.com"
  }
};

const response = await fetch('https://api.hectofinancial.com/v1/payment/request', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + apiKey
  },
  body: JSON.stringify(paymentData)
});

const result = await response.json();
console.log(result);
```

## 테스트 시나리오

<TestScenario
  successItems={[
    "유효한 API 키로 인증 성공",
    "필수 파라미터 모두 포함하여 요청",
    "결제 승인 응답 수신 (responseCode: 0000)",
    "결제 완료 후 Webhook 수신"
  ]}
  failureItems={[
    "잘못된 API 키로 401 오류 발생",
    "필수 파라미터 누락으로 400 오류 발생", 
    "결제 승인 거절 (responseCode: 1001)",
    "네트워크 오류로 연결 실패"
  ]}
/>

## 문제 해결

<ErrorGuide
  title="자주 발생하는 오류와 해결방법"
  content={
    <div>
      <p><strong>401 Unauthorized:</strong> API 키를 확인하세요.</p>
      <p><strong>400 Bad Request:</strong> 필수 파라미터가 누락되었는지 확인하세요.</p>
      <p><strong>결제 실패:</strong> 카드 정보와 한도를 확인하세요.</p>
    </div>
  }
/>

## 다음 단계

<NextSteps
  title="다른 결제수단도 연동해보세요"
  excludeTitle="신용카드"
/>

<DocumentFooter
  title="결제 연동을 시작해보세요!"
  description="더 자세한 정보가 필요하시면 전체 API 문서를 확인하세요."
  primaryButton={{
    text: "전체 API 문서 보기",
    href: "/api-docs"
  }}
  secondaryButton={{
    text: "샘플 코드 다운로드",
    href: "/samples"
  }}
/>
```

---

이 예시들을 참고하여 다양한 상황에 맞는 문서를 작성할 수 있습니다. 각 컴포넌트는 조합하여 사용할 수 있으며, 브랜드 일관성을 위해 제공된 색상 값들을 사용하는 것을 권장합니다.

## 💡 추가 팁

1. **색상 일관성**: 모든 컴포넌트에서 헥토 브랜드 컬러(`#ffb089`, `#fff7f0`, `#ffd9c1`)를 사용하세요.

2. **접근성**: `title`과 `description`은 명확하고 이해하기 쉽게 작성하세요.

3. **반응형**: 모든 컴포넌트는 모바일에서도 잘 작동하도록 설계되어 있습니다.

4. **성능**: 큰 이미지나 복잡한 내용은 적절히 분할하여 로딩 성능을 고려하세요.

5. **SEO**: frontmatter의 `title`과 `description`은 SEO에 중요하므로 신중하게 작성하세요.
