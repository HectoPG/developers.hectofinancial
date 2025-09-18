
  title: "신용카드 빌키 발급",
  description: "신용카드 빌키 발급 API",
  category: "결제 API",
  path: "/spay/APICardAuth.do",
  method: "POST",
  testUrl: "https://tbgw.settlebank.co.kr/spay/APICardAuth.do",
  prodUrl: "https://gw.settlebank.co.kr/spay/APICardAuth.do",
  contentType: "application/json"
};

# 신용카드 빌키 발급

결제 하지 않고 빌키만 발급받는 API입니다.

## 주의 사항

* 빌키 서비스는 영업 담당자를 통해 별도 신청이 필요합니다.
* 빌키 발급 후 저장하여 2회차 결제시 사용합니다.

## API 정보

- **Method**: `POST`
- **Path**: `/spay/APICardAuth.do`
- **Content-Type**: `application/json`

## 요청 파라미터











































## 해쉬 생성 방법

해쉬값은 다음 순서로 조합하여 SHA256으로 생성합니다:

```
요청일자 + 요청시간 + 상점아이디 + 상점주문번호 + "0" + 해쉬키
```

## 응답 파라미터

### 성공 응답

 객체





















#











































### 실패 응답







## 응답 해쉬 검증

응답 해쉬값은 다음 순서로 조합하여 SHA256으로 생성됩니다:

```
거래상태코드 + 요청일자 + 요청시간 + 상점아이디 + 상점주문번호 + "0" + 해쉬키
```

## 에러 코드

자세한 에러 코드는 [거절 코드 표](/docs/api/pg/credit-card/error-codes)를 참고하세요.
