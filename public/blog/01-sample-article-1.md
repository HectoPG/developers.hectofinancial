---
title: "헥토파이낸셜 PG 서비스 시작하기"
description: "헥토파이낸셜 전자결제(PG) 서비스 연동을 위한 첫 번째 단계를 알아보세요."
date: "2024-12-05"
readTime: "5분"
category: "가이드"
featured: true
tags: ["PG", "시작하기", "가이드"]
icon: "BookOpen"
thumbnail: "/images/blog/pg-thumbnail.jpg"
---

# 헥토파이낸셜 PG 서비스 시작하기

![헥토파이낸셜 PG 서비스 개요](/images/blog/sample-stamp.jpg)

헥토파이낸셜 전자결제(PG) 서비스에 오신 것을 환영합니다! 이 가이드를 통해 빠르고 안전하게 결제 서비스를 연동할 수 있습니다.

## 헥토파이낸셜 PG 서비스란?

헥토파이낸셜 전자결제(PG) 서비스는 **신용카드, 실시간 계좌이체, 가상계좌, 휴대폰 결제, 상품권 결제** 등 다양한 온라인 결제수단을 지원하는 통합 결제 서비스입니다.

## 주요 특징

### 💳 다양한 결제수단
신용카드부터 간편결제까지 모든 주요 결제수단을 하나의 API로 지원합니다.

![결제수단 다이어그램](/images/blog/sample-stamp.jpg)

### 🔒 강력한 보안

#### JavaScript 연동 예제

```javascript filename="payment-request.js"
// 헥토파이낸셜 PG 연동 예제
const paymentData = {
  amount: 10000,
  orderId: 'ORDER_' + Date.now(),
  customerName: '홍길동',
  customerEmail: 'customer@example.com'
};

// 결제 요청
fetch('/api/payment/request', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + apiKey
  },
  body: JSON.stringify(paymentData)
})
.then(response => response.json())
.then(data => {
  console.log('결제 요청 성공:', data);
  // 결제 페이지로 리다이렉트
  window.location.href = data.paymentUrl;
});
```

#### Python 연동 예제

```python filename="hecto_payment.py"

# 헥토파이낸셜 PG 연동 예제
def create_payment(amount, order_id, customer_name, customer_email):
    url = "https://api.hectofinancial.com/payment/request"
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    
    data = {
        "amount": amount,
        "orderId": order_id,
        "customerName": customer_name,
        "customerEmail": customer_email
    }
    
    response = requests.post(url, headers=headers, json=data)
    return response.json()

# 사용 예제
payment_result = create_payment(
    amount=10000,
    order_id=f"ORDER_{int(time.time())}",
    customer_name="홍길동",
    customer_email="customer@example.com"
)

print(f"결제 URL: {payment_result['paymentUrl']}")
```

#### cURL 예제

```bash filename="api-request.sh"
curl -X POST "https://api.hectofinancial.com/payment/request" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "amount": 10000,
    "orderId": "ORDER_12345",
    "customerName": "홍길동",
    "customerEmail": "customer@example.com"
  }'
```
PCI DSS 준수, AES-256 암호화, 해시 검증으로 안전한 결제 환경을 제공합니다.

### ⚡ 빠른 연동
표준 API와 SDK를 통한 쉽고 빠른 연동, 샘플 코드를 제공합니다.

### 📊 실시간 관리
실시간 거래 조회, 정산 관리, 상세한 통계 데이터를 제공합니다.

## 빠른 시작 (5분 연동)

```html filename="payment-page.html"

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

## 문서 사용법

> 💡 **팁**: 본 문서를 완독할 필요는 없습니다! 결제 수단별로 나누어져 있으니 필요한 부분만 참고하세요.

**문서 표기법:**
- 🟢 **필수** 파라미터: 반드시 포함해야 하는 필드
- 🟡 **선택** 파라미터: 필요에 따라 포함하는 필드
- **데이터 타입**: `N`(숫자), `A`(영문), `H`(한글), `AN`(영문+숫자)
- **길이**: UTF-8 인코딩 기준 바이트 수

---

**작성일**: 2025-09-05  
**카테고리**: 가이드  
**읽기 시간**: 5분