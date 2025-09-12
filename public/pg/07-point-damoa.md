# 🎯 포인트 다모아 결제

포인트 다모아는 다양한 포인트를 통합하여 결제할 수 있는 서비스입니다. 고객이 보유한 여러 포인트를 하나로 모아서 편리하게 결제할 수 있습니다.

## 📖 개요

### 🎯 주요 특징

### 🎁 포인트 다모아 특징

| 기능 | 설명 | 장점 |
|------|------|------|
| **통합 관리** | 여러 브랜드 포인트를 하나로 통합 | 포인트 관리 편의성 |
| **실시간 조회** | 보유 포인트 실시간 확인 | 정확한 잔액 파악 |
| **안전한 인증** | CI 기반 본인 확인 | 보안성 강화 |
| **약관 동의** | 포인트 사용 약관 동의 처리 | 법적 안전성 |

---

## ⚡ 빠른 시작

### 1️⃣ 기본 포인트 다모아 결제

```html

// 포인트 다모아 결제 요청
SETTLE_PG.pay({
    env: "https://tbnpg.settlebank.co.kr",
    mchtId: "nxpt_kt_il",              // 포인트 다모아 상점 ID
    method: "point",                   // 포인트 결제
    trdDt: "20231215",                 // 거래일자
    trdTm: "143022",                   // 거래시간
    mchtTrdNo: "POINT20231215143022",  // 주문번호
    mchtName: "테스트상점",
    mchtEName: "Test Shop",
    pmtPrdtNm: "테스트상품",
    trdAmt: "3000",                    // 3,000원
    mchtCustNm: "홍길동",              // 결제자명
    clipCustNm: "홍길동",              // 포인트 다모아 고객명
    clipCustCi: "AES암호화된CI값",      // 고객 CI
    clipCustPhoneNo: "01012345678",    // 휴대폰번호
    skipCd: "N",                       // 약관동의 스킵 여부
    notiUrl: "https://yoursite.com/point/notify",
    nextUrl: "https://yoursite.com/point/success",
    cancUrl: "https://yoursite.com/point/cancel",
    certNotiUrl: "https://yoursite.com/point/cert-notify", // 인증 결과 URL
    pktHash: "생성된해시값",           // SHA256 해시
    ui: {
        type: "popup",
        width: "430",
        height: "660"
    }
}, function(response) {
    if (response.outStatCd === "0021") {
        // 결제 성공
        console.log("포인트 다모아 결제 성공:", response);
        alert(`결제 완료!\n거래번호: ${response.trdNo}\n사용포인트: ${response.trdAmt}P`);
    } else {
        // 결제 실패
        console.log("포인트 다모아 결제 실패:", response.outRsltMsg);
        alert("결제가 실패했습니다: " + response.outRsltMsg);
    }
});

```

### 2️⃣ 결제 프로세스

      1
      결제 요청
      가맹점→PG

      2
      본인 인증
      CI 확인

      3
      약관 동의
      포인트 사용

      4
      포인트 차감
      결제 완료

---

## 🏗️ 구현 가이드

### 1️⃣ UI 포인트 다모아 결제

#### 📡 API 엔드포인트

| 환경 | URL |
|------|-----|
| **테스트** | `https://tbnpg.settlebank.co.kr/point/main.do` |
| **운영** | `https://npg.settlebank.co.kr/point/main.do` |

#### 📋 요청 파라미터

#### 🔐 해시 생성 예시

```javascript
const crypto = require('crypto');

function generatePointDamoaHash(params, hashKey) {
    // 해시 생성을 위한 데이터 조합
    const hashData = 
        params.mchtId +         // 상점아이디
        params.method +         // 결제수단 (point)
        params.mchtTrdNo +      // 상점주문번호
        params.trdDt +          // 요청일자
        params.trdTm +          // 요청시간
        params.trdAmt +         // 거래금액 (평문, 암호화 전)
        hashKey;                // 해시키 (헥토파이낸셜 제공)
    
    // SHA256 해시 생성
    return crypto.createHash('sha256').update(hashData, 'utf8').digest('hex');
}

// 사용 예시
const pointParams = {
    mchtId: "nxpt_kt_il",
    method: "point",
    mchtTrdNo: "POINT20231215143022",
    trdDt: "20231215",
    trdTm: "143022",
    trdAmt: "3000"  // 암호화 전 원본 금액
};

const hashKey = "your-hash-key-from-hecto"; // 헥토파이낸셜에서 제공
const pktHash = generatePointDamoaHash(pointParams, hashKey);
```

### 2️⃣ 응답 처리

#### 📨 결제 성공 응답

```javascript
{
    "outStatCd": "0021",               // 성공 코드
    "outRsltCd": "0000",               // 결과 코드
    "outRsltMsg": "정상처리",           // 결과 메시지
    "method": "point",                 // 결제수단
    "mchtTrdNo": "POINT20231215143022", // 상점주문번호
    "trdNo": "STFP_PGPTnxpt_kt_il0231215143022M1234567", // 헥토 거래번호
    "trdAmt": "3000",                  // 거래금액
    "authDt": "20231215143045",        // 승인일시
    "pointBalance": "7000"             // 결제 후 포인트 잔액
}
```

#### ❌ 결제 실패 응답

```javascript
{
    "outStatCd": "0031",               // 실패 코드
    "outRsltCd": "1009",               // 에러 코드
    "outRsltMsg": "포인트 잔액 부족",   // 에러 메시지
    "method": "point",
    "mchtTrdNo": "POINT20231215143022"
}
```

### 3️⃣ 결제 완료 노티(NOTI) 처리

포인트 다모아 결제가 완료되면 `notiUrl`로 결과가 전송됩니다.

```javascript
// Node.js Express 예시
app.post('/payment/point/notification', (req, res) => {
    const {
        outStatCd,
        trdNo,
        method,
        bizType,
        mchtTrdNo,
        trdAmt,
        trdDtm,
        mchtCustNm,
        pmtprdNm,
        pointBalance,
        pktHash
    } = req.body;
    
    // 1. 해시 검증
    const expectedHash = generatePointDamoaNotiHash(req.body, hashKey);
    if (pktHash !== expectedHash) {
        console.error('해시 검증 실패');
        return res.status(400).send('FAIL');
    }
    
    // 2. 결제 성공 여부 확인
    if (outStatCd === '0021' && bizType === 'B0') {
        // 포인트 다모아 결제 성공
        await updatePointDamoaPaymentStatus(mchtTrdNo, {
            status: 'completed',
            hectoTrdNo: trdNo,
            completedAt: trdDtm,
            usedPoints: trdAmt,
            remainingPoints: pointBalance,
            customerName: mchtCustNm,
            productName: pmtprdNm
        });
        
        // 포인트 사용 내역 기록
        await recordPointUsage(mchtTrdNo, {
            points: trdAmt,
            type: 'payment',
            description: pmtprdNm
        });
        
        // 고객에게 결제 완료 알림 발송
        await sendPointPaymentNotification(mchtTrdNo);
        
        // 성공 응답
        res.send('OK');
    } else if (bizType === 'C0') {
        // 취소 처리 (포인트 복원)
        await updatePointDamoaPaymentStatus(mchtTrdNo, {
            status: 'cancelled',
            cancelledAt: trdDtm
        });
        
        // 포인트 복원 처리
        await restorePoints(mchtTrdNo, trdAmt);
        
        res.send('OK');
    } else {
        // 기타 상태 처리
        console.log('포인트 다모아 결제 상태:', outStatCd, req.body.outRsltMsg);
        res.send('OK');
    }
});

// 포인트 다모아 노티 해시 생성 함수
function generatePointDamoaNotiHash(notiData, hashKey) {
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

### 4️⃣ 인증 결과 노티 처리

본인 인증 완료 시 `certNotiUrl`로 결과가 전송됩니다.

```javascript
// 인증 결과 노티 처리
app.post('/payment/point/cert-notification', (req, res) => {
    const {
        certResult,
        custCi,
        custName,
        custPhoneNo,
        mchtTrdNo
    } = req.body;
    
    if (certResult === 'SUCCESS') {
        // 인증 성공 - 고객 정보 업데이트
        await updateCustomerCertInfo(mchtTrdNo, {
            ci: custCi,
            name: custName,
            phoneNo: custPhoneNo,
            certifiedAt: new Date()
        });
        
        console.log('고객 인증 완료:', mchtTrdNo);
    } else {
        // 인증 실패
        console.log('고객 인증 실패:', mchtTrdNo, req.body.certFailReason);
    }
    
    res.send('OK');
});
```

---

## 🔄 고급 기능

### 1️⃣ 포인트 다모아 취소

포인트 다모아 결제 완료 후 취소하는 기능입니다.

#### 📡 취소 API 엔드포인트

| 환경 | URL |
|------|-----|
| **테스트** | `https://tbgw.settlebank.co.kr/spay/APICancel.do` |
| **운영** | `https://gw.settlebank.co.kr/spay/APICancel.do` |

#### 💻 취소 요청 예시

```javascript
const cancelPointDamoaRequest = {
    params: {
        mchtId: "nxpt_kt_il",
        ver: "0A19",
        method: "CP",                    // 포인트 다모아 취소 코드
        bizType: "C0",                   // 취소 구분
        encCd: "23",                     // 암호화 구분
        mchtTrdNo: "CANCEL20231215143022",
        trdDt: "20231215",
        trdTm: "143022"
    },
    data: {
        pktHash: "생성된해시값",
        orgTrdNo: "STFP_PGPTnxpt_kt_il0231215143022M1234567", // 원거래번호
        crcCd: "KRW",                    // 통화구분
        cnclOrd: "001",                  // 취소회차
        cnclAmt: "3000",                 // 취소금액 (포인트)
        cnclRsn: "고객 요청"             // 취소사유
    }
};

// 서버로 전송
fetch('https://tbgw.settlebank.co.kr/spay/APICancel.do', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify(cancelPointDamoaRequest)
})
.then(response => response.json())
.then(data => {
    console.log('취소 결과:', data);
    if (data.outStatCd === '0021') {
        alert('포인트 다모아 결제가 취소되었습니다. 포인트가 복원됩니다.');
    } else {
        alert('취소 실패: ' + data.outRsltMsg);
    }
});
```

### 2️⃣ 포인트 잔액 조회

결제 전 고객의 포인트 잔액을 확인하는 기능입니다.

```javascript
// 포인트 잔액 조회 API
async function checkPointBalance(customerCi) {
    const balanceRequest = {
        mchtId: "nxpt_kt_il",
        custCi: customerCi,              // 고객 CI
        reqType: "BALANCE_INQUIRY",      // 잔액 조회
        pktHash: "생성된해시값"
    };

    try {
        const response = await fetch('https://tbgw.settlebank.co.kr/point/balance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify(balanceRequest)
        });
        
        const result = await response.json();
        
        if (result.outStatCd === '0021') {
            return {
                totalPoints: result.totalPoints,
                availablePoints: result.availablePoints,
                lockedPoints: result.lockedPoints
            };
        } else {
            throw new Error(result.outRsltMsg);
        }
    } catch (error) {
        console.error('포인트 잔액 조회 실패:', error);
        throw error;
    }
}

// 사용 예시
async function beforePayment(customerCi, paymentAmount) {
    try {
        const pointBalance = await checkPointBalance(customerCi);
        
        if (pointBalance.availablePoints >= paymentAmount) {
            console.log('결제 가능:', pointBalance.availablePoints, '포인트 보유');
            return true;
        } else {
            console.log('포인트 부족:', pointBalance.availablePoints, '
  
    ✅ 성공 시나리오
    
      • 정상 포인트 결제
      • 잔액 조회
      • 본인 인증 완료
      • 약관 동의 처리
      • 포인트 취소 및 복원

    ❌ 실패 시나리오
    
      • 잘못된 CI 정보
      • 포인트 잔액 부족
      • 본인 인증 실패
      • 약관 동의 거부
      • 해시값 불일치

---

## ❌ 에러 처리

### 🚨 주요 에러 코드

| 코드 | 메시지 | 원인 | 해결방법 |
|------|--------|------|----------|
| `1009` | 결제 요청 정보 누락 | 필수 파라미터 누락 | 필수 파라미터 확인 |
| `1901` | 해쉬값 불일치 오류 | 해시 생성 오류 | 해시 생성 로직 점검 |
| `1902` | 암호화 항목 미처리 오류 | 암호화 필드 미처리 | AES 암호화 적용 |
| `PT01` | CI 정보 오류 | 잘못된 CI 값 | 정확한 CI 확인 |
| `PT02` | 포인트 잔액 부족 | 보유 포인트 부족 | 포인트 충전 또는 금액 조정 |
| `PT03` | 본인 인증 실패 | 인증 정보 불일치 | 고객 정보 재확인 |
| `PT04` | 약관 동의 필요 | 약관 동의 안함 | 약관 동의 처리 |

### 🔧 에러 해결 가이드

      💡

      일반적인 문제 해결
      
        • CI 정보 오류: CI 값이 정확히 88바이트인지 확인
        • 인증 실패: 고객명과 휴대폰번호 일치 여부 확인
        • 포인트 부족: 사전 잔액 조회 API 활용
        • 약관 동의: skipCd를 'N'으로 설정하여 약관 동의 화면 표시

---

## 💡 자주 묻는 질문

### Q. CI(고객식별정보)는 어떻게 획득하나요?
A. CI는 본인인증 서비스(NICE, KCB 등)를 통해 획득할 수 있습니다. 암호화되지 않은 원본 CI 값이 88바이트여야 합니다.

### Q. 포인트 다모아는 어떤 포인트를 통합하나요?
A. 다양한 브랜드의 포인트를 하나로 통합하여 관리합니다. 구체적인 포인트 브랜드는 헥토파이낸셜에 문의하세요.

### Q. 포인트 결제 취소 시 포인트는 언제 복원되나요?
A. 취소 승인 즉시 고객의 포인트 계정으로 복원됩니다. 실시간으로 처리됩니다.

### Q. 약관 동의를 스킵할 수 있나요?
A. skipCd를 'Y'로 설정하면 약관 동의 화면을 스킵할 수 있습니다. 단, 사전에 고객이 약관에 동의한 경우에만 사용하세요.

### Q. 포인트 유효기간이 있나요?
A. 포인트 유효기간은 포인트 발급처의 정책에 따라 다릅니다. 잔액 조회 API를 통해 확인할 수 있습니다.

---

## 🚀 다음 단계

포인트 다모아 결제 연동을 완료했다면, 다른 결제 수단도 확인해보세요:

        💳
      
      신용카드

        📱
      
      휴대폰

        🎁
      
      상품권

        ⚡
      
      간편결제