# ⚡ 간편 결제

페이코, 카카오페이, 네이버페이, 삼성페이 등 다양한 간편결제 서비스를 통한 결제 솔루션입니다. 고객이 선호하는 간편결제 방식으로 빠르고 편리한 결제가 가능합니다.

## 📖 개요

### 🎯 주요 특징

### 🏢 지원 간편결제 서비스

| 서비스 | 코드 | 특징 | 주요 기능 |
|--------|------|------|-----------|
| **페이코(PAYCO)** | `PAC` | NHN 간편결제 서비스 | 포인트, 쿠폰, 카드 복합결제 |
| **카카오페이** | `KKP` | 카카오 간편결제 서비스 | 카카오머니, 카드결제 |
| **네이버페이** | `NVP` | 네이버 간편결제 서비스 | 포인트, 카드 결제, 현금영수증 |
| **삼성페이** | `SPY` | 삼성 간편결제 서비스 | NFC, MST 기술 활용 |

---

## ⚡ 빠른 시작

### 1️⃣ 페이코 간편결제

```html

// 페이코 간편결제 요청
SETTLE_PG.pay({
    env: "https://tbnpg.settlebank.co.kr",
    mchtId: "hecto_test",              // 페이코 테스트 상점 ID
    method: "corp",                    // 간편결제
    corpPayCode: "PAC",                // 페이코 코드
    trdDt: "20231215",                 // 거래일자
    trdTm: "143022",                   // 거래시간
    mchtTrdNo: "PAYCO20231215143022",  // 주문번호
    mchtName: "테스트상점",
    pmtPrdtNm: "테스트상품",
    trdAmt: "5000",                    // 5,000원
    taxTypeCd: "N",                    // 과세
    notiUrl: "https://yoursite.com/payco/notify",
    nextUrl: "https://yoursite.com/payco/success",
    cancUrl: "https://yoursite.com/payco/cancel",
    pktHash: "생성된해시값",           // SHA256 해시
    ui: {
        type: "popup",
        width: "430",
        height: "660"
    }
}, function(response) {
    if (response.outStatCd === "0021") {
        // 결제 성공
        console.log("페이코 결제 성공:", response);
        alert(`결제 완료!\n거래번호: ${response.trdNo}\n승인시간: ${response.authDt}`);
    } else if (response.outStatCd === "0061") {
        // 인증 성공 (하이브리드 방식)
        console.log("인증 성공, 승인 API 호출 필요:", response);
        // 별도 승인 API 호출
        callPaycoApprovalAPI(response.trdNo);
    } else {
        // 결제 실패
        console.log("페이코 결제 실패:", response.outRsltMsg);
        alert("결제가 실패했습니다: " + response.outRsltMsg);
    }
});

```

### 2️⃣ 다양한 간편결제 선택

```javascript
// 간편결제 브랜드별 결제 함수
function payWithSimplePayment(serviceType, amount, productName) {
    const simplePaymentConfig = {
        'payco': {
            corpPayCode: 'PAC',
            name: '페이코',
            mchtId: 'hecto_test'
        },
        'kakaopay': {
            corpPayCode: 'KKP', 
            name: '카카오페이',
            mchtId: 'hecto_test'
        },
        'naverpay': {
            corpPayCode: 'NVP',
            name: '네이버페이', 
            mchtId: 'hecto_test'
        }
    };

    const config = simplePaymentConfig[serviceType];
    if (!config) {
        alert('지원하지 않는 간편결제 서비스입니다.');
        return;
    }

    SETTLE_PG.pay({
        env: "https://tbnpg.settlebank.co.kr",
        mchtId: config.mchtId,
        method: "corp",
        corpPayCode: config.corpPayCode,
        trdDt: getCurrentDate(),
        trdTm: getCurrentTime(),
        mchtTrdNo: generateOrderNo(),
        mchtName: "테스트상점",
        pmtPrdtNm: productName,
        trdAmt: amount.toString(),
        taxTypeCd: "N",
        notiUrl: `https://yoursite.com/${serviceType}/notify`,
        nextUrl: `https://yoursite.com/${serviceType}/success`,
        cancUrl: `https://yoursite.com/${serviceType}/cancel`,
        pktHash: generateSimplePaymentHash({
            mchtId: config.mchtId,
            method: "corp",
            mchtTrdNo: generateOrderNo(),
            trdDt: getCurrentDate(),
            trdTm: getCurrentTime(),
            trdAmt: amount.toString()
        })
    }, function(response) {
        if (response.outStatCd === "0021") {
            alert(`${config.name} 결제 완료!`);
        } else {
            alert(`${config.name} 결제 실패: ${response.outRsltMsg}`);
        }
    });
}

// 사용 예시
payWithSimplePayment('payco', 5000, '테스트 상품');
payWithSimplePayment('kakaopay', 10000, '프리미엄 서비스');
payWithSimplePayment('naverpay', 15000, '멤버십 구독');
```

---

## 🏗️ 구현 가이드

### 1️⃣ 페이코 간편결제 (UI)

#### 📡 API 엔드포인트

| 환경 | URL |
|------|-----|
| **테스트** | `https://tbnpg.settlebank.co.kr/corp/main.do` |
| **운영** | `https://npg.settlebank.co.kr/corp/main.do` |

#### 📋 요청 파라미터

#### 🔐 해시 생성 예시

```javascript
const crypto = require('crypto');

function generateSimplePaymentHash(params, hashKey) {
    // 해시 생성을 위한 데이터 조합
    const hashData = 
        params.mchtId +         // 상점아이디
        params.method +         // 결제수단 (corp)
        params.mchtTrdNo +      // 상점주문번호
        params.trdDt +          // 요청일자
        params.trdTm +          // 요청시간
        params.trdAmt +         // 거래금액 (평문, 암호화 전)
        hashKey;                // 해시키 (헥토파이낸셜 제공)
    
    // SHA256 해시 생성
    return crypto.createHash('sha256').update(hashData, 'utf8').digest('hex');
}

// 사용 예시
const simplePaymentParams = {
    mchtId: "hecto_test",
    method: "corp",
    mchtTrdNo: "PAYCO20231215143022",
    trdDt: "20231215",
    trdTm: "143022",
    trdAmt: "5000"  // 암호화 전 원본 금액
};

const hashKey = "your-hash-key-from-hecto"; // 헥토파이낸셜에서 제공
const pktHash = generateSimplePaymentHash(simplePaymentParams, hashKey);
```

### 2️⃣ 응답 처리

#### 📨 결제 성공 응답

```javascript
{
    "outStatCd": "0021",               // 성공 코드
    "outRsltCd": "0000",               // 결과 코드
    "outRsltMsg": "정상처리",           // 결과 메시지
    "method": "corp",                  // 결제수단
    "mchtTrdNo": "PAYCO20231215143022", // 상점주문번호
    "trdNo": "STFP_PGCAnxca_jt_il0231215143022M1494620", // 헥토 거래번호
    "trdAmt": "5000",                  // 거래금액
    "authDt": "20231215143045"         // 승인일시
}
```

#### 🔐 하이브리드 인증 성공 응답

```javascript
{
    "outStatCd": "0061",               // 인증 성공 코드
    "outRsltCd": "0000",               // 결과 코드
    "outRsltMsg": "인증 성공",          // 결과 메시지
    "method": "corp",
    "mchtTrdNo": "PAYCO20231215143022",
    "trdNo": "STFP_PGCAnx_mid_hd0231215143022M1234567", // 인증 거래번호
    "trdAmt": "5000"
    // 별도 승인 API 호출 필요
}
```

#### ❌ 결제 실패 응답

```javascript
{
    "outStatCd": "0031",               // 실패 코드
    "outRsltCd": "1009",               // 에러 코드
    "outRsltMsg": "결제 요청 정보 누락 (상품명)", // 에러 메시지
    "method": "corp",
    "mchtTrdNo": "PAYCO20231215143022"
}
```

### 3️⃣ 결제 완료 노티(NOTI) 처리

간편결제가 완료되면 `notiUrl`로 결과가 전송됩니다.

```javascript
// Node.js Express 예시
app.post('/payment/simple/notification', (req, res) => {
    const {
        outStatCd,
        trdNo,
        method,
        bizType,
        mchtTrdNo,
        trdAmt,
        trdDtm,
        ezpDivCd,      // 간편결제사 구분코드
        cardCd,        // 카드사코드
        cardNm,        // 카드명
        pntAmt,        // 포인트 금액
        cardAmt,       // 신용카드 금액
        coupAmt,       // 쿠폰 금액
        kkmAmt,        // 카카오머니 금액
        csrcIssAmt,    // 현금영수증 발행대상금액
        csrcIssNo,     // 현금영수증 승인번호
        pktHash
    } = req.body;
    
    // 1. 해시 검증
    const expectedHash = generateSimplePaymentNotiHash(req.body, hashKey);
    if (pktHash !== expectedHash) {
        console.error('해시 검증 실패');
        return res.status(400).send('FAIL');
    }
    
    // 2. 결제 성공 여부 확인
    if (outStatCd === '0021') {
        if (bizType === 'B0') {
            // 일반 승인 (페이코, 카카오페이)
            await updateSimplePaymentStatus(mchtTrdNo, {
                status: 'completed',
                hectoTrdNo: trdNo,
                completedAt: trdDtm,
                serviceProvider: getServiceProviderName(ezpDivCd),
                paymentDetails: {
                    pointAmount: pntAmt,
                    cardAmount: cardAmt,
                    couponAmount: coupAmt,
                    kakaoMoneyAmount: kkmAmt,
                    cardInfo: cardCd ? { code: cardCd, name: cardNm } : null,
                    cashReceiptAmount: csrcIssAmt,
                    cashReceiptNumber: csrcIssNo
                }
            });
        } else if (bizType === 'B1') {
            // 네이버페이 신용카드 결제
            await updateSimplePaymentStatus(mchtTrdNo, {
                status: 'completed',
                hectoTrdNo: trdNo,
                completedAt: trdDtm,
                serviceProvider: 'NaverPay',
                paymentMethod: 'card',
                cardInfo: { code: cardCd, name: cardNm }
            });
        }
        
        // 고객에게 결제 완료 알림 발송
        await sendSimplePaymentNotification(mchtTrdNo);
        
        // 성공 응답
        res.send('OK');
    } else if (bizType === 'C0') {
        // 취소 처리
        await updateSimplePaymentStatus(mchtTrdNo, {
            status: 'cancelled',
            cancelledAt: trdDtm
        });
        
        res.send('OK');
    } else {
        // 기타 상태 처리
        console.log('간편결제 상태:', outStatCd, req.body.outRsltMsg);
        res.send('OK');
    }
});

// 간편결제사 구분코드 매핑
function getServiceProviderName(ezpDivCd) {
    const providerMap = {
        'PAC': 'PAYCO',
        'KKP': 'KakaoPay',
        'NVP': 'NaverPay',
        'SPY': 'SamsungPay'
    };
    return providerMap[ezpDivCd] || ezpDivCd;
}

// 간편결제 노티 해시 생성 함수
function generateSimplePaymentNotiHash(notiData, hashKey) {
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

페이코의 경우 인증과 승인을 분리한 하이브리드 방식을 지원합니다.

#### 📡 승인 API 엔드포인트

| 환경 | URL |
|------|-----|
| **테스트** | `https://tbgw.settlebank.co.kr/spay/APITrdPayco.do` |
| **운영** | `https://gw.settlebank.co.kr/spay/APITrdPayco.do` |

#### 💻 승인 API 호출

```javascript
// 페이코 하이브리드 승인 API
async function callPaycoApprovalAPI(authTrdNo, amount) {
    const approvalRequest = {
        params: {
            mchtId: "nx_mid_hd",
            ver: "0A19",
            method: "PZ",
            bizType: "B2",
            encCd: "23",
            mchtTrdNo: "APPROVAL20231215143022",
            trdDt: "20231215",
            trdTm: "143022"
        },
        data: {
            pktHash: "생성된해시값",
            authTrdNo: authTrdNo,        // 인증 거래번호
            trdAmt: amount
        }
    };

    try {
        const response = await fetch('https://tbgw.settlebank.co.kr/spay/APITrdPayco.do', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify(approvalRequest)
        });
        
        const result = await response.json();
        
        if (result.outStatCd === '0021') {
            console.log('페이코 승인 성공:', result);
            return result;
        } else {
            console.error('페이코 승인 실패:', result.outRsltMsg);
            throw new Error(result.outRsltMsg);
        }
    } catch (error) {
        console.error('페이코 승인 API 호출 실패:', error);
        throw error;
    }
}
```

### 2️⃣ 간편결제 취소

각 간편결제 서비스별 취소 API입니다.

#### 💻 페이코 취소 요청

```javascript
const cancelPaycoRequest = {
    params: {
        mchtId: "hecto_test",
        ver: "0A19",
        method: "PZ",
        bizType: "C0",
        encCd: "23",
        mchtTrdNo: "CANCEL20231215143022",
        trdDt: "20231215",
        trdTm: "143022"
    },
    data: {
        pktHash: "생성된해시값",
        orgTrdNo: "STFP_PGCAnxca_jt_il0231215143022M1494620", // 원거래번호
        crcCd: "KRW",
        cnclOrd: "001",
        taxTypeCd: "N",
        cnclAmt: "5000",                 // 취소금액
        cnclRsn: "고객 요청"             // 취소사유
    }
};
```

#### 💻 네이버페이 취소 요청

```javascript
const cancelNaverPayRequest = {
    params: {
        mchtId: "hecto_test",
        ver: "0A19",
        method: "PZ",
        bizType: "C0",
        encCd: "23",
        mchtTrdNo: "CANCEL20231215143022",
        trdDt: "20231215",
        trdTm: "143022"
    },
    data: {
        pktHash: "생성된해시값",
        orgTrdNo: "원거래번호",
        crcCd: "KRW",
        cnclOrd: "001",
        taxTypeCd: "N",
        cnclAmt: "5000",
        taxAmt: "4545",                  // 과세금액
        vatAmt: "455",                   // 부가세금액
        taxFreeAmt: "0",                 // 비과세금액
        svcAmt: "0",                     // 봉사료
        cnclRsn: "고객 요청"
    }
};
```

### 3️⃣ 복합결제 처리

간편결제에서는 포인트, 쿠폰, 카드 등을 조합한 복합결제가 가능합니다.

```javascript
// 복합결제 결과 처리
function handleComplexPayment(notiData) {
    const paymentBreakdown = {
        totalAmount: parseInt(notiData.trdAmt),
        pointAmount: parseInt(notiData.pntAmt || 0),
        cardAmount: parseInt(notiData.cardAmt || 0),
        couponAmount: parseInt(notiData.coupAmt || 0),
        kakaoMoneyAmount: parseInt(notiData.kkmAmt || 0)
    };
    
    console.log('복합결제 내역:', paymentBreakdown);
    
    // 각 결제 수단별 처리
    if (paymentBreakdown.pointAmount > 0) {
        console.log(`포인트 사용: ${paymentBreakdown.pointAmount}원`);
        // 포인트 사용 내역 기록
    }
    
    if (paymentBreakdown.couponAmount > 0) {
        console.log(`쿠폰 사용: ${paymentBreakdown.couponAmount}원`);
        // 쿠폰 사용 내역 기록
    }
    
    if (paymentBreakdown.cardAmount > 0) {
        console.log(`카드 결제: ${paymentBreakdown.cardAmount}원`);
        // 카드 결제 내역 기록
    }
    
    // 현금영수증 발행 확인
    if (notiData.csrcIssAmt && notiData.csrcIssNo) {
        console.log(`현금영수증 발행: ${notiData.csrcIssAmt}원, 승인번호: ${notiData.csrcIssNo}`);
    }
    
    return paymentBreakdown;
}
```

---

## 🧪 테스트 가이드

### 🔧 테스트 환경 설정

**테스트 상점 정보:**
- **페이코**: `hecto_test`
- **카카오페이**: `hecto_test`
- **네이버페이**: `hecto_test`
- **환경**: `https://tbnpg.settlebank.co.kr`

### 💳 페이코 테스트 카드 정보

원본 문서에 명시된 페이코 개발계 테스트 카드:

| 카드사 | 카드번호 | 유효기간(MM/YY) | CVC | 비밀번호 |
|--------|----------|-----------------|-----|----------|
| **하나카드** | 9440-81**-****-**** | 12/25 | *** | **** |
| | 4570-47**-****-**** | | | |
| **신한카드** | 5107-3767-1104-**** | | | |
| | 9410-84**-****-**** | | | |
| **비씨카드** | 4906-****-****-**** | | | |
| | 5377-03**-****-**** | | | |
| **현대카드** | 9490-1907-****-**** | | | |
| | 3646-83**-****-**** | | | |
| **우리(BC)카드** | 6253-20**-****-**** | | | |
| | 9420-22**-****-**** | | | |
| **국민카드** | 4673-09**-****-**** | | | |
| | 4579-92**-****-**** | | | |
| **농협카드** | 4988-19**-****-**** | | | |
| **신한카드** | 9710-10**-****-**** | | | |
| **우리독자카드** | 4693-69**-****-**** | | | |

> **＊ 표시는 임의의 값을 넣어주시면 됩니다.**

### 📱 페이코 개발 앱 설치

페이코 테스트를 위해서는 개발용 앱 설치가 필요합니다:

1. **다운로드**: https://devcenter.payco.com/support/app?id=220401041
2. **iOS 설정**: 설정 > 일반 > 기기관리 > 'NHN'을(를) 신뢰함 선택
3. **기존 앱 삭제**: 리얼 PAYCO 앱이 설치되어 있으면 삭제 후 설치

### 🎯 테스트 시나리오

---

## ❌ 에러 처리

### 🚨 주요 에러 코드

| 코드 | 메시지 | 원인 | 해결방법 |
|------|--------|------|----------|
| `1009` | 결제 요청 정보 누락 (상품명) | 필수 파라미터 누락 | 필수 파라미터 확인 |
| `1901` | 해쉬값 불일치 오류 | 해시 생성 오류 | 해시 생성 로직 점검 |
| `1902` | 암호화 항목 미처리 오류 | 암호화 필드 미처리 | AES 암호화 적용 |
| `SP01` | 간편결제 앱 미설치 | 앱이 설치되지 않음 | 앱 설치 안내 |
| `SP02` | 간편결제 인증 실패 | 사용자 인증 실패 | 재인증 요청 |
| `SP03` | 결제 한도 초과 | 일일/월간 한도 초과 | 한도 확인 안내 |

### 🔧 에러 해결 가이드

      💡

      일반적인 문제 해결
      
        • 앱 설치 오류: 개발용 앱 다운로드 및 신뢰 설정
        • 인증 실패: 간편결제 서비스 로그인 상태 확인
        • 하이브리드 오류: 인증 거래번호 정확성 확인
        • 복합결제 오류: 포인트, 쿠폰 잔액 확인

---

## 💡 자주 묻는 질문

### Q. 간편결제별로 다른 상점ID가 필요한가요?
A. 기본적으로 동일한 상점ID를 사용하지만, 서비스별로 별도 계약이 필요할 수 있습니다. 헥토파이낸셜에 문의하세요.

### Q. 하이브리드 방식의 장점은 무엇인가요?
A. 인증과 승인을 분리하여 재고 확인, 쿠폰 적용 등의 추가 로직을 인증 후 승인 전에 처리할 수 있습니다.

### Q. 복합결제는 어떻게 처리되나요?
A. 노티에서 포인트, 쿠폰, 카드 등 각 결제 수단별 금액이 개별적으로 전달되므로 이를 분석하여 처리합니다.

### Q. 간편결제 취소 정책은 어떻게 되나요?
A. 각 간편결제 서비스별로 취소 정책이 다르며, 당일 취소와 익일 환불로 구분됩니다.

### Q. 현금영수증은 자동으로 발행되나요?
A. 네이버페이의 경우 자동으로 현금영수증이 발행되며, 발행 금액과 승인번호가 노티로 전달됩니다.

---

## 🚀 다음 단계

간편결제 연동을 완료했다면, 다른 결제 수단도 확인해보세요:

        💳
      
      신용카드

        📱
      
      휴대폰

        💰
      
      가상계좌

        🎁
      
      상품권