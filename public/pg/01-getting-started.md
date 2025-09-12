# 시작하기

헥토파이낸셜 전자결제(PG) 서비스에 오신 것을 환영합니다! 이 가이드를 통해 빠르고 안전하게 결제 서비스를 연동할 수 있습니다.

## 개요

### 헥토파이낸셜 PG 서비스란?

헥토파이낸셜 전자결제(PG) 서비스는 **신용카드, 실시간 계좌이체, 가상계좌, 휴대폰 결제, 상품권 결제** 등 다양한 온라인 결제수단을 지원하는 통합 결제 서비스입니다.

### 주요 특징

### 이 문서의 대상

이 문서는 **헥토파이낸셜 전자결제(PG) 시스템을 통해 결제를 연동하려는 개발자**를 대상으로 합니다.

### 문서 사용법

> **팁**: 본 문서를 완독할 필요는 없습니다! 결제 수단별로 나누어져 있으니 필요한 부분만 참고하세요.

**문서 표기법:**
- 🟢 **필수** 파라미터: 반드시 포함해야 하는 필드
- 🟡 **선택** 파라미터: 필요에 따라 포함하는 필드
- **데이터 타입**: 한글, 영문, 숫자 String 테이터 타입
- **길이**: UTF-8 인코딩 기준 바이트 수

---

## 환경

### 테스트베드 서버 정보

테스트 및 개발을 위한 환경 정보입니다:

### 운영 환경 서버 정보

운영을 위한 환경 정보입니다:

### 테스트용 인증 정보

**주의: 다음 정보는 테스트 전용입니다. 운영 환경에서는 절대 사용하지 마세요!**

## 표준 결제창(UI) 연동

가장 일반적인 연동 방식으로, 헥토파이낸셜에서 제공하는 결제창을 사용하는 방법입니다.

### 빠른 시작 (5분 연동)

```js

// 2. 결제 요청
SETTLE_PG.pay({
    env: "https://tbnpg.settlebank.co.kr", // 테스트 환경
    mchtId: "nxca_jt_il",                   // 상점 ID
    method: "card",                         // 결제수단
    trdDt: "20231215",                      // 거래일자
    trdTm: "143022",                        // 거래시간
    mchtTrdNo: "ORDER20231215143022",       // 주문번호
    mchtName: "테스트상점",
    pmtPrdtNm: "테스트상품",
    trdAmt: "1000",                         // 결제금액
    notiUrl: "https://yoursite.com/notify", // 결과통보 URL
    nextUrl: "https://yoursite.com/success",// 성공페이지 URL
    cancUrl: "https://yoursite.com/cancel", // 취소페이지 URL
    pktHash: "생성된해시값",                 // 보안 해시
    ui: {
        type: "popup",
        width: "430",
        height: "660"
    }
}, function(response) {
    // 3. 결제 결과 처리
    console.log(response);
});

```

### 연동 프로세스

      1
      결제 요청
      가맹점→PG

      2
      결제창 표시
      PG→고객

      3
      정보 입력
      고객 결제

      4
      승인 처리
      카드사 승인

      5
      결과 통보
      PG→가맹점

### 중요 주의사항

      ⚠️

      필수 확인 사항
      
        • 운영환경 테스트 시 비용 발생 - 테스트는 반드시 테스트베드에서 진행
        • HTTPS 필수 - HTTP 사용시 브라우저 정책으로 인해 오작동 가능
        • iframe 사용 금지 - 일부 브라우저에서 정상 작동하지 않음
        • IE 브라우저 지원 종료 (2022.06.15부터) - Edge 브라우저 사용 권장

### URL 파라미터 이해하기

**핵심 URL 3종세트:**

    🔔 notiUrl
    Server-to-Server 결과 통보
    💡 실제 DB 처리는 여기서!

    ✅ nextUrl
    결제 완료 후 고객 화면
    💡 화면 표시용으로만 사용

    ❌ cancUrl
    결제 취소 시 이동 화면
    💡 고객이 강제 종료시

---

## API 서버 연동 (Non-UI)

결제창 없이 서버에서 직접 결제를 처리하는 방식입니다.

### API 특징

- **Server-to-Server** 통신
- **JSON** 기반 데이터 교환
- **실시간** 결제 처리
- **높은 보안성**

### 요청/응답 헤더

```http
Content-type: application/json; charset=UTF-8
```

### API 연동 예시

```javascript
// API 요청 예시
const paymentRequest = {
    params: {
        mchtId: "nx_mid_il",
        ver: "0A19",
        mchtTrdNo: "ORDER20231215143022",
        trdDt: "20231215",
        trdTm: "143022"
    },
    data: {
        pktHash: "생성된해시값",
        method: "CA",
        trdAmt: "1000",
        pmtPrdtNm: "테스트상품",
        mchtCustNm: "홍길동",
        notiUrl: "https://yoursite.com/notify"
    }
};

// 서버로 전송
fetch('https://tbgw.settlebank.co.kr/spay/APICard.do', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify(paymentRequest)
})
.then(response => response.json())
.then(data => {
    console.log('결제 결과:', data);
});
```

---

### 노티(Notification) 서버

결제 결과를 실시간으로 통보받기 위한 서버 설정이 필요합니다.

      💡

      노티 서버 주의사항
      
        notiUrl로 전송되는 결과 데이터는 반드시 해시 검증을 거쳐야 합니다. 
        검증이 완료된 후에만 실제 서비스를 제공하세요.

---

**중요 사항:**
- 운영 환경 이행 시 **헥토파이낸셜에서 별도 제공하는 고유 키**를 사용해야 합니다
- 테스트용 키를 운영 환경에 사용하면 **보안 문제**가 발생할 수 있습니다

---

## 중요 정보 보안

### 개인정보 암복호화

#### AES 암호화 방식

**알고리즘**: AES-256/ECB/PKCS5Padding + **Base64 인코딩**

```javascript
// AES-256-ECB 암호화 예시 (Base64 인코딩)
const CryptoJS = require('crypto-js');

function encryptAES(plainText, secretKey) {
    const key = CryptoJS.enc.Utf8.parse(secretKey);
    const encrypted = CryptoJS.AES.encrypt(plainText, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs5
    });
    return encrypted.toString(); // Base64 인코딩된 결과 반환
}

// 사용 예시
const encryptedAmount = encryptAES("1000", "pgSettle30y739r82jtd709yOfZ2yK5K");
// 결과: "AntV/eDpxIaKF0hJiePDKA==" (Base64 인코딩)
```

### 해시 검증 알고리즘

**알고리즘**: SHA-256 + **Hex 인코딩 (소문자)**

```javascript
const crypto = require('crypto');

function generateHash(data) {
    return crypto.createHash('sha256').update(data, 'utf8').digest('hex');
}

// 해시 생성 예시 (신용카드 결제)
const hashData = mchtId + method + mchtTrdNo + trdDt + trdTm + trdAmt + hashKey;
const pktHash = generateHash(hashData);
// 결과: "f395b6725a9a18f2563ce34f8bc76698051d27c05e5ba815f463f00429061c0c" (Hex 소문자)
```

### 개인정보 암호키

암호화에 사용되는 키는 **헥토파이낸셜에서 별도 제공**합니다.
- 키 관리는 **보안이 생명처럼 중요**합니다
- 소스코드에 하드코딩하지 마세요
- 환경변수나 보안 저장소를 이용하세요

### 해시 인증키

위변조 방지를 위한 해시 인증키도 **헥토파이낸셜에서 별도 제공**합니다.

---

## 다음 단계

### 추가 리소스

- [📚 인터랙티브 API 문서](/api-docs) - 모든 API를 한눈에 보고 테스트해보세요
- [샘플 코드 다운로드](https://develop.sbsvc.online/21/bbsList.do?tx=R&articleSeq=149)
- [자주 묻는 질문](https://develop.sbsvc.online/3/bbsList.do)
- [고객센터 문의](mailto:support@hectofinancial.com)