# API 문서 작성 가이드

## 📋 API 목록 (Swagger YAML 기준)

### 결제 API
1. **신용카드 결제 (Non-UI)** - `POST /spay/APICardActionPay.do`
2. **신용카드 빌키 발급** - `POST /spay/APICardAuth.do`

### 취소 API  
3. **결제 취소** - `POST /spay/APICancel.do`

### 가상계좌 API
4. **가상계좌 채번** - `POST /spay/APIVBank.do`

### 거래 관리 API
5. **거래 상태 조회** - `POST /spay/APITrdStatInq.do`

## 📁 파일 구조

```
public/api-docs/
├── card-payment.md          # 신용카드 결제
├── card-auth.md             # 신용카드 빌키 발급  
├── payment-cancel.md        # 결제 취소
├── virtual-account.md       # 가상계좌 채번
└── transaction-inquiry.md   # 거래 상태 조회
```

## 📝 마크다운 템플릿

각 API 문서는 다음 구조로 작성하세요:

```markdown
# API 제목

API에 대한 간단한 설명입니다.

## 📡 API 정보

| 항목 | 값 |
|------|-----|
| **HTTP Method** | `POST` |
| **경로** | `/spay/API명.do` |
| **테스트 URL** | `https://tbgw.settlebank.co.kr/spay/API명.do` |
| **운영 URL** | `https://gw.settlebank.co.kr/spay/API명.do` |

## 📋 요청 파라미터

| 파라미터 | 타입 | 필수 | 설명 | 예시 |
|----------|------|------|------|------|
| `mchtId` | `string` | ✅ | 상점아이디 | `nxca_jt_bi` |
| `mchtTrdNo` | `string` | ✅ | 상점주문번호 | `ORDER20231215143022` |

## 💻 요청 예시

```json
{
  "params": {
    "mchtId": "nxca_jt_bi",
    "mchtTrdNo": "ORDER20231215143022"
  },
  "data": {
    "pktHash": "해시값",
    "trdAmt": "1000"
  }
}
```

## 📤 응답 예시

```json
{
  "params": {
    "outStatCd": "0021",
    "outRsltMsg": "정상적으로 처리되었습니다."
  },
  "data": {
    "trdAmt": "1000",
    "apprNo": "30001234"
  }
}
```

## 🔧 구현 예시

### JavaScript
```javascript
// API 호출 예시
async function callAPI(params) {
  const response = await fetch('https://tbgw.settlebank.co.kr/spay/API명.do', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params)
  });
  
  return await response.json();
}
```

### Python
```python
import requests

def call_api(params):
    url = 'https://tbgw.settlebank.co.kr/spay/API명.do'
    response = requests.post(url, json=params)
    return response.json()
```

## ⚠️ 주의사항

- 모든 요청은 HTTPS를 통해 전송되어야 합니다.
- 요청 본문은 JSON 형식으로 전송해야 합니다.
- 해시값 생성이 필요한 경우 정확한 순서로 생성해야 합니다.
```

## 🚀 다음 단계

1. `public/api-docs/` 디렉토리 생성
2. 각 API별로 위 템플릿을 사용해서 마크다운 파일 작성
3. `llms.txt`에 API 문서 경로 추가
4. 필요시 `package.json`에서 API 문서 생성 스크립트 제거
