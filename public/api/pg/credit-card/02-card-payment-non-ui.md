
  title: "신용카드 결제 (Non-UI)",
  description: "신용카드 Non-UI 결제 API",
  category: "결제 API",
  path: "/spay/APICardActionPay.do",
  method: "POST",
  testUrl: "https://tbgw.settlebank.co.kr/spay/APICardActionPay.do",
  prodUrl: "https://gw.settlebank.co.kr/spay/APICardActionPay.do",
  contentType: "application/json"
};

# 신용카드 결제 (Non-UI)

신용카드 Non-UI 결제는 서버에서 직접 카드 정보를 전송하여 결제를 진행하는 방식입니다.

## 주의 사항

* 구인증: 카드번호, 유효기간(yyMM), 식별번호, 카드비밀번호로 결제 요청
* 비인증: 카드번호, 유효기간(yyMM)으로 결제 요청
* 빌키(자동결제 키) 발급: 상점 아이디 설정에 따라 빌키를 응답 값으로 내려 드리고 있으며, 빌키를 따로 저장 하였다가 결제가 필요할 경우 빌키 결제로 요청 주시길 바랍니다.

## API 정보

- **Method**: `POST`
- **Path**: `/spay/APICardActionPay.do`
- **Content-Type**: `application/json`

## 요청 파라미터



















































 정수표기 [150])"
  inputType="text"
  defaultValue="1000"
  placeholder="거래금액을 입력하세요"
  section="data"
  isEncrypted={true}
/>













## 해쉬 생성 방법

해쉬값은 다음 순서로 조합하여 SHA256으로 생성합니다:

```
거래일자 + 거래시간 + 상점아이디 + 상점주문번호 + 거래금액(평문) + 해쉬키
```

## 응답 파라미터

### 성공 응답

 객체



















































### 실패 응답

 객체







#

실패 시에는 data 객체가 비어있습니다.

## 응답 해쉬 검증

응답 해쉬값은 다음 순서로 조합하여 SHA256으로 생성됩니다:

```
거래상태코드 + 요청일자 + 요청시간 + 상점아이디 + 상점주문번호 + 거래금액 + 해쉬키
```

## 에러 코드

자세한 에러 코드는 [거절 코드 표](/docs/api/pg/credit-card/error-codes)를 참고하세요.