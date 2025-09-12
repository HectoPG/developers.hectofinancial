# 🏦 계좌이체

고객의 은행 계좌에서 직접 결제 금액을 이체하는 실시간 결제 서비스입니다. 현금영수증 발행이 자동으로 처리되며, 빠르고 안전한 결제가 가능합니다.

## 📖 개요

### 🎯 주요 특징

### 🏦 지원 금융기관

| 금융기관 | 코드 | 특징 |
|----------|------|------|
| **국민은행** | `004` | 광범위한 사용자 기반 |
| **우리은행** | `020` | 빠른 이체 처리 |
| **신한은행** | `088` | 모바일 서비스 우수 |
| **하나은행** | `081` | 외환은행 통합 서비스 |
| **농협은행** | `011` | 지역 접근성 좋음 |
| **기업은행** | `003` | 기업 고객 특화 |
| **SC제일은행** | `023` | 외국계 은행 서비스 |
| **씨티은행** | `027` | 글로벌 금융 서비스 |

---

## ⚡ 빠른 시작

### 1️⃣ 기본 계좌이체 결제

```html

// 계좌이체 결제 요청
SETTLE_PG.pay({
    env: "https://tbnpg.settlebank.co.kr",
    mchtId: "nx_mid_il",               // 상점 ID
    method: "bank",                    // 계좌이체
    trdDt: "20231215",                 // 거래일자
    trdTm: "143022",                   // 거래시간
    mchtTrdNo: "BANK20231215143022",   // 주문번호
    mchtName: "테스트상점",
    mchtEName: "Test Shop",
    pmtPrdtNm: "테스트상품",
    trdAmt: "30000",                   // 30,000원
    mchtCustNm: "홍길동",              // 결제자명
    notiUrl: "https://yoursite.com/bank/notify",
    nextUrl: "https://yoursite.com/bank/success",
    cancUrl: "https://yoursite.com/bank/cancel",
    pktHash: "생성된해시값",           // SHA256 해시
    ui: {
        type: "popup",
        width: "430",
        height: "660"
    }
}, function(response) {
    if (response.outStatCd === "0021") {
        // 결제 성공
        console.log("계좌이체 결제 성공:", response);
        alert(`결제 완료!\n은행: ${response.fnNm}\n승인번호: ${response.authDt}`);
    } else {
        // 결제 실패
        console.log("계좌이체 결제 실패:", response.outRsltMsg);
        alert("결제가 실패했습니다: " + response.outRsltMsg);
    }
});

```

### 2️⃣ 결제 프로세스

      1
      결제 요청
      가맹점→PG

      2
      은행 선택
      고객 선택

      3
      인증 및 이체
      뱅크페이

      4
      결제 완료
      즉시 승인

---

## 🏗️ 구현 가이드

### 1️⃣ UI 계좌이체 결제

#### 📡 API 엔드포인트

| 환경 | URL |
|------|-----|
| **테스트** | `https://tbnpg.settlebank.co.kr/bank/main.do` |
| **운영** | `https://npg.settlebank.co.kr/bank/main.do` |

#### 📋 요청 파라미터

#### 🔐 해시 생성 예시

```javascript
const crypto = require('crypto');

function generateBankTransferHash(params, hashKey) {
    // 해시 생성을 위한 데이터 조합
    const hashData = 
        params.mchtId +         // 상점아이디
        params.method +         // 결제수단 (bank)
        params.mchtTrdNo +      // 상점주문번호
        params.trdDt +          // 요청일자
        params.trdTm +          // 요청시간
        params.trdAmt +         // 거래금액 (평문, 암호화 전)
        hashKey;                // 해시키 (헥토파이낸셜 제공)
    
    // SHA256 해시 생성
    return crypto.createHash('sha256').update(hashData, 'utf8').digest('hex');
}

// 사용 예시
const bankParams = {
    mchtId: "nx_mid_il",
    method: "bank",
    mchtTrdNo: "BANK20231215143022",
    trdDt: "20231215",
    trdTm: "143022",
    trdAmt: "30000"  // 암호화 전 원본 금액
};

const hashKey = "your-hash-key-from-hecto"; // 헥토파이낸셜에서 제공
const pktHash = generateBankTransferHash(bankParams, hashKey);
```

### 2️⃣ 응답 처리

#### 📨 결제 성공 응답

```javascript
{
    "outStatCd": "0021",               // 성공 코드
    "outRsltCd": "0000",               // 결과 코드
    "outRsltMsg": "정상처리",           // 결과 메시지
    "method": "bank",                  // 결제수단
    "mchtTrdNo": "BANK20231215143022", // 상점주문번호
    "trdNo": "STFP_PGRAnx_mid_il0231215143022M1234567", // 헥토 거래번호
    "trdAmt": "30000",                 // 거래금액
    "authDt": "20231215143045",        // 승인일시
    "fnNm": "국민은행",                 // 은행명
    "fnCd": "004"                      // 은행코드
}
```

#### ❌ 결제 실패 응답

```javascript
{
    "outStatCd": "0031",               // 실패 코드
    "outRsltCd": "1009",               // 에러 코드
    "outRsltMsg": "결제 요청 정보 누락 (거래금액)", // 에러 메시지
    "method": "bank",
    "mchtTrdNo": "BANK20231215143022"
}
```

### 3️⃣ 결제 완료 노티(NOTI) 처리

계좌이체가 완료되면 `notiUrl`로 결과가 전송됩니다.

```javascript
// Node.js Express 예시
app.post('/payment/bank/notification', (req, res) => {
    const {
        outStatCd,
        trdNo,
        method,
        bizType,
        mchtTrdNo,
        trdAmt,
        trdDtm,
        bankCd,
        bankNm,
        csrcIssNo,
        pktHash
    } = req.body;
    
    // 1. 해시 검증
    const expectedHash = generateBankNotiHash(req.body, hashKey);
    if (pktHash !== expectedHash) {
        console.error('해시 검증 실패');
        return res.status(400).send('FAIL');
    }
    
    // 2. 결제 성공 여부 확인
    if (outStatCd === '0021' && bizType === 'B0') {
        // 결제 성공 - DB 업데이트
        await updateBankTransferStatus(mchtTrdNo, {
            status: 'completed',
            hectoTrdNo: trdNo,
            completedAt: trdDtm,
            bankCode: bankCd,
            bankName: bankNm,
            cashReceiptNo: csrcIssNo,
            amount: trdAmt
        });
        
        // 고객에게 결제 완료 알림 발송
        await sendPaymentNotification(mchtTrdNo);
        
        // 성공 응답
        res.send('OK');
    } else if (bizType === 'C0') {
        // 취소 처리
        await updateBankTransferStatus(mchtTrdNo, {
            status: 'cancelled',
            cancelledAt: trdDtm
        });
        
        res.send('OK');
    } else {
        // 기타 상태 처리
        console.log('계좌이체 상태:', outStatCd, req.body.outRsltMsg);
        res.send('OK');
    }
});

// 노티 해시 생성 함수
function generateBankNotiHash(notiData, hashKey) {
    const hashData = 
        notiData.outStatCd +    // 거래상태코드
        notiData.trdDtm.substring(0, 8) +  // 거래일자 (YYYYMMDD)
        notiData.trdDtm.substring(8, 14) + // 거래시간 (HHMMSS)
        notiData.mchtId +       // 상점아이디
        notiData.mchtTrdNo +    // 상점주문번호
        notiData.trdAmt +       // 거래금액
        hashKey;                // 해시키
    
    return crypto.createHash('sha256').update(hashData, 'utf8').digest('hex');
}
```

---

## 🔄 고급 기능

### 1️⃣ 계좌이체 취소

결제 완료된 계좌이체를 취소하는 기능입니다.

#### 📡 취소 API 엔드포인트

| 환경 | URL |
|------|-----|
| **테스트** | `https://tbgw.settlebank.co.kr/spay/APICancel.do` |
| **운영** | `https://gw.settlebank.co.kr/spay/APICancel.do` |

#### 💻 취소 요청 예시

```javascript
const cancelRequest = {
    params: {
        mchtId: "nx_mid_il",
        ver: "0A19",
        mchtTrdNo: "CANCEL20231215143022",
        trdDt: "20231215",
        trdTm: "143022"
    },
    data: {
        pktHash: "생성된해시값",
        method: "RA",                    // 계좌이체 취소 코드
        orgTrdNo: "STFP_PGRAnx_mid_il0231215143022M1234567", // 원거래번호
        orgTrdDt: "20231215",            // 원거래일자
        cnclAmt: "30000",                // 취소금액 (전체취소)
        cnclRsn: "고객 요청"             // 취소사유
    }
};

// 서버로 전송
fetch('https://tbgw.settlebank.co.kr/spay/APICancel.do', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify(cancelRequest)
})
.then(response => response.json())
.then(data => {
    console.log('취소 결과:', data);
    if (data.outStatCd === '0021') {
        alert('취소가 완료되었습니다.');
    } else {
        alert('취소 실패: ' + data.outRsltMsg);
    }
});
```

### 2️⃣ 부분 취소

결제 금액의 일부만 취소하는 기능입니다.

```javascript
const partialCancelRequest = {
    params: {
        mchtId: "nx_mid_il",
        ver: "0A19",
        mchtTrdNo: "PARTIAL_CANCEL20231215143022",
        trdDt: "20231215",
        trdTm: "143022"
    },
    data: {
        pktHash: "생성된해시값",
        method: "RA",
        orgTrdNo: "STFP_PGRAnx_mid_il0231215143022M1234567",
        orgTrdDt: "20231215",
        cnclAmt: "10000",                // 부분취소 금액 (30,000원 중 10,000원)
        cnclRsn: "부분 환불 요청"
    }
};
```

### 3️⃣ 통장 표시명 관리

      💡

      통장 표시명 정책
      
        • 결제 및 익일환불: 뱅크페이에 등록된 가맹점명 사용
        • 당일취소: 각 은행 정책에 따라 다름
        • 표시명 변경: 헥토파이낸셜에 별도 문의 필요

---

## 🧪 테스트 가이드

### 🔧 테스트 환경 설정

**테스트 상점 정보:**
- **상점ID**: `nx_mid_il`
- **환경**: `https://tbnpg.settlebank.co.kr`
- **특징**: 실제 이체 없이 승인 테스트 가능

### 🎯 테스트 시나리오

### 💡 테스트 팁

- **은행별 테스트**: 주요 은행별로 결제 테스트 진행
- **모바일 테스트**: 모바일 환경에서 뱅크페이 앱 연동 확인
- **취소 테스트**: 당일취소와 익일환불 시나리오 모두 테스트
- **현금영수증**: 자동 발행되는 현금영수증 번호 확인

---

## ❌ 에러 처리

### 🚨 주요 에러 코드

| 코드 | 메시지 | 원인 | 해결방법 |
|------|--------|------|----------|
| `1009` | 결제 요청 정보 누락 (거래금액) | 필수 파라미터 누락 | 필수 파라미터 확인 |
| `1901` | 해쉬값 불일치 오류 | 해시 생성 오류 | 해시 생성 로직 점검 |
| `1902` | 암호화 항목 미처리 오류 | 암호화 필드 미처리 | AES 암호화 적용 |
| `ST24` | 예금주 불일치 | 계좌 명의자 불일치 | 정확한 예금주명 확인 |
| `ST30` | 인증 시간 만료 | 뱅크페이 인증 시간 초과 | 인증 시간 내 완료 안내 |
| `ST46` | 취소기간 경과 | 취소 가능 기간 초과 | 취소 가능 기간 확인 |

### 🔧 에러 해결 가이드

      • 뱅크페이 오류: 은행 시스템 점검 시간 확인
      • 인증 실패: 공동인증서 또는 간편인증 상태 확인
      • 취소 불가: 취소 가능 기간과 조건 확인
      • NOTI 미수신: 방화벽 및 URL 접근성 확인
    
  }
/>

---

## 💡 자주 묻는 질문

### Q. 계좌이체 취소는 언제까지 가능한가요?
A. 당일 23시까지는 당일취소, 그 이후는 익일환불로 처리됩니다. 취소 방식에 따라 처리 시간이 다릅니다.

### Q. 현금영수증은 자동으로 발행되나요?
A. 네, 계좌이체 결제 완료 시 현금영수증이 자동으로 발행됩니다. 별도 신청이 필요하지 않습니다.

### Q. 부분취소도 가능한가요?
A. 네, 원거래 금액 범위 내에서 여러 번 부분취소가 가능합니다.

### Q. 모든 은행이 지원되나요?
A. 뱅크페이에 참여하는 모든 국내 은행이 지원됩니다. 인터넷뱅킹 및 모바일뱅킹 모두 이용 가능합니다.

### Q. 통장에 표시되는 이름을 변경할 수 있나요?
A. 뱅크페이에 등록된 가맹점명이 표시됩니다. 변경이 필요한 경우 헥토파이낸셜에 문의하세요.

---

## 🚀 다음 단계

---