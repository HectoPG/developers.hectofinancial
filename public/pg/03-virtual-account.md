# 🏦 가상계좌

고객이 지정된 가상계좌로 입금하여 결제를 완료하는 서비스입니다. 온라인 쇼핑몰에서 널리 사용되며, 현금영수증 발행이 가능합니다.

## 📖 개요

### 🎯 주요 특징

### 🏦 지원 금융기관

| 금융기관 | 코드 | 특징 |
|----------|------|------|
| **국민은행** | `004` | 빠른 입금 확인 |
| **우리은행** | `020` | 광범위한 네트워크 |
| **신한은행** | `088` | 모바일 뱅킹 우수 |
| **하나은행** | `081` | 외환은행 통합 |
| **농협은행** | `011` | 지역 접근성 좋음 |
| **기업은행** | `003` | 기업 고객 특화 |
| **새마을금고** | `045` | 협동조합 은행 |

---

## ⚡ 빠른 시작

### 1️⃣ 기본 가상계좌 발급

```html

// 가상계좌 발급 요청
SETTLE_PG.pay({
    env: "https://tbnpg.settlebank.co.kr",
    mchtId: "nx_mid_il",               // 상점 ID
    method: "vbank",                   // 가상계좌
    trdDt: "20231215",                 // 거래일자
    trdTm: "143022",                   // 거래시간
    mchtTrdNo: "VBANK20231215143022",  // 주문번호
    mchtName: "테스트상점",
    mchtEName: "Test Shop",
    pmtPrdtNm: "테스트상품",
    trdAmt: "50000",                   // 50,000원
    expireDt: "20231220235959",        // 입금 기한 (5일 후)
    custAcntSumry: "테스트상점_홍길동", // 통장 표시명
    notiUrl: "https://yoursite.com/vbank/notify",
    nextUrl: "https://yoursite.com/vbank/success",
    cancUrl: "https://yoursite.com/vbank/cancel",
    pktHash: "생성된해시값",           // SHA256 해시
    ui: {
        type: "popup",
        width: "430",
        height: "660"
    }
}, function(response) {
    if (response.outStatCd === "0051") {
        // 가상계좌 발급 성공
        console.log("가상계좌 발급 성공:", response);
        alert(`입금 계좌: ${response.fnNm} ${response.vtlAcntNo}\n입금 기한: ${response.expireDt}`);
    } else {
        // 발급 실패
        console.log("가상계좌 발급 실패:", response.outRsltMsg);
        alert("가상계좌 발급이 실패했습니다: " + response.outRsltMsg);
    }
});

```

### 2️⃣ 테스트 입금 시뮬레이터

```javascript
// 테스트 환경에서 입금 테스트
const testDeposit = async (vAccountNo, amount) => {
    const testUrl = `https://tbgw.settlebank.co.kr/spay/APIVBankTest.do?mchtId=nx_mid_il&method=VA&bizType=F1&vAcntNo=${vAccountNo}&trdAmt=${amount}`;
    
    try {
        const response = await fetch(testUrl);
        const result = await response.text();
        console.log('입금 테스트 결과:', result);
    } catch (error) {
        console.error('입금 테스트 실패:', error);
    }
};

// 사용 예시
testDeposit("01012345678", "50000");
```

---

## 🏗️ 구현 가이드

### 1️⃣ UI 가상계좌 발급

#### 📡 API 엔드포인트

| 환경 | URL |
|------|-----|
| **테스트** | `https://tbnpg.settlebank.co.kr/vbank/main.do` |
| **운영** | `https://npg.settlebank.co.kr/vbank/main.do` |

#### 📋 요청 파라미터

#### 🔐 해시 생성 예시

```javascript
const crypto = require('crypto');

function generateVBankHash(params, hashKey) {
    // 해시 생성을 위한 데이터 조합
    const hashData = 
        params.mchtId +         // 상점아이디
        params.method +         // 결제수단 (vbank)
        params.mchtTrdNo +      // 상점주문번호
        params.trdDt +          // 요청일자
        params.trdTm +          // 요청시간
        params.trdAmt +         // 거래금액 (평문, 암호화 전)
        hashKey;                // 해시키 (헥토파이낸셜 제공)
    
    // SHA256 해시 생성
    return crypto.createHash('sha256').update(hashData, 'utf8').digest('hex');
}

// 사용 예시
const vbankParams = {
    mchtId: "nx_mid_il",
    method: "vbank",
    mchtTrdNo: "VBANK20231215143022",
    trdDt: "20231215",
    trdTm: "143022",
    trdAmt: "50000"  // 암호화 전 원본 금액
};

const hashKey = "your-hash-key-from-hecto"; // 헥토파이낸셜에서 제공
const pktHash = generateVBankHash(vbankParams, hashKey);
```

### 2️⃣ 응답 처리

#### 📨 가상계좌 발급 성공 응답

```javascript
{
    "outStatCd": "0051",               // 발급 성공 코드
    "outRsltCd": "0000",               // 결과 코드
    "outRsltMsg": "가상계좌 발급 성공", // 결과 메시지
    "method": "vbank",                 // 결제수단
    "mchtTrdNo": "VBANK20231215143022", // 상점주문번호
    "trdNo": "STFP_PGVAnx_mid_il0231215143022M1234567", // 헥토 거래번호
    "trdAmt": "50000",                 // 거래금액
    "authDt": "20231215143045",        // 발급일시
    "vtlAcntNo": "12345678901234567890", // 가상계좌번호 (암호화됨)
    "expireDt": "20231220235959",      // 입금기한
    "fnNm": "국민은행",                 // 은행명
    "fnCd": "004"                      // 은행코드
}
```

#### ❌ 발급 실패 응답

```javascript
{
    "outStatCd": "0031",               // 실패 코드
    "outRsltCd": "1009",               // 에러 코드
    "outRsltMsg": "결제 요청 정보 누락 (거래금액)", // 에러 메시지
    "method": "vbank",
    "mchtTrdNo": "VBANK20231215143022"
}
```

### 3️⃣ 입금 완료 노티(NOTI) 처리

고객이 가상계좌에 입금하면 `notiUrl`로 결과가 전송됩니다.

```javascript
// Node.js Express 예시
app.post('/payment/vbank/notification', (req, res) => {
    const {
        outStatCd,
        trdNo,
        method,
        mchtTrdNo,
        trdAmt,
        vtlAcntNo,
        fnNm,
        authDt,
        pktHash
    } = req.body;
    
    // 1. 해시 검증
    const expectedHash = generateNotificationHash(req.body, hashKey);
    if (pktHash !== expectedHash) {
        console.error('해시 검증 실패');
        return res.status(400).send('FAIL');
    }
    
    // 2. 입금 완료 여부 확인
    if (outStatCd === '0021') {
        // 입금 완료 - DB 업데이트
        await updateVBankStatus(mchtTrdNo, {
            status: 'completed',
            hectoTrdNo: trdNo,
            depositDt: authDt,
            bankName: fnNm,
            vAccountNo: vtlAcntNo,
            amount: trdAmt
        });
        
        // 고객에게 입금 완료 알림 발송
        await sendDepositNotification(mchtTrdNo);
        
        // 성공 응답
        res.send('OK');
    } else {
        // 입금 실패 또는 기타 상태
        console.log('입금 상태:', outStatCd, req.body.outRsltMsg);
        res.send('OK');
    }
});
```

---

## 🔄 고급 기능

### 1️⃣ API 직접 가상계좌 발급 (Non-UI)

UI 없이 서버에서 직접 가상계좌를 발급하는 방법입니다.

#### 📡 API 엔드포인트

| 환경 | URL |
|------|-----|
| **테스트** | `https://tbgw.settlebank.co.kr/spay/APIVBank.do` |
| **운영** | `https://gw.settlebank.co.kr/spay/APIVBank.do` |

#### 💻 API 요청 예시

```javascript
const vbankRequest = {
    params: {
        mchtId: "nx_mid_il",
        ver: "0A19",
        mchtTrdNo: "VBANK20231215143022",
        trdDt: "20231215",
        trdTm: "143022"
    },
    data: {
        pktHash: "생성된해시값",
        method: "VA",
        trdAmt: "50000",
        pmtPrdtNm: "테스트상품",
        mchtCustNm: "홍길동",
        expireDt: "20231220235959",
        custAcntSumry: "헥토파이낸셜_홍길동",
        notiUrl: "https://yoursite.com/vbank/notify"
    }
};

// 서버로 전송
fetch('https://tbgw.settlebank.co.kr/spay/APIVBank.do', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify(vbankRequest)
})
.then(response => response.json())
.then(data => {
    console.log('가상계좌 발급 결과:', data);
});
```

### 2️⃣ 가상계좌 정보 변경

이미 발급된 가상계좌의 정보를 변경하는 기능입니다.

```javascript
const updateVBankRequest = {
    params: {
        mchtId: "nx_mid_il",
        ver: "0A19",
        mchtTrdNo: "UPDATE20231215143022",
        trdDt: "20231215",
        trdTm: "143022"
    },
    data: {
        pktHash: "생성된해시값",
        method: "VA",
        orgTrdNo: "STFP_PGVAnx_mid_il0231215143022M1234567", // 원거래번호
        orgTrdDt: "20231215",      // 원거래일자
        expireDt: "20231225235959", // 새로운 입금기한
        trdAmt: "60000",           // 새로운 금액 (선택)
        pmtPrdtNm: "변경된 상품명"  // 새로운 상품명 (선택)
    }
};
```

### 3️⃣ 가상계좌 발급 취소

발급된 가상계좌를 취소하는 기능입니다.

```javascript
const cancelVBankRequest = {
    params: {
        mchtId: "nx_mid_il",
        ver: "0A19",
        mchtTrdNo: "CANCEL20231215143022",
        trdDt: "20231215",
        trdTm: "143022"
    },
    data: {
        pktHash: "생성된해시값",
        method: "VA",
        orgTrdNo: "STFP_PGVAnx_mid_il0231215143022M1234567", // 원거래번호
        orgTrdDt: "20231215",    // 원거래일자
        cnclRsn: "고객 요청"     // 취소사유
    }
};
```

### 4️⃣ 010 가상계좌

휴대폰 번호를 활용한 특별한 가상계좌 서비스입니다.

#### 🔍 특징
- 휴대폰 번호 형태의 가상계좌 번호
- 고객이 기억하기 쉬운 계좌번호
- 별도 상점ID 필요 (`nxva_sb_il`)

```javascript
// 010 가상계좌 발급
SETTLE_PG.pay({
    env: "https://tbnpg.settlebank.co.kr",
    mchtId: "nxva_sb_il",              // 010 가상계좌 전용 상점ID
    method: "vbank",
    // ... 기타 파라미터
    cphoneNo: "01012345678",           // 휴대폰 번호 (필수)
    // ... 나머지 파라미터
});
```

---

## 🧪 테스트 가이드

### 🔧 테스트 환경 설정

**테스트 상점 정보:**
- **상점ID**: `nx_mid_il` (일반), `nxva_sb_il` (010 가상계좌)
- **환경**: `https://tbnpg.settlebank.co.kr`
- **특징**: 실제 입금 없이 테스트 가능

### 💰 입금 테스트 시뮬레이터

테스트 환경에서 가상 입금을 시뮬레이션할 수 있습니다:

```javascript
// 입금 테스트 API 호출
const testDeposit = async (vAccountNo, amount) => {
    const testUrl = `https://tbgw.settlebank.co.kr/spay/APIVBankTest.do`;
    const params = new URLSearchParams({
        mchtId: 'nx_mid_il',
        method: 'VA',
        bizType: 'F1',
        vAcntNo: vAccountNo,
        trdAmt: amount
    });
    
    try {
        const response = await fetch(`${testUrl}?${params}`);
        const result = await response.text();
        console.log('입금 테스트 결과:', result);
        return result;
    } catch (error) {
        console.error('입금 테스트 실패:', error);
        throw error;
    }
};

// 사용 예시
testDeposit("01012345678", "50000");
```

### 🎯 테스트 시나리오

---

## ❌ 에러 처리

### 🚨 주요 에러 코드

| 코드 | 메시지 | 원인 | 해결방법 |
|------|--------|------|----------|
| `1009` | 결제 요청 정보 누락 (거래금액) | 필수 파라미터 누락 | 필수 파라미터 확인 |
| `1901` | 해쉬값 불일치 오류 | 해시 생성 오류 | 해시 생성 로직 점검 |
| `1902` | 암호화 항목 미처리 오류 | 암호화 필드 미처리 | AES 암호화 적용 |
| `ST47` | 미등록 상점 | 잘못된 상점ID | 올바른 상점ID 사용 |
| `ST50` | 중복요청 | 동일한 주문번호 재사용 | 고유한 주문번호 생성 |
| `ST06` | 거래정보 없음 | 존재하지 않는 거래 | 올바른 거래번호 확인 |

### 🔧 에러 해결 가이드

      • 가상계좌 발급 실패: 상점ID와 파라미터 확인
      • 입금 미확인: 테스트 시뮬레이터 활용
      • NOTI 미수신: notiUrl 접근성과 응답 확인
      • 입금 기한 설정: 최대 365일 제한 확인
    
  }
/>

---

## 💡 자주 묻는 질문

### Q. 가상계좌 번호는 재사용되나요?
A. 아니요, 각 주문마다 고유한 가상계좌 번호가 발급됩니다. 입금 완료 또는 만료 후 재사용되지 않습니다.

### Q. 입금 기한을 연장할 수 있나요?
A. 네, 가상계좌 정보 변경 API를 통해 입금 기한을 연장할 수 있습니다.

### Q. 부분 입금도 인식하나요?
A. 아니요, 정확한 금액이 입금되어야 결제가 완료됩니다. 부족하거나 초과 입금 시 별도 처리가 필요합니다.

### Q. 010 가상계좌의 장점은 무엇인가요?
A. 고객의 휴대폰 번호를 계좌번호로 사용하여 기억하기 쉽고, 입력 오류를 줄일 수 있습니다.

### Q. 환불은 어떻게 처리하나요?
A. 가상계좌 환불 API를 통해 고객의 계좌로 직접 환불할 수 있습니다.

---

## 🚀 다음 단계

---