# 결제 취소

신용카드, 계좌이체, 휴대폰결제 등 모든 결제 수단의 취소를 처리하는 API입니다.

## 📡 API 정보

| 항목 | 값 |
|------|-----|
| **HTTP Method** | `POST` |
| **경로** | `/spay/APICancel.do` |
| **테스트 URL** | `https://tbgw.settlebank.co.kr/spay/APICancel.do` |
| **운영 URL** | `https://gw.settlebank.co.kr/spay/APICancel.do` |

## 📋 요청 파라미터













## 💻 요청 예시

### 전체 취소

```json
{
  "mchtId": "nxca_jt_bi",
  "orgTrdNo": "STFP_PGCAnxca_jt_il0211129135810M1494620",
  "orgMchtTrdNo": "ORDER20231215143022",
  "orgTrdDt": "20231215",
  "canAmt": "1000",
  "pktHash": "f395b6725a9a18f2563ce34f8bc76698051d27c05e5ba815f463f00429061c0c"
}
```

### 부분 취소

```json
{
  "mchtId": "nxca_jt_bi",
  "orgTrdNo": "STFP_PGCAnxca_jt_il0211129135810M1494620",
  "orgMchtTrdNo": "ORDER20231215143022",
  "orgTrdDt": "20231215",
  "canAmt": "500",
  "pktHash": "f395b6725a9a18f2563ce34f8bc76698051d27c05e5ba815f463f00429061c0c"
}
```

## 📤 응답 파라미터

### 성공 응답







### 실패 응답







## 🔧 구현 예시

### JavaScript

```javascript
// 결제 취소 API 호출
async function callPaymentCancelAPI(params) {
  const response = await fetch('https://tbgw.settlebank.co.kr/spay/APICancel.do', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params)
  });
  
  return await response.json();
}

// 사용 예시 - 전체 취소
const cancelParams = {
  mchtId: "nxca_jt_bi",
  orgTrdNo: "STFP_PGCAnxca_jt_il0211129135810M1494620",
  orgMchtTrdNo: "ORDER20231215143022",
  orgTrdDt: "20231215",
  canAmt: "1000", // 전체 금액 취소
  pktHash: "생성된해시값"
};

const result = await callPaymentCancelAPI(cancelParams);
if (result.resultCode === "0000") {
  console.log('취소 성공:', result.canTrdNo);
} else {
  console.error('취소 실패:', result.resultMsg);
}

// 부분 취소 예시
const partialCancelParams = {
  ...cancelParams,
  canAmt: "500" // 부분 취소 금액
};

const partialResult = await callPaymentCancelAPI(partialCancelParams);
```

### Python

```python
import requests
import json

# 결제 취소 API 호출
def call_payment_cancel_api(params):
    url = 'https://tbgw.settlebank.co.kr/spay/APICancel.do'
    response = requests.post(url, json=params)
    return response.json()

# 사용 예시 - 전체 취소
cancel_params = {
    "mchtId": "nxca_jt_bi",
    "orgTrdNo": "STFP_PGCAnxca_jt_il0211129135810M1494620",
    "orgMchtTrdNo": "ORDER20231215143022",
    "orgTrdDt": "20231215",
    "canAmt": "1000",  # 전체 금액 취소
    "pktHash": "생성된해시값"
}

result = call_payment_cancel_api(cancel_params)
if result["resultCode"] == "0000":
    print('취소 성공:', result["canTrdNo"])
else:
    print('취소 실패:', result["resultMsg"])

# 부분 취소 예시
partial_cancel_params = {
    **cancel_params,
    "canAmt": "500"  # 부분 취소 금액
}

partial_result = call_payment_cancel_api(partial_cancel_params)
```

## ⚠️ 주의사항

- 취소는 원거래 발생일로부터 제한된 기간 내에만 가능합니다.
- 부분취소가 가능한 결제수단과 불가능한 결제수단이 있습니다.
- 취소금액은 원거래금액을 초과할 수 없습니다.
- 이미 취소된 거래에 대한 중복 취소는 불가능합니다.
- 취소 처리 시간은 결제수단과 카드사에 따라 다를 수 있습니다.
- 취소 승인 후 실제 카드사 취소 처리는 시간이 더 소요될 수 있습니다.

