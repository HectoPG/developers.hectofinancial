# 신용카드 빌키 결제

신용카드 결제 API 또는 빌키 발급 API를 통해 전달받은 빌키로 결제를 하는 API입니다.

## 주의 사항

* 빌키 서비스는 영업 담당자를 통해 별도 신청이 필요합니다.
* 1회차 결제시 발급받은 빌키를 사용하여 2회차 이후 결제를 진행합니다.

## API 정보

- **URL**: `/spay/APICardActionPay.do`
- **Method**: `POST`
- **Content-Type**: `application/x-www-form-urlencoded`

## 요청 파라미터

### params 객체





















### data 객체



















 정수표기 [150])"
  inputType="text"
  defaultValue="1000"
  placeholder="거래금액을 입력하세요"
  section="data"
/>











## 해쉬 생성 방법

해쉬값은 다음 순서로 조합하여 SHA256으로 생성합니다:

```
거래일자 + 거래시간 + 상점아이디 + 상점주문번호 + 거래금액(평문) + 해쉬키
```

## 응답 파라미터

### 성공 응답

#### params 객체

















































#### data 객체

빌키 결제는 추가적인 data 객체가 없습니다.

### 실패 응답

#### params 객체







#### data 객체

실패 시에는 data 객체가 비어있습니다.

## 응답 해쉬 검증

응답 해쉬값은 다음 순서로 조합하여 SHA256으로 생성됩니다:

```
거래상태코드 + 요청일자 + 요청시간 + 상점아이디 + 상점주문번호 + 거래금액 + 해쉬키
```

## 에러 코드

자세한 에러 코드는 [거절 코드 표](/docs/api/pg/credit-card/error-codes)를 참고하세요.
