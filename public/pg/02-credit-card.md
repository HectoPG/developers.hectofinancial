# 💳 신용카드 결제

가장 널리 사용되는 결제 수단인 신용카드 결제 서비스입니다. 국내외 주요 카드사를 지원하며, 안전하고 빠른 결제를 제공합니다.

## 📖 개요

### 🎯 주요 특징

### 💳 지원 카드사

| 카드사 | 코드 | 특징 |
|--------|------|------|
| **국민카드** | `KBC` | 앱카드, 간편결제 지원 |
| **신한카드** | `SHN` | 앱카드, 간편결제 지원 |
| **삼성카드** | `SSC` | 앱카드, 삼성페이 연동 |
| **현대카드** | `HDC` | PayShot, 앱카드 지원 |
| **하나카드** | `HNC` | 외환카드 통합 |
| **우리카드** | `WRI` | 광범위한 가맹점 네트워크 |
| **롯데카드** | `LTC` | 포인트 적립 서비스 |
| **BC카드** | `BCC` | 다양한 제휴 카드 |
| **NH농협** | `NHC` | 체크카드 포함 |

---

## ⚡ 빠른 시작

### 1️⃣ 기본 결제창 연동

```html

// 신용카드 결제 요청
SETTLE_PG.pay({
    env: "https://tbnpg.settlebank.co.kr",
    mchtId: "nxca_jt_il",           // 상점 ID (인증)
    method: "card",                 // 신용카드 결제
    trdDt: "20231215",              // 거래일자
    trdTm: "143022",                // 거래시간
    mchtTrdNo: "CARD20231215143022", // 주문번호
    mchtName: "테스트상점",
    mchtEName: "Test Shop",
    pmtPrdtNm: "테스트상품",
    trdAmt: "10000",                // 10,000원
    notiUrl: "https://yoursite.com/card/notify",
    nextUrl: "https://yoursite.com/card/success",
    cancUrl: "https://yoursite.com/card/cancel",
    pktHash: "생성된해시값",        // SHA256 해시
    ui: {
        type: "popup",
        width: "430",
        height: "660"
    }
}, function(response) {
    if (response.outStatCd === "0021") {
        // 결제 성공
        console.log("결제 성공:", response);
        location.href = response.nextUrl;
    } else {
        // 결제 실패
        console.log("결제 실패:", response.outRsltMsg);
        alert("결제가 실패했습니다: " + response.outRsltMsg);
    }
});

```

### 2️⃣ 테스트 정보

**테스트 환경에서 사용 가능한 카드 번호:**

| 카드사 | 카드번호 | 유효기간 | CVC |
|--------|----------|----------|-----|
| **신한카드** | `4000-0000-0000-0002` | `12/25` | `123` |
| **국민카드** | `4000-0000-0000-0010` | `12/25` | `123` |
| **삼성카드** | `4000-0000-0000-0028` | `12/25` | `123` |

---

## 🏗️ 구현 가이드

### 1️⃣ UI 결제창 연동

#### 📡 API 엔드포인트

| 환경 | URL |
|------|-----|
| **테스트** | `https://tbnpg.settlebank.co.kr/card/main.do` |
| **운영** | `https://npg.settlebank.co.kr/card/main.do` |

#### 📋 요청 파라미터

#### 🔐 해시 생성 예시

```javascript
const crypto = require('crypto');

function generateCardPaymentHash(params, hashKey) {
    // 해시 생성을 위한 데이터 조합
    const hashData = 
        params.mchtId +         // 상점아이디
        params.method +         // 결제수단 (card)
        params.mchtTrdNo +      // 상점주문번호
        params.trdDt +          // 요청일자
        params.trdTm +          // 요청시간
        params.trdAmt +         // 거래금액 (평문, 암호화 전)
        hashKey;                // 해시키 (헥토파이낸셜 제공)
    
    // SHA256 해시 생성
    return crypto.createHash('sha256').update(hashData, 'utf8').digest('hex');
}

// 사용 예시
const paymentParams = {
    mchtId: "nxca_jt_il",
    method: "card",
    mchtTrdNo: "CARD20231215143022",
    trdDt: "20231215",
    trdTm: "143022",
    trdAmt: "10000"  // 암호화 전 원본 금액
};

const hashKey = "your-hash-key-from-hecto"; // 헥토파이낸셜에서 제공
const pktHash = generateCardPaymentHash(paymentParams, hashKey);
```

### 2️⃣ 응답 처리

#### 📨 성공 응답 예시

```javascript
{
    "outStatCd": "0021",           // 성공 코드
    "outRsltCd": "0000",           // 결과 코드
    "outRsltMsg": "정상처리",       // 결과 메시지
    "method": "card",              // 결제수단
    "mchtTrdNo": "CARD20231215143022", // 상점주문번호
    "trdNo": "STFP_PGCAnxca_jt_il0231215143022M1234567", // 헥토 거래번호
    "trdAmt": "10000",             // 거래금액
    "authDt": "20231215143045",    // 승인일시
    "authNo": "12345678",          // 승인번호
    "intMon": "00",                // 할부개월 (00: 일시불)
    "fnNm": "신한카드",             // 카드사명
    "fnCd": "SHN",                 // 카드사코드
    "cardNo": "1234-56**-****-7890", // 마스킹된 카드번호
    "billKey": "SBILL_1234567890"  // 빌키 (정기결제용)
}
```

#### ❌ 실패 응답 예시

```javascript
{
    "outStatCd": "0031",           // 실패 코드
    "outRsltCd": "1009",           // 에러 코드
    "outRsltMsg": "결제 요청 정보 누락 (거래금액)", // 에러 메시지
    "method": "card",
    "mchtTrdNo": "CARD20231215143022"
}
```

### 3️⃣ 노티(NOTI) 처리

결제가 완료되면 `notiUrl`로 결과가 전송됩니다.

```javascript
// Node.js Express 예시
app.post('/payment/card/notification', (req, res) => {
    const {
        outStatCd,
        trdNo,
        method,
        mchtTrdNo,
        trdAmt,
        authNo,
        fnNm,
        pktHash
    } = req.body;
    
    // 1. 해시 검증
    const expectedHash = generateNotificationHash(req.body, hashKey);
    if (pktHash !== expectedHash) {
        console.error('해시 검증 실패');
        return res.status(400).send('FAIL');
    }
    
    // 2. 결제 성공 여부 확인
    if (outStatCd === '0021') {
        // 결제 성공 - DB 업데이트
        await updatePaymentStatus(mchtTrdNo, {
            status: 'completed',
            hectoTrdNo: trdNo,
            authNo: authNo,
            cardCompany: fnNm,
            amount: trdAmt
        });
        
        // 성공 응답
        res.send('OK');
    } else {
        // 결제 실패 처리
        await updatePaymentStatus(mchtTrdNo, {
            status: 'failed',
            errorMessage: req.body.outRsltMsg
        });
        
        res.send('OK');
    }
});
```

---

## 🔄 고급 기능

### 1️⃣ 정기결제 (빌키)

빌키를 이용한 정기결제 구현 방법입니다.

#### 📋 빌키 발급 요청

```javascript
// 첫 결제 시 빌키 발급 요청
SETTLE_PG.pay({
    // ... 기본 파라미터
    billKeyYn: "Y",        // 빌키 발급 요청
    // ... 나머지 파라미터
});
```

#### 🔄 빌키로 결제

```javascript
// 빌키를 이용한 정기결제 API 호출
const billingPayment = {
    params: {
        mchtId: "nxca_jt_il",
        ver: "0A19",
        mchtTrdNo: "BILLING20231215143022",
        trdDt: "20231215",
        trdTm: "143022"
    },
    data: {
        method: "CA",
        trdAmt: "10000",
        billKey: "SBILL_1234567890", // 이전에 발급받은 빌키
        pmtPrdtNm: "정기결제 상품",
        pktHash: "생성된해시값"
    }
};
```

### 2️⃣ 부분취소

결제 금액의 일부만 취소하는 기능입니다.

```javascript
const partialCancel = {
    params: {
        mchtId: "nxca_jt_il",
        ver: "0A19",
        mchtTrdNo: "CANCEL20231215143022",
        trdDt: "20231215",
        trdTm: "143022"
    },
    data: {
        method: "CA",
        orgTrdNo: "STFP_PGCAnxca_jt_il0231215143022M1234567", // 원거래번호
        orgTrdDt: "20231215",    // 원거래일자
        cnclAmt: "3000",         // 취소금액 (부분취소)
        cnclRsn: "고객 요청",     // 취소사유
        pktHash: "생성된해시값"
    }
};
```

### 3️⃣ WebView 연동 (모바일 앱)

모바일 앱에서 WebView를 통한 결제 연동 방법입니다.

#### Android 설정

```java
// WebView 설정
WebView webView = findViewById(R.id.webview);
WebSettings webSettings = webView.getSettings();
webSettings.setJavaScriptEnabled(true);
webSettings.setDomStorageEnabled(true);

// 결제 완료 후 앱으로 복귀
webView.setWebViewClient(new WebViewClient() {
    @Override
    public boolean shouldOverrideUrlLoading(WebView view, String url) {
        if (url.startsWith("myapp://")) {
            // 앱 스키마 처리
            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
            startActivity(intent);
            return true;
        }
        return false;
    }
});
```

#### iOS 설정

```swift
// WKWebView 설정

class PaymentViewController: UIViewController, WKNavigationDelegate {
    @IBOutlet weak var webView: WKWebView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        webView.navigationDelegate = self
        
        // 결제 페이지 로드
        if let url = URL(string: paymentUrl) {
            webView.load(URLRequest(url: url))
        }
    }
    
    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        
        if let url = navigationAction.request.url?.absoluteString {
            if url.hasPrefix("myapp://") {
                // 앱 스키마 처리
                decisionHandler(.cancel)
                return
            }
        }
        decisionHandler(.allow)
    }
}
```

---

## 🧪 테스트 가이드

### 🔧 테스트 환경 설정

**테스트 상점 정보:**
- **상점ID**: `nxca_jt_il` (인증), `nxca_jt_bi` (비인증)
- **환경**: `https://tbnpg.settlebank.co.kr`
- **특징**: 실제 결제 없이 승인 테스트 가능

### 💳 테스트 카드 정보

| 카드사 | 카드번호 | 유효기간 | CVC | 비밀번호 |
|--------|----------|----------|-----|----------|
| **신한카드** | `4000-0000-0000-0002` | `12/25` | `123` | `00` |
| **국민카드** | `4000-0000-0000-0010` | `12/25` | `123` | `00` |
| **삼성카드** | `4000-0000-0000-0028` | `12/25` | `123` | `00` |
| **현대카드** | `4000-0000-0000-0036` | `12/25` | `123` | `00` |
| **하나카드** | `4000-0000-0000-0044` | `12/25` | `123` | `00` |

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

### 🔧 에러 해결 가이드

      • 해시 오류: 파라미터 순서와 인코딩 확인
      • 암호화 오류: AES-128-ECB 방식과 키 확인
      • 중복 주문번호: 타임스탬프나 UUID 활용
      • 금액 오류: 숫자 형태와 암호화 여부 확인
    
  }
/>

---

## 💡 자주 묻는 질문

### Q. 해외 카드도 결제 가능한가요?
A. 네, 외화 결제 전용 상점ID(`nxca_ab_bi`, `nxca_ab_il`)를 사용하면 해외 카드 결제가 가능합니다.

### Q. 빌키의 유효기간은 얼마나 되나요?
A. 빌키는 카드 유효기간과 동일하며, 카드가 재발급되면 새로운 빌키를 발급받아야 합니다.

### Q. 할부 수수료는 누가 부담하나요?
A. 일반적으로 고객이 부담하지만, 가맹점이 무이자 할부로 제공할 수도 있습니다.

### Q. 부분취소는 몇 번까지 가능한가요?
A. 원거래 금액 범위 내에서 여러 번 부분취소가 가능합니다.

---

## 🚀 다음 단계

---