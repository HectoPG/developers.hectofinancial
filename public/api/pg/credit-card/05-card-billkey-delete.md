
  title: "신용카드 빌키 삭제",
  description: "신용카드 빌키 삭제 API",
  category: "결제 API",
  path: "/spay/APICardActionDelkey.do",
  method: "POST",
  testUrl: "https://tbgw.settlebank.co.kr/spay/APICardActionDelkey.do",
  prodUrl: "https://gw.settlebank.co.kr/spay/APICardActionDelkey.do",
  contentType: "application/json"
};

# 신용카드 빌키 삭제

1회차 응답으로 발급받은 빌키를 삭제하는 API입니다.

## 주의 사항

* 빌키 서비스는 영업 담당자를 통해 별도 신청이 필요합니다.
* 삭제된 빌키는 더 이상 사용할 수 없습니다.

## API 정보

- **Method**: `POST`
- **Path**: `/spay/APICardActionDelkey.do`
- **Content-Type**: `application/json`

## 요청 파라미터































## 해쉬 생성 방법

해쉬값은 다음 순서로 조합하여 SHA256으로 생성합니다:

```
거래일자 + 거래시간 + 상점아이디 + 상점주문번호 + "0" + 해쉬키
```

## 응답 파라미터

### 성공 응답

 객체

























#





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
