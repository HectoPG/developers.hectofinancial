
  title: "신용카드 결제 (Non-UI)",
  description: "신용카드 결제 및 빌키 결제 API",
  path: "/spay/APICardActionPay.do",
  method: "POST",
  testUrl: "https://tbgw.settlebank.co.kr/spay/APICardActionPay.do",
  prodUrl: "https://gw.settlebank.co.kr/spay/APICardActionPay.do"
};

# 신용카드 결제 (Non-UI)

신용카드 결제 및 빌키 결제 API입니다.

**결제 방식:**
- 구인증: 카드번호, 유효기간(yyMM), 식별번호, 카드비밀번호로 결제 요청
- 비인증: 카드번호, 유효기간(yyMM)으로 결제 요청
- 빌키(자동결제 키) 발급: 상점 아이디 설정에 따라 빌키를 응답 값으로 내려 드리고 있으며, 빌키를 따로 저장 하였다가 결제가 필요할 경우 빌키 결제로 요청 주시길 바랍니다.

**해시 생성 방법:**
- **요청 해시**: pktHash = SHA256(거래일자 + 거래시간 + 상점아이디 + 상점주문번호 + 거래금액(평문) + 해쉬키)
- **응답 해시**: pktHash = SHA256(거래상태코드 + 요청일자 + 요청시간 + 상점아이디 + 상점주문번호 + 거래금액 + 해쉬키)

## 📡 API 정보

| 항목 | 값 |
|------|-----|
| **HTTP Method** | `POST` |
| **경로** | `/spay/APICardActionPay.do` |
| **테스트 URL** | `https://tbgw.settlebank.co.kr/spay/APICardActionPay.do` |
| **운영 URL** | `https://gw.settlebank.co.kr/spay/APICardActionPay.do` |

## 📋 요청 파라미터

### params 객체





















### data 객체









































## 💻 요청 예시

### 비인증 신용카드 결제

```json
{
  "params": {
    "mchtId": "nxca_jt_bi",
    "ver": "0A19",
    "method": "CA",
    "bizType": "B0",
    "encCd": "23",
    "mchtTrdNo": "ORDER20231215143022",
    "trdDt": "20231215",
    "trdTm": "143022",
    "mobileYn": "N",
    "osType": "W"
  },
  "data": {
    "pktHash": "f395b6725a9a18f2563ce34f8bc76698051d27c05e5ba815f463f00429061c0c",
    "pmtprdNm": "테스트상품",
    "mchtCustNm": "홍길동",
    "mchtCustId": "HongGilDong",
    "email": "HongGilDong@example.com",
    "cardNo": "1111222233334444",
    "vldDtMon": "12",
    "vldDtYear": "24",
    "instmtMon": "00",
    "crcCd": "KRW",
    "taxTypeCd": "N",
    "trdAmt": "1000",
    "notiUrl": "https://example.com/notiUrl",
    "mchtParam": "name=HongGilDong&age=25"
  }
}
```

### 구인증 신용카드 결제

```json
{
  "params": {
    "mchtId": "nxca_ks_gu",
    "ver": "0A19",
    "method": "CA",
    "bizType": "B0",
    "encCd": "23",
    "mchtTrdNo": "ORDER20231215143022",
    "trdDt": "20231215",
    "trdTm": "143022",
    "mobileYn": "N",
    "osType": "W"
  },
  "data": {
    "pktHash": "f395b6725a9a18f2563ce34f8bc76698051d27c05e5ba815f463f00429061c0c",
    "pmtprdNm": "테스트상품",
    "mchtCustNm": "홍길동",
    "mchtCustId": "HongGilDong",
    "email": "HongGilDong@example.com",
    "cardNo": "1111222233334444",
    "vldDtMon": "12",
    "vldDtYear": "24",
    "idntNo": "991231",
    "cardPwd": "00",
    "instmtMon": "00",
    "crcCd": "KRW",
    "taxTypeCd": "N",
    "trdAmt": "1000",
    "notiUrl": "https://example.com/notiUrl",
    "mchtParam": "name=HongGilDong&age=25"
  }
}
```

## 📤 응답 예시

### 성공 응답

```json
{
  "params": {
    "mchtId": "nxca_jt_bi",
    "ver": "0A19",
    "method": "CA",
    "bizType": "B0",
    "encCd": "23",
    "mchtTrdNo": "ORDER20231215143022",
    "trdNo": "STFP_PGCAnxca_jt_il0211129135810M1494620",
    "trdDt": "20231215",
    "trdTm": "143022",
    "outStatCd": "0021",
    "outRsltCd": "0000",
    "outRsltMsg": "정상적으로 처리되었습니다."
  },
  "data": {
    "pktHash": "f395b6725a9a18f2563ce34f8bc76698051d27c05e5ba815f463f00429061c0c",
    "trdAmt": "1000",
    "billKey": "SBILL_0123456789",
    "cardNo": "111122xxxxxx4444",
    "vldDtMon": "12",
    "vldDtYear": "24",
    "issrId": "NHC",
    "cardNm": "NH 농협",
    "cardKind": "NH 체크카드",
    "ninstmtTypeCd": "N",
    "instmtMon": "00",
    "apprNo": "30001234"
  }
}
```

### 실패 응답

```json
{
  "params": {
    "mchtId": "nxca_jt_bi",
    "ver": "0A19",
    "method": "CA",
    "bizType": "B0",
    "encCd": "23",
    "mchtTrdNo": "ORDER20231215143022",
    "trdDt": "20231215",
    "trdTm": "143022",
    "outStatCd": "0031",
    "outRsltCd": "1001",
    "outRsltMsg": "카드번호가 올바르지 않습니다."
  },
  "data": {
    "pktHash": "f395b6725a9a18f2563ce34f8bc76698051d27c05e5ba815f463f00429061c0c"
  }
}
```

## 🔧 구현 예시

### JavaScript

```javascript
// 신용카드 결제 API 호출
async function callCardPaymentAPI(params) {
  const response = await fetch('https://tbgw.settlebank.co.kr/spay/APICardActionPay.do', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params)
  });
  
  return await response.json();
}

// 사용 예시
const paymentParams = {
  params: {
    mchtId: "nxca_jt_bi",
    ver: "0A19",
    method: "CA",
    bizType: "B0",
    encCd: "23",
    mchtTrdNo: "ORDER" + Date.now(),
    trdDt: new Date().toISOString().slice(0, 10).replace(/-/g, ''),
    trdTm: new Date().toTimeString().slice(0, 8).replace(/:/g, ''),
    mobileYn: "N",
    osType: "W"
  },
  data: {
    pktHash: "생성된해시값",
    pmtprdNm: "테스트상품",
    mchtCustNm: "홍길동",
    mchtCustId: "HongGilDong",
    cardNo: "암호화된카드번호",
    vldDtMon: "12",
    vldDtYear: "24",
    instmtMon: "00",
    crcCd: "KRW",
    trdAmt: "1000"
  }
};

const result = await callCardPaymentAPI(paymentParams);
console.log('결제 결과:', result);
```

### Python

```python
import requests
import json
from datetime import datetime

# 신용카드 결제 API 호출
def call_card_payment_api(params):
    url = 'https://tbgw.settlebank.co.kr/spay/APICardActionPay.do'
    response = requests.post(url, json=params)
    return response.json()

# 사용 예시
current_time = datetime.now()
payment_params = {
    "params": {
        "mchtId": "nxca_jt_bi",
        "ver": "0A19",
        "method": "CA",
        "bizType": "B0",
        "encCd": "23",
        "mchtTrdNo": f"ORDER{int(current_time.timestamp())}",
        "trdDt": current_time.strftime("%Y%m%d"),
        "trdTm": current_time.strftime("%H%M%S"),
        "mobileYn": "N",
        "osType": "W"
    },
    "data": {
        "pktHash": "생성된해시값",
        "pmtprdNm": "테스트상품",
        "mchtCustNm": "홍길동",
        "mchtCustId": "HongGilDong",
        "cardNo": "암호화된카드번호",
        "vldDtMon": "12",
        "vldDtYear": "24",
        "instmtMon": "00",
        "crcCd": "KRW",
        "trdAmt": "1000"
    }
}

result = call_card_payment_api(payment_params)
print('결제 결과:', result)
```

## ⚠️ 주의사항

- 모든 요청은 HTTPS를 통해 전송되어야 합니다.
- 요청 본문은 JSON 형식으로 전송해야 합니다.
- 해시값 생성이 필요한 경우 정확한 순서로 생성해야 합니다.
- 카드번호, 유효기간, 식별번호, 카드비밀번호, 거래금액 등은 AES 암호화하여 전달해야 합니다.
- 빌키 서비스를 이용하는 상점의 경우 응답에서 빌키를 받을 수 있습니다.
- 구인증과 비인증은 서로 다른 상점아이디를 사용해야 합니다.

