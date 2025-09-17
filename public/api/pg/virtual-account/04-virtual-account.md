# 가상계좌 채번

가상계좌 발급 및 채번취소 API입니다. 고객에게 고유한 가상계좌번호를 발급하여 입금을 받을 수 있습니다.

## 📡 API 정보

| 항목 | 값 |
|------|-----|
| **HTTP Method** | `POST` |
| **경로** | `/spay/APIVBank.do` |
| **테스트 URL** | `https://tbgw.settlebank.co.kr/spay/APIVBank.do` |
| **운영 URL** | `https://gw.settlebank.co.kr/spay/APIVBank.do` |

## 📋 요청 파라미터

















## 💻 요청 예시

### 기본 가상계좌 발급

```json
{
  "mchtId": "nxca_jt_bi",
  "mchtTrdNo": "VBANK20231215143022",
  "trdDt": "20231215",
  "trdTm": "143022",
  "trdAmt": "10000",
  "pktHash": "f395b6725a9a18f2563ce34f8bc76698051d27c05e5ba815f463f00429061c0c"
}
```

### 만료일과 은행 지정

```json
{
  "mchtId": "nxca_jt_bi",
  "mchtTrdNo": "VBANK20231215143022",
  "trdDt": "20231215",
  "trdTm": "143022",
  "trdAmt": "10000",
  "pktHash": "f395b6725a9a18f2563ce34f8bc76698051d27c05e5ba815f463f00429061c0c",
  "expDt": "20231222",
  "bankCd": "004"
}
```

## 📤 응답 파라미터

### 성공 응답











### 실패 응답











## 🔧 구현 예시

### JavaScript

```javascript
// 가상계좌 채번 API 호출
async function callVirtualAccountAPI(params) {
  const response = await fetch('https://tbgw.settlebank.co.kr/spay/APIVBank.do', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params)
  });
  
  return await response.json();
}

// 사용 예시
const vbankParams = {
  mchtId: "nxca_jt_bi",
  mchtTrdNo: "VBANK" + Date.now(),
  trdDt: new Date().toISOString().slice(0, 10).replace(/-/g, ''),
  trdTm: new Date().toTimeString().slice(0, 8).replace(/:/g, ''),
  trdAmt: "10000",
  pktHash: "생성된해시값",
  expDt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10).replace(/-/g, ''),
  bankCd: "004" // 국민은행
};

const result = await callVirtualAccountAPI(vbankParams);
if (result.resultCode === "0000") {
  console.log('가상계좌 발급 성공:');
  console.log('- 계좌번호:', result.vbankNo);
  console.log('- 은행명:', result.vbankNm);
  console.log('- 만료일:', result.expDt);
  
  // 고객에게 가상계좌 정보 안내
  alert(`입금계좌: ${result.vbankNm} ${result.vbankNo}\n만료일: ${result.expDt}`);
} else {
  console.error('가상계좌 발급 실패:', result.resultMsg);
}
```

### Python

```python
import requests
import json
from datetime import datetime, timedelta

# 가상계좌 채번 API 호출
def call_virtual_account_api(params):
    url = 'https://tbgw.settlebank.co.kr/spay/APIVBank.do'
    response = requests.post(url, json=params)
    return response.json()

# 사용 예시
current_time = datetime.now()
exp_date = (current_time + timedelta(days=7)).strftime("%Y%m%d")

vbank_params = {
    "mchtId": "nxca_jt_bi",
    "mchtTrdNo": f"VBANK{int(current_time.timestamp())}",
    "trdDt": current_time.strftime("%Y%m%d"),
    "trdTm": current_time.strftime("%H%M%S"),
    "trdAmt": "10000",
    "pktHash": "생성된해시값",
    "expDt": exp_date,
    "bankCd": "004"  # 국민은행
}

result = call_virtual_account_api(vbank_params)
if result["resultCode"] == "0000":
    print('가상계좌 발급 성공:')
    print(f'- 계좌번호: {result["vbankNo"]}')
    print(f'- 은행명: {result["vbankNm"]}')
    print(f'- 만료일: {result["expDt"]}')
    
    # 고객에게 가상계좌 정보 안내
    print(f"입금계좌: {result['vbankNm']} {result['vbankNo']}")
    print(f"만료일: {result['expDt']}")
else:
    print('가상계좌 발급 실패:', result["resultMsg"])
```

## ⚠️ 주의사항

- 가상계좌는 발급 후 만료일까지 유효합니다.
- 만료일 이후에는 입금이 불가능하며, 자동으로 폐기됩니다.
- 입금금액이 설정된 금액과 정확히 일치해야 자동 승인됩니다.
- 가상계좌 발급 후 입금까지는 시간이 소요될 수 있습니다.
- 입금 완료 시 별도의 노티피케이션을 받을 수 있습니다.
- 가상계좌번호는 고유하며, 중복 발급되지 않습니다.

