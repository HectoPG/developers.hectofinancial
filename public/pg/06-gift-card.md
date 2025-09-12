# 🎁 상품권 결제

다양한 온라인 상품권을 통한 결제 서비스입니다. 게임, 도서, 교통카드 등 다양한 상품권을 지원하여 고객에게 편리한 결제 옵션을 제공합니다.

## 📖 개요

### 🎯 주요 특징

### 🎁 지원 상품권

| 상품권 브랜드 | 코드 | 특징 | 주요 사용처 |
|--------------|------|------|-------------|
| **틴캐시** | `teencash` | 게임 전용 상품권 | 온라인 게임, 게임 아이템 |
| **해피머니** | `happymoney` | 범용 상품권 | 온라인 쇼핑몰, 게임 |
| **컬쳐캐시** | `culturecash` | 문화상품권 | 도서, 영화, 공연 |
| **스마트문상** | `smartcash` | 게임 상품권 | 모바일 게임, PC 게임 |
| **도서상품권** | `booknlife` | 도서 전용 | 온라인 서점, 전자책 |
| **티머니** | `tmoney` | 교통카드 충전 | 대중교통, 편의점 |

---

## ⚡ 빠른 시작

### 1️⃣ 기본 상품권 결제

```html

// 틴캐시 상품권 결제 요청
SETTLE_PG.pay({
    env: "https://tbnpg.settlebank.co.kr",
    mchtId: "nx_mid_il",               // 상점 ID
    method: "teencash",                // 틴캐시 상품권
    trdDt: "20231215",                 // 거래일자
    trdTm: "143022",                   // 거래시간
    mchtTrdNo: "GIFT20231215143022",   // 주문번호
    mchtName: "테스트상점",
    mchtEName: "Test Shop",
    pmtPrdtNm: "게임 아이템",
    trdAmt: "10000",                   // 10,000원
    mchtCustNm: "홍길동",              // 결제자명
    notiUrl: "https://yoursite.com/gift/notify",
    nextUrl: "https://yoursite.com/gift/success",
    cancUrl: "https://yoursite.com/gift/cancel",
    pktHash: "생성된해시값",           // SHA256 해시
    ui: {
        type: "popup",
        width: "430",
        height: "660"
    }
}, function(response) {
    if (response.outStatCd === "0021") {
        // 결제 성공
        console.log("상품권 결제 성공:", response);
        alert(`결제 완료!\n거래번호: ${response.trdNo}\n승인시간: ${response.authDt}`);
    } else {
        // 결제 실패
        console.log("상품권 결제 실패:", response.outRsltMsg);
        alert("결제가 실패했습니다: " + response.outRsltMsg);
    }
});

```

### 2️⃣ 여러 상품권 브랜드 선택

```javascript
// 상품권 브랜드별 결제 함수
function payWithGiftCard(giftCardType, amount, productName) {
    const giftCardNames = {
        'teencash': '틴캐시',
        'happymoney': '해피머니', 
        'culturecash': '컬쳐캐시',
        'smartcash': '스마트문상',
        'booknlife': '도서상품권',
        'tmoney': '티머니'
    };

    SETTLE_PG.pay({
        env: "https://tbnpg.settlebank.co.kr",
        mchtId: "nx_mid_il",
        method: giftCardType,              // 동적 상품권 타입
        trdDt: getCurrentDate(),
        trdTm: getCurrentTime(),
        mchtTrdNo: generateOrderNo(),
        mchtName: "테스트상점",
        mchtEName: "Test Shop",
        pmtPrdtNm: productName,
        trdAmt: amount.toString(),
        mchtCustNm: "홍길동",
        notiUrl: "https://yoursite.com/gift/notify",
        nextUrl: "https://yoursite.com/gift/success",
        cancUrl: "https://yoursite.com/gift/cancel",
        pktHash: generateGiftCardHash({
            mchtId: "nx_mid_il",
            method: giftCardType,
            mchtTrdNo: generateOrderNo(),
            trdDt: getCurrentDate(),
            trdTm: getCurrentTime(),
            trdAmt: amount.toString()
        })
    }, function(response) {
        if (response.outStatCd === "0021") {
            alert(`${giftCardNames[giftCardType]} 결제 완료!`);
        } else {
            alert(`${giftCardNames[giftCardType]} 결제 실패: ${response.outRsltMsg}`);
        }
    });
}

// 사용 예시
payWithGiftCard('teencash', 10000, '게임 아이템');
payWithGiftCard('booknlife', 15000, '전자책');
payWithGiftCard('tmoney', 5000, '교통카드 충전');
```

---

## 🏗️ 구현 가이드

### 1️⃣ UI 상품권 결제

#### 📡 API 엔드포인트

| 환경 | URL |
|------|-----|
| **테스트** | `https://tbnpg.settlebank.co.kr/gift/main.do` |
| **운영** | `https://npg.settlebank.co.kr/gift/main.do` |

#### 📋 요청 파라미터

#### 🔐 해시 생성 예시

```javascript
const crypto = require('crypto');

function generateGiftCardHash(params, hashKey) {
    // 해시 생성을 위한 데이터 조합
    const hashData = 
        params.mchtId +         // 상점아이디
        params.method +         // 결제수단 (상품권 타입)
        params.mchtTrdNo +      // 상점주문번호
        params.trdDt +          // 요청일자
        params.trdTm +          // 요청시간
        params.trdAmt +         // 거래금액 (평문, 암호화 전)
        hashKey;                // 해시키 (헥토파이낸셜 제공)
    
    // SHA256 해시 생성
    return crypto.createHash('sha256').update(hashData, 'utf8').digest('hex');
}

// 사용 예시
const giftCardParams = {
    mchtId: "nx_mid_il",
    method: "teencash",
    mchtTrdNo: "GIFT20231215143022",
    trdDt: "20231215",
    trdTm: "143022",
    trdAmt: "10000"  // 암호화 전 원본 금액
};

const hashKey = "your-hash-key-from-hecto"; // 헥토파이낸셜에서 제공
const pktHash = generateGiftCardHash(giftCardParams, hashKey);
```

### 2️⃣ 응답 처리

#### 📨 결제 성공 응답

```javascript
{
    "outStatCd": "0021",               // 성공 코드
    "outRsltCd": "0000",               // 결과 코드
    "outRsltMsg": "정상처리",           // 결과 메시지
    "method": "teencash",              // 상품권 타입
    "mchtTrdNo": "GIFT20231215143022", // 상점주문번호
    "trdNo": "STFP_PGTCnx_mid_il0231215143022M1234567", // 헥토 거래번호
    "trdAmt": "10000",                 // 거래금액
    "authDt": "20231215143045"         // 승인일시
}
```

#### ❌ 결제 실패 응답

```javascript
{
    "outStatCd": "0031",               // 실패 코드
    "outRsltCd": "1009",               // 에러 코드
    "outRsltMsg": "상품권 잔액 부족",   // 에러 메시지
    "method": "teencash",
    "mchtTrdNo": "GIFT20231215143022"
}
```

### 3️⃣ 결제 완료 노티(NOTI) 처리

상품권 결제가 완료되면 `notiUrl`로 결과가 전송됩니다.

```javascript
// Node.js Express 예시
app.post('/payment/gift/notification', (req, res) => {
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
        pktHash
    } = req.body;
    
    // 1. 해시 검증
    const expectedHash = generateGiftCardNotiHash(req.body, hashKey);
    if (pktHash !== expectedHash) {
        console.error('해시 검증 실패');
        return res.status(400).send('FAIL');
    }
    
    // 2. 결제 성공 여부 확인
    if (outStatCd === '0021' && bizType === 'B0') {
        // 상품권 결제 성공
        await updateGiftCardPaymentStatus(mchtTrdNo, {
            status: 'completed',
            hectoTrdNo: trdNo,
            completedAt: trdDtm,
            giftCardType: getGiftCardTypeFromMethod(method),
            amount: trdAmt,
            customerName: mchtCustNm,
            productName: pmtprdNm
        });
        
        // 디지털 상품 자동 지급
        if (isDigitalProduct(mchtTrdNo)) {
            await deliverDigitalProduct(mchtTrdNo);
        }
        
        // 고객에게 결제 완료 알림 발송
        await sendGiftCardPaymentNotification(mchtTrdNo);
        
        // 성공 응답
        res.send('OK');
    } else if (bizType === 'C0') {
        // 취소 처리
        await updateGiftCardPaymentStatus(mchtTrdNo, {
            status: 'cancelled',
            cancelledAt: trdDtm
        });
        
        res.send('OK');
    } else {
        // 기타 상태 처리
        console.log('상품권 결제 상태:', outStatCd, req.body.outRsltMsg);
        res.send('OK');
    }
});

// 상품권 타입 매핑 함수
function getGiftCardTypeFromMethod(method) {
    const typeMap = {
        'TC': 'teencash',
        'HM': 'happymoney',
        'CG': 'culturecash',
        'SG': 'smartcash',
        'BG': 'booknlife',
        'TM': 'tmoney',
        'CP': 'pointdamoa'
    };
    return typeMap[method] || method;
}

// 노티 해시 생성 함수
function generateGiftCardNotiHash(notiData, hashKey) {
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

### 1️⃣ 상품권 결제 취소

상품권 결제 완료 후 취소하는 기능입니다.

#### 📡 취소 API 엔드포인트

| 환경 | URL |
|------|-----|
| **테스트** | `https://tbgw.settlebank.co.kr/spay/APICancel.do` |
| **운영** | `https://gw.settlebank.co.kr/spay/APICancel.do` |

#### 💻 취소 요청 예시

```javascript
const cancelGiftCardRequest = {
    params: {
        mchtId: "nx_mid_il",
        ver: "0A19",
        method: "CP",                    // 상품권 취소 코드 (공통)
        bizType: "C0",                   // 취소 구분
        encCd: "23",                     // 암호화 구분
        mchtTrdNo: "CANCEL20231215143022",
        trdDt: "20231215",
        trdTm: "143022"
    },
    data: {
        pktHash: "생성된해시값",
        orgTrdNo: "STFP_PGTCnx_mid_il0231215143022M1234567", // 원거래번호
        crcCd: "KRW",                    // 통화구분
        cnclOrd: "001",                  // 취소회차
        cnclAmt: "10000",                // 취소금액
        cnclRsn: "고객 요청"             // 취소사유
    }
};

// 서버로 전송
fetch('https://tbgw.settlebank.co.kr/spay/APICancel.do', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify(cancelGiftCardRequest)
})
.then(response => response.json())
.then(data => {
    console.log('취소 결과:', data);
    if (data.outStatCd === '0021') {
        alert('상품권 결제가 취소되었습니다.');
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
        method: "CP",
        bizType: "C0",
        encCd: "23",
        mchtTrdNo: "PARTIAL_CANCEL20231215143022",
        trdDt: "20231215",
        trdTm: "143022"
    },
    data: {
        pktHash: "생성된해시값",
        orgTrdNo: "STFP_PGTCnx_mid_il0231215143022M1234567",
        crcCd: "KRW",
        cnclOrd: "001",
        cnclAmt: "3000",                 // 부분취소 금액 (10,000원 중 3,000원)
        cnclRsn: "부분 환불 요청"
    }
};
```

### 3️⃣ 상품권 브랜드별 특화 기능

#### 티머니 컵 보증금 처리

```javascript
// 티머니 결제 시 컵 보증금 포함
function payWithTmoney(productAmount, cupDeposit = 300) {
    const totalAmount = productAmount + cupDeposit;
    
    SETTLE_PG.pay({
        // ... 기본 파라미터
        method: "tmoney",
        trdAmt: totalAmount.toString(),  // 상품금액 + 컵보증금
        taxFreeAmt: cupDeposit.toString(), // 컵보증금 (비과세)
        // ... 기타 파라미터
    }, function(response) {
        if (response.outStatCd === "0021") {
            console.log(`티머니 결제 완료 - 상품: ${productAmount}원, 보증금: ${cupDeposit}원`);
        }
    });
}
```

#### 컬쳐캐시 고객ID 필수 처리

```javascript
// 컬쳐캐시는 mchtCustId가 필수
function payWithCultureCash(customerId, amount, productName) {
    if (!customerId) {
        alert('컬쳐캐시 결제는 고객 ID가 필요합니다.');
        return;
    }

    SETTLE_PG.pay({
        // ... 기본 파라미터
        method: "culturecash",
        mchtCustId: customerId,          // 필수 항목
        trdAmt: amount.toString(),
        pmtPrdtNm: productName,
        // ... 기타 파라미터
    }, function(response) {
        if (response.outStatCd === "0021") {
            console.log('컬쳐캐시 결제 완료');
        }
    });
}
```

---

## 🧪 테스트 가이드

### 🔧 테스트 환경 설정

**테스트 상점 정보:**
- **상점ID**: `nx_mid_il`
- **환경**: `https://tbnpg.settlebank.co.kr`
- **특징**: 실제 상품권 차감 없이 승인 테스트 가능

### 🎁 테스트 상품권 정보

각 상품권별 테스트 정보:

| 상품권 | 테스트 번호 | PIN | 잔액 |
|--------|-------------|-----|------|
| **틴캐시** | `1234567890123456` | `1234` | 50,000원 |
| **해피머니** | `9876543210987654` | `5678` | 30,000원 |
| **컬쳐캐시** | `1111222233334444` | `0000` | 100,000원 |
| **스마트문상** | `5555666677778888` | `9999` | 20,000원 |
| **도서상품권** | `1234123412341234` | `5555` | 25,000원 |

### 🎯 테스트 시나리오

---

## ❌ 에러 처리

### 🚨 주요 에러 코드

| 코드 | 메시지 | 원인 | 해결방법 |
|------|--------|------|----------|
| `1009` | 결제 요청 정보 누락 | 필수 파라미터 누락 | 필수 파라미터 확인 |
| `1901` | 해쉬값 불일치 오류 | 해시 생성 오류 | 해시 생성 로직 점검 |
| `1902` | 암호화 항목 미처리 오류 | 암호화 필드 미처리 | AES 암호화 적용 |
| `GC01` | 상품권 번호 오류 | 잘못된 상품권 번호 | 정확한 상품권 번호 확인 |
| `GC02` | PIN 번호 오류 | 잘못된 PIN 번호 | PIN 번호 재확인 |
| `GC03` | 잔액 부족 | 상품권 잔액 부족 | 결제 금액 조정 또는 다른 상품권 사용 |
| `GC04` | 유효기간 만료 | 상품권 유효기간 초과 | 유효한 상품권 사용 |

### 🔧 에러 해결 가이드

      • 상품권 인식 실패: 상품권 번호 앞뒤 공백 제거
      • PIN 오류: 대소문자 구분 및 특수문자 확인
      • 잔액 부족: 사전 잔액 조회 API 활용
      • 컬쳐캐시 오류: mchtCustId 필수 입력 확인
    
  }
/>

---

## 💡 자주 묻는 질문

### Q. 상품권 잔액을 미리 확인할 수 있나요?
A. 결제 전 잔액 조회는 별도 API를 통해 가능합니다. 헥토파이낸셜에 문의하여 잔액 조회 API 연동을 요청하세요.

### Q. 여러 상품권을 조합해서 결제할 수 있나요?
A. 현재는 한 번에 하나의 상품권만 사용 가능합니다. 여러 상품권 조합 결제는 별도 개발이 필요합니다.

### Q. 상품권 결제 취소 기한이 있나요?
A. 일반적으로 결제 당일 취소가 가능하며, 익일 이후는 환불 처리됩니다. 상품권별로 정책이 다를 수 있습니다.

### Q. 티머니 컵 보증금은 어떻게 처리되나요?
A. 컵 보증금(300원)은 비과세 금액으로 처리되며, `taxFreeAmt` 파라미터에 별도 입력해야 합니다.

### Q. 모든 상품권이 실시간으로 처리되나요?
A. 네, 모든 지원 상품권은 실시간으로 잔액 확인 및 차감 처리됩니다.

---

## 🚀 다음 단계

---