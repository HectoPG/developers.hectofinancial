# 신용카드 빌키 발급

신용카드 빌키(자동결제 키) 발급 API입니다. 빌키를 발급받아 재사용 가능한 결제 수단으로 활용할 수 있습니다.

## 📡 API 정보

| 항목 | 값 |
|------|-----|
| **HTTP Method** | `POST` |
| **경로** | `/spay/APICardAuth.do` |
| **테스트 URL** | `https://tbgw.settlebank.co.kr/spay/APICardAuth.do` |
| **운영 URL** | `https://gw.settlebank.co.kr/spay/APICardAuth.do` |

## 📋 요청 파라미터











## 💻 요청 예시

```json
{
  "mchtId": "nxca_jt_bi",
  "mchtTrdNo": "AUTH20231215143022",
  "trdDt": "20231215",
  "trdTm": "143022",
  "pktHash": "f395b6725a9a18f2563ce34f8bc76698051d27c05e5ba815f463f00429061c0c"
}
```

## 📤 응답 예시

### 성공 응답

```json
{
  "resultCode": "0000",
  "resultMsg": "정상적으로 처리되었습니다.",
  "billKey": "SBILL_0123456789"
}
```

### 실패 응답

```json
{
  "resultCode": "1001",
  "resultMsg": "상점아이디가 올바르지 않습니다.",
  "billKey": null
}
```

## 🔧 구현 예시

### JavaScript

```javascript
// 신용카드 빌키 발급 API 호출
async function callCardAuthAPI(params) {
  const response = await fetch('https://tbgw.settlebank.co.kr/spay/APICardAuth.do', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params)
  });
  
  return await response.json();
}

// 사용 예시
const authParams = {
  mchtId: "nxca_jt_bi",
  mchtTrdNo: "AUTH" + Date.now(),
  trdDt: new Date().toISOString().slice(0, 10).replace(/-/g, ''),
  trdTm: new Date().toTimeString().slice(0, 8).replace(/:/g, ''),
  pktHash: "생성된해시값"
};

const result = await callCardAuthAPI(authParams);
if (result.resultCode === "0000") {
  console.log('빌키 발급 성공:', result.billKey);
  // 빌키를 안전하게 저장하여 재사용
} else {
  console.error('빌키 발급 실패:', result.resultMsg);
}
```

### Python

```python
import requests
import json
from datetime import datetime

# 신용카드 빌키 발급 API 호출
def call_card_auth_api(params):
    url = 'https://tbgw.settlebank.co.kr/spay/APICardAuth.do'
    response = requests.post(url, json=params)
    return response.json()

# 사용 예시
current_time = datetime.now()
auth_params = {
    "mchtId": "nxca_jt_bi",
    "mchtTrdNo": f"AUTH{int(current_time.timestamp())}",
    "trdDt": current_time.strftime("%Y%m%d"),
    "trdTm": current_time.strftime("%H%M%S"),
    "pktHash": "생성된해시값"
}

result = call_card_auth_api(auth_params)
if result["resultCode"] == "0000":
    print('빌키 발급 성공:', result["billKey"])
    # 빌키를 안전하게 저장하여 재사용
else:
    print('빌키 발급 실패:', result["resultMsg"])
```

## ⚠️ 주의사항

- 빌키 발급 시에는 실제 결제가 발생하지 않습니다.
- 발급된 빌키는 안전하게 저장하여 재사용해야 합니다.
- 빌키는 상점별로 고유하며, 다른 상점에서는 사용할 수 없습니다.
- 빌키의 유효기간은 카드사 정책에 따라 다를 수 있습니다.
- 빌키를 사용한 결제 시에는 별도의 결제 API를 호출해야 합니다.

