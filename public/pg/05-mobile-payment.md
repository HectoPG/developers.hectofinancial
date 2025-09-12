# 📱 휴대폰 결제

휴대폰 번호 인증을 통해 통신요금과 함께 결제하는 서비스입니다. 간편하고 빠른 결제가 가능하며, 정기결제 서비스도 지원합니다.

## 📖 개요

### 🎯 주요 특징

### 📡 지원 통신사

| 통신사 | 코드 | 특징 |
|--------|------|------|
| **SK텔레콤** | `SKT` | 국내 최대 통신사 |
| **KT** | `KTF` | 광범위한 커버리지 |
| **LG유플러스** | `LGT` | 데이터 서비스 우수 |
| **CJ헬로모바일** | `CJH` | 알뜰폰 서비스 |
| **한국케이블텔레콤** | `KCT` | 케이블 연계 서비스 |
| **SK 세븐모바일** | `SKL` | SK 계열 알뜰폰 |

---

## ⚡ 빠른 시작

### 1️⃣ 기본 휴대폰 결제

```html

// 휴대폰 결제 요청
SETTLE_PG.pay({
    env: "https://tbnpg.settlebank.co.kr",
    mchtId: "nxhp_sb_il",              // 휴대폰 결제 상점 ID
    method: "mobile",                  // 휴대폰 결제
    trdDt: "20231215",                 // 거래일자
    trdTm: "143022",                   // 거래시간
    mchtTrdNo: "MOBILE20231215143022", // 주문번호
    mchtName: "테스트상점",
    mchtEName: "Test Shop",
    pmtPrdtNm: "테스트상품",
    trdAmt: "5000",                    // 5,000원
    mchtCustNm: "홍길동",              // 결제자명
    cphoneNo: "01012345678",           // 휴대폰번호
    telecomCd: "SKT|KTF|LGT",          // 지원 통신사
    notiUrl: "https://yoursite.com/mobile/notify",
    nextUrl: "https://yoursite.com/mobile/success",
    cancUrl: "https://yoursite.com/mobile/cancel",
    pktHash: "생성된해시값",           // SHA256 해시
    ui: {
        type: "popup",
        width: "430",
        height: "660"
    }
}, function(response) {
    if (response.outStatCd === "0021") {
        // 결제 성공
        console.log("휴대폰 결제 성공:", response);
        alert(`결제 완료!\n통신사: ${response.fnNm}\n승인번호: ${response.authDt}`);
    } else if (response.outStatCd === "0061") {
        // 하이브리드 인증 성공
        console.log("인증 성공, 승인 API 호출 필요:", response);
        // 별도 승인 API 호출
        callApprovalAPI(response.trdNo);
    } else {
        // 결제 실패
        console.log("휴대폰 결제 실패:", response.outRsltMsg);
        alert("결제가 실패했습니다: " + response.outRsltMsg);
    }
});

```

### 2️⃣ 월자동 결제 설정

```javascript
// 정기결제 설정
SETTLE_PG.pay({
    env: "https://tbnpg.settlebank.co.kr",
    mchtId: "nxhp_sb_ma",              // 월자동 결제 전용 상점 ID
    method: "mobile",
    autoPayType: "M",                  // 월자동 결제 설정
    // ... 기타 파라미터
}, function(response) {
    if (response.outStatCd === "0021" && response.billKey) {
        // 정기결제 등록 성공
        console.log("정기결제 등록 성공:", response.billKey);
        // billKey를 저장하여 다음 달 자동결제에 사용
        saveBillKey(response.billKey, response.billKeyExpireDt);
    }
});
```

---

## 🏗️ 구현 가이드

### 1️⃣ UI 휴대폰 결제

#### 📡 API 엔드포인트

| 환경 | URL |
|------|-----|
| **테스트** | `https://tbnpg.settlebank.co.kr/mobile/main.do` |
| **운영** | `https://npg.settlebank.co.kr/mobile/main.do` |

#### 📋 요청 파라미터

#### 🔐 해시 생성 예시

```javascript
const crypto = require('crypto');

function generateMobilePaymentHash(params, hashKey) {
    // 해시 생성을 위한 데이터 조합
    const hashData = 
        params.mchtId +         // 상점아이디
        params.method +         // 결제수단 (mobile)
        params.mchtTrdNo +      // 상점주문번호
        params.trdDt +          // 요청일자
        params.trdTm +          // 요청시간
        params.trdAmt +         // 거래금액 (평문, 암호화 전)
        hashKey;                // 해시키 (헥토파이낸셜 제공)
    
    // SHA256 해시 생성
    return crypto.createHash('sha256').update(hashData, 'utf8').digest('hex');
}

// 사용 예시
const mobileParams = {
    mchtId: "nxhp_sb_il",
    method: "mobile",
    mchtTrdNo: "MOBILE20231215143022",
    trdDt: "20231215",
    trdTm: "143022",
    trdAmt: "5000"  // 암호화 전 원본 금액
};

const hashKey = "your-hash-key-from-hecto"; // 헥토파이낸셜에서 제공
const pktHash = generateMobilePaymentHash(mobileParams, hashKey);
```

### 2️⃣ 응답 처리

#### 📨 결제 성공 응답

```javascript
{
    "outStatCd": "0021",               // 성공 코드
    "outRsltCd": "0000",               // 결과 코드
    "outRsltMsg": "정상처리",           // 결과 메시지
    "method": "mobile",                // 결제수단
    "mchtTrdNo": "MOBILE20231215143022", // 상점주문번호
    "trdNo": "STFP_PGMPnxhp_sb_il0231215143022M1234567", // 헥토 거래번호
    "trdAmt": "5000",                  // 거래금액
    "authDt": "20231215143045",        // 승인일시
    "fnNm": "SKT",                     // 통신사명
    "fnCd": "001",                     // 통신사코드
    "billKey": "MO1234567890"          // 자동결제키 (월자동 결제시)
}
```

#### 🔐 하이브리드 인증 성공 응답

```javascript
{
    "outStatCd": "0061",               // 인증 성공 코드
    "outRsltCd": "0000",               // 결과 코드
    "outRsltMsg": "인증 성공",          // 결과 메시지
    "method": "mobile",
    "mchtTrdNo": "MOBILE20231215143022",
    "trdNo": "STFP_PGMPnxhp_sb_hd0231215143022M1234567", // 인증 거래번호
    "trdAmt": "5000"
    // 별도 승인 API 호출 필요
}
```

#### ❌ 결제 실패 응답

```javascript
{
    "outStatCd": "0031",               // 실패 코드
    "outRsltCd": "1009",               // 에러 코드
    "outRsltMsg": "결제 요청 정보 누락 (거래금액)", // 에러 메시지
    "method": "mobile",
    "mchtTrdNo": "MOBILE20231215143022"
}
```

### 3️⃣ 결제 완료 노티(NOTI) 처리

휴대폰 결제가 완료되면 `notiUrl`로 결과가 전송됩니다.

```javascript
// Node.js Express 예시
app.post('/payment/mobile/notification', (req, res) => {
    const {
        outStatCd,
        trdNo,
        method,
        bizType,
        mchtTrdNo,
        trdAmt,
        trdDtm,
        billKey,
        billKeyExpireDt,
        telecomCd,
        telecomNm,
        phoneNoEnc,
        pktHash
    } = req.body;
    
    // 1. 해시 검증
    const expectedHash = generateMobileNotiHash(req.body, hashKey);
    if (pktHash !== expectedHash) {
        console.error('해시 검증 실패');
        return res.status(400).send('FAIL');
    }
    
    // 2. 결제 성공 여부 확인
    if (outStatCd === '0021') {
        if (bizType === 'B0') {
            // 일반 결제 성공
            await updateMobilePaymentStatus(mchtTrdNo, {
                status: 'completed',
                hectoTrdNo: trdNo,
                completedAt: trdDtm,
                telecomCode: telecomCd,
                telecomName: telecomNm,
                phoneNumber: phoneNoEnc,
                amount: trdAmt,
                billKey: billKey // 월자동 결제시
            });
        } else if (bizType === 'B1') {
            // 자동연장 결제
            await processMonthlybilling(mchtTrdNo, {
                hectoTrdNo: trdNo,
                amount: trdAmt,
                billedAt: trdDtm
            });
        }
        
        // 고객에게 결제 완료 알림 발송
        await sendMobilePaymentNotification(mchtTrdNo);
        
        // 성공 응답
        res.send('OK');
    } else if (bizType === 'C0') {
        // 취소 처리
        await updateMobilePaymentStatus(mchtTrdNo, {
            status: 'cancelled',
            cancelledAt: trdDtm
        });
        
        res.send('OK');
    } else {
        // 기타 상태 처리
        console.log('휴대폰 결제 상태:', outStatCd, req.body.outRsltMsg);
        res.send('OK');
    }
});

// 휴대폰 결제 노티 해시 생성 함수
function generateMobileNotiHash(notiData, hashKey) {
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

### 1️⃣ 하이브리드 API (인증/승인 분리)

인증과 승인을 분리하여 더 유연한 결제 프로세스를 구현할 수 있습니다.

#### 📡 승인 API 엔드포인트

| 환경 | URL |
|------|-----|
| **테스트** | `https://tbgw.settlebank.co.kr/spay/APIMobileApproval.do` |
| **운영** | `https://gw.settlebank.co.kr/spay/APIMobileApproval.do` |

#### 💻 승인 API 호출

```javascript
// 1단계: 인증 완료 후 승인 API 호출
async function callMobileApproval(authTrdNo) {
    const approvalRequest = {
        params: {
            mchtId: "nxhp_sb_hd",
            ver: "0A19",
            mchtTrdNo: "APPROVAL20231215143022",
            trdDt: "20231215",
            trdTm: "143022"
        },
        data: {
            pktHash: "생성된해시값",
            method: "MP",
            authTrdNo: authTrdNo,        // 인증 거래번호
            trdAmt: "5000",
            pmtPrdtNm: "테스트상품"
        }
    };

    try {
        const response = await fetch('https://tbgw.settlebank.co.kr/spay/APIMobileApproval.do', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify(approvalRequest)
        });
        
        const result = await response.json();
        
        if (result.outStatCd === '0021') {
            console.log('승인 성공:', result);
            return result;
        } else {
            console.error('승인 실패:', result.outRsltMsg);
            throw new Error(result.outRsltMsg);
        }
    } catch (error) {
        console.error('승인 API 호출 실패:', error);
        throw error;
    }
}
```

### 2️⃣ 월자동 결제

정기결제 서비스를 위한 월자동 결제 구현 방법입니다.

#### 💻 월자동 결제 API

```javascript
// 월자동 결제 API 호출
async function processMonthlyPayment(billKey, amount, productName) {
    const monthlyRequest = {
        params: {
            mchtId: "nxhp_sb_ma",
            ver: "0A19",
            mchtTrdNo: "MONTHLY20231215143022",
            trdDt: "20231215",
            trdTm: "143022"
        },
        data: {
            pktHash: "생성된해시값",
            method: "MP",
            billKey: billKey,            // 이전에 발급받은 billKey
            trdAmt: amount,
            pmtPrdtNm: productName,
            autoPayType: "M"
        }
    };

    try {
        const response = await fetch('https://tbgw.settlebank.co.kr/spay/APIMobileMonthly.do', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify(monthlyRequest)
        });
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('월자동 결제 실패:', error);
        throw error;
    }
}

// 정기결제 스케줄러 예시
async function scheduleMonthlyPayments() {
    // 매월 1일에 실행되는 스케줄러
    const subscriptions = await getActiveSubscriptions();
    
    for (const subscription of subscriptions) {
        try {
            const result = await processMonthlyPayment(
                subscription.billKey,
                subscription.amount,
                subscription.productName
            );
            
            if (result.outStatCd === '0021') {
                await updateSubscriptionStatus(subscription.id, 'paid');
                await sendPaymentConfirmation(subscription.userId);
            } else {
                await updateSubscriptionStatus(subscription.id, 'failed');
                await sendPaymentFailureNotification(subscription.userId);
            }
        } catch (error) {
            console.error(`정기결제 실패 - 구독 ID: ${subscription.id}`, error);
        }
    }
}
```

### 3️⃣ 휴대폰 결제 취소 및 환불

#### 취소 API (당일)

```javascript
const cancelRequest = {
    params: {
        mchtId: "nxhp_sb_il",
        ver: "0A19",
        mchtTrdNo: "CANCEL20231215143022",
        trdDt: "20231215",
        trdTm: "143022"
    },
    data: {
        pktHash: "생성된해시값",
        method: "MP",
        orgTrdNo: "STFP_PGMPnxhp_sb_il0231215143022M1234567", // 원거래번호
        orgTrdDt: "20231215",            // 원거래일자
        cnclAmt: "5000",                 // 취소금액
        cnclRsn: "고객 요청"             // 취소사유
    }
};
```

#### 환불 API (익일 이후)

```javascript
const refundRequest = {
    params: {
        mchtId: "nxhp_sb_il",
        ver: "0A19",
        mchtTrdNo: "REFUND20231216143022",
        trdDt: "20231216",
        trdTm: "143022"
    },
    data: {
        pktHash: "생성된해시값",
        method: "MP",
        orgTrdNo: "STFP_PGMPnxhp_sb_il0231215143022M1234567",
        orgTrdDt: "20231215",
        cnclAmt: "5000",
        cnclRsn: "고객 요청 환불"
    }
};
```

---

## 🧪 테스트 가이드

### 🔧 테스트 환경 설정

**테스트 상점 정보:**
- **일반 결제**: `nxhp_sb_il`
- **하이브리드**: `nxhp_sb_hd`
- **월자동결제**: `nxhp_sb_ma`
- **환경**: `https://tbnpg.settlebank.co.kr`

### 📱 테스트 휴대폰 정보

테스트 환경에서 사용 가능한 휴대폰 번호:

| 통신사 | 휴대폰번호 | 생년월일 | 특징 |
|--------|------------|----------|------|
| **SKT** | `01012345678` | `900101` | 일반 테스트 |
| **KT** | `01087654321` | `850315` | 일반 테스트 |
| **LGU+** | `01055556666` | `920720` | 일반 테스트 |

### 🎯 테스트 시나리오

    ✅ 성공 시나리오
    
      • 일반 휴대폰 결제
      • 하이브리드 인증 → 승인
      • 월자동 결제 등록
      • 정기결제 실행
      • 당일 취소
      • 익일 환불

    ❌ 실패 시나리오
    
      • 잘못된 휴대폰 번호
      • 통신사 불일치
      • 한도 초과
      • 인증 실패
      • 해시값 불일치

---

## ❌ 에러 처리

### 🚨 주요 에러 코드

| 코드 | 메시지 | 원인 | 해결방법 |
|------|--------|------|----------|
| `1009` | 결제 요청 정보 누락 (거래금액) | 필수 파라미터 누락 | 필수 파라미터 확인 |
| `1901` | 해쉬값 불일치 오류 | 해시 생성 오류 | 해시 생성 로직 점검 |
| `1902` | 암호화 항목 미처리 오류 | 암호화 필드 미처리 | AES 암호화 적용 |
| `ST30` | 인증 시간 만료 | 인증 시간 초과 | 인증 시간 내 완료 안내 |
| `ST46` | 취소기간 경과 | 취소 가능 기간 초과 | 환불 API 사용 |
| `ST50` | 중복요청 | 동일한 주문번호 재사용 | 고유한 주문번호 생성 |

### 🔧 에러 해결 가이드

      💡

      일반적인 문제 해결
      
        • 통신사 인증 실패: 휴대폰 번호와 통신사 일치 확인
        • 월한도 초과: 통신사별 월 결제 한도 확인
        • 하이브리드 승인 실패: 인증 거래번호 정확성 확인
        • 정기결제 실패: billKey 유효기간 확인

---

## 💡 자주 묻는 질문

### Q. 휴대폰 결제 한도는 얼마인가요?
A. 통신사별로 다르며, 일반적으로 월 30만원입니다. 고객의 통신요금 납부 이력에 따라 한도가 달라질 수 있습니다.

### Q. 하이브리드 방식의 장점은 무엇인가요?
A. 인증과 승인을 분리하여 더 유연한 결제 프로세스를 구현할 수 있습니다. 예를 들어, 인증 후 재고 확인 후 승인 처리가 가능합니다.

### Q. 월자동 결제는 언제 청구되나요?
A. 매월 1일에 자동으로 청구됩니다. 실패 시 3일간 재시도하며, 계속 실패하면 서비스가 중단됩니다.

### Q. 취소와 환불의 차이는 무엇인가요?
A. 당일 취소는 통신요금에 반영되지 않으며, 익일 이후 환불은 다음 달 통신요금에서 차감됩니다.

### Q. 알뜰폰도 지원되나요?
A. 네, CJ헬로모바일, 한국케이블텔레콤 등 주요 알뜰폰 서비스를 지원합니다.

---

## 🚀 다음 단계