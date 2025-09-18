# 거래 상태 조회

실시간 거래 상태 조회 API입니다. 특정 거래의 현재 상태와 상세 정보를 조회할 수 있습니다.

## API 정보

- **Method**: `POST`
- **Path**: `/spay/APITrdStatInq.do`
- **Content-Type**: `application/json`

## 요청 파라미터

















## 💻 요청 예시

### 신용카드 거래 조회

```json
{
  "mchtId": "nxca_jt_bi",
  "mchtTrdNo": "ORDER20231215143022",
  "trdDt": "20231215",
  "trdTm": "143022",
  "method": "CA",
  "trdAmt": "1000",
  "pktHash": "f395b6725a9a18f2563ce34f8bc76698051d27c05e5ba815f463f00429061c0c"
}
```

### 가상계좌 거래 조회

```json
{
  "mchtId": "nxca_jt_bi",
  "mchtTrdNo": "VBANK20231215143022",
  "trdDt": "20231215",
  "trdTm": "143022",
  "method": "VB",
  "trdAmt": "10000",
  "pktHash": "f395b6725a9a18f2563ce34f8bc76698051d27c05e5ba815f463f00429061c0c"
}
```

## 📤 응답 파라미터

### 성공 응답

















### 거래 없음 응답

















## 📊 거래 상태 코드

| 코드 | 상태 | 설명 |
|------|------|------|
| `0021` | 성공 | 정상적으로 처리된 거래 |
| `0031` | 실패 | 거래 실패 |
| `0041` | 대기 | 처리 대기 중 |
| `0051` | 진행중 | 처리 진행 중 |

## 🔧 구현 예시

### JavaScript

```javascript
// 거래 상태 조회 API 호출
async function callTransactionInquiryAPI(params) {
  const response = await fetch('https://tbgw.settlebank.co.kr/spay/APITrdStatInq.do', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params)
  });
  
  return await response.json();
}

// 사용 예시
const inquiryParams = {
  mchtId: "nxca_jt_bi",
  mchtTrdNo: "ORDER20231215143022",
  trdDt: "20231215",
  trdTm: "143022",
  method: "CA",
  trdAmt: "1000",
  pktHash: "생성된해시값"
};

const result = await callTransactionInquiryAPI(inquiryParams);
if (result.resultCode === "0000") {
  console.log('거래 조회 성공:');
  console.log('- 거래번호:', result.trdNo);
  console.log('- 거래상태:', result.trdStat);
  console.log('- 거래금액:', result.trdAmt);
  console.log('- 결제일시:', result.payDt, result.payTm);
  
  // 거래 상태에 따른 처리
  switch(result.trdStat) {
    case "0021":
      console.log('✅ 결제 완료');
      break;
    case "0031":
      console.log('❌ 결제 실패');
      break;
    case "0041":
    case "0051":
      console.log('⏳ 처리 중...');
      break;
  }
} else {
  console.error('거래 조회 실패:', result.resultMsg);
}

// 주기적 거래 상태 확인 함수
async function checkTransactionStatus(mchtTrdNo, maxAttempts = 10) {
  for (let i = 0; i  setTimeout(resolve, 5000));
  }
  
  console.log('⏰ 조회 시간 초과');
  return false;
}
```

### Python

```python
import requests
import json
import time

# 거래 상태 조회 API 호출
def call_transaction_inquiry_api(params):
    url = 'https://tbgw.settlebank.co.kr/spay/APITrdStatInq.do'
    response = requests.post(url, json=params)
    return response.json()

# 사용 예시
inquiry_params = {
    "mchtId": "nxca_jt_bi",
    "mchtTrdNo": "ORDER20231215143022",
    "trdDt": "20231215",
    "trdTm": "143022",
    "method": "CA",
    "trdAmt": "1000",
    "pktHash": "생성된해시값"
}

result = call_transaction_inquiry_api(inquiry_params)
if result["resultCode"] == "0000":
    print('거래 조회 성공:')
    print(f'- 거래번호: {result["trdNo"]}')
    print(f'- 거래상태: {result["trdStat"]}')
    print(f'- 거래금액: {result["trdAmt"]}')
    print(f'- 결제일시: {result["payDt"]} {result["payTm"]}')
    
    # 거래 상태에 따른 처리
    trd_stat = result["trdStat"]
    if trd_stat == "0021":
        print('✅ 결제 완료')
    elif trd_stat == "0031":
        print('❌ 결제 실패')
    elif trd_stat in ["0041", "0051"]:
        print('⏳ 처리 중...')
else:
    print('거래 조회 실패:', result["resultMsg"])

# 주기적 거래 상태 확인 함수
def check_transaction_status(mcht_trd_no, max_attempts=10):
    for i in range(max_attempts):
        result = call_transaction_inquiry_api({
            **inquiry_params,
            "mchtTrdNo": mcht_trd_no
        })
        
        if result["resultCode"] == "0000":
            trd_stat = result["trdStat"]
            if trd_stat == "0021":
                print('✅ 결제 완료 확인됨')
                return True
            elif trd_stat == "0031":
                print('❌ 결제 실패')
                return False
        
        # 5초 대기 후 재시도
        time.sleep(5)
    
    print('⏰ 조회 시간 초과')
    return False
```

## ⚠️ 주의사항

- 거래 상태 조회는 실시간으로 처리되며, 조회 시점의 상태를 반환합니다.
- 거래가 존재하지 않거나 잘못된 정보로 조회 시 오류가 발생할 수 있습니다.
- 조회 가능한 거래 기간에는 제한이 있을 수 있습니다.
- 대량 조회 시에는 API 호출 제한에 주의해야 합니다.
- 거래 상태가 변경되는 동안 조회 시 일시적으로 다른 상태가 반환될 수 있습니다.

