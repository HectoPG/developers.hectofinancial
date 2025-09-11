# 헥토파이낸셜 개발자 문서 작성 가이드

이 가이드는 헥토파이낸셜 개발자 사이트의 서비스 문서와 블로그 문서를 작성하는 방법을 안내합니다.

## 📁 문서 구조

### 서비스 문서 (`/src/docs/`)
```
src/docs/
├── pg/                    # PG 결제 서비스
│   ├── 01-getting-started.mdx
│   ├── 02-credit-card.mdx
│   └── ...
├── ezauth/               # 간편현금결제 서비스
├── ezcp/                 # 간편현금결제 서비스
├── whitelabel/           # 화이트라벨 서비스
└── blog/                 # 블로그 문서
    ├── 01-sample-article-1.mdx
    └── ...
```

### 블로그 문서 (`/src/docs/blog/`)
- 기술 블로그, 업데이트 소식, 가이드 문서 등

## 📝 MDX 문서 작성법

### 1. Frontmatter (필수)

모든 MDX 문서는 상단에 frontmatter를 포함해야 합니다:

#### 서비스 문서
```yaml
---
title: "문서 제목"
description: "문서 설명"
category: "pg" # pg, ezauth, ezcp, whitelabel
---
```

#### 블로그 문서
```yaml
---
title: "블로그 포스트 제목"
description: "블로그 포스트 설명"
date: "2024-12-05"
readTime: "5분"
category: "가이드" # 가이드, 업데이트, 기술
featured: true # 메인 페이지 노출 여부
tags: ["PG", "시작하기", "가이드"]
icon: "BookOpen" # Lucide 아이콘 이름
thumbnail: "/images/blog/thumbnail.jpg"
---
```

### 2. 기본 마크다운 문법

```markdown
# 제목 1 (H1)
## 제목 2 (H2)  
### 제목 3 (H3)

**굵은 텍스트**
*기울임 텍스트*

- 목록 아이템 1
- 목록 아이템 2

1. 순서 목록 1
2. 순서 목록 2

[링크 텍스트](https://example.com)

> 인용구 텍스트

`인라인 코드`
```

### 3. 코드 블록 작성

#### 기본 코드 블록
```javascript
const example = "기본 코드 블록";
console.log(example);
```

#### 파일명이 있는 코드 블록
```javascript filename="payment.js"
// 파일명이 표시되는 코드 블록
const paymentData = {
  amount: 10000,
  orderId: 'ORDER_123'
};
```

#### 지원하는 언어
- `javascript`, `typescript`, `html`, `css`, `json`
- `python`, `java`, `bash`, `shell`
- `sql`, `yaml`, `dockerfile` 등

## 🧩 사용 가능한 컴포넌트

### 1. ParameterCard - API 파라미터 설명

API 파라미터를 깔끔하게 문서화할 때 사용합니다.

```mdx
<ParameterCard
  name="amount"
  type="number"
  required={true}
  description="결제 금액 (원 단위)"
  example="10000"
  note="1원 이상의 양수만 입력 가능합니다."
  values={["1000", "5000", "10000"]}
/>
```

**Props:**
- `name`: 파라미터 이름 (필수)
- `type`: 데이터 타입 (필수)
- `required`: 필수 여부 (필수)
- `description`: 파라미터 설명 (필수)
- `example`: 사용 예시 (선택)
- `note`: 추가 참고사항 (선택)
- `values`: 허용 가능한 값들 배열 (선택)

### 2. FeatureGrid - 기능 소개 그리드

서비스의 주요 기능들을 격자 형태로 소개할 때 사용합니다.

```mdx
<FeatureGrid 
  features={[
    {
      icon: "💳",
      title: "다양한 결제수단",
      description: "신용카드, 계좌이체, 가상계좌 등 모든 주요 결제수단 지원",
      bgColor: "#fff7f0",
      borderColor: "#ffd9c1", 
      iconBgColor: "#ffb089"
    },
    {
      icon: "🔒",
      title: "강력한 보안",
      description: "PCI-DSS 인증을 통한 안전한 결제 환경 제공",
      bgColor: "#fff7f0",
      borderColor: "#ffd9c1",
      iconBgColor: "#ffb089"
    }
  ]}
/>
```

**Props:**
- `features`: Feature 객체 배열 (필수)
  - `icon`: 이모지 아이콘
  - `title`: 기능 제목
  - `description`: 기능 설명
  - `bgColor`, `borderColor`, `iconBgColor`: 색상 설정

### 3. TestScenario - 테스트 시나리오

성공/실패 시나리오를 나란히 보여줄 때 사용합니다.

```mdx
<TestScenario
  successItems={[
    "유효한 카드 정보로 결제 요청",
    "정상적인 승인 응답 수신",
    "결제 완료 페이지로 리다이렉트"
  ]}
  failureItems={[
    "잘못된 카드 번호 입력",
    "한도 초과로 인한 승인 거절",
    "네트워크 오류로 인한 통신 실패"
  ]}
/>
```

**Props:**
- `successItems`: 성공 시나리오 문자열 배열 (필수)
- `failureItems`: 실패 시나리오 문자열 배열 (필수)

### 4. ErrorGuide - 오류 해결 가이드

중요한 팁이나 오류 해결 방법을 강조할 때 사용합니다.

```mdx
<ErrorGuide
  title="결제 실패 시 확인사항"
  content={
    <div>
      <p>결제가 실패했을 때는 다음 사항들을 확인해보세요:</p>
      <ul>
        <li>카드 유효성 검증</li>
        <li>결제 한도 확인</li>
        <li>네트워크 연결 상태</li>
      </ul>
    </div>
  }
/>
```

**Props:**
- `title`: 가이드 제목 (필수)
- `content`: 가이드 내용 (React.ReactNode) (필수)

### 5. NextSteps - 다음 단계 안내

사용자가 다음에 할 일을 안내할 때 사용합니다.

```mdx
<NextSteps
  title="다음 단계로 진행해보세요"
  excludeTitle="신용카드"
/>
```

**Props:**
- `title`: 섹션 제목 (필수)
- `steps`: 커스텀 단계 배열 (선택)
- `excludeTitle`: 제외할 결제수단 (자동으로 다른 결제수단들 표시) (선택)

### 6. DocumentFooter - 문서 하단 액션

문서 하단에 주요 액션 버튼들을 배치할 때 사용합니다.

```mdx
<DocumentFooter
  title="이제 신용카드 결제를 시작해보세요!"
  description="더 자세한 정보가 필요하시면 개발 가이드를 확인하세요."
  primaryButton={{
    text: "개발 시작하기",
    href: "/docs/pg/getting-started"
  }}
  secondaryButton={{
    text: "API 문서 보기", 
    href: "/api-docs"
  }}
/>
```

**Props:**
- `title`: 메인 메시지 (필수)
- `description`: 부가 설명 (선택)
- `primaryButton`: 주요 버튼 (필수)
  - `text`: 버튼 텍스트
  - `href`: 링크 URL
- `secondaryButton`: 보조 버튼 (선택)

## 📋 문서 작성 베스트 프랙티스

### 1. 구조화된 내용 작성
- 명확한 제목 계층 구조 사용 (H1 → H2 → H3)
- 각 섹션은 하나의 주제에 집중
- 목차가 자동 생성되므로 의미있는 제목 작성

### 2. 코드 예제 작성
- 실제 동작하는 코드 예제 제공
- 주석으로 설명 추가
- 파일명을 명시하여 맥락 제공

### 3. 시각적 요소 활용
- 이미지는 `/public/images/` 경로에 저장
- 컴포넌트를 활용하여 정보를 구조화
- 색상은 헥토 브랜드 컬러 활용 (#ffb089)

### 4. 사용자 친화적 작성
- 단계별 설명 제공
- 예상되는 오류 상황 안내
- 다음 단계 명확히 제시

## 🎨 스타일 가이드

### 색상 팔레트
- **Primary Orange**: `#ffb089` (메인 브랜드 컬러)
- **Light Orange**: `#fff7f0` (배경색)
- **Border Orange**: `#ffd9c1` (테두리색)
- **Success Green**: `#10b981` (성공 상태)
- **Error Red**: `#ef4444` (오류 상태)
- **Warning Amber**: `#f59e0b` (경고 상태)

### 폰트
- **한글**: Noto Sans KR
- **영문**: Proxima Nova (또는 시스템 폰트)
- **코드**: ui-monospace, 'SF Mono', Monaco

## 📖 예제 템플릿

### 서비스 문서 템플릿

```mdx
---
title: "서비스명 연동 가이드"
description: "서비스명을 연동하는 방법을 알아보세요."
category: "pg"
---

# 서비스명 연동 가이드

서비스에 대한 간단한 소개와 개요를 작성합니다.

## 주요 기능

<FeatureGrid 
  features={[
    {
      icon: "💳",
      title: "기능 1",
      description: "기능 1에 대한 설명",
      bgColor: "#fff7f0",
      borderColor: "#ffd9c1",
      iconBgColor: "#ffb089"
    }
  ]}
/>

## API 연동 방법

### 1. 결제 요청

```javascript filename="payment.js"
// 결제 요청 코드 예제
const paymentData = {
  amount: 10000,
  orderId: 'ORDER_123'
};
```

### 2. 파라미터 설명

<ParameterCard
  name="amount"
  type="number"
  required={true}
  description="결제 금액"
  example="10000"
/>

## 테스트 시나리오

<TestScenario
  successItems={["성공 케이스 1", "성공 케이스 2"]}
  failureItems={["실패 케이스 1", "실패 케이스 2"]}
/>

## 문제 해결

<ErrorGuide
  title="자주 발생하는 오류"
  content={<p>오류 해결 방법을 설명합니다.</p>}
/>

## 다음 단계

<NextSteps
  title="다른 결제수단도 확인해보세요"
  excludeTitle="현재 결제수단"
/>

<DocumentFooter
  title="연동을 시작해보세요!"
  primaryButton={{
    text: "개발 시작하기",
    href: "/docs/pg/getting-started"
  }}
/>
```

### 블로그 문서 템플릿

```mdx
---
title: "블로그 포스트 제목"
description: "블로그 포스트에 대한 설명"
date: "2024-12-05"
readTime: "5분"
category: "가이드"
featured: true
tags: ["태그1", "태그2"]
icon: "BookOpen"
thumbnail: "/images/blog/thumbnail.jpg"
---

# 블로그 포스트 제목

![썸네일 이미지](/images/blog/thumbnail.jpg)

포스트의 도입부를 작성합니다.

## 주요 내용

내용을 섹션별로 나누어 작성합니다.

### 코드 예제

```javascript filename="example.js"
// 코드 예제
console.log("Hello, Hecto!");
```

## 마무리

포스트의 결론과 요약을 작성합니다.
```

---

이 가이드를 참고하여 일관되고 사용자 친화적인 문서를 작성해주세요! 궁금한 점이 있으면 개발팀에 문의하세요. 📚✨
