# 전자결제(PG) 서비스 소개

헥토파이낸셜 전자결제(PG)서비스는 신용카드, 실시간 계좌이체, 가상계좌, 휴대폰 결제, 상품권 결제 등 다양한 온라인 결제수단을 지원하는 통합 결제 서비스입니다.

#### Quick Link

[신용카드](https://develop.sbsvc.online/16/onlineDocList.do#item-433)  [계좌이체](https://develop.sbsvc.online/16/onlineDocList.do#item-443)  [가상계좌](https://develop.sbsvc.online/16/onlineDocList.do#item-453)  [010가상계좌](https://develop.sbsvc.online/16/onlineDocList.do#item-824)  [휴대폰결제](https://develop.sbsvc.online/16/onlineDocList.do#item-463)  [상품권결제](https://develop.sbsvc.online/16/onlineDocList.do#item-473)  [포인트다모아](https://develop.sbsvc.online/16/onlineDocList.do#item-533)  [페이코 간편결제](https://develop.sbsvc.online/16/onlineDocList.do#item-1023)  [카카오페이 간편결제](https://develop.sbsvc.online/16/onlineDocList.do#item-1061)  [네이버페이 간편결제](https://develop.sbsvc.online/16/onlineDocList.do#item-1112)  [삼성페이 간편결제](https://develop.sbsvc.online/16/onlineDocList.do#item-1269)  [신용카드 비/구인증 API](https://develop.sbsvc.online/16/onlineDocList.do#item-1046)

# 표준 연동규격서

# 1\. 개요

## 1.1 목적

본 문서는 헥토파이낸셜에서 제공하는 전자결제(PG) 표준결제창 연동 개발에 필요한 기술적 이해를 돕고 상세 규격을 정의하기 위해 작성 되었습니다.

## 1.2 대상

본 문서는 헥토파이낸셜 전자결제(PG) 시스템을 통해 결제를 수행하기 위한 고객사 개발자를 대상으로 합니다.

## 1.3 문서 규격

다음은 본 문서에서 언급하는 연동상의 일반적인 사항에 대하여 설명합니다.

*   요청/응답 파라미터 중 필수 필드는 '●' 기호를 사용하며, 선택 필드는 '○' 기호를 사용합니다.
*   요청/응답 파라미터의 데이터 타입은 다음과 같습니다.
    *   N : 숫자 형식의 문자열
    *   A : 알파벳 형식의 문자열
    *   H : 한글 형식의 문자열
*   요청/응답 파라미터의 길이는 평문을 UTF-8 인코딩한 값(Byte)을 기준으로 합니다.

## 1.4 기타

*   [여기](https://develop.sbsvc.online/21/bbsList.do?tx=R&articleSeq=149)에서 오프라인 문서를 다운로드 받을 수 있습니다. (온라인 문서는 항상 최신화 되어 있습니다.)
*   본 문서를 완독할 필요는 없습니다. 결제 수단 및 서비스별로 항목이 나누어져 있으니, 필요한 부분만 참고하시면 됩니다.
*   자주묻는질문(FAQ) [이동](https://develop.sbsvc.online/3/bbsList.do)

# 2\. 표준결제창(UI) 연동

헥토파이낸셜에서 제공하는 전자결제(PG) 표준결제창 연동 방법에 대해 기술합니다.

## 2.1 요약 설명

*   결제 수단별 요청 URI를 확인합니다.(\[[2.3 API URI](#item-432)\] 참고)
*   결제 수단별 요청 전문을 확인하여, 요청파라미터를 세팅한 후 POST방식으로 요청합니다.
*   개인/민감정보 관련 파라미터는 암호화 해야합니다.(\[[5.중요 정보 보안](#item-424)\] 참고)
*   헥토파이낸셜 결제창을 띄우고, 결제를 진행합니다.
*   결제 완료 화면에서 \[닫기\] 버튼을 누르면, 요청파라미터 nextUrl에 지정된 URL로 결과(응답파라미터)가 리턴됩니다.
*   사용자가 결제 도중 강제로 결제창을 종료할 시(세틀 결제창 'X'버튼), cancUrl 파라미터에 지정된 URL로 결과(응답 파라미터)가 리턴됩니다

## 2.2 주의 사항

*   **2022년 6월 15일부터, IE 브라우저 지원이 종료되오니, Edge 브라우저 사용해 주시기 바랍니다.**
*   **오페라 브라우저 사용을 삼가 주십시오. 일부 기능이 작동하지 않을 수 있습니다.**
*   **운영환경에서 상점아이디(mchtId)로 테스트 진행시 발생하는 비용은 가맹점 부담입니다.**
*   **요청은 POST method만을 사용합니다.**
*   **요청 파라미터는 연동규격서에 명시된 것만 사용하십시오. 그렇지 않을 경우 오류가 발생할 수 있습니다.**
*   **요청 파라미터에 :, &, ?, ', ", new line, <, > 등의 특수문자 사용을 삼가 주십시오.**
*   **요청 파라미터에 href, alert, javascript, console.log 등의 html태그 또는 예약어 사용을 삼가 주십시오. 해당 단어들이 포함될 경우 사용자의 의도와 관계 없이 제거됩니다.**
*   **요청 파라미터에 이모지 사용을 삼가 주십시오. 이모지가 포함될 경우 사용자의 의도와 관계 없이 제거됩니다.**
*   **응답 파라미터는 예고 없이 변동될  수 있습니다.**
*   **결제창 연동시 Iframe 사용하는 경우, 일부 브라우저나 기기에서 정상적으로 작동하지 않는 경우가 있으니, Iframe 사용을 삼가 주십시오.**
*   **nextUrl, notiUrl 파라미터**
    *   nextUrl : 헥토파이낸셜 결제창 완료 화면에서 고객이 '닫기' 버튼을 클릭한 경우 호출되는 URL입니다. 응답파라미터가 POST방식으로 전달되며, 고객이 결제창을 강제로 종료하는 경우(브라우저 'X'버튼) 호출되지 않습니다. nextUrl은 반드시 화면 처리 용도로만 사용하시고, DB처리는 notiUrl에서 하시기 바랍니다.  
         
    *   notiUrl : 헥토파이낸셜 결제서버에서  결제가 성공적으로 처리된 경우, 가맹점측으로 Server To Server 커넥션을 맺어 응답 파라미터를 POST방식으로 전송합니다. 결제창 강제 종료 여부에 관계없이 승인성공시 응답파라미터가 전송됩니다.  
         
    *   따라서 nextUrl에서는 전달된 응답파라미터로 결제 결 과를 보여주는 화면 처리를 하시고, 가맹점측 결제 관련 DB처리는 반드시 notiUrl에서 처리해 주시기 바랍니다.
*   **notiUrl 해쉬 체크**
    *   **데이터 위변조를 체크하기 위해서 notiUrl로 수신받은 해쉬데이터를 반드시 가맹점DB와 검증하는** **절차를 진행해야 합니다. 일치하는 경우에만 고객에게 서비스를 제공해야 합니다.**
    *   해쉬데이터 체크 방법과 알고리즘은 노티 전문의 pktHash 파라미터를 참고해 주십시오.
*   **nextUrl, notiUrl, cancUrl 프로토콜**
    *   HTTP 사용시 브라우저 정책에 위반되어(cross-origin 등) 결제창이 정상적으로 동작하지 않을 수 있습니다.
    *   따라서 HTTPS 사용을 권장드립니다.

## 2.3 API URI

헥토파이낸셜 결제창(UI) 서버 도메인 이름은 다음과 같습니다.

 
| 구분  | 도메인 이름 |
| --- | --- |
| 테스트베드 | tbnpg.settlebank.co.kr |
| 상용 환경 | npg.settlebank.co.kr |

헥토파이낸셜 결제창(UI) API URI는 다음과 같습니다.

   
| 기능 구분 | 결제 수단 | URI | HTTP  <br>Method |
| --- | --- | --- | --- |
| 표준결제창 (UI) | 신용카드 | https://{domain}/card/main.do | POST |
| 신용카드-직호출 | https://{domain}/card/cardDirect.do |
| 신용카드-외화결제창 | https://{domain}/card/abroad/main.do |
| 계좌이체 | https://{domain}/bank/main.do |
| 가상계좌 | https://{domain}/vbank/main.do |
| 휴대폰결제 | https://{domain}/mobile/main.do |
| 틴캐시상품권 | https://{domain}/gift/teenCash/main.do |
| 해피머니상품권 | https://{domain}/gift/happyMoney/main.do |
| 컬쳐랜드상품권(컬쳐캐쉬) | https://{domain}/gift/cultureCash/main.do |
| 스마트문상 | https://{domain}/gift/smartCash/main.do |
| 도서상품권 | https://{domain}/gift/booknlife/main.do |
| 티머니 | https://{domain}/tmoney/main.do |
| 포인트다모아 | https://{domain}/point/main.do |
| 간편결제 | https://{domain}/corp/main.do |

## 2.4 요청 및 응답 헤더

 
| 구분  | 내용  |
| --- | --- |
| 요청  | Content-type=application/x-www-form-urlencoded; charset=UTF-8 |
| 응답  | Content-type=text/html; charset=UTF-8 |

## 2.5 요청 파라미터 검증

필수값 누락, HASH 데이터 불일치, 길이체크 등 파라미터 검증 후 이상이 있을 경우 아래와 같은 응답 코드를 반환합니다.

```
{
    "outRsltMsg" : "결제 요청 정보 누락 (상품명)",
    "mchtTrdNo" : "ORDER20211231100000",
    "outRsltCd" : "1008",
    "outStatCd" : "0031",
    "mchtId" : "nxca_jt_il"
}
```

## 2.6 연동 스크립트 예시

연동시 가맹점측 편의를 위해 연동 스크립트를 제공하고 있습니다.

 
| 구분  | URL |
| --- | --- |
| 테스트베드 | https://tbnpg.settlebank.co.kr/resources/js/v1/SettlePG\_v1.2.js |
| 상용 환경 | https://npg.settlebank.co.kr/resources/js/v1/SettlePG\_v1.2.js |

- - -

연동 스크립트 사용 예시는 다음과 같습니다.

```
SETTLE_PG.pay({
    env: "https://tbnpg.settlebank.co.kr",
    mchtId: "nxca_jt_il",
    method: "card",
    trdDt: "20211231",
    trdTm: "100000",
    mchtTrdNo: "ORDER20211231100000",
    mchtName: "헥토파이낸셜",
    mchtEName: "Hecto Financial",
    pmtPrdtNm: "테스트상품",
    trdAmt: "AntV/eDpxIaKF0hJiePDKA==",
    mchtCustNm: "홍길동",
    custAcntSumry: "헥토파이낸셜",
    notiUrl: "https://example.com/notiUrl",
    nextUrl: "https://example.com/nextUrl",
    cancUrl: "https://example.com/cancUrl",
    mchtParam: "name=HongGilDong&age=25",
    custIp: "127.0.0.1",
    pktHash: "f395b6725a9a18f2563ce34f8bc76698051d27c05e5ba815f463f00429061c0c",
    ui: {
        type: "popup",
        width: "430",
        height: "660"
    }
}, function(rsp){
    console.log(rsp);
});
```

아이프레임 닫기

```
parent.postMessage(JSON.stringify({action:"HECTO_IFRAME_CLOSE", params: _PAY_RESULT}), "*");
```

아이프레임 너비 조절

```
parent.postMessage(JSON.stringify({action:"HECTO_IFRAME_RESIZE", params: {width:"500px"}}), "*");
```

아이프레임 기본사이즈로

```
parent.postMessage(JSON.stringify({action:"HECTO_IFRAME_RETURNSIZE"}), "*");
```

## 2.7 스크립트 파라미터 정의

   
| 파라미터 | 타입  | 설명  | 필수 여부 |
| --- | --- | --- | --- |
| env | string | 결제 시스템의 환경을 설정합니다.  <br>테스트 환경: 'https://tbnpg.settlebank.co.kr'  <br>운영 환경: 'https://npg.settlebank.co.kr' | Y   |
| mchtId | string | 상점 ID입니다. 상점에 고유한 값이 부여됩니다. | Y   |
| method | string | 결제 방법을 설정합니다. 예: 'card' 등 | Y   |
| trdDt | string | 거래일자를 설정합니다. 형식: 'YYYYMMDD' | Y   |
| trdTm | string | 거래시간을 설정합니다. 형식: 'HHMMSS' | Y   |
| mchtTrdNo | string | 상점 거래번호입니다. 상점에서 고유하게 생성된 거래 번호 | Y   |
| mchtName | string | 상점명입니다. 예: '헥토파이낸셜' | Y   |
| mchtEnName | string | 상점 영문명입니다. 예: 'Hecto Financial' | Y   |
| pmtPrdtNm | string | 결제 상품명입니다. 예: '테스트상품' | Y   |
| trdAmt | string | 결제 금액을 암호화된 값으로 전달합니다. | Y   |
| mchtCustNm | string | 상점 고객명입니다. 예: '홍길동' | Y   |
| custAcntSumry | string | 고객 계좌 요약 정보입니다. | Y   |
| notiUrl | string | 결제 상태 변경 알림을 받을 URL입니다. | Y   |
| nextUrl | string | 결제 완료 후 리턴될 URL입니다. | Y   |
| cancUrl | string | 결제 취소 후 리턴될 URL입니다. | Y   |
| mchtParam | string | 상점 고유의 파라미터를 전달합니다. 예: 'name=HongGilDong&age=25' | Y   |
| custIp | string | 고객의 IP 주소입니다. 예: '127.0.0.1' | Y   |
| pktHash | string | 암호화된 결제 요청 데이터의 해시 값입니다. | Y   |
| ui  | object | 결제 UI 설정입니다. 결제창의 호출 방식 및 크기를 설정합니다. | Y   |

*   스크립트 ui 객체

   
| 파라미터 | 타입  | 설명  | 필수 여부 |
| --- | --- | --- | --- |
| type | string | 결제창 호출 방식. 선택할 수 있는 값:  <br>\- popup : 팝업 창 방식  <br>\- iframe : iframe 형식  <br>(지양하는 방식)  <br>\- self : 동일 창에서 호출  <br>\- blank :새 창에서 호출 | Y   |
| width | string | 결제창의 너비 (단위: px) | Y   |
| height | string | 결제창의 높이 (단위: px) | Y   |

## 2.8 샘플 소스 제공

*   헥토파이낸셜 결제창 연동을 용이하게 하기 위해서, 샘플 소스를 제공합니다.
*   헥토파이낸셜에서 제공하는 샘플 소스는 연동을 위한 기본적인 사항만 기재되어 있으므로, 실제 개발시에는 고객사의 환경에 맞게 연동하시기 바랍니다.

1.  **헥토파이낸셜 개발자 지원 사이트 접속** [클릭!](https://develop.sbsvc.online)
2.  **상단 메뉴 \[개발자 포럼\] > \[[SDK 다운로드](https://develop.sbsvc.online/21/bbsList.do)\]에서 샘플 소스 다운로드**
    *   표준결제창(UI) [클릭!](https://develop.sbsvc.online/21/bbsList.do?tx=R&articleSeq=209)
    *   신용카드 비/구인증 API(Non-UI) [클릭!](https://develop.sbsvc.online/21/bbsList.do?tx=R&articleSeq=210)
    *   가상계좌 API(Non-UI) [클릭!](https://develop.sbsvc.online/21/bbsList.do?tx=R&articleSeq=216)
3.  **config.xxx 설정 변경**
    *   샘플 소스 설정파일입니다. 상점아이디, 암호화 키, 로그 디렉터리 등을 설정할 수 있습니다.
    *   테스트 환경에서는 디폴트 값을 사용하시면 됩니다.
    *   운영 환경에서는 헥토파이낸셜에서 발급받은 상점아이디 및 암호화 키를 설정하셔야 합니다.
4.  **notiUrl, nextUrl, cancUrl 요청 파라미터 값 변경**
    *   notiUrl : 헥토파이낸셜에서 Server To Server로 전달되는 응답 파라미터를 수신하는 URL 기재
    *   nextUrl : 헥토파이낸셜 결제창 결제 완료 후 전환되는 가맹점측 화면 URL 기재
    *   cancUrl : 헥토파이낸셜 결제창에서 고객이 강제 종료시 전환되는 가맹점측 화면 URL 기재
5.  **기타 주의 사항**
    *   JAVA(JSP) : log4j 설정 파일 자사에 맞게 변경 필요
    *   PHP : curl 및 openssl 패키지 설치 필요(php.ini 파일 주석 해제 필요)
    *   PHP 5.4 버전 이하인 경우 일부 함수가 작동하지 않을 수 있습니다.
    *   ASP 클래식의 경우 추가로 배포된 DLL파일(암복호화 모듈) 설치 필요합니다.
    *   ASP 클래식 DLL 가이드 [클릭!](https://develop.sbsvc.online/21/bbsList.do?tx=R&articleSeq=172)

# 3\. API서버 연동 (Non-UI)

결제 수단별 취소, 신용카드 빌키 결제, 휴대폰 월자동 결제, 가상계좌 채번 등의 API 서비스 연동 방법에 대해 기술합니다.

## 3.1 요약 설명

*   이용 하고자 하는 서비스별 [API URI](#item-582)를 확인합니다.
*   이용 하고자 하는 서비스별 요청 전문을 확인 후, 해당되는 요청 파라미터를 세팅합니다.
*   Server to Server 로 HTTP Connection 하여 [JSON 데이터](#item-584)로 요청/응답합니다.
*   개인/민감정보 관련 파라미터는 암호화해야 합니다. (\[[5.중요 정보 보안](#item-424)\] 참고)

## 3.2 API URI

헥토파이낸셜 API 서버 도메인 이름은 다음과 같습니다.

 
| 구분  | 도메인 이름 |
| --- | --- |
| 테스트베드 | tbgw.settlebank.co.kr |
| 상용 환경 | gw.settlebank.co.kr |

API 서버 URI는 다음과 같습니다.

   
| 기능구분 | 서비스 | URI | HTTP  <br>Method |
| --- | --- | --- | --- |
| 결제 API  <br>(Non-UI) | 신용카드 결제 및 빌키 결제 | https://{domain}/spay/APICardActionPay.do | POST |
| 신용카드 빌키 발급 | https://{domain}/spay/APICardAuth.do |
| 휴대폰 월자동결제 | https://{domain}/spay/APIService.do |
| 페이코 간편결제 승인 | https://{domain}/spay/APITrdPayco.do |
| 취소 API  <br>(Non-UI) | 신용카드 취소 | https://{domain}/spay/APICancel.do | POST |
| 계좌이체 취소 |
| 휴대폰결제 취소 |
| 틴캐시 취소 |
| 해피머니 취소 |
| 컬쳐랜드상품권(컬쳐캐쉬) 취소 |
| 스마트문상 취소 |
| 도서상품권 취소 |
| 티머니 취소 |
| 포인트다모아 취소 |
| 간편결제 취소 |
| 가상계좌 서비스 API  <br>(Non-UI) | 가상계좌 채번 | https://{domain}/spay/APIVBank.do | POST |
| 가상계좌 채번취소 | https://{domain}/spay/APIVBank.do |
| 가상계좌 환불 | https://{domain}/spay/APIRefund.do |
| 휴대폰 환불 API | 휴대폰결제 환불 | https://{domain}/spay/APIRefund.do | POST |
| 기타 서비스 API  <br>(Non-UI) | 신용카드 빌키 삭제 | https://{domain}/spay/APICardActionDelkey.do | POST |
| 실시간 거래 조회 | https://{domain}/spay/APITrdcheck.do |

## 3.3 요청 및 응답 헤더

 
| 구분  | 내용  |
| --- | --- |
| 요청  | Content-type=application/json; charset=UTF-8 |
| 응답  | Content-type=application/json; charset=UTF-8 |

## 3.4 JSON 요청 데이터 예시

다음은 신용카드 취소 요청 전문 JSON 예시입니다.

```
{
	"params" : {
		"mchtId" : "nxca_jt_il",
		"ver" : "0A19",
		"method" : "CA",
		"bizType" : "C0",
		"encCd" : "23",
		"mchtTrdNo" : "ORDER20211231100000",
		"trdDt" : "20211231",
		"trdTm" : "100000",
		"mobileYn" : "N",
		"osType" : "W"
	},
	"data" : {
		"pktHash" : "a2d6d597d55d7c9b689baa2e08c1ddf0ce71f4248c5b9b59fe61bfbf949543e1",
		"crcCd" : "KRW",
		"orgTrdNo" : "STFP_PGCAnxca_jt_il0211129135810M1494620",
		"cnclAmt" : "AntV/eDpxIaKF0hJiePDKA==",
		"cnclOrd" : "001",
		"cnclRsn" : "상품이 마음에 들지 않아서"
	}
}
```

# 4\. 연동 서버

## 4.1 서버 IP 주소

다음은 헥토파이낸셜 서버의 IP주소입니다.

   
| 구분  |     | 도메인 이름 | IP주소 |
| --- | --- | --- | --- |
| 결제창(UI) | 테스트 베드 | tbnpg.settlebank.co.kr | 61.252.169.51  <br>HTTPS(TCP/443) |
| 상용 환경 | npg.settlebank.co.kr | 14.34.14.25(primary) |
| 61.252.169.58(secondary) |
| 취소 및 기타 API서비스 (Non-UI) | 테스트 베드 | tbgw.settlebank.co.kr  <br>HTTPS(TCP/443) | 61.252.169.42 |
| 상용 환경 | gw.settlebank.co.kr  <br>HTTPS(TCP/443) | 14.34.14.21(primary) |
| 61.252.169.53(secondary) |
| 정산대사 API | 테스트 베드 | tb-nspay.settlebank.co.kr  <br>HTTPS(TCP/443) | 61.252.169.32 |
| 상용 환경 | nspay.settlebank.co.kr  <br>HTTPS(TCP/443) | 61.252.169.29 (primary) |
| 14.34.14.37 (secondary) |

 

*   헥토파이낸셜 PG차세대 시스템은 IDC센터 이중화 구성되어 있습니다.(상용 환경)  
    따라서 예고 없이 GLB시스템 운영으로 주센터와 보조센터 전환이 이루어질 수 있으며, DNS Lookup에 의한 접속을 권장하고 있습니다.  
    따라서 안내드린 2개의 공인 IP주소(상용)를 방화벽에서 접속허용 요청드리며, hosts파일 구성은 권장하지 않습니다.
*   만약 귀사의 내부 정책으로 인하여 hosts파일에 Domain주소를 고정설정으로 구성하시는 경우 헥토파이낸셜 IDC센터 전환시에는 아래와 같이 "#(코멘트) 표시된 IP주소"로 반드시 모든 서버의 hosts파일을 수작업으로 변경처리를 해야만 정상적으로 결제서비스를 이용하실 수 있습니다.
*   모든 통신은 HTTPS(TCP/443) 프로토콜을 사용하며, TLS 1.2 이상을 사용하여 접속하는것을 강력하게 권장드립니다. TLS 1.1 이하버전은 보안권고사항에 따라 사전에 통지 없이 지원이 중단 될 수 있습니다 

##### #<</etc/hosts or c:\\windows\\system32\\drivers\\etc\\hosts파일내용>>

```
#cat /etc/hosts
#<<추가>>
14.34.14.25 npg.settlebank.co.kr
#61.252.169.58 npg.settlebank.co.kr

14.34.14.21 gw.settlebank.co.kr
#61.252.169.53 gw.settlebank.co.kr
```

## 4.2 노티 서버

거래 완료 후 거래 결과를 헥토파이낸셜에서 고객사시스템(방화벽 Inbound 허용필요)으로 Notification처리하는 서버에 대한 방화벽 허용하여야 합니다.  
결제창 호출시 notiUrl로 고객사 페이지를 호출합니다. TCP Port번호는 notiUrl에 지정한 포트번호로 방화벽 허용해 주시면 됩니다.

  
| 서비스 | 구분  | IP  |
| --- | --- | --- |
| 테스트 베드 | Notification발송 | 61.252.169.22 |
| 상용 환경 | Notification발송 | 14.34.14.23(Primary center) |
| 61.252.169.24(Secondary center) |

*   예) notiUrl=https://abc.com:8443/abc.do
    *   Source IP : 위 목록의 헥토파이낸셜 노티서버
    *   Destination : 고객사 서버IP(abc.com), TCP/8443
*   노티와 결제창 nextUrl 결과 전달 또는 노티와 NON-UI 승인 응답 사이에는 수신 순서가 보장되지 않습니다.
*   결제창 결제 후 승인 노티 발송은 필수, 취소 노티 발송은 옵션입니다. 취소 노티가 필요하신 경우 서비스 오픈 전 헥토파이낸셜 담당자에게 발송 설정 요청 바랍니다.
*   노티의 인코딩 방식은 별도 요청이 없는 경우 EUC-KR로 설정됩니다.  
    EUC-KR, UTF-8 중 원하시는 인코딩 방식이 있으신 경우, 헥토파이낸셜 담당자에게 요청해주시기 바랍니다.

# 5\. 중요 정보 보안

## 5.1 개인정보 및 중요정보 암복호화(암호화/복호화)

데이터 송수신 시 개인정보/중요정보 필드에 대해서는 다음과 같은 암복호화(암호화/복호화)를 수행해야 합니다.

   
| 구분  | 항목  | 적용  | 인코딩 |
| --- | --- | --- | --- |
| 개인정보 | 알고리즘 | AES-256/ECB/PKCS5Padding | Base64 Encoding |
| 대상 필드 | 거래금액, 고객명, 휴대폰번호, 이메일 등  <br>(암호화 대상 필드는 개별 API의 요청 필드 규격의 비고란에 명시됩니다.) |     |     |

## 5.2 개인정보 암호키

개인 정보 및 중요정보 암복호화시 키 정보는 운영 환경에 따라 다르며 다음과 같습니다.  
단순 연동 테스트용으로는 테이블 첫번째 항목을 사용하십시오. 이후 연동이 성공적으로 이루어지면 헥토파이낸셜에서 발급하는 고유 키를 사용하십시오.

 
| 구분  | 암복호화 키 |
| --- | --- |
| 테스트베드 키(테스트용 공용 키) | pgSettle30y739r82jtd709yOfZ2yK5K |
| 상용 환경 키(가맹점 고유 키) | 서비스 이행 시 별도 통보 |

## 5.3 위변조 방지 알고리즘

요청 데이터의 위변조 여부를 검증하기 위해 추가적으로 해쉬키 검증을 수행하며, 해쉬키 생성 알고리즘은 다음과 같습니다.

   
| 구분  | 항목  | 적용  | 인코딩 |
| --- | --- | --- | --- |
| 위변조 | 알고리즘 | SHA-256 | Hex Encoding |

## 5.4 해쉬생성 인증키

단순 연동 테스트용으로는 테이블 첫번째 항목을 사용하시고, 연동이 성공적으로 이루어지면 헥토파이낸셜에서 발급하는 고유 키를 사용하십시오.

 
| 구분  | 인증 키 |
| --- | --- |
| 테스트베드 키(테스트용 공용 키) | ST1009281328226982205 |
| 상용 환경 키(가맹점 고유 키) | 서비스 이행시 별도 통보 |

# 6\. 신용카드 결제 (UI)

## 6.1 주의 사항

*   상점아이디 속성에 따라 화면이 분기됩니다.
    *   상점아이디가 일반 인증 결제로 설정되어 있는 경우 카드사 인증창이 나타납니다.
    *   상점아이디가 비인증 또는 구인증으로 설정되어 있는 경우 카드정보 입력창이 나타납니다.
*   신용카드 빌키(billKey)를 내려받고자 하는 경우, 빌키서비스를 별도 신청하셔야 합니다
*   빌키를 발급받은 경우, 해당 빌키로 2회차 결제 API 요청하시면 됩니다.(\[[신용카드 빌키 결제 API](#item-1047)\] 참고)
*   ※ 매출전표의 발행금액은 가맹점에서 전송하는 파라미터를 기준으로 표기되니 주의하시기 바랍니다.
    *   ex) 과세 가맹점에서 거래금액 1,000원을 다음과 같이 전송하는 경우
    *   1) 거래금액만 전송 : 과세 909, 부가세 91 로 표기
    *   2) 과세금액 900, 부가세금액 100 전송 : 과세 900, 부가세 100 으로 표기

## 6.2 요청 전문 (가맹점 → 헥토파이낸셜)

     
| 파라미터 | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- |
| mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디  <br>nxca\_jt\_il:인증  <br>nxca\_jt\_bi:비인증  <br>nxca\_jt\_gu:구인증  <br>nxca\_ab\_bi:영문외화 비인증  <br>nxca\_ab\_il:영문외화 인증 | AN(10) | ●   | "nxca\_jt\_il" |
| method | 결제수단 | PG 서비스에 해당하는 결제 구분 코드 | AN(20) | ●   | "card"  <br>※ 고정값 |
| trdDt | 요청일자 | yyyyMMdd | N(8) | ●   | "20211231" |
| trdTm | 요청시간 | HH24MISS | N(6) | ●   | "100000" |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유 주문번호  <br>※ 한글 제외 | AN(100) | ●   | "ORDER20211231100000" |
| mchtName | 상점한글명 | 상점한글명 | AHN(100) | ●   | "헥토파이낸셜" |
| mchtEName | 상점영문명 | 상점영문명 | AN(100) | ●   | "Hecto Financial" |
| pmtPrdtNm | 상품명 | 결제상품명 | AHN(128) | ●   | "테스트상품" |
| trdAmt | 거래금액 | 거래금액  <br>※ USD(달러) 사용시 100을 곱하여 전달  <br>※ AES 암호화 | N(12) | ●   | "1000" ※ KRW  <br>"100"   ※ USD  <br>ex) $ 1.00 → 100 (USD) |
| mchtCustNm | 고객명 | 고객명  <br>※ AES 암호화 | AHN(30) | ○   | "홍길동" |
| notiUrl | 결과처리 URL | 결제 후 결과 전달되는 페이지의 URL(Server To Server 연동 URL) | AN(250) | ●   | "https://example.com/notiUrl" |
| nextUrl | 결과화면 URL | 결제 후 결과 전달 및 이동페이지 URL | AN(250) | ●   | "https://example.com/nextUrl" |
| cancUrl | 결제취소 URL | 고객 강제 종료시 결과 전달 및 이동페이지 URL | AN(250) | ●   | "https://example.com/cancUrl" |
| mchtParam | 상점예약필드 | 기타 주문 정보를 입력하는 상점 예약 필드 | AHN(4000) | ○   | "name=HongGilDong&age=25" |
| email | 이메일 | 이메일 주소  <br>※ AES 암호화 | AN(60) | ○   | "HongGilDong@example.com" |
| prdtTerm | 상품제공기간 | yyyyMMddHHmmss  <br>값이 없으면 일반결제로 표기 | N(14) | ○   | "20221231235959" |
| mchtCustId | 상점고객아이디 | 상점에서 보내주는 고유 고객아이디 혹은 유니크키  <br>※ AES 암호화 | AN(50) | ○   | "HongGilDong" |
| taxTypeCd | 면세여부 | N:과세, Y:면세, G:복합과세  <br>공백일 경우 상점 설정에 따름 | A(1) | ○   | "N" |
| taxAmt | 과세금액 | 과세금액(복합과세일 경우 필수)  <br>※ AES 암호화 | N(12) | ○   | "909" |
| vatAmt | 부가세금액 | 부가세금액(복합과세일 경우 필수)  <br>※ AES 암호화 | N(12) | ○   | "91" |
| taxFreeAmt | 비과세금액 | 면세금액(복합과세일 경우 필수)  <br>※ AES 암호화 | N(12) | ○   | "0" |
| svcAmt | 봉사료 | 신용카드 봉사료  <br>※AES 암호화 | N(12) | ○   | "10" |
| instmtMon | 할부개월수 | 신용카드(일반) : 요청된 할부 개월 수가 할부 개월 리스트에 있을 경우 선택된 상태로 고정, 요청된 할부 개월 수가 할부 개월 리스트에 없을 경우 선택 할 수 있도록 할부 개월 수 리스트 노출  <br>신용카드-직호출 : 요청된 할부 개월 수로 결제 | N(2) | ○   | "00","2","3","4"... |
| cardType | 카드결제타입 | 3:앱카드 전용가능 카드사\[신한/삼성/현대/KB/농협/롯데\]  <br>6:현대카드 PayShot(카드사와 직접 제휴계약 진행 후 사용가능) | N(1) | ○   | "3" |
| chainUserId | 현대카드 PayShot ID | 카드사와 직접 제휴계약 진행 후 사용 가능 | AN(100) | ○   | ""  |
| cardGb | 특정카드사 코드 | 하나의 특정 카드사만 노출  <br>\[[신용카드 식별자](#item-545)\] 참고 | AN(4) | ○   | "NHC" |
| appScheme | 앱스키마 | (AppScheme://~)형식으로 사용되며, 자체앱을 구축하는 경우 사용  <br>\[[신용카드 WebView](#item-690)\] 참고 | AN(100) | ○   | "PAYAPPNAME://" |
| custIp | 고객 IP주소 | 상점 서버의 IP가 아닌, 고객 기기의 IP주소 | AN(15) | ○   | "127.0.0.1" |
| pktHash | hash데이터 | SHA256 방식으로 생성한 해쉬값  <br>\[[요청 전문 해쉬 코드](#item-772)\] 참고 | AN(200) | ●   | "f395b6725a9a18f2563ce34f8bc76698051d27c05e5ba815f463f00429061c0c" |

## 6.3 요청 전문 해쉬 코드

 
| 항목  | 조합 필드 |
| --- | --- |
| pktHash | 상점아이디 + 결제수단 + 상점주문번호 + 요청일자 + 요청시간 + 거래금액(평문) + 해쉬키 |

## 6.4 응답 전문 (헥토파이낸셜 → 가맹점)

신용카드 결제창에서 가맹점측으로 응답하는 컬럼을 다음과 같이 정의 합니다.

     
| 파라미터 | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- |
| mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디  <br>nxca\_jt\_il:인증  <br>nxca\_jt\_bi:비인증  <br>nxca\_ks\_gu:구인증 | AN(10) | ●   | "nxca\_jt\_il" |
| outStatCd | 거래상태 | 거래상태코드(성공/실패)  <br>0021:성공  <br>0031:실패 | AN(4) | ●   | "0021" |
| outRsltCd | 거절코드 | 거래상태가 "0031"일 경우, 상세 코드 전달  <br>\[[거절 코드 표](#item-544)\] 참고 | AN(4) | ●   | "0000" |
| outRsltMsg | 결과메세지 | 결과 메세지 전달  <br>URL Encoding, UTF-8 | AHN(200) | ●   | "결제 요청 정보 누락 (상품명)" |
| method | 결제수단 | PG 서비스에 해당하는 결제 구분 코드 | AN(20) | ●   | "card"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유 주문번호  <br>※ 한글 제외 | AN(100) | ●   | "ORDER20211231100000" |
| mchtCustId | 상점고객아이디 | 보내주는 고유 고객아이디 혹은 유니크 키  <br>※ AES 암호화 | AN(50) | ○   | "HongGilDong" |
| trdNo | 거래번호 | 헥토파이낸셜 거래번호 | AN(40) | ●   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| trdAmt | 거래금액 | 거래금액  <br>※ AES 암호화 | N(12) | ●   | "1000" |
| mchtParam | 상점예약필드 | 요청으로 받은 필드값을 응답으로 Bypass | AHN(4000) | ○   | "name=HongGilDong&age=25" |
| authDt | 승인일시 | 결제 승인 일시 | N(14) | ○   | "20211231100000" |
| authNo | 승인번호 | 신용카드 승인 번호 | N(15) | ○   | "30001234" |
| intMon | 할부개월 수 | 신용카드 할부 개월 수 | N(2) | ○   | "00" |
| fnNm | 카드사명 | 신용카드 카드사명 | AH(20) | ○   | "우리카드" |
| fnCd | 카드사코드 | 신용카드 카드사 코드 | AN(4) | ○   | "LTC" |
| pointTrdNo | 포인트 거래번호 | 고객이 포인트 결제를 했을 경우 포인트 결제 건 거래번호 | AN(40) | ○   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| pointTrdAmt | 포인트 거래금액 | 고객이 포인트 결제를 했을 경우 포인트 결제 금액  <br>※ AES 암호화 | N(12) | ○   | "1000" |
| cardTrdAmt | 신용카드 결제금액 | 고객이 할인 받은 금액 또는 포인트금액을 제외한 신용카드 결제금액  <br>※ AES 암호화 | N(12) | ○   | "4000" |
| billKey | 빌키(대문자 'K') | 빌키 서비스 이용시 발급되는 자동결제키. 2회차 결제 시 사용.  <br> ※ 빌키서비스 별도 신청 필요 | AN(50) | ●   | "SBILL\_0123456789" |

## 6.5 노티 전문 (헥토파이낸셜 → 가맹점)

거래가 정상적으로 완료되면, 헥토파이낸셜에서 가맹점으로 노티(결과통보) 메세지가 전송됩니다.

     
| 파라미터 | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- |
| outStatCd | 거래상태 | 성공\[0021\] | N(4) | ●   | "0021" |
| trdNo | 거래번호 | 헥토파이낸셜에서 부여하는 고유 거래번호 | AN(40) | ●   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| method | 결제수단 | 신용카드\[CA\] | A(2) | ●   | "CA" |
| bizType | 업무구분 | 승인\[B0\], 취소\[C0\] | AN(2) | ●   | "B0" |
| mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 상점아이디 | AN(12) | ●   | "nxca\_jt\_il" |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유 주문 번호 | AN(100) | ●   | "ORDER20211231100000" |
| mchtCustNm | 고객명 | 실제 결제자의 주문자명 | AHN(30) | ○   | "홍길동" |
| mchtName | 상점한글명 | 실 판매자명, 거래 요청시 실 판매자명이 없는 경우 헥토파이낸셜와 계약된 상점명 | AHN(20) | ○   | "헥토파이낸셜" |
| pmtprdNm | 상품명 | 고객이 주문한 결제 상품명 | AHN(128) | ○   | "테스트상품" |
| trdDtm | 거래일시 | 승인일시, 취소/부분취소거래 : 취소일시가 전달됩니다.  <br>형식:YYYYMMDDhhmmss | N(14) | ●   | "20211231100000" |
| trdAmt | 거래금액 | 거래금액 | N(12) | ○   | "1000" |
| svcAmt | 봉사료 | 신용카드 봉사료  <br>※ 오프라인거래이면서 봉사료 포함거래일 경우 전달. | N(12) | ○   | "0" |
| billKey | 자동결제키 | 자동결제 2회차를 위한 billKey발급 | AN(40) | ○   | "SBILL\_0123456789" |
| billKeyExpireDt | 자동결제키 유효기간 | YYMM | N(4) | ○   | "2212" |
| cardCd | 카드사코드 | 카드사 코드  <br>\[[신용카드 식별자 참고](#item-545)\] | AN(10) | ○   | "NHC" |
| cardNm | 카드명 | 카드사 명  <br>\[[신용카드 식별자 참고](#item-545)\] | AHN(20) | ○   | "NH 체크" |
| email | 고객이메일 | 상점 고객 이메일 | AN(60) | ○   | "HongGilDong@example.com" |
| mchtCustId | 상점고객아이디 | 상점 고객 아이디 | AN(50) | ○   | "HongGilDong" |
| cardNo | 카드번호 | 마스킹된 카드번호 123456\*\*\*\*\*\*7890  <br>\*상점 설정 정보에 따른 옵션값 | AN(20) | ○   | "123456\*\*\*\*\*\*7890" |
| cardApprNo | 카드승인번호 | 카드 승인 번호 | AN(15) | ○   | "30001234" |
| instmtMon | 할부개월수 | 할부 개월 수 | N(2) | ○   | "00" |
| instmtType | 할부타입 | 할부 개월이 카드사 이벤트에 속하는 경우 Y  <br>\*상점 설정 정보에 따른 옵션값 | A(1) | ○   | "N" |
| orgTrdNo | 원거래번호 | 취소 시, 원거래 번호 | AN(40) | ○   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| orgTrdDt | 원거래일자 | 취소 시, 원거래 일자 | N(8) | ○   | "20211231" |
| mixTrdNo | 복합결제 거래번호 | 복합결제 거래번호 | AN(40) | ○   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| mixTrdAmt | 복합결제 금액 | \*mixTrdNo 가 존재하는 경우에만 전달 | N(12) | ○   | "1000" |
| payAmt | 실 결제금액 | 거래금액에서 복합결제 금액을 제외한 결제 금액  <br>payAmt = trdAmt - mixTrdAmt  <br>\*mixTrdNo 가 존재하는 경우에만 전달 | N(12) | ○   | "1000" |
| cnclType | 취소거래타입 | 00:전체 취소, 10:부분 취소 | N(2) | ○   | "00" |
| mchtParam | 상점예약필드 | 상점에서 이용하는 추가 정보 필드로 전달한 값이 그대로 반환됩니다. | AHN(4000) | ○   | "name=HongGilDong&age=25" |
| pktHash | 해쉬값 | SHA256 (거래상태코드+거래일자+거래시간+상점아이디+상점주문번호+거래금액+해쉬키) | AN(64) | ●   | "a2d6d597d55d7c9b689baa2e08c1ddf0ce71f4248c5b9b59fe61bfbf949543e1" |

가맹점에서 헥토파이낸셜로 응답을 전송합니다.

 
| 응답 (가맹점 → 헥토파이낸셜) |     |
| --- | --- |
| 성공시 | "OK" (대문자) |
| 실패시 | "FAIL" (대문자, FAIL로 응답시 명확한 실패로 인식합니다. 노티가 재전송 됩니다.) |
| 그 외 | 비정상 실패로 인식하여, 설정된 횟수만큼 노티 재발송 처리함. |

# 7\. 신용카드 WebView

## 7.1 APP SCHEME 설정

*   결제 요청시 가맹점 App Scheme 설정
    *   `appScheme` 파라미터에 스키마 이름을 명시(가맹점앱스키마이름://)합니다.
    *   외부 앱을 호출하는 경우, 외부 앱 종료 시 해당 App Scheme 로 제어가 넘어갑니다.
    *   카드사 앱 호출 후 다른 결제 수단 앱으로 전환 시, 해당 App Scheme을 추가하면 됩니다.

## 7.2 안드로이드

*   WebViewClient 클래스의 shouldOverrideUrlLoading 메소드 재정의
    *   앱카드, 백신앱 등 외부 앱을 호출할 때, 앱이 설치되어 있지 않은 경우 마켓으로 이동하여 설치하는 로직입니다.

```
private class TestWebViewClient extends WebViewClient {

@Override
public boolean shouldOverrideUrlLoading(WebView view, String url) {   
	if(url == null)
		return false;
		
	if((url.startsWith("http://") || url.startsWith("https://"))){
		view.loadUrl(url);
		return false;
	}else{
		Intent intent;
		try{
					
			intent = Intent.parseUri(url, Intent.URI_INTENT_SCHEME);
			Uri uri = Uri.parse(intent.getDataString());
			intent = new Intent(Intent.ACTION_VIEW, uri);
			startActivity(intent);
			return true;	
		}catch(URISyntaxException e1){
			e1.printStackTrace();
			return false;
		}catch(ActivityNotFoundException e2){
			if(url.startsWith("ispmobile://")){
	Uri marketUri = Uri.parse("market://details?id=kvp.jjy.MispAndroid320");
				Intent marketIntent = new Intent(Intent.ACTION_VIEW,marketUri);
				startActivity(marketIntent);
				return true;
			}else if(url.startsWith("kftc-bankpay://")){
				Uri marketUri = Uri.parse("market://details?id=com.kftc.bankpay.android");
				Intent marketIntent = new Intent(Intent.ACTION_VIEW,marketUri);
				startActivity(marketIntent);
				return true;
			}else{
				try {
				    String packagename = intent.getPackage();
					if (packagename != null) {
						Uri marketUri = Uri.parse("market://details?id=" + packagename);
						Intent marketIntent = new Intent(Intent.ACTION_VIEW, marketUri);
						startActivity(marketIntent);
						return true;
					}
				} catch (URISyntaxException e3) {
					e3.printStackTrace();
					return false;
				}
			}
		}
	}
	return false;
}
```

*   웹뷰 설정 및 자바스크립트 ALERT / CONFIRM 메소드 구현
    *   ※ 자바스크립트를 사용가능하도록 설정 필수
    *   ※ Local Storage 사용 설정 필수
    *   ※ 캐시 사용 설정 필수
    *   alert / confirm 를 인식하게 합니다.

```
public void onCreate(Bundle savedInstanceState) {
	...
	view.setWebChromeClient(new MyWebChromeClient());
	WebSettings set = view.getSettings();
	set.setJavaScriptEnabled(true);
	set.setCacheMode(WebSettings.LOAD_DEFAULT);
	set.setDomStorageEnabled(true);
	...
}

class MyWebChromeClient extends WebChromeClient {

@Override
public booleanon JsAlert(WebView view, String url, String message, final android.webkit.JsResult result) {
	new AlertDialog.Builder(MainActivity.this).setTitle("").setMessage(message)
		.setPositiveButton(android.R.string.ok, new AlertDialog.OnClickListener() {
			public void onClick(DialogInterface dialog, int which) {
				result.confirm();
            }
        }).setCancelable(false).create().show();
		return true;
    }

    @Override
    public boolean onJsConfirm(WebView view, String url, String message, final JsResult result) {
    	new AlertDialog.Builder(MainActivity.this).setTitle("").setMessage(message)
    		.setPositiveButton(android.R.string.ok, new DialogInterface.OnClickListener() {
    			public void onClick(DialogInterface dialog, int which) {
    				result.confirm();
    			}
        }).setNegativeButton(android.R.string.cancel, new 
        	DialogInterface.OnClickListener() {
        		public void onClick(DialogInterface dialog, int which) {
        			result.cancel();
        		}
        }).create().show();
    	return true;
    }
}
```

*   안드로이드 Lollipop 버전 이후 적용사항
    *   Insecurity 페이지 허용 및 Third Party Cookies

```
WebSettings settings = view.getSettings();
 
if(Build.VERSION.SDK_INT>= Build.VERSION_CODES.LOLLIPOP) {

   settings.setMixedContentMode(settings.MIXED_CONTENT_ALWAYS_ALLOW);
   CookieManager.cookieManager = CookieManager.getInstance();
   cookieManager.setAcceptCookie(true);
   cookieManager.setAcceptThirdPartyCookies(view,true);

}
```

*   주요 외부 앱리스트
    *   Schema 및 Package Name

  
| App | Scheme | Package Name |
| --- | --- | --- |
| ISP모바일 | ispmobile | kvp.jjy.MispAndroid320 |
| KBAPP카드 | kb-acp | com.kbcard.cxh.appcard |
| KB스타뱅킹 | kbbank | com.kbstar.kbbank |
| L.POINT |     | com.lottemembers.android |
| L.pay | lpayapp | com..lotte.lpay |
| LG페이 | callonlinepay | com.lge.lgpay |
| LiiV(국민은행) | liivbank | com.kbstar.liivbank |
| NHAPP카드 | nhappcardansimclick | nh.smart.mobilecard |
| NH올원페이 | nhallonepayansimclick | nh.smart.nhallonepay |
| PAYCO간편결제 | payco | com.nhnent.payapp |
| SSGPAY |     | com.ssg.serviceapp.android.egiftcertificate |
| V3  | ahnlabv3mobileplus | com.ahnlab.v3mobileplus |
| VG웹백신 |     | kr.co.shiftworks.vguardweb |
| mVaccine | mvaccinestart | com.TouchEn.mVaccine.webs |
| 계좌이체 | kftc-bankpay | com.kftc.bankpay.android |
| 네이버페이 |     | com.nhn.android.search |
| 롯데APP카드 | lotteappcard | com.lcacApp |
| 롯데모바일결제 | lottesmartpay | com.lotte.lottesmartpay |
| 리브Next | newliiv | com.kbstar.reboot |
| 삼성APP카드 | mpocket.online.ansimclick | kr.co.samsungcard.mpocket |
| 삼성페이 | samsungpay | com.samsung.android.spay |
| 삼성페이(미니) |     | com.samsung.android.spaylite |
| 신한페이판(공동인증서) |     | com.shinhancard.smartshinhan |
| 신한 SOL뱅크 |     | com.shinhan.sbanking |
| 신한APP카드 | shinhan-sr-ansimclick | com.shcard.smartpay |
| 신한 슈퍼 SOL |     | com.shinhan.smartcaremgr |
| 씨티공인인증서/스마트간편결제 | smartpay | kr.co.citibank.citimobile |
| 씨티모바일앱 | citimobile | kr.co.citibank.citimobile |
| 씨티앱공인인증서 | citicardapp | com.citibank.cardapp |
| 씨티앱스마트간편결제 | citispay | com.citibank.cardapp |
| 우리WON뱅킹 | wooribank | com.wooribank.smart.npib |
| 우리WON카드 | com.wooricard.smartapp | com.wooricard.smartapp |
| 우리앱카드 | wooripay | com.wooricard.wpay |
| 카카오페이 |     | com.kakao.talk |
| 코나김포페이 |     | gov.gimpo.gpay |
| 토스  | supertoss | viva.republica.toss |
| 티머니댐댐 |     | com.tmoney.nfc\_pay |
| 티머니인앱 |     | com.tmoney.inapp |
| 페이핀 | paypin | com.skp.android.paypin |
| 하나(모비페이) | cloudpay | com.hanaskcard.paycla |
| 하나멤버스 |     | kr.co.hanamembers.hmscustomer |
| 하나멤버스월렛 | hanawalletmembers | com.hanaskcard.paycla |
| 현대APP카드 | hdcardappcardansimclick | com.hyundaicard.appcard |
| 현대카드(공동인증서) |     | com.lumensoft.touchenappfree |
| 카카오뱅크 | kakaobank | com.kakaobank.channel |

## 7.3 IOS

*   URL Scheme 설정
    *   IOS 9 이상에서는 보안정책 강화로 plist 파일에 `LSApplicationQueriesSchemes key`에 App Schema를 등록해야 합니다.
    *   LSApplicationQueriesSchemes 등록리스트는 APP을 제공하는 금융사의 사정에 따라 추가 및 변경 될 수 있습니다.

 
| App | Scheme |
| --- | --- |
| ISP 모바일 | ispmobile |
| KB APP 카드 | kb-acp |
| LiiV(국민은행) | liivbank |
| 리브 Next | newliiv |
| KB스타뱅킹 | kbbank |
| 롯데 APP 카드 | lotteappcard |
| 롯데 스마트 페이 | lottesmartpay |
| 현대 APP 카드 | hdcardappcardansimclick |
| 현대 공인인증 앱 | smhyundaiansimclick |
| 삼성APP카드 | mpocket.online.ansimclick |
| 삼성 공인인증 앱 | scardcertiapp |
| 신한APP카드 | shinhan-sr-ansimclick |
| 신한 공인인증 앱 | smshinhanansimclick |
| NH APP카드 | nhappcardansimclick |
| NH 올원페이 | nhallonepayansimclick |
| NH 공인인증 앱 | nonghyupcardansimclick |
| 하나(모비페이) | cloudpay |
| 씨티 APP 카드 | citispay |
| 씨티 공인인증 앱 | citicardappkr |
| 씨티공인인증서/스마트간편결제(신규) | citimobileapp |
| mVaccine | NA  |
| 계좌이체 | kftc-bankpay |
| 페이핀 | paypin |
| PAYCO 간편결제 | payco, paycoapplogin (2개 모두) |
| 시럽 APP카드 | tswansimclick |
| 뱅크월렛 | bankwallet |
| 은련카드 | uppay |
| 하나카드 | Hanaskcardmobileportal |
| LG페이 | Callonlinepay |
| L.pay | Lpayapp |
| 우리앱카드 | Wooripay |
| 하나멤버스월렛 | hanawalletmembers |
| 우리WON카드 | com.wooricard.wcard |
| 하나모아사인 | hanamopmoasign |
| 우리WON뱅킹 | NewSmartPib |
| Liiv(KB국민은행) | liivbank |
| 토스  | supertoss |
| 카카오뱅크 | kakaobank |

*   plist 예

```
<key>LSApplicationQueriesSchemes</key>
<array>
       <string>ispmobile</string>
       <string>hdcardappcardansimclick</string>
       <string>smhyundaiansimclick</string>
       <string>shinhan-sr-ansimclick</string>
       ...
</array>
```

 

*   쿠키허용
    *   IOS6 이상에서 Safari의 쿠키 기본설정이 허용된 것으로 바뀌어 세션만료 오류가 발생할 수 있습니다. 아래 코드를 적용하여 쿠키를 항상 허용으로 설정합니다.

```
(BOOL)application:(UIApplication *)application 
didFinishLaunchingWithOptions:(NSDictionary  *)launchOptions
{ 
	[[NSHTTPCookieStoragesharedHTTPCookieStorage]  
	setCookieAcceptPolicy:NSHTTPCookieAcceptPolicyAlways];   
    ... 
    return YES; 
} 
```

# 8\. 신용카드 결제 API (Non-UI)

## 8.1 결제 API 요청 전문 (빌키 발급 포함)

  
※ 구인증 : 카드번호, 유효기간(yyMM), 식별번호, 카드비밀번호로 결제 요청  
※ 비인증 : 카드번호, 유효기간(yyMM)으로 결제 요청  
※ 빌키(자동결제 키) 발급 : 상점 아이디 설정에 따라 빌키를 응답 값으로 내려 드리고 있으며, 빌키를 따로 저장 하였다가 결제가 필요할 경우 빌키 결제로 요청 주시길 바랍니다. 상점 아이디에 빌키 발급 설정은 영업 담당자를 통해 요청 주시기 바랍니다.  
  
가맹점 서버에서 헥토파이낸셜측으로 요청하는 컬럼을 다음과 같이 정의합니다.

      
| 파라미터 |     | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- | --- |
| params | mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디  <br>nxca\_ks\_gu:구인증  <br>nxca\_jt\_bi:비인증 | AN(12) | ●   | "nxca\_jt\_bi" |
| ver | 버전  | 전문의 버전 | AN(4) | ●   | "0A19"  <br>※ 고정값 |
| method | 결제수단 | 결제수단 | A(2) | ●   | "CA"  <br>※ 고정값 |
| bizType | 업무구분 | 업무 구분코드 | AN(2) | ●   | "B0"  <br>※ 고정값 |
| encCd | 암호화 구분 | 암호화 구분 코드 | N(2) | ●   | "23"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유한 거래번호 | AN(100) | ●   | "ORDER20211231100000" |
| trdDt | 요청일자 | 현재 전문을 전송하는 일자(YYYYMMDD) | N(8) | ●   | "20211231" |
| trdTm | 요청시간 | 현재 전문을 전송하는 시간(HHMMSS) | N(6) | ●   | "100000" |
| mobileYn | 모바일 여부 | Y:모바일웹/앱, N:PC 또는 그 외 | A(1) | ○   | "N" |
| osType | OS 구분 | A:Android, I:IOS, W:windows, M:Mac, E:기타  <br>공백:확인불가 | A(1) | ○   | "W" |
| data | pktHash | hash데이터 | SHA256 방식으로 생성한 해쉬값  <br>\[[요청 전문 해쉬 코드](#item-1050)\] 참고 | AN(200) | ●   | "f395b6725a9a18f2563ce34f8bc76698051d27c05e5ba815f463f00429061c0c" |
| pmtprdNm | 상품명 | 결제상품명 | AHN(128) | ●   | "테스트상품" |
| mchtCustNm | 고객명 | 상점 고객명 | AHN(30) | ●   | "홍길동" |
| mchtCustId | 상점고객아이디 | 상점 고객아이디 | AHN(50) | ●   | "HongGilDong" |
| email | 이메일 | 상점 고객 이메일주소 | AN(60) | ○   | "HongGilDong@example.com" |
| cardNo | 카드번호 | 카드번호  <br>※AES 암호화 | N(16) | ●   | "1111222233334444" |
| vldDtMon | 유효기간(월) | 유효기간 MM  <br>※AES 암호화 | N(2) | ●   | "12" |
| vldDtYear | 유효기간(년) | 유효기간 YY  <br>※AES 암호화 | N(2) | ●   | "24" |
| idntNo  <br>※ 구인증만 사용 | 식별번호 | 생년월일 6자리 또는 사업자 번호 10자리  <br>※AES 암호화 | N(10) | ●   | "991231" |
| cardPwd  <br>※ 구인증만 사용 | 카드비밀번호 | 카드비밀번호 앞 2자리  <br>※AES 암호화  <br>※ 구인 증 결제시에만 사용합니다. | N(2) | ●   | "00" |
| instmtMon | 할부개월수 | 할부개월수 2자리 | N(2) | ●   | "00" |
| crcCd | 통화구분 | 통화구분 | A(3) | ●   | "KRW" ※국내결제  <br>"USD"  ※해외결제 |
| taxTypeCd | 세금유형 | N : 과세, Y : 면세, G : 복합과세  <br>공백일 경우 상점 설정에 따름 | A(1) | ○   | "N" |
| trdAmt | 거래금액 | 거래금액  <br>※AES 암호화 | N(12) | ●   | "1000" ※국내결제  <br>"150"   ※해외결제  <br>ex \[1.50$\] => 정수표기 \[150\] |
| taxAmt | 과세금액 | 거래금액 중 과세금액  <br>(복합과세일 경우 필수)  <br>※AES 암호화 | N(12) | ○   | "909" |
| vatAmt | 부가세금액 | 거래금액 중 부가세금액  <br>(복합과세일 경우 필수)  <br>※AES 암호화 | N(12) | ○   | "91" |
| taxFreeAmt | 비과세금액 | 거래금액 중 비과세금액  <br>(복합과세일 경우 필수)  <br>※AES 암호화 | N(12) | ○   | "0" |
| svcAmt | 봉사료 | 신용카드 봉사료  <br>※AES 암호화 | N(12) | ○   | "10" |
| notiUrl | 결과처리URL | 결제완료후, 헥토파이낸셜에서 상점으로 전달하는  <br>노티(결과통보)를 수신하는Callback URL 작성 | AN(250) | ○   | "https://example.com/notiUrl" |
| mchtParam | 상점예약필드 | 기타 주문 정보를 입력하는 상점 예약 필드 | AHN(4000) | ○   | "name=HongGilDong&age=25" |

## 8.2 요청 전문 해쉬 코드

 
| 항목  | 조합 필드 |
| --- | --- |
| pktHash | 거래일자 + 거래시간 + 상점아이디 + 상점주문번호 + 거래금액(평문) + 해쉬키 |

## 8.3 결제 API 응답 전문 (빌키 발급 포함)

      
| 파라미터 |     | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- | --- |
| params | mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(12) | ●   | "nxca\_jt\_bi" |
| ver | 버전  | 전문의 버전 | AN(4) | ●   | "0A19"  <br>※ 고정값 |
| method | 결제수단 | 결제수단 | A(2) | ●   | "CA"  <br>※ 고정값 |
| bizType | 업무구분 | 업무 구분코드 | AN(2) | ●   | "B0"  <br>※ 고정값 |
| encCd | 암호화 구분 | 암호화 구분 코드 | N(2) | ●   | "23"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유한 주문번호 | AN(100) | ●   | "ORDER20211231100000" |
| trdNo | 헥토파이낸셜거래번호 | 헥토파이낸셜에서 발급한 고유한 거래번호 | AN(40) | ●   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| trdDt | 요청일자 | 현재 전문을 전송하는 일자(YYYYMMDD) | N(8) | ●   | "20211231" |
| trdTm | 요청시간 | 현재 전문을 전송하는 시간(HHMMSS) | N(6) | ●   | "100000" |
| outStatCd | 거래상태 | 거래상태코드(성공/실패)  <br>0021:성공  <br>0031:실패 | AN(4) | ●   | "0021" |
| outRsltCd | 거절코드 | 거래상태가 "0031"일 경우, 상세 코드 전달  <br>\[[거절 코드 표](#item-544)\] 참고 | AN(4) | ●   | "0000" |
| outRsltMsg | 결과메세지 | 결과 메세지 전달  <br>URL Encoding, UTF-8 | AHN(200) | ●   | "정상적으로 처리되었습니다." |
| data | pktHash | 해쉬값 | 요청시, hash 값 그대로 return | AN(64) | ●   |     |
| trdAmt | 거래금액 | 거래금액  <br>※AES 암호화 | N(12) | ●   | "1000" ※국내결제  <br>"150"   ※해외결제  <br>ex \[1.50$\] => 정수표기 \[150\] |
| billKey | 빌키  | 2회차 결제시 사용되는 빌키  <br>※ 빌키 서비스 이용 상점에 한하여 제공됩니다. | AN(50) | ○   | "SBILL\_0123456789" |
| cardNo | 카드번호 | 마스킹 된 카드번호를 return합니다.  <br>※ 기본적으로 제공되지 않으며, 특정 상점에 한하여 제공됩니다. 사업부에 문의 부탁드립니다. | N(16) | ○   | "111122xxxxxx4444" |
| vldDtMon | 유효기간(월) | 유효기간 MM  <br>※ 빌키 서비스 이용 상점에 한하여 제공됩니다. | N(2) | ○   | "12" |
| vldDtYear | 유효기간(년) | 유효기간 YY  <br>※ 빌키 서비스 이용 상점에 한하여 제공됩니다. | N(2) | ○   | "24" |
| issrId | 발급사아이디 | 카드발급사 코드  <br>\[[신용카드 식별자](#item-545)\] 참고 | AN(4) | ●   | "NHC" |
| cardNm | 카드사명 | 카드사 명  <br>\[[신용카드 식별자](#item-545)\] 참고 | AHN(20) | ●   | "NH 농협" |
| cardKind | 카드종류명 | 카드 종류  <br>\[[신용카드 식별자](#item-545)\] 참고 | AHN(50) | ●   | "NH 체크카드" |
| ninstmtTypeCd | 무이자할부타입 | Y:무이자(부분,상점)  <br>N:일반할부, 일시불 | A(1) | ●   | "N" |
| instmtMon | 할부개월수 | 요청 시 값 그대로 return | N(2) | ○   | "00" |
| apprNo | 승인번호 | 카드 승인번호 | N(15) | ●   | "30001234" |

## 8.4 응답 전문 해쉬 코드

 
| 항목  | 조합 필드 |
| --- | --- |
| pktHash | 거래상태코드 + 요청일자 + 요청시간 + 상점아이디 + 상점주문번호 + 거래금액 + 해쉬키 |

## 8.5 빌키 발급 API 요청 전문

※ 결제 하지 않고 빌키 발급  
가맹점 서버에서 헥토파이낸셜측으로 요청하는 컬럼을 다음과 같이 정의합니다.

      
| 파라미터 |     | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- | --- |
| params | mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(12) | ●   | "nxca\_ks\_gu" |
| ver | 버전  | 전문의 버전 | AN(4) | ●   | "0A19"  <br>※ 고정값 |
| method | 결제수단 | 결제수단 | A(2) | ●   | "CA"  <br>※ 고정값 |
| bizType | 업무구분 | 업무 구분코드 | AN(2) | ●   | "A4"  <br>※ 고정값 |
| encCd | 암호화 구분 | 암호화 구분 코드 | N(2) | ●   | "23"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유한 주문번호 | AN(100) | ●   | "PG\_API20220920131039" |
| trdDt | 요청일자 | 현재 전문을 전송하는 일자(YYYYMMDD) | N(8) | ●   | "20220920" |
| trdTm | 요청시간 | 현재 전문을 전송하는 시간(HHMMSS) | N(6) | ●   | "131039" |
| mobileYn | 모바일 여부 | Y:모바일웹/앱, N:PC 또는 그 외 | A(1) | ○   | "N" |
| osType | OS 구분 | A:Android, I:IOS, W:windows, M:Mac, E:기타  <br>공백:확인불가 | A(1) | ○   | "W" |
| data | pktHash | hash값 | SHA256 방식으로 생성한 해쉬값  <br>\[[요청 전문 해쉬 코드](#item-1131)\] 참고 | AN(64) | ●   | "3bf1295695eb0e081f7900dfcbfcb225887d8fb07322d54c3dba72a2726bf55d" |
| cardNo | 카드번호 | 카드번호, 숫자만  <br>※AES 암호화 | N(128) | ●   | "522112\*\*\*\*\*\*1621" |
| idntNo | 식별번호 | 생년월일6자리  or 사업자번호10자리  <br>※AES 암호화 | N(64) | ●   | "620817" |
| vldDtMon | 유효기간(월) | 카드 유효기간(월), 숫자만  <br>※AES 암호화 | N(24) | ●   | "11" |
| vldDtYear | 유효기간(년) | 카드 유효기간(년), 숫자만  <br>※AES 암호화 | N(24) | ●   | "11" |
| cardPwd | 카드비밀번호 | 카드 비밀번호 앞2자리  <br>※AES 암호화 | N(24) | ●   | "11" |
| mchtCustNm | 고객명 | 고객명(한글포함가능) | AHN(30) | ○   | "홍길동" |
| mchtCustId | 고객아이디 | 고객아이디(한글포함불가) | AHN(50) | ○   | "HongGilDong" |
| keyRegYn | 빌키발급요청여부 | 인증후 빌키발급여부(Y, N) | A(1) | ●   | "Y" |

## 8.6 요청 전문 해쉬 코드

 
| 항목  | 조합 필드 |
| --- | --- |
| pktHash | 요청일자 + 요청시간 + 상점아이디 + 상점주문번호 + "0" + 해쉬키 |

## 8.7 빌키 발급 API 응답 전문

      
| 파라미터 |     | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- | --- |
| params | mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(12) | ●   | "nxca\_ks\_gu" |
| ver | 버전  | 전문의 버전 | AN(4) | ●   | "0A19"  <br>※ 고정값 |
| method | 결제수단 | 결제수단 | A(2) | ●   | "CA"  <br>※ 고정값 |
| bizType | 업무구분 | 업무 구분코드 | AN(2) | ●   | "A4"  <br>※ 고정값 |
| encCd | 암호화 구분 | 암호화 구분 코드 | N(2) | ●   | "23"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유한 주문번호 | AN(100) | ●   | "PG\_API20220920131039" |
| trdNo | 헥토파이낸셜 거래번호 | 헥토파이낸셜에서 생성하는 고유한 거래번호 | AN(40) | ●   | "STFP\_PGCAnxca\_ks\_gu0220921093117M1260999" |
| trdDt | 거래일자 | 현재 전문을 전송하는 일자(YYYYMMDD) | N(8) | ●   | "20220921" |
| trdTm | 거래시간 | 현재 전문을 전송하는 시간(HHMMSS) | N(6) | ●   | "093117" |
| outStatCd | 거래상태 | 0021:성공, 0031:실패  <br>(성공건 확인: 거래상태=0021 + 결과코드=0000) | N(4) | ●   | "0021" |
| outRsltCd | 결과코드 | 결과코드. 성공 0000, 그 외 \[[거절 코드 표\]](https://develop.sbsvc.online/16/onlineDocList.do#item-544) 참고 | N(4) | ●   | "0000" |
| outRsltMsg | 결과메시지 | 결과 메시지 | AHN(200) | ●   | "정상처리되었습니다" |
| data | pktHash | hash데이터 | SHA256 방식으로 생성한 해쉬값 | AN(64) | ●   | "07d36ed4ef2a773829feca675b01e3f16db40f90b3895c6f8d85e6d0e7c1d583" |
| cardNo | 카드번호 | 카드번호 | N(128) | ○   | "522112\*\*\*\*\*\*1621" |
| issrId | 발급사 아이디 | 카드발급사 식별자  <br>\[[신용카드 식별자](https://develop.sbsvc.online/16/onlineDocList.do#item-545)\] 참고 | A(64) | ○   | "HDC" |
| cardNm | 카드사 명 | 카드사 명  <br>\[[신용카드 식별자](https://develop.sbsvc.online/16/onlineDocList.do#item-545)\] 참고 | AH(20) | ○   | "현대" |
| cardKind | 카드종류 명 | 카드 종류  <br>\[[신용카드 식별자](https://develop.sbsvc.online/16/onlineDocList.do#item-545)\] 참고 | AN(50) | ○   | "현대마스타개인" |
| billKey | 빌키  | 발급요청 Y일때 빌키응답 | AN(40) | ○   | "SBILL\_PGCAnxca\_ks\_gu20222609990921093117" |

## 8.8 응답 전문 해쉬 코드

 
| 항목  | 조합 필드 |
| --- | --- |
| pktHash | 거래상태코드 + 요청일자 + 요청시간 + 상점아이디 + 상점주문번호 + "0" + 해쉬키 |

# 9\. 신용카드 빌키 결제 API(Non-UI)

*   신용카드 결제 API 또는 빌키 발급 API를 통해 전달받은 빌키로 결제를 하는 API입니다.
*   빌키 서비스는 영업 담당자를 통해 별도 신청이 필요합니다.

## 9.1 요청 전문 (가맹점 → 헥토파이낸셜)

      
| 파라미터 |     | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- | --- |
| params | mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디  <br>nxca\_ks\_gu:구인증  <br>nxca\_jt\_bi:비인증 | AN(12) | ●   | "nxca\_jt\_bi" |
| ver | 버전  | 전문의 버전 | AN(4) | ●   | "0A19"  <br>※ 고정값 |
| method | 결제수단 | 결제수단 | A(2) | ●   | "CA"  <br>※ 고정값 |
| bizType | 업무구분 | 업무 구분코드 | AN(2) | ●   | "B0"  <br>※ 고정값 |
| encCd | 암호화 구분 | 암호화 구분 코드 | N(2) | ●   | "23"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유한 주문번호 | AN(100) | ●   | "ORDER20211231100000" |
| trdDt | 요청일자 | 현재 전문을 전송하는 일자(YYYYMMDD) | N(8) | ●   | "20211231" |
| trdTm | 요청시간 | 현재 전문을 전송하는 시간(HHMMSS) | N(6) | ●   | "100000" |
| mobileYn | 모바일 여부 | Y:모바일웹/앱, N:PC 또는 그 외 | A(1) | ○   | "N" |
| osType | OS 구분 | A:Android, I:IOS, W:windows, M:Mac, E:기타  <br>공백:확인불가 | A(1) | ○   | "W" |
| data | pktHash | hash데이터 | SHA256 방식으로 생성한 해쉬값  <br>\[[요청 전문 해쉬 코드](#item-1053)\] 참고 | AN(200) | ●   | "f395b6725a9a18f2563ce34f8bc76698051d27c05e5ba815f463f00429061c0c" |
| pmtprdNm | 상품명 | 결제상품명 | AHN(128) | ●   | "테스트상품" |
| mchtCustNm | 고객명 | 상점 고객명 | AHN(30) | ●   | "홍길동" |
| mchtCustId | 상점고객아이디 | 상점 고객아이디 | AHN(50) | ●   | "HongGilDong" |
| email | 이메일 | 상점 고객 이메일주소 | AN(60) | ○   | "HongGilDong@example.com" |
| billKey | 빌키  | 1회차 결제시 발급받았던 빌키 | AN(50) | ●   | "SBILL\_0123456789" |
| instmtMon | 할부개월수 | 할부개월수 2자리 | N(2) | ●   | "00" |
| crcCd | 통화구분 | 통화구분 | A(3) | ●   | "KRW"  <br>※ 국내결제  <br>"USD"    <br>※ 해외결제 |
| taxTypeCd | 세금유형 | N : 과세, Y : 면세, G : 복합과세  <br>공백일 경우 상점 설정에 따름 | A(1) | ○   | "N" |
| trdAmt | 거래금액 | 거래금액  <br>※AES 암호화 | N(12) | ●   | "1000" ※ 국내결제  <br>"150"   ※ 해외결제  <br>ex \[1.50$\] => 정수표기 \[150\] |
| taxAmt | 과세금액 | 거래금액 중 과세금액  <br>(복합과세일 경우 필수)  <br>※AES 암호화 | N(12) | ○   | "909" |
| vatAmt | 부가세금액 | 거래금액 중 부가세금액  <br>(복합과세일 경우 필수)  <br>※AES 암호화 | N(12) | ○   | "91" |
| taxFreeAmt | 비과세금액 | 거래금액 중 비과세금액  <br>(복합과세일 경우 필수)  <br>※AES 암호화 | N(12) | ○   | "0" |
| svcAmt | 봉사료 | 신용카드 봉사료  <br>※AES 암호화 | N(12) | ○   | "10" |
| mchtParam | 상점예약필드 | 기타 주문 정보를 입력하는 상점 예약 필드 | AHN(4000) | ○   | "name=HongGilDong&age=25" |

## 9.2 요청 전문 해쉬 코드

 
| 항목  | 조합 필드 |
| --- | --- |
| pktHash | 거래일자 + 거래시간 + 상점아이디 + 상점주문번호 + 거래금액(평문) + 해쉬키 |

## 9.3 응답 전문 (헥토파이낸셜 → 가맹점)

      
| 파라미터 |     | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- | --- |
| params | mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(12) | ●   | "nxca\_jt\_bi" |
| ver | 버전  | 전문의 버전 | AN(4) | ●   | "0A19"  <br>※ 고정값 |
| method | 결제수단 | 결제수단 | A(2) | ●   | "CA"  <br>※ 고정값 |
| bizType | 업무구분 | 업무 구분코드 | AN(2) | ●   | "B0"  <br>※ 고정값 |
| encCd | 암호화 구분 | 암호화 구분 코드 | N(2) | ●   | "23"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유한 주문번호 | AN(100) | ●   | "ORDER20211231100000" |
| trdNo | 헥토파이낸셜거래번호 | 헥토파이낸셜에서 발급한 고유한 거래번호 | AN(40) | ●   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| trdDt | 요청일자 | 현재 전문을 전송하는 일자(YYYYMMDD) | N(8) | ●   | "20211231" |
| trdTm | 요청시간 | 현재 전문을 전송하는 시간(HHMMSS) | N(6) | ●   | "100000" |
| outStatCd | 거래상태 | 거래상태코드(성공/실패)  <br>0021:성공  <br>0031:실패 | AN(4) | ●   | "0021" |
| outRsltCd | 거절코드 | 거래상태가 "0031"일 경우, 상세 코드 전달  <br>\[[거절 코드 표](#item-544)\] 참고 | AN(4) | ●   | "0000" |
| outRsltMsg | 결과메세지 | 결과 메세지 전달  <br>URL Encoding, UTF-8 | AHN(200) | ●   | "정상적으로 처리되었습니다." |
| data | pktHash | 해쉬값 | 요청시, hash 값 그대로 return | AN(64) | ●   |     |
| trdAmt | 거래금액 | 거래금액  <br>※AES 암호화 | N(12) | ●   | "1000" |
| billKey | 빌키  | 요청 시 값 그대로 return | AN(50) | ●   | "SBILL\_0123456789" |
| cardNo | 카드번호 | 마스킹 된 카드번호를 return합니다.  <br>※ 기본적으로 제공되지 않으며, 특정 상점에 한하여 제공됩니다. 사업부에 문의 부탁드립니다. | N(16) | ○   | "111122xxxxxx4444" |
| vldDtMon | 유효기간(월) | 유효기간 MM  <br>※ 빌키 서비스 이용 상점에 한하여 제공됩니다. | N(2) | ○   | "12" |
| vldDtYear | 유효기간(년) | 유효기간 YY  <br>※ 빌키 서비스 이용 상점에 한하여 제공됩니다. | N(2) | ○   | "24" |
| issrId | 발급사아이디 | 카드발급사 식별자  <br>\[[신용카드 식별자](#item-545)\] 참고 | AN(4) | ●   | "NHC" |
| cardNm | 카드사명 | 카드사 명  <br>\[[신용카드 식별자](#item-545)\] 참고 | AHN(20) | ●   | "NH 농협" |
| cardKind | 카드종류명 | 카드 종류  <br>\[[신용카드 식별자](#item-545)\] 참고 | AHN(50) | ●   | "NH 체크카드" |
| ninstmtTypeCd | 무이자할부타입 | Y:무이자(부분,상점)  <br>N:일반할부, 일시불 | A(1) | ●   | "N" |
| instmtMon | 할부개월수 | 요청 시 값 그대로 return | N(2) | ○   | "00" |
| apprNo | 승인번호 | 카드 승인번호 | N(15) | ●   | "30001234" |

## 9.4 응답 전문 해쉬 코드

 
| 항목  | 조합 필드 |
| --- | --- |
| pktHash | 거래상태코드 + 요청일자 + 요청시간 + 상점아이디 + 상점주문번호 + 거래금액 + 해쉬키 |

# 10\. 신용카드 빌키 삭제 API (Non-UI)

## 10.1 요청 전문 (가맹점 → 헥토파이낸셜)

      
| 파라미터 |     | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- | --- |
| params | mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디  <br>nxca\_jt\_bi:비인증  <br>nxca\_ks\_gu:구인증 | AN(12) | ●   | "nxca\_jt\_bi" |
| ver | 버전  | 전문의 버전 | AN(4) | ●   | "0A19"  <br>※ 고정값 |
| method | 결제수단 | 결제수단 | A(2) | ●   | "CA"  <br>※ 고정값 |
| bizType | 업무구분 | 업무 구분코드 | AN(2) | ●   | "A1"  <br>※ 고정값 |
| encCd | 암호화 구분 | 암호화 구분 코드 | N(2) | ●   | "23"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유한 주문번호 | AN(100) | ●   | "ORDER20211231100000" |
| trdDt | 요청일자 | 현재 전문을 전송하는 일자(YYYYMMDD) | N(8) | ●   | "20211231" |
| trdTm | 요청시간 | 현재 전문을 전송하는 시간(HHMMSS) | N(6) | ●   | "100000" |
| mobileYn | 모바일 여부 | Y:모바일웹/앱, N:PC 또는 그 외 | A(1) | ○   | "N" |
| osType | OS 구분 | A:Android, I:IOS, W:windows, M:Mac, E:기타  <br>공백:확인불가 | A(1) | ○   | "W" |
| data | pktHash | hash데이터 | SHA256 방식으로 생성한 해쉬값  <br>\[[요청 전문 해쉬 코드](#item-1056)\] 참고 | AN(200) | ●   | "f395b6725a9a18f2563ce34f8bc76698051d27c05e5ba815f463f00429061c0c" |
| billKey | 빌키  | 1회차 응답으로 발급받은 빌키 | AN(50) | ●   | "SBILL\_0123456789" |
| etcInfo | 해지사유 | 해지사유코드 | AN(12) | ○   | ""  |

## 10.2 요청 전문 해쉬 코드

 
| 항목  | 조합 필드 |
| --- | --- |
| pktHash | 거래일자 + 거래시간 + 상점아이디 + 상점주문번호 + "0" + 해쉬키 |

## 10.3 응답 전문 (헥토파이낸셜 → 가맹점)

      
| 파라미터 |     | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- | --- |
| params | mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(12) | ●   | "nxca\_jt\_bi" |
| ver | 버전  | 전문의 버전 | AN(4) | ●   | "0A19"  <br>※ 고정값 |
| method | 결제수단 | 결제수단 | A(2) | ●   | "CA"  <br>※ 고정값 |
| bizType | 업무구분 | 업무 구분코드 | AN(2) | ●   | "A1"  <br>※ 고정값 |
| encCd | 암호화 구분 | 암호화 구분 코드 | N(2) | ●   | "23"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유한 주문번호 | AN(100) | ●   | "ORDER20211231100000" |
| trdNo | 헥토파이낸셜거래번호 | 헥토파이낸셜에서 발급한 고유한 거래번호 | AN(40) | ●   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| trdDt | 요청일자 | 현재 전문을 전송하는 일자(YYYYMMDD) | N(8) | ●   | "20211231" |
| trdTm | 요청시간 | 현재 전문을 전송하는 시간(HHMMSS) | N(6) | ●   | "100000" |
| outStatCd | 거래상태 | 거래상태코드(성공/실패)  <br>0021:성공  <br>0031:실패 | AN(4) | ●   | "0021" |
| outRsltCd | 거절코드 | 거래상태가 "0031"일 경우, 상세 코드 전달  <br>\[[거절 코드 표](#item-544)\] 참고 | AN(4) | ●   | "0000" |
| outRsltMsg | 결과메세지 | 결과 메세지 전달  <br>URL Encoding, UTF-8 | AHN(200) | ●   | "정상적으로 처리되었습니다." |
| data | pktHash | 해쉬값 | 요청시, hash 값 그대로 return | AN(64) | ●   |     |
| billKey | 빌키  | 요청시, 값 그대로 return | AN(50) | ●   | "SBILL\_0123456789" |

## 10.4 응답 전문 해쉬 코드

 
| 항목  | 조합 필드 |
| --- | --- |
| pktHash | 거래상태코드 + 요청일자 + 요청시간 + 상점아이디 + 상점주문번호 + 거래금액 + 해쉬키 |

# 11\. 신용카드 취소 (Non-UI)

## 11.1 요청 전문 (가맹점 → 헥토파이낸셜)

*   API URI
    *   테스트계 : https://tbgw.settlebank.co.kr/spay/APICancel.do
    *   운영계 : https://gw.settlebank.co.kr/spay/APICancel.do

  
가맹점 서버에서 헥토파이낸셜측으로 요청하는 컬럼을 다음과 같이 정의합니다.

      
| 파라미터 |     | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- | --- |
| params | mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디  <br>nxca\_jt\_il:인증  <br>nxca\_jt\_bi:비인증  <br>nxca\_ks\_gu:구인증  <br>nxca\_ab\_bi:영문외화 비인증 | AN(12) | ●   | "nxca\_jt\_il" |
| ver | 버전  | 전문의 버전 | AN(4) | ●   | "0A19"  <br>※ 고정값 |
| method | 결제수단 | 결제수단 | A(2) | ●   | "CA"  <br>※ 고정값 |
| bizType | 업무구분 | 업무 구분코드 | AN(2) | ●   | "C0"  <br>※ 고정값 |
| encCd | 암호화 구분 | 암호화 구분 코드 | N(2) | ●   | "23"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유한 주문번호 | AN(100) | ●   | "ORDER20211231100000" |
| trdDt | 취소요청일자 | 현재 전문을 전송하는 일자(YYYYMMDD) | N(8) | ●   | "20211231" |
| trdTm | 취소요청시간 | 현재 전문을 전송하는 시간(HHMMSS) | N(6) | ●   | "100000" |
| mobileYn | 모바일 여부 | Y:모바일웹/앱, N:PC 또는 그 외 | A(1) | ○   | "N" |
| osType | OS 구분 | A:Android, I:IOS, W:windows, M:Mac, E:기타, 공백:확인불가 | A(1) | ○   | "W" |
| data | pktHash | hash데이터 | SHA256 방식으로 생성한 해쉬값  <br>\[[요청 전문 해쉬 코드](#item-441)\] 참고 | AN(200) | ●   | "f395b6725a9a18f2563ce34f8bc76698051d27c05e5ba815f463f00429061c0c" |
| orgTrdNo | 원거래번호 | 결제 시, 헥토파이낸셜에서 발급한 거래번호 | AN(40) | ●   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| crcCd | 통화구분 | 통화 구분 값 | A(3) | ●   | "KRW" ※국내결제  <br>"USD"  ※해외결제 |
| cnclOrd | 취소회차 | 001부터 시작. 부분취소 2회차의 경우 002 | N(3) | ●   | "001" |
| taxTypeCd | 면세여부 | Y:면세, N:과세, G:복합과세. 공백일 경우 상점 기본 정보에 따름. | A(1) | ○   | "N" |
| cnclAmt | 취소금액 | 취소금액  <br>※ AES 암호화 | N(12) | ●   | "1000" ※국내결제  <br>"150"   ※해외결제  <br>ex \[1.50$\] => 정수표기 \[150\] |
| taxAmt | 과세금액 | 취소금액 중 과세금액(복합과세인 경우 필수)  <br>※ AES 암호화 | N(12) | ○   | "909" |
| vatAmt | 부가세금액 | 취소금액 중 부가세금액(복합과세인 경우 필수)  <br>※ AES 암호화 | N(12) | ○   | "91" |
| taxFreeAmt | 비과세금액 | 취소금액 중 면세금액(복합과세인 경우 필수)  <br>※ AES 암호화 | N(12) | ○   | "0" |
| svcAmt | 봉사료 | 취소금액 중 봉사료  <br>※ AES 암호화 | N(12) | ○   | "0" |
| cnclRsn | 취소사유내용 | 필요한 경우, 취소 사유 메세지 기재 | AHN(255) | ○   | "상품이 마음에 들지 않아서" |

## 11.2 요청 전문 해쉬 코드

 
| 항목  | 조합 필드 |
| --- | --- |
| pktHash | 취소요청일자 + 취소요청시간 + 상점아이디 + 상점주문번호 + 취소금액(평문) + 해쉬키 |

## 11.3 응답 전문 (헥토파이낸셜 → 가맹점)

헥토파이낸셜에서 가맹점측으로 응답하는 컬럼을 다음과 같이 정의합니다.

      
| 파라미터 |     | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- | --- |
| params | mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디  <br>nxca\_jt\_il:인증  <br>nxca\_jt\_bi:비인증  <br>nxca\_ks\_gu:구인증 | AN(12) | ●   | "nxca\_jt\_il" |
| ver | 버전  | 전문의 버전 | AN(4) | ●   | "0A19"  <br>※ 고정값 |
| method | 결제수단 | 결제수단 | A(2) | ●   | "CA"  <br>※ 고정값 |
| bizType | 업무구분 | 업무 구분코드 | AN(2) | ●   | "C0"  <br>※ 고정값 |
| encCd | 암호화 구분 | 암호화 구분 코드 | N(2) | ●   | "23"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유한 주문번호 | AN(100) | ●   | "ORDER20211231100000" |
| trdNo | 헥토파이낸셜 거래번호 | 헥토파이낸셜에서 생성하는 고유한 거래번호 | AN(40) | ●   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| trdDt | 취소요청일자 | 현재 전문을 전송하는 일자(YYYYMMDD) | N(8) | ●   | "20211231" |
| trdTm | 취소요청시간 | 현재 전문을 전송하는 시간(HHMMSS) | N(6) | ●   | "100000" |
| outStatCd | 거래상태 | 거래상태코드(성공/실패)  <br>0021:성공  <br>0031:실패 | AN(4) | ●   | "0021" |
| outRsltCd | 거절코드 | 거래상태가 "0031"일 경우, 상세 코드 전달  <br>\[[거절 코드 표](#item-544)\] 참고 | AN(4) | ●   | "0000" |
| outRsltMsg | 결과메세지 | 결과 메세지 전달  <br>URL Encoding, UTF-8 | AHN(200) | ●   | "정상적으로 처리되었습니다." |
| data | pktHash | 해쉬값 | 요청시, hash 값 그대로 return | AN(64) | ●   |     |
| orgTrdNo | 원거래번호 | 결제 시, 헥토파이낸셜에서 발급한 거래번호 | AN(40) | ●   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| cnclAmt | 취소금액 | 취소금액  <br>※ AES 암호화 | N(12) | ●   | "1000" ※국내결제  <br>"150"   ※해외결제  <br>ex \[1.50$\] => 정수표기 \[150\] |
| cardCnclAmt | 신용카드 취소금액 | 전체금액 중 신용카드 취소금액  <br>※ AES 암호화 | N(12) | ●   | "5000" |
| pntCnclAmt | 포인트 취소금액 | 전체금액 중 포인트 취소금액  <br>※ AES 암호화 | N(12) | ●   | "1000" |
| blcAmt | 취소가능잔액 | 취소성공시 거래번호 기준 남은 취소 가능잔액 리턴  <br>※ AES 암호화 | N(12) | ●   | "0" |

## 11.4 노티 전문 (헥토파이낸셜 → 가맹점)

※ \[[6.5 노티 전문](#item-773)\] 참고

# 12\. 계좌이체 결제 (UI)

####  계좌이체 고객통장 적요

*   뱅크페이 결제 및 취소 시 고객통장에 찍히는 적요는 아래 정책에 따라 결정됩니다.
*   **결제 및 익일환불**: 뱅크페이에 등록된 가맹점명을 사용. 수정이 필요한 경우 헥토파이낸셜에 문의 필요
*   **당일취소**: 은행 정책에 따라 다름

## 12.1 요청 전문 (가맹점 → 헥토파이낸셜)

가맹점 서버에서 헥토파이낸셜측으로 요청하는 컬럼을 다음과 같이 정의합니다.

     
| 파라미터 | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- |
| mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(10) | ●   | "nx\_mid\_il" |
| method | 결제수단 | PG 서비스에 해당하는 결제 구분 코드 | AN(20) | ●   | "bank"  <br>※ 고정값 |
| trdDt | 요청일자 | yyyyMMdd | N(8) | ●   | "20211231" |
| trdTm | 요청시간 | HH24MISS | N(6) | ●   | "100000" |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유 주문번호  <br>※ 한글 제외 | AN(100) | ●   | "ORDER20211231100000" |
| mchtName | 상점한글명 | 상점한글명 | AHN(100) | ●   | "헥토파이낸셜" |
| mchtEName | 상점영문명 | 상점영문명 | AN(100) | ●   | "Hecto Financial" |
| pmtPrdtNm | 상품명 | 결제상품명 | AHN(128) | ●   | "테스트상품" |
| trdAmt | 거래금액 | 거래금액  <br>※ AES 암호화 | N(12) | ●   | "1000" |
| mchtCustNm | 고객명 | 고객명  <br>※ AES 암호화 | AHN(30) | ○   | "홍길동" |
| notiUrl | 결과처리 URL | 결제 후 결과 전달되는 페이지의 URL(Server To Server 연동 URL) | AN(250) | ●   | "https://example.com/notiUrl" |
| nextUrl | 결과화면 URL | 결제 후 결과 전달 및 이동페이지 URL | AN(250) | ●   | "https://example.com/nextUrl" |
| cancUrl | 결제취소 URL | 고객 강제 종료시 결과 전달 및 이동페이지 URL | AN(250) | ●   | "https://example.com/cancUrl" |
| mchtParam | 상점예약필드 | 기타 주문 정보를 입력하는 상점 예약 필드 | AHN(4000) | ○   | "name=HongGilDong&age=25" |
| email | 이메일 | 이메일 주소  <br>※ AES 암호화 | AN(60) | ○   | "HongGilDong@example.com" |
| prdtTerm | 상품제공기간 | yyyyMMddHHmmss  <br>값이 없으면 일반결제로 표기 | N(14) | ○   | "20221231235959" |
| mchtCustId | 상점고객아이디 | 상점에서 보내주는 고유 고객아이디 혹은 유니크키  <br>※ AES 암호화 | AN(50) | ○   | "HongGilDong" |
| taxTypeCd | 면세여부 | N:과세, Y:면세, G:복합과세  <br>공백일 경우 상점 설정에 따름 | A(1) | ○   | "N" |
| taxAmt | 과세금액 | 과세 금액 (복합과세일 경우 필수)  <br>※ AES 암호화 | N(12) | ○   | "909" |
| vatAmt | 부가세금액 | 부가세 금액 (복합과세일 경우 필수)  <br>※ AES 암호화 | N(12) | ○   | "91" |
| taxFreeAmt | 비과세금액 | 면세 금액 (복합과세일 경우 필수)  <br>※ AES 암호화 | N(12) | ○   | "0" |
| custIp | 고객 IP주소 | 상점 서버의 IP가 아닌, 고객 기기의 IP주소 | AN(15) | ○   | "127.0.0.1" |
| appScheme | 앱스키마 | (AppScheme://~)형식으로 사용되며, 자체앱을 구축하는 경우 사용 | AN(100) | ○   | "PAYAPPNAME://" |
| pktHash | hash데이터 | SHA256 방식으로 생성한 해쉬값  <br>\[[요청 전문 해쉬 코드](#item-445)\] 참고 | AN(200) | ●   | "f395b6725a9a18f2563ce34f8bc76698051d27c05e5ba815f463f00429061c0c" |

## 12.2 요청 전문 해쉬 코드

 
| 항목  | 조합 필드 |
| --- | --- |
| pktHash | 상점아이디 + 결제수단 + 상점주문번호 + 요청일자 + 요청시간 + 거래금액(평문) + 해쉬키 |

## 12.3 응답 전문 (헥토파이낸셜 → 가맹점)

계좌이체 결제창에서 가맹점측으로 응답하는 컬럼을 다음과 같이 정의 합니다.

     
| 파라미터 | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- |
| mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(10) | ●   | "nx\_mid\_il" |
| outStatCd | 거래상태 | 거래상태코드(성공/실패)  <br>0021:성공  <br>0031:실패 | AN(4) | ●   | "0021" |
| outRsltCd | 거절코드 | 거래상태가 "0031"일 경우, 상세 코드 전달  <br>\[[거절 코드 표](#item-544)\] 참고 | AN(4) | ●   | "0000" |
| outRsltMsg | 결과메세지 | 결과 메세지 전달  <br>URL Encoding, UTF-8 | AHN(200) | ●   | "결제 요청 정보 누락 (상품명)" |
| method | 결제수단 | PG 서비스에 해당하는 결제 구분 코드 | AN(20) | ●   | "bank"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유 주문번호  <br>※ 한글 제외 | AN(100) | ●   | "ORDER20211231100000" |
| mchtCustId | 상점고객아이디 | 보내주는 고유 고객아이디 혹은 유니크 키  <br>※ AES 암호화 | AN(50) | ○   | "HongGilDong" |
| trdNo | 거래번호 | 헥토파이낸셜 거래번호 | AN(40) | ●   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| trdAmt | 거래금액 | 거래금액  <br>※ AES 암호화 | N(12) | ●   | "1000" |
| mchtParam | 상점예약필드 | 요청으로 받은 필드값을 응답으로 Bypass | AHN(4000) | ○   | "name=HongGilDong&age=25" |
| authDt | 승인일시 | 결제 승인 일시 | N(14) | ○   | "20211231100000" |
| fnNm | 은행명 | 은행명  <br>\[[금융 기관 식별자](#item-546)\] 참고 | AH(50) | ○   | "농협" |
| fnCd | 은행코드 | 은행 코드  <br>\[[금융 기관 식별자](#item-546)\] 참고 | N(4) | ○   | "11" |

## 12.4 노티 전문 (헥토파이낸셜 → 가맹점)

거래가 정상적으로 완료되면, 헥토파이낸셜에서 가맹점으로 노티(결과통보) 메세지가 전송됩니다.

     
| 파라미터 | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- |
| outStatCd | 거래상태 | 성공\[0021\] | N(4) | ●   | "0021" |
| trdNo | 거래번호 | 헥토파이낸셜에서 부여하는 고유 거래번호 | AN(40) | ●   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| method | 결제수단 | 계좌이체\[RA\] | A(2) | ●   | "RA" |
| bizType | 업무구분 | 승인\[B0\], 취소\[C0\] | AN(2) | ●   | "B0" |
| mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 상점아이디 | AN(12) | ●   | "nx\_mid\_il" |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유 주문 번호 | AN(100) | ●   | "ORDER20211231100000" |
| mchtCustNm | 고객명 | 실제 결제자의 주문자명 | AHN(30) | ○   | "홍길동" |
| mchtName | 상점한글명 | 실판매자명, 거래요청시 실판매자명이 없는 경우 헥토파이낸셜와 계약된 상점명 | AHN(20) | ○   | "헥토파이낸셜" |
| pmtprdNm | 상품명 | 고객이 주문한 결제 상품명 | AHN(128) | ○   | "테스트상품" |
| trdDtm | 거래일시 | 승인일시, 취소/부분취소거래 : 취소일시가 전달됩니다.  <br>형식:YYYYMMDDhhmmss | N(14) | ●   | "20211231100000" |
| trdAmt | 거래금액 | 거래금액 | N(12) | ○   | "1000" |
| bankCd | 은행코드 | 은행 코드  <br>\[[금융기관 식별자](#item-546)\] 참고 | AN(10) | ○   | "011" |
| bankNm | 은행명 | 은행명  <br>\[[금융기관 식별자](#item-546)\] 참고 | AHN(10) | ○   | "NH농협" |
| acntPrintNm | 통장인자명 | 고객의 통장에 찍힐 통장인자명 - 결제요청시 전달된 값으로 전달됩니다.  <br>단, 값이 없는 경우는 헥토파이낸셜와 계약된 상점명으로 전달됩니다. | AHN(12) | ○   | "헥토파이낸셜" |
| email | 고객이메일 | 상점 고객이메일 | AN(60) | ○   | "HongGilDong@example.com" |
| mchtCustId | 상점고객아이디 | 상점 고객 아이디 | AN(50) | ○   | "HongGilDong" |
| orgTrdNo | 원거래번호 | 취소 시, 원거래번호 | AN(40) | ○   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| orgTrdDt | 원거래일자 | 취소 시, 원거래일자 | N(8) | ○   | "20211231" |
| csrcIssNo | 현금영수증 승인번호 | 현금영수증 승인번호 | AN(9) | ○   | "0123456789" |
| cnclType | 취소거래타입 | 00:전체취소, 10:부분취소 | N(2) | ○   | "00" |
| mchtParam | 상점예약필드 | 상점에서 이용하는 추가 정보 필드로 전달한 값이 그대로 반환됩니다. | AHN(4000) | ○   | "name=HongGilDong&age=25" |
| pktHash | 해쉬값 | SHA256 (거래상태코드+거래일자+거래시간+상점아이디+상점주문번호+거래금액+해쉬키) | AN(64) | ●   | "a2d6d597d55d7c9b689baa2e08c1ddf0ce71f4248c5b9b59fe61bfbf949543e1" |

가맹점에서 헥토파이낸셜로 응답을 전송합니다.

 
| 응답 (가맹점 → 헥토파이낸셜) |     |
| --- | --- |
| 성공시 | "OK" (대문자) |
| 실패시 | "FAIL" (대문자, FAIL로 응답시 명확한 실패로 인식합니다. 노티가 재전송 됩니다.) |
| 그 외 | 비정상 실패로 인식하여, 설정된 횟수만큼 노티 재발송 처리함. |

# 13\. 계좌이체 취소 (Non-UI)

## 13.1 요청 전문 (가맹점 → 헥토파이낸셜)

가맹점 서버에서 헥토파이낸셜측으로 요청하는 컬럼을 다음과 같이 정의합니다.

      
| 파라미터 |     | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- | --- |
| params | mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(12) | ●   | "nx\_mid\_il" |
| ver | 버전  | 전문의 버전 | AN(4) | ●   | "0A19"  <br>※ 고정값 |
| method | 결제수단 | 결제수단 | A(2) | ●   | "RA"  <br>※ 고정값 |
| bizType | 업무구분 | 업무 구분코드 | AN(2) | ●   | "C0"  <br>※ 고정값 |
| encCd | 암호화 구분 | 암호화 구분 코드 | N(2) | ●   | "23"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유한 주문번호 | AN(100) | ●   | "ORDER20211231100000" |
| trdDt | 취소요청일자 | 현재 전문을 전송하는 일자(YYYYMMDD) | N(8) | ●   | "20211231" |
| trdTm | 취소요청시간 | 현재 전문을 전송하는 시간(HHMMSS) | N(6) | ●   | "100000" |
| mobileYn | 모바일 여부 | Y:모바일웹/앱, N:PC 또는 그 외 | A(1) | ○   | "N" |
| osType | OS 구분 | A:Android, I:IOS, W:windows, M:Mac, E:기타, 공백:확인불가 | A(1) | ○   | "W" |
| data | pktHash | hash데이터 | SHA256 방식으로 생성한 해쉬값  <br>\[[요청 전문 해쉬 코드](#item-451)\] 참고 | AN(200) | ●   | "f395b6725a9a18f2563ce34f8bc76698051d27c05e5ba815f463f00429061c0c" |
| orgTrdNo | 원거래번호 | 결제 시, 헥토파이낸셜에서 발급한 거래번호 | AN(40) | ●   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| crcCd | 통화구분 | 통화 구분 값 | A(3) | ●   | "KRW"  <br>※ 고정값 |
| cnclOrd | 취소회차 | 001부터 시작. 부분취소 2회차의 경우 002 | N(3) | ●   | "001" |
| taxTypeCd | 면세여부 | Y:면세, N:과세, G:복합과세. 공백일 경우 상점 기본 정보에 따름. | A(1) | ○   | "N" |
| cnclAmt | 취소금액 | 취소금액  <br>※ AES 암호화 | N(12) | ●   | "1000" |
| taxAmt | 과세금액 | 취소금액 중 과세금액(복합과세인 경우 필수)  <br>※ AES 암호화 | N(12) | ○   | "909" |
| vatAmt | 부가세금액 | 취소금액 중 부가세금액(복합과세인 경우 필수)  <br>※ AES 암호화 | N(12) | ○   | "91" |
| taxFreeAmt | 비과세금액 | 취소금액 중 면세금액(복합과세인 경우 필수)  <br>※ AES 암호화 | N(12) | ○   | "0" |
| cnclRsn | 취소사유내용 | 필요한 경우, 취소 사유 메세지 기재 | AHN(255) | ○   | "상품이 마음에 들지 않아서" |

## 13.2 요청 전문 해쉬 코드

 
| 항목  | 조합 필드 |
| --- | --- |
| pktHash | 취소요청일자 + 취소요청시간 + 상점아이디 + 상점주문번호 + 취소금액(평문) + 해쉬키 |

## 13.3 응답 전문 (헥토파이낸셜 → 가맹점)

헥토파이낸셜에서 가맹점측으로 응답하는 컬럼을 다음과 같이 정의합니다.

      
| 파라미터 |     | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- | --- |
| params | mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(10) | ●   | "nx\_mid\_il" |
| ver | 버전  | 전문의 버전 | AN(4) | ●   | "0A19"  <br>※ 고정값 |
| method | 결제수단 | 결제수단 | A(2) | ●   | "RA"  <br>※ 고정값 |
| bizType | 업무구분 | 업무 구분코드 | AN(2) | ●   | "C0"  <br>※ 고정값 |
| encCd | 암호화 구분 | 암호화 구분 코드 | N(2) | ●   | "23"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유한 주문번호 | AN(100) | ●   | "ORDER20211231100000" |
| trdNo | 헥토파이낸셜 거래번호 | 헥토파이낸셜에서 생성하는 고유한 거래번호 | AN(40) | ●   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| trdDt | 취소요청일자 | 현재 전문을 전송하는 일자(YYYYMMDD) | N(8) | ●   | "20211231" |
| trdTm | 취소요청시간 | 현재 전문을 전송하는 시간(HHMMSS) | N(6) | ●   | "100000" |
| outStatCd | 거래상태 | 거래상태코드(성공/실패)  <br>0021:성공  <br>0031:실패 | AN(4) | ●   | "0021" |
| outRsltCd | 거절코드 | 거래상태가 "0031"일 경우, 상세 코드 전달  <br>\[[거절 코드 표](#item-544)\] 참고 | AN(4) | ●   | "0000" |
| outRsltMsg | 결과메세지 | 결과 메세지 전달  <br>URL Encoding, UTF-8 | AHN(200) | ●   | "정상적으로 처리되었습니다." |
| data | pktHash | 해쉬값 | 요청시, hash 값 그대로 return | AN(64) | ●   |     |
| orgTrdNo | 원거래번호 | 결제 시, 헥토파이낸셜에서 발급한 거래번호 | AN(40) | ●   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| cnclAmt | 취소금액 | 취소금액  <br>※ AES 암호화 | N(12) | ●   | "1000" |
| blcAmt | 취소가능잔액 | 취소성공시 거래번호 기준 남은 취소 가능잔액 리턴  <br>※ AES 암호화 | N(12) | ●   | "0" |

## 13.4 노티 전문 (헥토파이낸셜 → 가맹점)

※ \[[12.4 노티 전문](#item-713)\] 참고

# 14\. 가상계좌 결제(UI)

## 14.1 요청 전문 (가맹점 → 헥토파이낸셜)

     
| 파라미터 | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- |
| mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(10) | ●   | "nx\_mid\_il" |
| method | 결제수단 | PG 서비스에 해당하는 결제 구분 코드 | AN(20) | ●   | “vbank”  <br>※ 고정값 |
| trdDt | 요청일자 | yyyyMMdd | N(8) | ●   | "20211231" |
| trdTm | 요청시간 | HH24MISS | N(6) | ●   | "100000" |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유 주문번호  <br>※ 한글 제외 | AN(100) | ●   | "ORDER20211231100000" |
| mchtName | 상점한글명 | 상점한글명 | AHN(100) | ●   | "헥토파이낸셜" |
| mchtEName | 상점영문명 | 상점영문명 | AN(100) | ●   | "Hecto Financial" |
| pmtPrdtNm | 상품명 | 결제상품명 | AHN(128) | ●   | "테스트상품" |
| trdAmt | 거래금액 | 거래금액  <br>※ AES 암호화 | N(12) | ●   | "1000" |
| mchtCustNm | 고객명 | 고객명  <br>※ AES 암호화 | AHN(30) | ○   | "홍길동" |
| custAcntSumry | 통장인자내용 | 고객의 통장에 찍힐 인자명  <br>※ 공백일 경우 mchtName(상점한글명)을 통장인자명으로 사용 | AHN(50) | ○   | "가맹점명\_홍길동" |
| expireDt | 입금만료일 | 가상계좌 신청후 입금이 되어야 하는 기한 일시  <br>예) 신청일이 12월 30일인 경우 입금일을 "20201231235959"로 넘기면 입금기한은 12월 31일까지 입니다.  <br>※ 입금만료일을 넣지 않을 경우 거래일 기준으로 10일 뒤로 자동 세팅됩니다.  <br>  <br>※ 입금만료일의 최대기한은 현재일 기준 +365일 23:59:59를 초과할 수 없습니다.  <br>예) 신청일이 2022년  1월 1일인 경우, 20230101235959 를 초과할수 없습니다. | N(14) | ○   | "20211231235959" |
| notiUrl | 결과처리 URL | 결제 후 결과 전달되는 페이지의 URL(Server To Server 연동 URL) | AN(250) | ●   | "https://example.com/notiUrl" |
| nextUrl | 결과화면 URL | 결제 후 결과 전달 및 이동페이지 URL | AN(250) | ●   | "https://example.com/nextUrl" |
| cancUrl | 결제취소 URL | 고객 강제 종료시 결과 전달 및 이동페이지 URL | AN(250) | ●   | "https://example.com/cancUrl" |
| mchtParam | 상점예약필드 | 기타 주문 정보를 입력하는 상점 예약 필드 | AHN(4000) | ○   | "name=HongGilDong&age=25" |
| email | 이메일 | 이메일 주소  <br>※ AES 암호화 | AN(60) | ○   | "HongGilDong@example.com" |
| prdtTerm | 상품제공기간 | yyyyMMddHHmmss  <br>값이 없으면 일반결제로 표기 | N(14) | ○   | "20221231235959" |
| cphoneNo | 휴대폰번호 | 010xxxxyyyy(하이픈 제거)  <br>※ AES 암호화 | N(11) | ○   | "01012345678" |
| mchtCustId | 상점고객아이디 | 상점에서 보내주는 고유 고객아이디 혹은 유니크키  <br>※ AES 암호화 | AN(50) | ○   | "HongGilDong" |
| taxTypeCd | 면세여부 | N:과세, Y:면세, G:복합과세  <br>공백일 경우 상점 설정에 따름 | A(1) | ○   | "N" |
| taxAmt | 과세금액 | 과세금액(복합과세일 경우 필수)  <br>※ AES 암호화 | N(12) | ○   | "909" |
| vatAmt | 부가세금액 | 부가세금액(복합과세일 경우 필수)  <br>※ AES 암호화 | N(12) | ○   | "91" |
| taxFreeAmt | 비과세금액 | 면세금액(복합과세일 경우 필수)  <br>※ AES 암호화 | N(12) | ○   | "0" |
| custIp | 고객 IP주소 | 상점 서버의 IP가 아닌, 고객 기기의 IP주소 | AN(15) | ○   | "127.0.0.1" |
| pktHash | hash데이터 | SHA256 방식으로 생성한 해쉬값  <br>\[[요청 전문 해쉬 코드](#item-455)\] 참고 | AN(200) | ●   | "f395b6725a9a18f2563ce34f8bc76698051d27c05e5ba815f463f00429061c0c" |

## 14.2 요청 전문 해쉬 코드

 
| 항목  | 조합 필드 |
| --- | --- |
| pktHash | 상점아이디 + 결제수단 + 상점주문번호 + 요청일자 + 요청시간 + 거래금액(평문) + 해쉬키 |

## 14.3 응답 전문 (헥토파이낸셜 → 가맹점)

가상계좌 결제창에서 가맹점측으로 응답하는 컬럼을 다음과 같이 정의 합니다.

     
| 파라미터 | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- |
| mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(10) | ●   | "nx\_mid\_il" |
| outStatCd | 거래상태 | 거래상태코드(성공/실패)  <br>0051:채번(가상계좌 발급) 성공  <br>0031:실패 | AN(4) | ●   | "0051" |
| outRsltCd | 거절코드 | 거래상태가 "0031"일 경우, 상세 코드 전달  <br>\[[거절 코드 표](#item-544)\] 참고 | AN(4) | ●   | "0000" |
| outRsltMsg | 결과메세지 | 결과 메세지 전달  <br>URL Encoding, UTF-8 | AHN(200) | ●   | "결제 요청 정보 누락 (상품명)" |
| method | 결제수단 | PG 서비스에 해당하는 결제 구분 코드 | AN(20) | ●   | "vbank"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유 주문번호  <br>※ 한글 제외 | AN(100) | ●   | "ORDER20211231100000" |
| mchtCustId | 상점고객아이디 | 보내주는 고유 고객아이디 혹은 유니크 키  <br>※ AES 암호화 | AN(50) | ○   | "HongGilDong" |
| trdNo | 거래번호 | 헥토파이낸셜 거래번호 | AN(40) | ●   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| trdAmt | 거래금액 | 거래금액  <br>※ AES 암호화 | N(12) | ●   | "1000" |
| mchtParam | 상점예약필드 | 요청으로 받은 필드값을 응답으로 Bypass | AHN(4000) | ○   | "name=HongGilDong&age=25" |
| authDt | 승인일시 | 가상계좌 주문(채번) 일시 | N(14) | ○   | "20211231100000" |
| vtlAcntNo | 가상계좌번호 | 고객이 입금할 가상계좌번호  <br>※ AES 암호화 | N(30) | ○   | "0123456789" |
| expireDt | 입금기한 | 가상계좌번호 입금만료기간 | N(14) | ○   | "20211231235959" |
| reqIssueDt | 채번요청일시 | 채번 요청시의 일시  <br>(010가상계좌인 경우에만 해당)  <br>yyyyMMddHHmmss | N(14) | ○   | "20211231100000" |
| fnNm | 은행명 | 은행명  <br>\[[금융 기관 식별자](#item-546)\] 참고 | AH(50) | ○   | "농협" |
| fnCd | 은행코드 | 은행 코드  <br>\[[금융 기관 식별자](#item-546)\] 참고 | N(4) | ○   | "11" |

## 14.4 (테스트환경) 입금테스트API

####  주의사항

*   본 API는 테스트환경에서 입금테스트를 할 수 있는 시뮬레이터입니다.
*   운영환경에서 상점아이디(mchtId)로 테스트 진행시 발생하는 비용은 가맹점 부담입니다.
*   가상계좌 입금테스트
    

##### 요청 전문 (가맹점->헥토파이낸셜)

     
| 파라미터 | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- |
| mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디  <br>\[nx\_mid\_il\]일반 가상계좌  <br>\[nxva\_sb\_il\]010 가상계좌 | AN(10) | ●   | "nx\_mid\_il" |
| method | 결제수단 | 결제수단 구분 코드 | AN(2) | ●   | “VA”  <br>※ 고정값 |
| bizType | 업무구분 | 업무구분 코드 | N(2) | ●   | "F1"  <br>※ 고정값 |
| vAcntNo | 가상계좌번호 | 채번받은 가상계좌번호 | N(11) | ●   | "01012345678" |
| trdAmt | 거래금액 | 거래금액 | N(12) | ●   | "1000" |

 

##### 입금테스트 예시

```
https://tbgw.settlebank.co.kr/spay/APIVBankTest.do?mchtId=nx_mid_il&method=VA&bizType=F1&vAcntNo=01012345678&trdAmt=1000
```

- - -

##### 응답 전문(헥토파이낸셜->가맹점)

     
| 파라미터 | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- |
| method | 결제수단 | 결제수단 구분 코드 | AN(2) | ●   | "VA" |
| bizType | 업무구분 | 업무구분 코드 | AN(2) | ●   | "F1" |
| outRsltCd | 결과코드 | 결과 코드 | AN(4) | ●   | "0000" |
| outRsltMsg | 결과메세지 | 결과 메세지 | AHN(200) | ●   | "정상 처리 되었습니다." |

## 14.5 노티 전문 (헥토파이낸셜 → 가맹점)

※ 가상계좌 거래는 채번노티, 입금노티 총 2번의 노티가 전달됩니다. 반드시 채번 노티와 입금 노티를 모두 처리해 주시기 바랍니다. 

*   채번 노티 : 가맹점측에서 헥토파이낸셜로 거래를 요청하여, 가상계좌번호가 발급되는 단계에서 헥토파이낸셜에서 가맹점으로 전달되는 노티입니다.
    *   outStatCd\[0051\] 로 전달됩니다.
*   입금 노티 : 가맹점 고객이 발급된 가상계좌번호로 입금하는 시점에 헥토파이낸셜에서 가맹점으로 전달되는 노티입니다.
    *   outStatCd\[0021\] 로 전달됩니다.

     
| 파라미터 | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- |
| outStatCd | 거래상태 | 성공\[0021\] / 가상계좌 입금대기중\[0051\] | N(4) | ●   | "0021" |
| trdNo | 거래번호 | 헥토파이낸셜에서 부여하는 고유 거래번호 | AN(40) | ●   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| method | 결제수단 | 가상계좌\[VA\] | A(2) | ●   | "VA" |
| bizType | 업무구분 | 채번\[A0\], 채번취소\[A2\],  <br>010가상계좌 채번\[A4\],  <br>입금통보\[B1\],  <br>환불\[C0\] | AN(2) | ●   | "A0" |
| mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 상점아이디 | AN(12) | ●   | "nx\_mid\_il" |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유주문번호 | AN(100) | ●   | "ORDER20211231100000" |
| mchtCustNm | 고객명 | 실제 결제자의 주문자명 | AHN(30) | ○   | "가맹점명\_홍길동" |
| mchtName | 상점한글명 | 실판매자명, 거래요청시 실판매자명이 없는 경우 헥토파이낸셜와 계약된 상점명 | AHN(20) | ○   | "헥토파이낸셜" |
| pmtprdNm | 상품명 | 고객이 주문한 결제 상품명 | AHN(128) | ○   | "테스트상품" |
| trdDtm | 거래일시 | 승인일시, 취소/부분취소거래 : 취소일시가 전달됩니다.  <br>형식:YYYYMMDDhhmmss | N(14) | ●   | "20211231100000" |
| trdAmt | 거래금액 | 거래금액 | N(12) | ○   | "1000" |
| bankCd | 은행코드 | 은행 코드  <br>\[[금융기관 식별자 참고](#item-546)\] | AN(10) | ○   | "011" |
| bankNm | 은행명 | 은행명  <br>\[[금융기관 식별자 참고](#item-546)\] | AHN(10) | ○   | "NH농협" |
| acntType | 계좌구분 | 1 : 기본(회전식),  <br>2 : 고정식,  <br>3 : 고정무제한 | N(1) | ○   | "1" |
| vAcntNo | 가상계좌번호 | 가상계좌번호 | N(64) | ○   | "0123456789" |
| expireDt | 가상계좌 입금만료일시 | 가상계좌 입금만료일시 | N(14) | ○   | "20211231235959" |
| AcntPrintNm | 통장인자명 | 고객의 통장에 찍힐 통장인자명 - 결제요청시 전달된 값으로 전달됩니다.  <br>단, 값이 없는 경우는 헥토파이낸셜와 계약된 상점명으로 전달됩니다. | AHN(12) | ○   | "헥토파이낸셜" |
| dpstrNm | 입금자명 | 가상계좌에 실제 입금한 사람의 이름 | AHN(30) | ○   | "홍길동" |
| email | 고객이메일 | 상점고객이메일 | AN(60) | ○   | "HongGilDong@example.com" |
| mchtCustId | 상점고객아이디 | 상점고객아이디 | AN(50) | ○   | "HongGilDong" |
| orgTrdNo | 원거래번호 | 취소 시, 원거래번호 | AN(40) | ○   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| orgTrdDt | 원거래일자 | 취소 시, 원거래일자 | N(8) | ○   | "20211231" |
| csrcIssNo | 현금영수증 승인번호 | 현금영수증 승인번호 | AN(9) | ○   | "0123456789" |
| cnclType | 취소거래타입 | 00:전체취소, 10:부분취소 | N(2) | ○   | "00" |
| mchtParam | 상점예약필드 | 상점에서 이용하는 추가 정보 필드로 전달한 값이 그대로 반환됩니다. | AHN(4000) | ○   | "name=HongGilDong&age=25" |
| pktHash | 해쉬값 | SHA256 (거래상태코드+거래일자+거래시간+상점아이디+상점주문번호+거래금액+해쉬키) | AN(64) | ●   | "a2d6d597d55d7c9b689baa2e08c1ddf0ce71f4248c5b9b59fe61bfbf949543e1" |

가맹점에서 헥토파이낸셜로 응답을 전송합니다.

 
| 응답 (가맹점 → 헥토파이낸셜) |     |
| --- | --- |
| 성공시 | "OK" (대문자) |
| 실패시 | "FAIL" (대문자, FAIL로 응답시 명확한 실패로 인식합니다. 노티가 재전송 됩니다.) |
| 그 외 | 비정상 실패로 인식하여, 설정된 횟수만큼 노티 재발송 처리함. |

# 15\. 가상계좌 채번(Non-UI)

*   가상계좌 고정식 무제한 방식의 경우, 현금영수증 API를 따로 호출하셔야 합니다. 
[현금영수증 API 링크](https://develop.sbsvc.online/25/onlineDocList.do)

## 15.1.1 회전식, 고정식 요청 전문 (가맹점 → 헥토파이낸셜)

요청 URI

 
| 구분  | URL |
| --- | --- |
| 테스트베드 | https://tbgw.settlebank.co.kr/spay/APIVBank.do |
| 상용 환경 | https://gw.settlebank.co.kr/spay/APIVBank.do |

가맹점 서버에서 헥토파이낸셜측으로 요청하는 컬럼을 다음과 같이 정의합니다.

      
| 파라미터 |     | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- | --- |
| params | mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디  <br>nx\_mid\_il:일반(회전식)  <br>nxva\_fix:고정식 | AN(10) | ●   | "nx\_mid\_il" |
| ver | 버전  | 전문의 버전 | AN(4) | ●   | "0A19"  <br>※ 고정값 |
| method | 결제수단 | 결제수단 | A(2) | ●   | "VA"  <br>※ 고정값 |
| bizType | 업무구분 | 업무 구분코드 | AN(2) | ●   | "A0"  <br>※ 고정값 |
| encCd | 암호화 구분 | 암호화 구분 코드 | N(2) | ●   | "23"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 채번 요청시 상점에서 생성하는 고유한 주문번호 | AN(100) | ●   | "ORDER20211231100000" |
| trdDt | 요청일자 | 현재 전문을 전송하는 일자(YYYYMMDD) | N(8) | ●   | "20211231" |
| trdTm | 요청시간 | 현재 전문을 전송하는 시간(HHMMSS) | N(6) | ●   | "100000" |
| mobileYn | 모바일 여부 | Y:모바일웹/앱, N:PC 또는 그 외 | A(1) | ○   | "N" |
| osType | OS 구분 | A:Android, I:IOS, W:windows, M:Mac, E:기타, 공백:확인불가 | A(1) | ○   | "W" |
| data | pktHash | hash데이터 | SHA256 방식으로 생성한 해쉬값  <br>\[[요청 전문 해쉬 코드](#item-740)\] 참고 | AN(200) | ●   | "f395b6725a9a18f2563ce34f8bc76698051d27c05e5ba815f463f00429061c0c" |
| bankCd | 가상계좌  <br>은행코드 | \[[PG가상계좌 은행코드](#item-1124)\] 참고 | AN(3) | ●   | "011" |
| acntType | 계좌구분 | 1 : 기본(회전식): 랜덤으로 계좌 발급받아 사용  <br>2 : 고정식: 계좌 미리 할당 받아 사용(당사와 협의 필요). 입금할때마다 채번하는 방식 | N(1) | ●   | "1" (공백인 경우 1로 설정) |
| vAcntNo | 가상계좌번호 | ※ 고정식일 경우에만 사용합니다.( acntType = 2 or 3 )  <br>※ AES 암호화 | N(16) | ○   | \[[고정식 가상계좌 리스트](#item-1123)\] 참고 |
| expireDate | 입금만료일시 | 가상계좌 신청후 입금이 되어야 하는 기한 일시  <br>YYYYMMDDhhmmss  <br>※ 입금만료일을 넣지 않을 경우 거래일 기준으로 10일 뒤로 자동 세팅됩니다.  <br>※ 입금만료일의 최대기한은 현재일 기준 +365일 23:59:59를 초과할 수 없습니다.  <br>예) 신청일이 2022년  1월 1일인 경우, 20230101235959 를 초과할수 없습니다. | N(14) | ○   | "20211231235959" |
| prdtNm | 상품명 | 상품명 | AHN(128) | ●   | "테스트상품" |
| sellerNm | 판매자명 | 판매자명 | AHN(128) | ●   | "헥토파이낸셜" |
| ordNm | 주문자명 | 주문자명 | AHN(30) | ○   | "홍길동" |
| trdAmt | 거래금액 | 거래금액  <br>※ AES 암호화 | N(12) | ●   | "1000" |
| dpstrNm | 통장인자명 | 고객의 통장에 찍히는 통장인자명  <br>※ 공백일 경우 sellerNm(판매자명)을 통장인자명으로 사용 | AHN(50) | ○   | "가맹점명\_홍길동" |
| taxTypeCd | 면세여부 | N:과세, Y:면세, G:복합과세  <br>공백일 경우 상점 설정에 따름 | A(1) | ●   | "N" |
| taxAmt | 과세금액 | 과세금액(복합과세일 경우 필수)  <br>※ AES 암호화 | N(12) | ○   | "909" |
| vatAmt | 부가세금액 | 부가세금액(복합과세일 경우 필수)  <br>※ AES 암호화 | N(12) | ○   | "91" |
| taxFreeAmt | 비과세금액 | 면세금액(복합과세일 경우 필수)  <br>※ AES 암호화 | N(12) | ○   | "0" |
| escrAgrYn | 사용여부 | 에스크로 사용여부  <br>Y:동의, N:비동의 | A(1) | ●   | "N" |
| escrPwd | 비밀번호 | 에스크로비밀번호(에스크로 사용시 필수)  <br>※ AES 암호화 | AN(64) | ○   | "1234" |
| rfdDpstrNm | 예금주명 | 에스크로 환불시 예금주명(에스크로 사용시 필수)  <br>※ AES 암호화 | AHN(50) | ○   | "홍길동" |
| csrcIssReqYn | 발행여부 | 현금영수증 발행여부  <br>Y:발행, N:미발행 | A(1) | ●   | "N" |
| cashRcptPrposDivCd | 용도구분 | 현금영수증 용도구분(현금영수증 사용시 필수)  <br>0:소득증빙용, 1:지출증빙용 | N(1) | ○   | "0" |
| csrcRegNoDivCd | 등록번호구분코드 | 현금영수증 등록번호구분코드(현금영수증 사용시 필수)  <br>1:카드, 2:주민번호, 3:사업자번호, 4:휴대폰번호 | N(1) | ○   | "4" |
| csrcRegNo | 고유식별정보 | 현금영수증 고유식별정보(현금영수증 사용시 필수)  <br>※ AES 암호화 | N(18) | ○   | "1234567890" |
| email | 이메일 | 사용자 이메일(에스크로 사용시 필수) | AN(60) | ○   | "HongGilDong@example.com" |
| notiUrl | 결과처리 URL | 결제 후 결과 전달되는 페이지의 URL(Server To Server 연동 URL) | AN(250) | ○   | "https://example.com/notiUrl" |
| mchtParam | 상점예약필드 | 기타 주문 정보를 입력하는 상점 예약 필드 | AHN(4000) | ○   | "name=HongGilDong&age=25" |
| mchtCustId | 상점고객아이디 | 상점에서 보내주는 고유 고객아이디 혹은 유니크키 | AN(50) | ○   | "HongGilDong" |

## 15.1.2 고정식무제한 요청 전문 (가맹점 → 헥토파이낸셜)

      
| 파라미터 |     | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- | --- |
| params | mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디  <br>nxva\_fix2:고정무제한 | AN(10) | ●   | "nxva\_fix2" |
| ver | 버전  | 전문의 버전 | AN(4) | ●   | "0A19"  <br>※ 고정값 |
| method | 결제수단 | 결제수단 | A(2) | ●   | "VA"  <br>※ 고정값 |
| bizType | 업무구분 | 업무 구분코드 | AN(2) | ●   | "A0"  <br>※ 고정값 |
| encCd | 암호화 구분 | 암호화 구분 코드 | N(2) | ●   | "23"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 채번 요청시 상점에서 생성하는 고유한 주문번호 | AN(100) | ●   | "ORDER20211231100000" |
| trdDt | 요청일자 | 현재 전문을 전송하는 일자(YYYYMMDD) | N(8) | ●   | "20211231" |
| trdTm | 요청시간 | 현재 전문을 전송하는 시간(HHMMSS) | N(6) | ●   | "100000" |
| mobileYn | 모바일 여부 | Y:모바일웹/앱, N:PC 또는 그 외 | A(1) | ○   | "N" |
| osType | OS 구분 | A:Android, I:IOS, W:windows, M:Mac, E:기타, 공백:확인불가 | A(1) | ○   | "W" |
| data | pktHash | hash데이터 | SHA256 방식으로 생성한 해쉬값  <br>\[[요청 전문 해쉬 코드](#item-740)\] 참고 | AN(200) | ●   | "f395b6725a9a18f2563ce34f8bc76698051d27c05e5ba815f463f00429061c0c" |
| bankCd | 가상계좌  <br>은행코드 | \[[PG가상계좌 은행코드](#item-1124)\] 참고 | AN(3) | ●   | "011" |
| acntType | 계좌구분 | 3 : 고정무제한: 계좌 미리 할당 받아 사용(당사와 협의 필요). 한 번만 채번하여 계속 입금하는 방식 | N(1) | ●   | "3"  <br>※ 고정값 |
| vAcntNo | 가상계좌번호 | ※ 고정식일 경우에만 사용합니다.( acntType = 2 or 3 )  <br>※ AES 암호화 | N(16) | ●   | \[[고정식 가상계좌 리스트](#item-1123)\] 참고 |
| expireDate | 입금만료일시 | 가상계좌 신청후 입금이 되어야 하는 기한 일시  <br>YYYYMMDDhhmmss  <br>※ 입금만료일을 넣지 않을 경우 거래일 기준으로 10일 뒤로 자동 세팅됩니다.  <br>※ 입금만료일의 최대기한은 현재일 기준 +365일 23:59:59를 초과할 수 없습니다.  <br>예) 신청일이 2022년  1월 1일인 경우, 20230101235959 를 초과할수 없습니다. | N(14) | ○   | "20211231235959" |
| prdtNm | 상품명 | 상품명 | AHN(128) | ●   | "테스트상품" |
| sellerNm | 판매자명 | 판매자명 | AHN(128) | ●   | "헥토파이낸셜" |
| ordNm | 주문자명 | 주문자명 | AHN(30) | ○   | "홍길동" |
| trdAmt | 거래금액 | 거래금액  <br>※ 고정식 무제한 계좌인 경우(acntType=3) 0으로 세팅  <br>※ AES 암호화 | N(12) | ●   | "0"  <br>※ 고정값 |
| dpstrNm | 통장인자명 | 고객의 통장에 찍히는 통장인자명  <br>※ 공백일 경우 sellerNm(판매자명)을 통장인자명으로 사용 | AHN(50) | ○   | "가맹점명\_홍길동" |
| mchtCustId | 상점고객아이디 | 상점에서 보내주는 고유 고객아이디 혹은 유니크키 | AN(50) | ○   | "HongGilDong" |

## 15.2 요청 전문 해쉬 코드

 
| 항목  | 조합 필드 |
| --- | --- |
| pktHash | 거래일자 + 거래시간 + 상점아이디 + 상점주문번호 + 거래금액(평문) + 해쉬키 |

## 15.3 응답 전문 (헥토파이낸셜 → 가맹점)

헥토파이낸셜에서 가맹점측으로 응답하는 컬럼을 다음과 같이 정의합니다.

      
| 파라미터 |     | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- | --- |
| params | mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(10) | ●   | "nx\_mid\_il" |
| ver | 버전  | 전문의 버전 | AN(4) | ●   | "0A19"  <br>※ 고정값 |
| method | 결제수단 | 결제수단 | A(2) | ●   | "VA"  <br>※ 고정값 |
| bizType | 업무구분 | 업무 구분코드 | AN(2) | ●   | "A0"  <br>※ 고정값 |
| encCd | 암호화 구분 | 암호화 구분 코드 | N(2) | ●   | "23"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 채번 요청시 상점에서 생성하는 고유한 거래번호 | AN(100) | ●   | "ORDER20211231100000" |
| trdNo | 헥토파이낸셜 거래번호 | 헥토파이낸셜에서 생성하는 고유한 거래번호 | AN(40) | ●   | "STFP\_PGVAnx\_mid\_il00210806075210M1853381" |
| trdDt | 요청일자 | 현재 전문을 전송하는 일자(YYYYMMDD) | N(8) | ●   | "20211231" |
| trdTm | 요청시간 | 현재 전문을 전송하는 시간(HHMMSS) | N(6) | ●   | "100000" |
| outStatCd | 거래상태코드 | 거래상태코드(성공/실패)  <br>0021:채번 성공  <br>0031:실패 | AN(4) | ●   | "0021" |
| outRsltCd | 거절코드 | 거래상태가 "0031"일 경우, 상세 코드 전달  <br>\[[거절 코드 표](#item-544)\] 참고 | AN(4) | ●   | "0000" |
| outRsltMsg | 결과메세지 | 결과 메세지 전달  <br>URL Encoding, UTF-8 | AHN(200) | ●   | "정상적으로 처리되었습니다." |
| data | pktHash | 해쉬값 | 요청시, hash 값 그대로 return | AN(64) | ●   |     |
| bankCd | 가상계좌  <br>은행코드 | \[[PG가상계좌 은행코드](#item-1124)\] 참고 | AN(3) | ●   | "011" |
| vAcntNo | 가상계좌번호 | 채번받았던 가상계좌번호  <br>※ AES 암호화 | N(16) | ●   | "0123456789" |
| expireDate | 입금만료일시 | 입금만료일시 YYYYMMDDhhmmss | N(14) | ●   | "20211231235959" |
| trdAmt | 거래금액 | 거래금액  <br>※ AES 암호화 | N(12) | ●   | "1000" |
| acntType | 계좌구분 | 요청시 값 그대로 전달 | N(1) | ●   | "1" |

## 15.4 응답 전문 해쉬 코드

 
| 항목  | 조합 필드 |
| --- | --- |
| pktHash | 거래상태코드 + 요청일자 + 요청시간 + 상점아이디 + 상점주문번호 + 거래금액(평문) + 해쉬키 |

## 15.5 (테스트환경) 입금테스트API

※ \[[14.4 입금테스트API](#item-878)\] 참고

## 15.6 노티 전문 (헥토파이낸셜 → 가맹점)

※ 회전식/고정식 가상계좌는 \[[14.5 노티 전문](#item-715)\] 참고  
  
**고정식 무제한 계좌 입금노티**

     
| 파라미터 | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- |
| outStatCd | 거래상태 | 성공\[0021\]  <br>(고정식무제한계좌는 채번노티 0051 지원하지 않음) | N(4) | ●   | "0021" |
| trdNo | 거래번호 | 헥토파이낸셜에서 부여하는 고유 거래번호 | AN(40) | ●   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| method | 결제수단 | 가상계좌\[VA\] | A(2) | ●   | "VA" |
| bizType | 업무구분 | 입금통보\[B1\] | AN(2) | ●   | "B1" |
| mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 상점아이디 | AN(12) | ●   | "nxva\_fix2" |
| mchtTrdNo | 상점주문번호 | 0000000 고정 | AN(100) | ●   | "0000000" |
| trdDtm | 거래일시 | 승인일시, 취소/부분취소거래 : 취소일시가 전달됩니다.  <br>형식:YYYYMMDDhhmmss | N(14) | ●   | "20211231100000" |
| trdAmt | 거래금액 | 거래금액 | N(12) | ○   | "1000" |
| bankCd | 은행코드 | 은행 코드  <br>\[[금융기관 식별자 참고](#item-546)\] | AN(10) | ○   | "011" |
| bankNm | 은행명 | 은행명  <br>\[[금융기관 식별자 참고](#item-546)\] | AHN(10) | ○   | "NH농협" |
| acntType | 계좌구분 | 1 : 기본(회전식),  <br>2 : 고정식,  <br>3 : 고정무제한 | N(1) | ○   | "3" |
| vAcntNo | 가상계좌번호 | 가상계좌번호 | N(64) | ○   | "0123456789" |
| expireDt | 가상계좌 입금만료일시 | 가상계좌 입금만료일시 | N(14) | ○   | "20211231235959" |
| AcntPrintNm | 통장인자명 | 고객의 통장에 찍힐 통장인자명 - 결제요청시 전달된 값으로 전달됩니다.  <br>단, 값이 없는 경우는 헥토파이낸셜와 계약된 상점명으로 전달됩니다. | AHN(12) | ○   | "헥토파이낸셜" |
| dpstrNm | 입금자명 | 가상계좌에 실제 입금한 사람의 이름 | AHN(30) | ○   | "홍길동" |
| pktHash | 해쉬값 | SHA256 (거래상태코드+거래일자+거래시간+상점아이디+상점주문번호+거래금액+해쉬키) | AN(64) | ●   | "a2d6d597d55d7c9b689baa2e08c1ddf0ce71f4248c5b9b59fe61bfbf949543e1" |

## 15.7 (테스트 환경) 고정식 가상계좌 리스트

테스트 환경(tbgw.settlebank.co.kr)에서만 사용할 수 있는 가상계좌번호입니다.

 
| 상점아이디(mchtId) | 은행코드(bankCd) | 가상계좌번호(vAcntNo) |
| --- | --- | --- |
| nxva\_fix | 004 | 2022004000001~2022004000050 |
| 011 | 2022011000001~2022011000050 |
| nxva\_fix2 | 004 | 2022004000056~2022004000100 |
| 011 | 2022011000056~2022011000100 |

## 15.8 PG가상계좌 은행코드

PG가상계좌 채번(가상계좌 발급) 가능한 은행코드는 다음과 같습니다.

| 은행코드 | 은행명 |
| --- | --- |
| 003 | IBK기업은행 |
| 004 | KB국민은행 |
| 011 | NH농협은행 |
| 020 | 우리은행 |
| 023 | SC제일은행 |
| 031 | iM뱅크(대구은행) |
| 032 | 부산은행 |
| 034 | 광주은행 |
| 039 | 경남은행 |
| 045 | 새마을금고 |
| 071 | 우체국 |
| 081 | 하나은행(KEB하나은행) |
| 088 | 신한은행 |
| 089 | 케이뱅크 |

※ 수협은행(007) 은 2025년 2분기부터 사용 불가합니다.

# 16\. 가상계좌 채번 정보 변경(Non-UI)

## 16.1 요청 전문 (가맹점 → 헥토파이낸셜)

### **※ 요청 URI**

 
| 구분  | URL |
| --- | --- |
| 테스트베드 | https://tbgw.settlebank.co.kr/spay/APIVBank.do |
| 상용 환경 | https://gw.settlebank.co.kr/spay/APIVBank.do |

가맹점 서버에서 헥토파이낸셜측으로 요청하는 컬럼을 다음과 같이 정의합니다.

      
| 파라미터 |     | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- | --- |
| params | mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(10) | ●   | "nx\_mid\_il" |
| ver | 버전  | 전문의 버전 | AN(4) | ●   | "0A19"  <br>※ 고정값 |
| method | 결제수단 | 결제수단 | A(2) | ●   | "VA"  <br>※ 고정값 |
| bizType | 업무구분 | 업무 구분코드 | AN(2) | ●   | "A1"  <br>※ 고정값 |
| encCd | 암호화 구분 | 암호화 구분 코드 | N(2) | ●   | "23"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 요청시 상점에서 생성하는 고유한 주문번호 | AN(100) | ●   | "ORDER20211231100000" |
| trdDt | 요청일자 | 현재 전문을 전송하는 일자(YYYYMMDD) | N(8) | ●   | "20211231" |
| trdTm | 요청시간 | 현재 전문을 전송하는 시간(HHMMSS) | N(6) | ●   | "100000" |
| mobileYn | 모바일 여부 | Y:모바일웹/앱, N:PC 또는 그 외 | A(1) | ○   | "N" |
| osType | OS 구분 | A:Android, I:IOS, W:windows, M:Mac, E:기타, 공백:확인불가 | A(1) | ○   | "W" |
| data | pktHash | hash데이터 | SHA256 방식으로 생성한 해쉬값  <br>\[[요청 전문 해쉬 코드](#item-1128)\] 참고 | AN(200) | ●   | "f395b6725a9a18f2563ce34f8bc76698051d27c05e5ba815f463f00429061c0c" |
| bankCd | 은행코드 | \[[PG가상계좌 은행코드](#item-1124)\] 참고 | AN(3) | ●   | "011" |
| vAcntNo | 가상계좌번호 | 발급받았던 가상 계좌 번호  <br>※ AES 암호화 | N(16) | ●   | "1234567890" |
| expireDate | 입금만료일시 | 변경할 입금만료일:yyyyMMddHHmmss | N(14) | ●   | "20221231235959" |
| trdAmt | 거래금액 | 거래금액  <br>※ AES 암호화 | N(12) | ●   | "1000" |
| acntType | 계좌구분 | 가상계좌 구분  <br>1:회전식  <br>2:고정식  <br>3:고정무제한 | N(1) | ●   | "1" |

## 16.2 요청 전문 해쉬 코드

 
| 항목  | 조합 필드 |
| --- | --- |
| pktHash | 요청일자 + 요청시간 + 상점아이디 + 상점주문번호 + 거래금액 + 해쉬키 |

## 16.3 응답 전문 (헥토파이낸셜 → 가맹점)

헥토파이낸셜에서 가맹점측으로 응답하는 컬럼을 다음과 같이 정의합니다.

      
| 파라미터 |     | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- | --- |
| params | mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(10) | ●   | "nx\_mid\_il" |
| ver | 버전  | 전문의 버전 | AN(4) | ●   | "0A19"  <br>※ 고정값 |
| method | 결제수단 | 결제수단 | A(2) | ●   | "VA"  <br>※ 고정값 |
| bizType | 업무구분 | 업무 구분코드 | AN(2) | ●   | "A1"  <br>※ 고정값 |
| encCd | 암호화 구분 | 암호화 구분 코드 | N(2) | ●   | "23"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유한 주문번호 | AN(100) | ●   | "ORDER20211231100000" |
| trdNo | 헥토파이낸셜 거래번호 | 헥토파이낸셜에서 생성하는 고유한 거래번호 | AN(40) | ●   | "STBK\_0123456789" |
| trdDt | 요청일자 | 현재 전문을 전송하는 일자(YYYYMMDD) | N(8) | ●   | "20211231" |
| trdTm | 요청시간 | 현재 전문을 전송하는 시간(HHMMSS) | N(6) | ●   | "120000" |
| outStatCd | 거래상태 | 거래상태코드(성공/실패)  <br>0021:성공  <br>0031:실패 | AN(4) | ●   | "0021" |
| outRsltCd | 거절코드 | 거래상태가 "0031"일 경우, 상세 코드 전달  <br>\[[거절 코드 표](#item-544)\] 참고 | AN(4) | ●   | "0000" |
| outRsltMsg | 결과메세지 | 결과 메세지 전달  <br>URL Encoding, UTF-8 | AHN(200) | ●   | "정상적으로 처리되었습니다." |
| data | pktHash | 해쉬값 | 요청시 값 그대로 return | AN(64) | ●   | "f395b6725a9a18f2563ce34f8bc76698051d27c05e5ba815f463f00429061c0c" |
| bankCd | 은행코드 | 요청시 값 그대로 return | AN(3) | ●   | "011" |
| vAcntNo | 가상계좌번호 | 요청시 값 그대로 return  <br>※ AES 암호화 | N(16) | ●   | "1234567890" |
| expireDate | 입금만료일시 | 요청시  값 그대로 return | N(14) | ●   | "20221231235959" |
| trdAmt | 거래금액 | 요청시 값 그대로 return  <br>※ AES 암호화 | N(12) | ●   | "1000" |
| acntType | 계좌구분 | 요청시 값 그대로 return | N(1) | ●   | "1" |

# 17\. 가상계좌 채번 취소(Non-UI)

## 17.1 요청 전문 (가맹점 → 헥토파이낸셜)

요청 URI

 
| 구분  | URL |
| --- | --- |
| 테스트베드 | https://tbgw.settlebank.co.kr/spay/APIVBank.do |
| 상용 환경 | https://gw.settlebank.co.kr/spay/APIVBank.do |

가맹점 서버에서 헥토파이낸셜측으로 요청하는 컬럼을 다음과 같이 정의합니다.

      
| 파라미터 |     | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- | --- |
| params | mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(10) | ●   | "nx\_mid\_il" |
| ver | 버전  | 전문의 버전 | AN(4) | ●   | "0A19"  <br>※ 고정값 |
| method | 결제수단 | 결제수단 | A(2) | ●   | "VA"  <br>※ 고정값 |
| bizType | 업무구분 | 업무 구분코드 | AN(2) | ●   | "A2"  <br>※ 고정값 |
| encCd | 암호화 구분 | 암호화 구분 코드 | N(2) | ●   | "23"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 채번 취소시 상점에서 생성하는 고유한 주문번호 | AN(100) | ●   | "ORDER20211231100000" |
| trdDt | 취소요청일자 | 현재 전문을 전송하는 일자(YYYYMMDD) | N(8) | ●   | "20211231" |
| trdTm | 취소요청시간 | 현재 전문을 전송하는 시간(HHMMSS) | N(6) | ●   | "100000" |
| mobileYn | 모바일 여부 | Y:모바일웹/앱, N:PC 또는 그 외 | A(1) | ○   | "N" |
| osType | OS 구분 | A:Android, I:IOS, W:windows, M:Mac, E:기타, 공백:확인불가 | A(1) | ○   | "W" |
| data | pktHash | hash데이터 | SHA256 방식으로 생성한 해쉬값  <br>\[[요청 전문 해쉬 코드](#item-461)\] 참고 | AN(200) | ●   | "f395b6725a9a18f2563ce34f8bc76698051d27c05e5ba815f463f00429061c0c" |
| orgTrdNo | 원거래번호 | 채번시, 헥토파이낸셜에서 발급한 거래번호 | AN(40) | ●   | "STFP\_PGVAnx\_mid\_il00210806075210M1853381" |
| vAcntNo | 가상계좌번호 | 발급받았던 가상 계좌 번호  <br>※ AES 암호화 | N(16) | ●   | "1234567890" |

## 17.2 요청 전문 해쉬 코드

 
| 항목  | 조합 필드 |
| --- | --- |
| pktHash | 취소요청일자 + 취소요청시간 + 상점아이디 + 상점주문번호 + "0" + 해쉬키 |

## 17.3 응답 전문 (헥토파이낸셜 → 가맹점)

헥토파이낸셜에서 가맹점측으로 응답하는 컬럼을 다음과 같이 정의합니다.

      
| 파라미터 |     | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- | --- |
| params | mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(10) | ●   | "nx\_mid\_il" |
| ver | 버전  | 전문의 버전 | AN(4) | ●   | "0A19"  <br>※ 고정값 |
| method | 결제수단 | 결제수단 | A(2) | ●   | "VA"  <br>※ 고정값 |
| bizType | 업무구분 | 업무 구분코드 | AN(2) | ●   | "A2"  <br>※ 고정값 |
| encCd | 암호화 구분 | 암호화 구분 코드 | N(2) | ●   | "23"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 채번 취소시 상점에서 생성하는 고유한 주문번호 | AN(100) | ●   | "ORDER20211231100000" |
| trdNo | 헥토파이낸셜 거래번호 | 헥토파이낸셜에서 생성하는 고유한 거래번호 | AN(40) | ●   | "STBK\_0123456789" |
| trdDt | 취소요청일자 | 현재 전문을 전송하는 일자(YYYYMMDD) | N(8) | ●   | "20211231" |
| trdTm | 취소요청시간 | 현재 전문을 전송하는 시간(HHMMSS) | N(6) | ●   | "120000" |
| outStatCd | 거래상태 | 거래상태코드(성공/실패)  <br>0021:성공  <br>0031:실패 | AN(4) | ●   | "0021" |
| outRsltCd | 거절코드 | 거래상태가 "0031"일 경우, 상세 코드 전달  <br>\[[거절 코드 표](#item-544)\] 참고 | AN(4) | ●   | "0000" |
| outRsltMsg | 결과메세지 | 결과 메세지 전달  <br>URL Encoding, UTF-8 | AHN(200) | ●   | "정상적으로 처리되었습니다." |
| data | pktHash | 해쉬값 | 요청시, hash 값 그대로 return | AN(64) | ●   |     |
| orgTrdNo | 원거래번호 | 채번시, 헥토파이낸셜에서 발급한 거래번호 | AN(40) | ○   | "STFP\_PGVAnx\_mid\_il00210806075210M1853381" |
| acntType | 계좌구분 | 가상계좌 구분  <br>4:010가상계좌  <br>null:이외 | N(1) | ○   | "4" |
| vAcntNo | 가상계좌번호 | 채번받았던 가상계좌번호  <br>※ AES 암호화 | N(16) | ●   | "1234567890" |

## 17.4 노티 전문 (헥토파이낸셜 → 가맹점)

※ \[[14.5 노티 전문](#item-715)\] 참고

# 18\. 가상계좌 환불 (Non-UI)

####  가상계좌 환불 주의사항

*   환불기능은 환불서비스가 등록된 상점에 한해서 가능합니다.
*   환불API는 환불 접수를 하는 기능이며, 실제 고객 계좌로의 송금은 3~5일이 걸릴 수 있습니다.
*   은행 점검 시간대(23:30~00:35) 사이에는 환불이 실패할 수 있으니 해당 시간대는 피해서 환불 요청해주시기 바랍니다.
*   테스트 환경에서는 개인정보 보호를 위하여 가상의 계좌번호 및 예금주명을 사용해주시기 바랍니다.

## 18.1 요청 전문 (가맹점 → 헥토파이낸셜)

요청 URI

 
| 구분  | URL |
| --- | --- |
| 테스트베드 | https://tbgw.settlebank.co.kr/spay/APIRefund.do |
| 상용 환경 | https://gw.settlebank.co.kr/spay/APIRefund.do |

가맹점 서버에서 헥토파이낸셜측으로 요청하는 컬럼을 다음과 같이 정의합니다.

      
| 파라미터 |     | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- | --- |
| params | mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(10) | ●   | "nx\_mid\_il" |
| ver | 버전  | 전문의 버전 | AN(4) | ●   | "0A19"  <br>※ 고정값 |
| method | 결제수단 | 결제수단 | A(2) | ●   | "VA"  <br>※ 고정값 |
| bizType | 업무구분 | 업무 구분코드 | AN(2) | ●   | "C0"  <br>※ 고정값 |
| encCd | 암호화 구분 | 암호화 구분 코드 | N(2) | ●   | "23"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 환불시 상점에서 생성하는 고유한 주문번호 | AN(100) | ●   | "ORDER20211231" |
| trdDt | 요청일자 | 현재 전문을 전송하는 일자(YYYYMMDD) | N(8) | ●   | "20211231" |
| trdTm | 요청시간 | 현재 전문을 전송하는 시간(HHMMSS) | N(6) | ●   | "100000" |
| mobileYn | 모바일 여부 | Y:모바일웹/앱, N:PC 또는 그 외 | A(1) | ○   | "N" |
| osType | OS 구분 | A:Android, I:IOS, W:windows, M:Mac, E:기타, 공백:확인불가 | A(1) | ○   | "W" |
| data | pktHash | hash데이터 | SHA256 방식으로 생성한 해쉬값  <br>\[[요청 전문 해쉬 코드](#item-696)\] 참고 | AN(200) | ●   | "f395b6725a9a18f2563ce34f8bc76698051d27c05e5ba815f463f00429061c0c" |
| orgTrdNo | 원거래번호 | 채번요청시, 헥토파이낸셜에서 발급한 거래번호 | AN(40) | ●   | "STFP\_PGVAnx\_mid\_il00210806075210M1853381" |
| crcCd | 통화구분 | 통화 구분 값 | A(3) | ●   | "KRW"  <br>※ 고정값 |
| cnclOrd | 취소회차 | 001부터 시작. 부분취소 2회차의 경우 002 | N(3) | ●   | "001" |
| taxTypeCd | 면세여부 | Y:면세, N:과세, G:복합과세. 공백일 경우 상점 기본 정보에 따름.  <br>※ 복합과세인 경우 필수. | A(1) | ○   | "N" |
| cnclAmt | 환불금액 | 환불금액  <br>※ AES 암호화 | N(12) | ●   | "1000" |
| taxAmt | 과세금액 | 환불금액 중 과세금액(복합과세인 경우 필수)  <br>※ AES 암호화 | N(12) | ○   | "909" |
| vatAmt | 부가세금액 | 환불금액 중 부가세금액(복합과세인 경우 필수)  <br>※ AES 암호화 | N(12) | ○   | "91" |
| taxFreeAmt | 비과세금액 | 환불금액 중 면세금액(복합과세인 경우 필수)  <br>※ AES 암호화 | N(12) | ○   | "0" |
| refundBankCd | 환불은행코드 | 환불할 은행 코드  <br>\[[금융기관 식별자](#item-546)\] 참고 | AN(3) | ●   | "011" |
| refundAcntNo | 환불계좌번호 | 환불할 계좌 번호  <br>※ AES 암호화 | N(16) | ●   | "1234567890" |
| refundDpstrNm | 환불계좌예금주명 | 화불계좌의 예금주명 | AHN(50) | ●   | "홍길동" |
| cnclRsn | 환불사유내용 | 필요한 경우, 환불 사유 메세지 기재 | AHN(255) | ○   | "상품이 마음에 들지 않아서" |

## 18.2 요청 전문 해쉬 코드

 
| 항목  | 조합 필드 |
| --- | --- |
| pktHash | 환불요청일자 + 환불요청시간 + 상점아이디 + 상점주문번호 + 환불금액(평문) + 해쉬키 |

## 18.3 응답 전문 (헥토파이낸셜 → 가맹점)

헥토파이낸셜에서 가맹점측으로 응답하는 컬럼을 다음과 같이 정의합니다.

      
| 파라미터 |     | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- | --- |
| params | mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(10) | ●   | "nx\_mid\_il" |
| ver | 버전  | 전문의 버전 | AN(4) | ●   | "0A19"  <br>※ 고정값 |
| method | 결제수단 | 결제수단 | A(2) | ●   | "VA"  <br>※ 고정값 |
| bizType | 업무구분 | 업무 구분코드 | AN(2) | ●   | "C0"  <br>※ 고정값 |
| encCd | 암호화 구분 | 암호화 구분 코드 | N(2) | ●   | "23"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 환불시, 상점에서 생성하는 고유한 주문번호 | AN(100) | ●   | "ORDER20211231100000" |
| trdNo | 헥토파이낸셜 거래번호 | 헥토파이낸셜에서 생성하는 고유한 거래번호 | AN(40) | ●   | "STFP\_PGVAnx\_mid\_il00210806075210M1853381" |
| trdDt | 요청일자 | 현재 전문을 전송하는 일자(YYYYMMDD) | N(8) | ●   | "20211231" |
| trdTm | 요청시간 | 현재 전문을 전송하는 시간(HHMMSS) | N(6) | ●   | "100000" |
| outStatCd | 거래상태 | 거래상태코드(성공/실패)  <br>0021:성공  <br>0031:실패 | AN(4) | ●   | "0021" |
| outRsltCd | 거절코드 | 거래상태가 "0031"일 경우, 상세 코드 전달  <br>\[[거절 코드 표](#item-544)\] 참고 | AN(4) | ●   | "0000" |
| outRsltMsg | 결과메세지 | 결과 메세지 전달  <br>URL Encoding, UTF-8 | AHN(200) | ●   | "정상적으로 처리되었습니다." |
| data | pktHash | 해쉬값 | 요청시, hash 값 그대로 return | AN(64) | ●   |     |
| orgTrdNo | 원거래번호 | 채번 요청시, 헥토파이낸셜에서 발급한 거래번호 | AN(40) | ●   | "STFP\_PGVAnx\_mid\_il00210806075210M1853381" |
| cnclAmt | 환불금액 | 환불금액  <br>※ AES 암호화 | N(12) | ●   | "1000" |
| blcAmt | 환불가능잔액 | 환불성공시 거래번호 기준 남은 환불 가능잔액 리턴  <br>※ AES 암호화 | N(12) | ●   | "0" |

## 18.4 노티 전문 (헥토파이낸셜 → 가맹점)

※ \[[14.5 노티 전문](#item-715)\] 참고

# 19\. 010가상계좌 결제(UI)

010가상계좌 상세한 규격 및 API연동을 원하시는 경우, [여기를 클릭하십시오.](https://develop.sbsvc.online/26/onlineDocList.do)

## 19.1 요청 전문 (가맹점 → 헥토파이낸셜)

가맹점 서버에서 헥토파이낸셜측으로 요청하는 컬럼을 다음과 같이 정의합니다.

     
| 파라미터 | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- |
| mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(10) | ●   | "nxva\_sb\_il" |
| method | 결제수단 | PG 서비스에 해당하는 결제 구분 코드 | AN(20) | ●   | “vbank010”  <br>※ 고정값 |
| trdDt | 요청일자 | yyyyMMdd | N(8) | ●   | "20211231" |
| trdTm | 요청시간 | HH24MISS | N(6) | ●   | "100000" |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유 주문번호  <br>※ 한글 제외 | AN(100) | ●   | "ORDER20211231100000" |
| mchtName | 상점한글명 | 상점한글명 | AHN(100) | ●   | "헥토파이낸셜" |
| mchtEName | 상점영문명 | 상점영문명 | AN(100) | ●   | "Hecto Financial" |
| pmtPrdtNm | 상품명 | 결제상품명 | AHN(128) | ●   | "테스트상품" |
| trdAmt | 거래금액 | 거래금액  <br>※ AES 암호화 | N(12) | ●   | "1000" |
| mchtCustNm | 고객명 | 고객명  <br>※ AES 암호화 | AHN(30) | ○   | "가맹점명\_홍길동" |
| expireDt | 입금만료일 | 가상계좌 신청후 입금이 되어야 하는 기한 일시  <br>예) 신청일이 12월 30일인 경우 입금일을 "20201231235959"로 넘기면 입금기한은 12월 31일까지 입니다.  <br>※ 입금만료일을 넣지 않을 경우 거래일 기준으로 10일 뒤로 자동 세팅됩니다. | N(14) | ●   | "20201231235959" |
| notiUrl | 결과처리 URL | 결제 후 결과 전달되는 페이지의 URL(Server To Server 연동 URL) | AN(250) | ●   | "https://example.com/notiUrl" |
| nextUrl | 결과화면 URL | 결제 후 결과 전달 및 이동페이지 URL | AN(250) | ●   | "https://example.com/nextUrl" |
| cancUrl | 결제취소 URL | 고객 강제 종료시 결과 전달 및 이동페이지 URL | AN(250) | ●   | "https://example.com/cancUrl" |
| mchtParam | 상점예약필드 | 기타 주문 정보를 입력하는 상점 예약 필드 | AHN(4000) | ○   | "name=HongGilDong&age=25" |
| email | 이메일 | 이메일 주소  <br>※ AES 암호화 | AN(60) | ○   | "HongGilDong@example.com" |
| prdtTerm | 상품제공기간 | yyyyMMddHHmmss  <br>값이 없으면 일반결제로 표기 | N(14) | ○   | "20221231235959" |
| cphoneNo | 휴대폰번호 | 010xxxxyyyy(하이픈 제거)  <br>※ 점유인증 생략을 원하시는 경우, 필수로 보내주십시오  <br>※ AES 암호화 | N(11) | ○   | "01012345678" |
| mchtCustId | 상점고객아이디 | 상점에서 보내주는 고유 고객아이디 혹은 유니크키  <br>※ 점유인증 생략을 원하시는 경우, 필수로 보내주십시오  <br>※ AES 암호화 | AN(50) | ○   | "HongGilDong" |
| taxTypeCd | 면세여부 | N:과세, Y:면세, G:복합과세  <br>공백일 경우 상점 설정에 따름 | A(1) | ○   | "N" |
| taxAmt | 과세금액 | 과세금액(복합과세일 경우 필수)  <br>※ AES 암호화 | N(12) | ○   | "909" |
| vatAmt | 부가세금액 | 부가세금액(복합과세일 경우 필수)  <br>※ AES 암호화 | N(12) | ○   | "91" |
| taxFreeAmt | 비과세금액 | 면세금액(복합과세일 경우 필수)  <br>※ AES 암호화 | N(12) | ○   | "0" |
| custIp | 고객 IP주소 | 상점 서버의 IP가 아닌, 고객 기기의 IP주소 | AN(15) | ○   | "127.0.0.1" |
| pktHash | hash데이터 | SHA256 방식으로 생성한 해쉬값  <br>\[[요청 전문 해쉬 코드](#item-826)\] 참고 | AN(200) | ●   | "f395b6725a9a18f2563ce34f8bc76698051d27c05e5ba815f463f00429061c0c" |

## 19.2 요청 전문 해쉬 코드

 
| 항목  | 조합 필드 |
| --- | --- |
| pktHash | 상점아이디 + 결제수단 + 상점주문번호 + 요청일자 + 요청시간 + 거래금액(평문) + 해쉬키 |

## 19.3 응답 전문 (헥토파이낸셜 → 가맹점)

가상계좌 결제창에서 가맹점측으로 응답하는 컬럼을 다음과 같이 정의 합니다.

     
| 파라미터 | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- |
| mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(10) | ●   | "nxva\_sb\_il" |
| outStatCd | 거래상태 | 거래상태코드(성공/실패)  <br>0051:채번 성공(입금대기중)  <br>0031:실패 | AN(4) | ●   | "0051" |
| outRsltCd | 거절코드 | 거래상태가 "0031"일 경우, 상세 코드 전달  <br>\[[거절 코드 표](#item-544)\] 참고 | AN(4) | ●   | "0000" |
| outRsltMsg | 결과메세지 | 결과 메세지 전달  <br>URL Encoding, UTF-8 | AHN(200) | ●   | "결제 요청 정보 누락 (상품명)" |
| method | 결제수단 | PG 서비스에 해당하는 결제 구분 코드 | AN(20) | ●   | "vbank010"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유 주문번호  <br>※ 한글 제외 | AN(100) | ●   | "ORDER20211231100000" |
| mchtCustId | 상점고객아이디 | 보내주는 고유 고객아이디 혹은 유니크 키  <br>※ AES 암호화 | AN(50) | ○   | "HongGilDong" |
| trdNo | 거래번호 | 헥토파이낸셜 거래번호 | AN(40) | ●   | "STFP\_PGVAnx\_mid\_il00210806075210M1853381" |
| trdAmt | 거래금액 | 거래금액  <br>※ AES 암호화 | N(12) | ●   | "1000" |
| mchtParam | 상점예약필드 | 요청으로 받은 필드값을 응답으로 Bypass | AHN(4000) | ○   | "name=HongGilDong&age=25" |
| authDt | 승인일시 | 가상계좌 주문(채번) 일시 | N(14) | ○   | "20211231100000" |
| vtlAcntNo | 가상계좌번호 | 고객이 입금할 가상계좌번호  <br>※ AES 암호화 | N(30) | ○   | "1234567890" |
| expireDt | 입금기한 | 가상계좌번호 입금만료기간 | N(14) | ○   | "20210101235959" |
| reqIssueDt | 채번요청일시 | 채번 요청시의 일시  <br>yyyyMMddHHmmss | N(14) | ○   | "20211231100000" |
| fnNm | 은행명 | 은행명  <br>\[[금융 기관 식별자](#item-546)\] 참고 | AH(50) | ○   | "K뱅크" |
| fnCd | 은행코드 | 은행 코드  <br>\[[금융 기관 식별자](#item-546)\] 참고 | N(4) | ○   | "089" |

## 19.4 (테스트환경) 입금테스트API

※ \[[14.4 입금테스트API](#item-878)\] 참고

## 19.5 노티 전문 (헥토파이낸셜 → 가맹점)

※ \[[14.5 노티 전문](#item-715)\] 참고

# 20\. 휴대폰 결제 (UI)

## 20.1 요청 전문 (가맹점 → 헥토파이낸셜)

가맹점 서버에서 헥토파이낸셜측으로 요청하는 컬럼을 다음과 같이 정의합니다.

     
| 파라미터 | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- |
| mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디  <br>※ 테스트용 상점 아이디  <br>nxhp\_sb\_il:일반  <br>nxhp\_sb\_hd:인증/승인분리형(하이브리드)  <br>nxhp\_sb\_ma:월자동결제 | AN(10) | ●   | "nxhp\_sb\_il" |
| method | 결제수단 | PG 서비스에 해당하는 결제 구분 코드 | AN(20) | ●   | “mobile”  <br>※ 고정값 |
| trdDt | 요청일자 | yyyyMMdd | N(8) | ●   | "20211231" |
| trdTm | 요청시간 | HH24MISS | N(6) | ●   | "100000" |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유 주문번호  <br>※ 한글 제외 | AN(100) | ●   | "ORDER20211231100000" |
| mchtName | 상점한글명 | 상점한글명 | AHN(100) | ●   | "헥토파이낸셜" |
| mchtEName | 상점영문명 | 상점영문명 | AN(100) | ●   | "Hecto Financial" |
| pmtPrdtNm | 상품명 | 결제상품명 | AHN(128) | ●   | "테스트상품" |
| trdAmt | 거래금액 | 거래금액  <br>※ AES 암호화 | N(12) | ●   | "1000" |
| mchtCustNm | 고객명 | 고객명  <br>※ AES 암호화 | AHN(30) | ○   | "홍길동" |
| notiUrl | 결과처리 URL | 결제 후 결과 전달되는 페이지의 URL(Server To Server 연동 URL)  <br>※ 휴대폰 하이브리드 연동의 경우 전달 X | AN(250) | ●   | "https://example.com/notiUrl" |
| nextUrl | 결과화면 URL | 결제 후 결과 전달 및 이동페이지 URL | AN(250) | ●   | "https://example.com/nextUrl" |
| cancUrl | 결제취소 URL | 고객 강제 종료시 결과 전달 및 이동페이지 URL | AN(250) | ●   | "https://example.com/cancUrl" |
| mchtParam | 상점예약필드 | 기타 주문 정보를 입력하는 상점 예약 필드 | AHN(4000) | ○   | "name=HongGilDong&age=25" |
| cphoneNo | 휴대폰번호 | 010xxxxyyyy(하이픈 제거)  <br>※ AES 암호화 | N(11) | ○   | "01012345678" |
| email | 이메일 | 이메일 주소  <br>※ AES 암호화 | AN(60) | ○   | "HongGilDong@example.com" |
| prdtTerm | 상품제공기간 | yyyyMMddHHmmss  <br>값이 없으면 일반결제로 표기 | N(14) | ○   | "20221231235959" |
| telecomCd | 통신사 | SKT:SK Telecom ,  <br>KTF:KT,  <br>LGT:LG U+,  <br>CJH:CJ헬로모바일,  <br>KCT:한국케이블텔레콤,  <br>SKL:SK 7Mobile  <br>  <br>※주의 사항  <br>입력한 통신사만 화면에 노출됩니다.  <br>"\|"를 구분자로 사용하여 통신사 다중 입력 가능  <br>ex) "SKT\|KTF\|LGT", "SKT" | AN(23) | ○   | "SKT\|KTF\|LGT" |
| mchtCustId | 상점고객아이디 | 상점에서 보내주는 고유 고객아이디 혹은 유니크키  <br>※ AES 암호화 | AN(50) | ○   | "HongGilDong" |
| taxTypeCd | 면세여부 | N:과세, Y:면세, G:복합과세  <br>공백일 경우 상점 설정에 따름 | A(1) | ○   | "N" |
| taxAmt | 과세금액 | 과세금액(복합과세 경우에만 요청)  <br>※ AES 암호화 | N(12) | ○   | "909" |
| vatAmt | 부가세금액 | 부가세금액(복합과세 경우에만 요청)  <br>※ AES 암호화 | N(12) | ○   | "91" |
| taxFreeAmt | 비과세금액 | 면세금액(복합과세 경우에만 요청)  <br>※ AES 암호화 | N(12) | ○   | "0" |
| autoPayType | 자동결제 타입 | ※ 공백:일반결제, M:월자동 결제 | A(1) | ○   | ""  |
| linkMethod | 연동 방식 | ※ 공백 or STD : 표준결제창  <br>HBRD:하이브리드(인증, 승인 분리 방식) | AN(12) | ○   | "STD" |
| custIp | 고객 IP주소 | 상점 서버의 IP가 아닌, 고객 기기의 IP주소 | AN(15) | ○   | "127.0.0.1" |
| pktHash | hash데이터 | SHA256 방식으로 생성한 해쉬값  <br>\[[요청 전문 해쉬 코드](#item-465)\] 참고 | AN(200) | ●   | "f395b6725a9a18f2563ce34f8bc76698051d27c05e5ba815f463f00429061c0c" |

## 20.2 요청 전문 해쉬 코드

 
| 항목  | 조합 필드 |
| --- | --- |
| pktHash | 상점아이디 + 결제수단 + 상점주문번호 + 요청일자 + 요청시간 + 거래금액(평문) + 해쉬키 |

## 20.3 응답 전문 (헥토파이낸셜 → 가맹점)

휴대폰 결제창에서 가맹점측으로 응답하는 컬럼을 다음과 같이 정의 합니다.

     
| 파라미터 | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- |
| mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디  <br>※ 테스트용 상점 아이디  <br>nxhp\_sb\_il:일반  <br>nxhp\_sb\_hd:인증/승인분리형(하이브리드)  <br>nxhp\_sb\_ma:월자동결제 | AN(10) | ●   | "nxhp\_sb\_il" |
| outStatCd | 거래상태 | 거래상태코드(성공/실패)  <br>0021:성공  <br>0061:인증 성공(하이브리드 방식)  <br>0031:실패 | AN(4) | ●   | "0021" |
| outRsltCd | 거절코드 | 거래상태가 "0031"일 경우, 상세 코드 전달  <br>\[[거절 코드 표](#item-544)\] 참고 | AN(4) | ●   | "0000" |
| outRsltMsg | 결과메세지 | 결과 메세지 전달  <br>URL Encoding, UTF-8 | AHN(200) | ●   | "결제 요청 정보 누락 (상품명)" |
| method | 결제수단 | PG 서비스에 해당하는 결제 구분 코드 | AN(20) | ●   | "mobile"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유 주문번호  <br>※ 한글 제외 | AN(100) | ●   | "ORDER20211231100000" |
| mchtCustId | 상점고객아이디 | 보내주는 고유 고객아이디 혹은 유니크 키  <br>※ AES 암호화 | AN(50) | ○   | "HongGilDong" |
| trdNo | 거래번호 | 헥토파이낸셜 거래번호 | AN(40) | ●   | "STFP\_PGVAnxhp\_sb\_il00210806075210M1853381" |
| trdAmt | 거래금액 | 거래금액  <br>※ AES 암호화 | N(12) | ●   | "1000" |
| mchtParam | 상점예약필드 | 요청으로 받은 필드값을 응답으로 Bypass | AHN(4000) | ○   | "name=HongGilDong&age=25" |
| billKey | 자동결제키  <br>(대문자'K') | 월 자동 결제 키. 2회차 결제시 사용  <br>※빌키 이용 상점만 해당 | AN(50) | ○   | "MO0123456789" |
| authDt | 승인일시 | 승인일시 | N(14) | ○   | "20211231100000" |
| fnNm | 이통사명 | 이통사명 | A(50) | ○   | "SKT" |
| fnCd | 이통사코드 | 이통사코드 | N(3) | ○   | "001" |

## 20.4 노티 전문 (헥토파이낸셜 → 가맹점)

거래가 정상적으로 완료되면, 헥토파이낸셜에서 가맹점으로 노티(결과통보) 메세지가 전송됩니다.

     
| 파라미터 | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- |
| outStatCd | 거래상태 | 성공\[0021\] | N(4) | ●   | "0021" |
| trdNo | 거래번호 | 헥토파이낸셜에서 부여하는 고유 거래번호 | AN(40) | ●   | "STFP\_PGVAnxhp\_sb\_il00210806075210M1853381" |
| method | 결제수단 | 휴대폰결제\[MP\] | A(2) | ●   | "MP" |
| bizType | 업무구분 | 결제\[B0\], 취소\[C0\], 자동연장\[B1\], 헥토파이낸셜 원천 결제\[B2\], 환불\[C1\] | AN(2) | ●   | "B0" |
| mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 상점아이디 | AN(12) | ●   | "nxhp\_sb\_il" |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유주문번호 | AN(100) | ●   | "ORDER20211231100000" |
| mchtCustNm | 고객명 | 실제 결제자의 주문자명 | AHN(30) | ○   | "홍길동" |
| mchtName | 상점한글명 | 실판매자명, 거래요청시 실판매자명이 없는 경우 헥토파이낸셜와 계약된 상점명 | AHN(20) | ○   | "헥토파이낸셜" |
| pmtprdNm | 상품명 | 고객이 주문한 결제 상품명 | AHN(128) | ○   | "테스트상품" |
| trdDtm | 거래일시 | 승인일시, 취소/부분취소거래 : 취소일시가 전달됩니다.  <br>형식:YYYYMMDDhhmmss | N(14) | ●   | "20211231010101" |
| trdAmt | 거래금액 | 거래금액 | N(12) | ○   | "1000" |
| billKey | 자동결제키 | 자동결제 2회차를 위한 billKey발급 | AN(40) | ○   | "MO0123456789" |
| billKeyExpireDt | 자동결제키 유효기간 | YYMM | N(4) | ○   | "1231" |
| telecomCd | 이통사코드 | SKT:SK Telecom,  <br>KTF:KT,  <br>LGT:LG U+,  <br>CJH:CJ헬로모바일,  <br>KCT:한국케이블텔레콤,  <br>SKL:SK 7Mobile | A(10) | ○   | "SKT" |
| telecomNm | 이통사명 | 이통사 명 | AHN(10) | ○   | "SK Telecom" |
| email | 고객이메일 | 상점고객이메일 | AN(60) | ○   | "HongGilDong@example.com" |
| mchtCustId | 상점고객아이디 | 상점고객아이디 | AN(50) | ○   | "HongGilDong" |
| phoneNoEnc | 휴대폰번호(암호화) | 고객의 휴대폰번호를 암호화하여 전달  <br>※ AES 암호화 | N(11) | ○   | "01012345678" |
| orgTrdNo | 원거래번호 | 취소 시, 원거래번호 | AN(40) | ○   | "STFP\_PGVAnxhp\_sb\_il00210806075210M1853381" |
| orgTrdDt | 원거래일자 | 취소 시, 원거래일자 | N(8) | ○   | "20211231" |
| cnclType | 취소거래타입 | 00:전체취소, 10:부분취소 | N(2) | ○   | "00" |
| mchtParam | 상점예약필드 | 상점에서 이용하는 추가 정보 필드로 전달한 값이 그대로 반환됩니다. | AHN(4000) | ○   | "name=HongGilDong&age=25" |
| pktHash | 해쉬값 | SHA256 (거래상태코드+거래일자+거래시간+상점아이디+상점주문번호+거래금액+해쉬키) | AN(64) | ●   | "a2d6d597d55d7c9b689baa2e08c1ddf0ce71f4248c5b9b59fe61bfbf949543e1" |

가맹점에서 헥토파이낸셜로 응답을 전송합니다.

 
| 응답 (가맹점 → 헥토파이낸셜) |     |
| --- | --- |
| 성공시 | "OK" (대문자) |
| 실패시 | "FAIL" (대문자, FAIL로 응답시 명확한 실패로 인식합니다. 노티가 재전송 됩니다.) |
| 그 외 | 비정상 실패로 인식하여, 설정된 횟수만큼 노티 재발송 처리함. |

# 21\. 휴대폰승인API(하이브리드)

## 21.1 API URI

 
| 구분  | URL |
| --- | --- |
| 테스트베드 | https://tbgw.settlebank.co.kr/spay/APIService.do |
| 상용 환경 | https://gw.settlebank.co.kr/spay/APIService.do |

## 21.2 요청 및 응답 헤더

휴대폰 승인(하이브리드 방식) API는 Non-UI 방식으로 표준결제창을 이용하지 않습니다. ([JSON 요청 데이터](#item-584) 예시)항목을 참고 하십시오.

 
| 구분  | 내용  |
| --- | --- |
| 요청  | Content-type=application/json; charset=UTF-8 |
| 응답  | Content-type=application/json; charset=UTF-8 |

## 21.3 요청 전문 (가맹점 → 헥토파이낸셜)

가맹점 서버에서 헥토파이낸셜측으로 요청하는 컬럼을 다음과 같이 정의합니다.

      
| 파라미터 |     | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- | --- |
| params | mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(10) | ●   | "nxhp\_sb\_hd" |
| ver | 버전  | 전문의 버전 | AN(4) | ●   | "0A19"  <br>※ 고정값 |
| method | 결제수단 | 결제수단 | A(2) | ●   | "MP"  <br>※ 고정값 |
| bizType | 업무구분 | 업무 구분코드  <br>B0: 페이레터 재판매 승인,  <br>B2: 헥토파이낸셜 원천 승인 | AN(2) | ●   | "B2" |
| encCd | 암호화 구분 | 암호화 구분 코드 | N(2) | ●   | "23"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | ※ 주의  <br>반드시 인증요청시에 생성한 상점주문번호를 기재해야 합니다. | AN(100) | ●   | "ORDER20211231100000" |
| trdDt | 요청일자 | 현재 전문을 전송하는 일자(YYYYMMDD) | N(8) | ●   | "20211231" |
| trdTm | 요청시간 | 현재 전문을 전송하는 시간(HHMMSS) | N(6) | ●   | "100000" |
| mobileYn | 모바일 여부 | Y:모바일웹/앱, N:PC 또는 그 외 | A(1) | ○   | "N" |
| osType | OS 구분 | A:Android, I:IOS, W:windows, M:Mac, E:기타, 공백:확인불가 | A(1) | ○   | "W" |
| data | pktHash | hash데이터 | SHA256 방식으로 생성한 해쉬값  <br>\[[요청 전문 해쉬 코드](#item-1035)\] 참고 | AN(200) | ●   | "f395b6725a9a18f2563ce34f8bc76698051d27c05e5ba815f463f00429061c0c" |
| phoneNo | 휴대폰번호 | 고객 휴대폰 번호  <br>※ AES 암호화 | N(11) | ○   | "01012345678" |
| telCo | 통신사 | SKT:SK Telecom ,  <br>KTF:KT,  <br>LGT:LG U+,  <br>CJH:CJ헬로모바일,  <br>KCT:한국케이블텔레콤,  <br>SKL:SK 7Mobile  <br>※ AES 암호화 | A(3) | ○   | "SKT" |
| email | 이메일 | 고개 이메일 주소 | AN(60) | ○   | "HongGilDong@example.com" |
| mUserId | 상점고객아이디 | 상점고객아이디 | AHN(50) | ○   | "HongGilDong" |
| crcCd | 통화구분 | 통화구분 | A(3) | ●   | "KRW"  <br>※ 고정값 |
| trdAmt | 거래금액 | ※ AES 암호화 | N(12) | ●   | "1000" |
| prdtNm | 상품명 | 상품명 | AHN(128) | ●   | "드시모네" |
| sellerNm | 판매자명 | 판매자명 | AHN(128) | ○   | "헥토파이낸셜" |
| ordNm | 주문자명 | 주문자명 | AHN(30) | ○   | "홍길동" |
| getBillKeyYn | 빌키발급여부 | Y:빌키발급,  <br>그외:빌키미발급 | A(1) | ○   | ""  |
| authTrdNo | 인증거래번호 | ※ 인증 성공 시, 헥토파이낸셜에서 응답한 거래번호 | AN(40) | ●   | "SOFP\_PGMPnxhp\_pl\_hd0211021111808M1234567" |
| linkMethod | 연동방식코드 | 연동 방식 코드 | AN(12) | ●   | "HBRD"  <br>※ 고정값 |
| notiUrl | 결과처리 URL | 결제 후 결과 전달되는 페이지의 URL(Server To Server 연동 URL) | AN(250) | ○   | "https://example.com/notiUrl" |
| mchtParam | 상점예약필드 | 기타 주문 정보를 입력하는 상점 예약 필드 | AHN(4000) | ○   | "name=HongGilDong&age=25" |

## 21.4 요청 전문 해쉬 코드

 
| 항목  | 조합 필드 |
| --- | --- |
| pktHash | 거래일자+거래시간+상점아이디+상점주문번호+거래금액(평문)+해쉬키 |

## 21.5 응답 전문 (헥토파이낸셜 → 가맹점)

헥토파이낸셜에서 가맹점측으로 응답하는 컬럼을 다음과 같이 정의합니다.

      
| 파라미터 |     | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- | --- |
| params | mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(10) | ●   | "nxhp\_pl\_hd" |
| ver | 버전  | 전문의 버전 | AN(4) | ●   | "0A19"  <br>※ 고정값 |
| method | 결제수단 | 결제수단 | A(2) | ●   | "MP"  <br>※ 고정값 |
| bizType | 업무구분 | 업무 구분코드 | AN(2) | ●   | "B0"  <br>※ 고정값 |
| encCd | 암호화 구분 | 암호화 구분 코드 | N(2) | ●   | "23"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유한 주문번호 | AN(100) | ●   | "ORDER20211231100000" |
| trdNo | 헥토파이낸셜 거래번호 | 헥토파이낸셜에서 생성하는 고유한 거래번호 | AN(40) | ●   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| trdDt | 요청일자 | 현재 전문을 전송하는 일자(YYYYMMDD) | N(8) | ●   | "20211231" |
| trdTm | 요청시간 | 현재 전문을 전송하는 시간(HHMMSS) | N(6) | ●   | "100000" |
| outStatCd | 거래상태 | 거래상태코드(성공/실패)  <br>0021:성공  <br>0031:실패 | AN(4) | ●   | "0021" |
| outRsltCd | 거절코드 | 거래상태가 "0031"일 경우, 상세 코드 전달  <br>\[[거절 코드 표](#item-544)\] 참고 | AN(4) | ●   | "0000" |
| outRsltMsg | 결과메세지 | 결과 메세지 전달  <br>URL Encoding, UTF-8 | AHN(200) | ●   | "정상적으로 처리되었습니다." |
| data | pktHash | 해쉬값 | 요청시, hash 값 그대로 return | AN(64) | ●   |     |
| phoneNo | 휴대폰번호 | 고객의 휴대폰번호  <br>※ AES 암호화 | N(11) | ○   | "01012341234" |
| telCo | 통신사 | 요청 시, 값 그대로 return  <br>※ AES 암호화 | A(3) | ○   | "SKT" |
| trdAmt | 거래금액 | 요청 시, 값 그대로 return  <br>※ AES 암호화 | N(12) | ●   | "1000" |
| getBillKeyYn | 빌키발급여부 | Y:빌키발급,  <br>그외:빌키미발급 | A(1) | ○   | ""  |
| billKey | 빌키  | 헥토파이낸셜에서 발급하는 빌키, 2회차부터 사용 | AN(50) | ○   | "MO0123456789" |

## 21.6 노티 전문 (헥토파이낸셜 → 가맹점)

※ \[[20.4 노티 전문](#item-718)\] 참고

# 22\. 휴대폰 자동결제 (Non-UI)

## 22.1 요약 설명

*    **월자동 결제**
    *   휴대폰 자동결제는 1회차 결제 승인 이후, 발급된 인증키(billKey)로 다음 회차에 다시 결제하는 방식의 서비스입니다.
    *   1회차 결제시([19.1 요청 전문 참고](#item-464)) `autoPayType` 요청 파라미터에 "M"을 설정하면, 헥토파이낸셜에서 응답으로 `billKey` 파라미터를 리턴합니다.
    *   2회차 결제시, 발급 받은 `billKey`를 요청파라미터에 세팅하여 결제 요청합니다.
    *   2회차 결제시의 거래금액과 상품명은 1회차 결제와 동일해야 합니다.

## 22.2 API URI

 
| 구분  | URL |
| --- | --- |
| 테스트베드 | https://tbgw.settlebank.co.kr/spay/APIService.do |
| 상용 환경 | https://gw.settlebank.co.kr/spay/APIService.do |

## 22.3 요청 및 응답 헤더

휴대폰 자동결제는 Non-UI 방식으로 표준결제창을 이용하지 않습니다. ([JSON 요청 데이터](#item-584) 예시)항목을 참고 하십시오.

 
| 구분  | 내용  |
| --- | --- |
| 요청  | Content-type=application/json; charset=UTF-8 |
| 응답  | Content-type=application/json; charset=UTF-8 |

## 22.4 월자동 요청 전문 (가맹점 → 헥토파이낸셜)

가맹점 서버에서 헥토파이낸셜측으로 요청하는 컬럼을 다음과 같이 정의합니다.

      
| 파라미터 |     | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- | --- |
| params | mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(10) | ●   | "nxhp\_pl\_ma" |
| ver | 버전  | 전문의 버전 | AN(4) | ●   | "0A19"  <br>※ 고정값 |
| method | 결제수단 | 결제수단 | A(2) | ●   | "MP"  <br>※ 고정값 |
| bizType | 업무구분 | 업무 구분코드 | AN(2) | ●   | "B1"  <br>※ 고정값 |
| encCd | 암호화 구분 | 암호화 구분 코드 | N(2) | ●   | "23"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유한 주문번호 | AN(100) | ●   | "ORDER20211231100000" |
| trdDt | 요청일자 | 현재 전문을 전송하는 일자(YYYYMMDD) | N(8) | ●   | "20211231" |
| trdTm | 요청시간 | 현재 전문을 전송하는 시간(HHMMSS) | N(6) | ●   | "100000" |
| mobileYn | 모바일 여부 | Y:모바일웹/앱, N:PC 또는 그 외 | A(1) | ○   | "N" |
| osType | OS 구분 | A:Android, I:IOS, W:windows, M:Mac, E:기타, 공백:확인불가 | A(1) | ○   | "W" |
| data | pktHash | hash데이터 | SHA256 방식으로 생성한 해쉬값  <br>\[[요청 전문 해쉬 코드](#item-654)\] 참고 | AN(200) | ●   | "f395b6725a9a18f2563ce34f8bc76698051d27c05e5ba815f463f00429061c0c" |
| email | 이메일 | 고개 이메일 주소 | AN(60) | ●   | "HongGilDong@example.com" |
| mUserId | 상점고객아이디 | 상점고객아이디 | AHN(50) | ●   | "HongGilDong" |
| crcCd | 통화구분 | 통화구분 | A(3) | ●   | "KRW"  <br>※ 고정값 |
| trdAmt | 거래금액 | ※ AES 암호화 | N(12) | ●   | "1000" |
| prdtNm | 상품명 | 상품명 | AHN(128) | ●   | "드시모네" |
| sellerNm | 판매자명 | 판매자명 | AHN(50) | ○   | "헥토파이낸셜" |
| ordNm | 주문자명 | 주문자명 | AHN(50) | ●   | "홍길동" |
| billKey | 빌키  | 헥토파이낸셜에서 발급한 빌키 | AN(50) | ●   | "MO0123456789" |

## 22.5 요청 전문 해쉬 코드

 
| 항목  | 조합 필드 |
| --- | --- |
| pktHash | 거래일자+거래시간+상점아이디+상점주문번호+거래금액(평문)+해쉬키 |

## 22.6 월자동 응답 전문 (헥토파이낸셜 → 가맹점)

헥토파이낸셜에서 가맹점측으로 응답하는 컬럼을 다음과 같이 정의합니다.

      
| 파라미터 |     | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- | --- |
| params | mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(10) | ●   | "nxhp\_pl\_ma" |
| ver | 버전  | 전문의 버전 | AN(4) | ●   | "0A19"  <br>※ 고정값 |
| method | 결제수단 | 결제수단 | A(2) | ●   | "MP"  <br>※ 고정값 |
| bizType | 업무구분 | 업무 구분코드 | AN(2) | ●   | "B1"  <br>※ 고정값 |
| encCd | 암호화 구분 | 암호화 구분 코드 | N(2) | ●   | "23"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유한 거래번호 | AN(100) | ●   | "ORDER20211231100000" |
| trdNo | 헥토파이낸셜 거래번호 | 헥토파이낸셜에서 생성하는 고유한 거래번호 | AN(40) | ●   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| trdDt | 요청일자 | 현재 전문을 전송하는 일자(YYYYMMDD) | N(8) | ●   | "20211231" |
| trdTm | 요청시간 | 현재 전문을 전송하는 시간(HHMMSS) | N(6) | ●   | "100000" |
| outStatCd | 거래상태 | 거래상태코드(성공/실패)  <br>0021:성공  <br>0031:실패 | AN(4) | ●   | "0021" |
| outRsltCd | 거절코드 | 거래상태가 "0031"일 경우, 상세 코드 전달  <br>\[[거절 코드 표](#item-544)\] 참고 | AN(4) | ●   | "0000" |
| outRsltMsg | 결과메세지 | 결과 메세지 전달  <br>URL Encoding, UTF-8 | AHN(200) | ●   | "정상적으로 처리되었습니다." |
| data | pktHash | 해쉬값 | 요청시, hash 값 그대로 return | AN(64) | ●   |     |
| telCo | 통신사 | 요청 시, 값 그대로 return  <br>※ AES 암호화 | A(3) | ○   | "SKT" |
| trdAmt | 거래금액 | 요청 시, 값 그대로 return  <br>※ AES 암호화 | N(12) | ●   | "1000" |
| billKey | 빌키  | 요청 시, 값 그대로 return | AN(50) | ●   | "MO0123456789" |

# 23\. 휴대폰결제 취소 (Non-UI)

통신사 결제 취소 가능 기간\[당월\]에 취소 시 취소API를 요청하며, 익월부터는 환불API를 요청합니다.

*    **예시**
    *   2023-06-30 승인 건 / 2023-07-01에 환불 API 요청

## 23.1 요청 전문 (가맹점 → 헥토파이낸셜)

가맹점 서버에서 헥토파이낸셜측으로 요청하는 컬럼을 다음과 같이 정의합니다.

      
| 파라미터 |     | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- | --- |
| params | mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(10) | ●   | "nxhp\_pl\_il" |
| ver | 버전  | 전문의 버전 | AN(4) | ●   | "0A19"  <br>※ 고정값 |
| method | 결제수단 | 결제수단 | A(2) | ●   | "MP"  <br>※ 고정값 |
| bizType | 업무구분 | 업무 구분코드 | AN(2) | ●   | "C0"  <br>※ 고정값 |
| encCd | 암호화 구분 | 암호화 구분 코드 | N(2) | ●   | "23"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유한 주문번호 | AN(100) | ●   | "ORDER20211231100000" |
| trdDt | 취소요청일자 | 현재 전문을 전송하는 일자(YYYYMMDD) | N(8) | ●   | "20211231" |
| trdTm | 취소요청시간 | 현재 전문을 전송하는 시간(HHMMSS) | N(6) | ●   | "100000" |
| mobileYn | 모바일 여부 | Y:모바일웹/앱, N:PC 또는 그 외 | A(1) | ○   | "N" |
| osType | OS 구분 | A:Android, I:IOS, W:windows, M:Mac, E:기타, 공백:확인불가 | A(1) | ○   | "W" |
| data | pktHash | hash데이터 | SHA256 방식으로 생성한 해쉬값  <br>\[[요청 전문 해쉬 코드](#item-471)\] 참고 | AN(200) | ●   | "f395b6725a9a18f2563ce34f8bc76698051d27c05e5ba815f463f00429061c0c" |
| orgTrdNo | 원거래번호 | 결제 시, 헥토파이낸셜에서 발급한 거래번호 | AN(40) | ●   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| crcCd | 통화구분 | 통화 구분 값 | A(3) | ●   | "KRW"  <br>※ 고정값 |
| cnclOrd | 취소회차 | 001부터 시작. 부분취소 2회차의 경우 002 | N(3) | ●   | "001" |
| taxTypeCd | 면세여부 | Y:면세, N:과세, G:복합과세. 공백일 경우 상점 기본 정보에 따름. | A(1) | ○   | "N" |
| cnclAmt | 취소금액 | 취소금액  <br>※ AES 암호화 | N(12) | ●   | "1000" |
| taxAmt | 과세금액 | 취소금액 중 과세금액(복합과세 경우에만 요청)  <br>※ AES 암호화 | N(12) | ○   | "909" |
| vatAmt | 부가세금액 | 취소금액 중 부가세금액(복합과세 경우에만 요청)  <br>※ AES 암호화 | N(12) | ○   | "91" |
| taxFreeAmt | 비과세금액 | 취소금액 중 면세금액(복합과세 경우에만 요청)  <br>※ AES 암호화 | N(12) | ○   | "0" |
| cnclRsn | 취소사유내용 | 필요한 경우, 취소 사유 메세지 기재 | AHN(255) | ○   | "상품이 마음에 들지 않아서" |

## 23.2 요청 전문 해쉬 코드

 
| 항목  | 조합 필드 |
| --- | --- |
| pktHash | 취소요청일자 + 취소요청시간 + 상점아이디 + 상점주문번호 + 취소금액(평문) + 해쉬키 |

## 23.3 응답 전문 (헥토파이낸셜 → 가맹점)

헥토파이낸셜에서 가맹점측으로 응답하는 컬럼을 다음과 같이 정의합니다.

      
| 파라미터 |     | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- | --- |
| params | mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(10) | ●   | "nxhp\_pl\_il" |
| ver | 버전  | 전문의 버전 | AN(4) | ●   | "0A19"  <br>※ 고정값 |
| method | 결제수단 | 결제수단 | A(2) | ●   | "MP"  <br>※ 고정값 |
| bizType | 업무구분 | 업무 구분코드 | AN(2) | ●   | "C0"  <br>※ 고정값 |
| encCd | 암호화 구분 | 암호화 구분 코드 | N(2) | ●   | "23"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유한 거래번호 | AN(100) | ●   | "ORDER20211231100000" |
| trdNo | 헥토파이낸셜 거래번호 | 헥토파이낸셜에서 생성하는 고유한 거래번호 | AN(40) | ●   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| trdDt | 취소요청일자 | 현재 전문을 전송하는 일자(YYYYMMDD) | N(8) | ●   | "20211231" |
| trdTm | 취소요청시간 | 현재 전문을 전송하는 시간(HHMMSS) | N(6) | ●   | "100000" |
| outStatCd | 거래상태 | 거래상태코드(성공/실패)  <br>0021:성공  <br>0031:실패 | AN(4) | ●   | "0021" |
| outRsltCd | 거절코드 | 거래상태가 "0031"일 경우, 상세 코드 전달  <br>\[[거절 코드 표](#item-544)\] 참고 | AN(4) | ●   | "0000" |
| outRsltMsg | 결과메세지 | 결과 메세지 전달  <br>URL Encoding, UTF-8 | AHN(200) | ●   | "정상적으로 처리되었습니다." |
| data | pktHash | 해쉬값 | 요청시, hash 값 그대로 return | AN(64) | ●   |     |
| orgTrdNo | 원거래번호 | 결제 시, 헥토파이낸셜에서 발급한 거래번호 | AN(40) | ●   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| cnclAmt | 취소금액 | 취소금액  <br>※ AES 암호화 | N(12) | ●   | "1000" |
| blcAmt | 취소가능잔액 | 취소성공시 거래번호 기준 남은 취소 가능잔액 리턴  <br>※ AES 암호화 | N(12) | ●   | "0" |
| rfdPsblCd | 환불가능여부 | 취소 실패에 따른 환불 구분 코드  <br>Y:환불 가능  <br>N:환불 불가(서비스 미등록)  <br>C:환불 불가(환불 조건 미충족) | A(1) | ○   | "Y" |

## 23.4 노티 전문 (헥토파이낸셜 → 가맹점)

※ \[[20.4 노티 전문](#item-718)\] 참고

# 24\. 휴대폰결제 환불 (Non-UI)

휴대폰 결제 취소 가능 기간\[당월\]이 지나 취소가 불가할때, 환불 요청합니다.

*    **예시**
    *   2023-06-30 승인 건 / 2023-07-01에 환불 API 요청

# 24.1 요청 전문 (가맹점 → 헥토파이낸셜)

요청 URI

 
| 구분  | URL |
| --- | --- |
| 테스트베드 | https://tbgw.settlebank.co.kr/spay/APIRefund.do |
| 상용 환경 | https://gw.settlebank.co.kr/spay/APIRefund.do |

가맹점 서버에서 헥토파이낸셜측으로 요청하는 컬럼을 다음과 같이 정의합니다.

      
| 파라미터 |     | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- | --- |
| params | mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(10) | ●   | "nxhp\_sb\_il" |
| ver | 버전  | 전문의 버전 | AN(4) | ●   | "0A19"  <br>※ 고정값 |
| method | 결제수단 | 결제수단 | A(2) | ●   | "MP"  <br>※ 고정값 |
| bizType | 업무구분 | 업무 구분코드 | AN(2) | ●   | "C1"  <br>※ 고정값 |
| encCd | 암호화 구분 | 암호화 구분 코드 | N(2) | ●   | "23"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 환불시 상점에서 생성하는 고유한 주문번호 | AN(100) | ●   | "ORDER20211231" |
| trdDt | 요청일자 | 현재 전문을 전송하는 일자(YYYYMMDD) | N(8) | ●   | "20211231" |
| trdTm | 요청시간 | 현재 전문을 전송하는 시간(HHMMSS) | N(6) | ●   | "100000" |
| mobileYn | 모바일 여부 | Y:모바일웹/앱, N:PC 또는 그 외 | A(1) | ○   | "N" |
| osType | OS 구분 | A:Android, I:IOS, W:windows, M:Mac, E:기타, 공백:확인불가 | A(1) | ○   | "W" |
| data | pktHash | hash데이터 | SHA256 방식으로 생성한 해쉬값  <br>\[[요청 전문 해쉬 코드](#item-1074)\] 참고 | AN(200) | ●   | "f395b6725a9a18f2563ce34f8bc76698051d27c05e5ba815f463f00429061c0c" |
| orgTrdNo | 원거래번호 | 채번요청시, 헥토파이낸셜에서 발급한 거래번호 | AN(40) | ●   | "STFP\_PGVAnx\_mid\_il00210806075210M1853381" |
| crcCd | 통화구분 | 통화 구분 값 | A(3) | ●   | "KRW"  <br>※ 고정값 |
| cnclOrd | 취소회차 | 001부터 시작. 부분취소 2회차의 경우 002 | N(3) | ●   | "001" |
| taxTypeCd | 면세여부 | Y:면세, N:과세, G:복합과세. 공백일 경우 상점 기본 정보에 따름. | A(1) | ○   | "N" |
| cnclAmt | 환불금액 | 환불금액  <br>※ AES 암호화 | N(12) | ●   | "1000" |
| taxAmt | 과세금액 | 환불금액 중 과세금액(복합과세 경우에만 요청)  <br>※ AES 암호화 | N(12) | ○   | "909" |
| vatAmt | 부가세금액 | 환불금액 중 부가세금액(복합과세 경우에만 요청)  <br>※ AES 암호화 | N(12) | ○   | "91" |
| taxFreeAmt | 비과세금액 | 환불금액 중 면세금액(복합과세 경우에만 요청)  <br>※ AES 암호화 | N(12) | ○   | "0" |
| refundBankCd | 환불은행코드 | 환불할 은행 코드  <br>\[[금융기관 식별자](#item-546)\] 참고 | AN(3) | ●   | "011" |
| refundAcntNo | 환불계좌번호 | 환불할 계좌 번호  <br>※ AES 암호화 | N(16) | ●   | "1234567890" |
| refundDpstrNm | 환불계좌예금주명 | 환불계좌의 예금주명 | AHN(50) | ●   | "홍길동" |
| cnclRsn | 환불사유내용 | 필요한 경우, 환불 사유 메세지 기재 | AHN(255) | ○   | "상품이 마음에 들지 않아서" |

# 24.2 요청 전문 해쉬 코드

 
| 항목  | 조합 필드 |
| --- | --- |
| pktHash | 환불요청일자 + 환불요청시간 + 상점아이디 + 상점주문번호 + 환불금액(평문) + 해쉬키 |

# 24.3 응답 전문 (헥토파이낸셜 → 가맹점)

헥토파이낸셜에서 가맹점측으로 응답하는 컬럼을 다음과 같이 정의합니다.

      
| 파라미터 |     | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- | --- |
| params | mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(10) | ●   | "nxhp\_sb\_il" |
| ver | 버전  | 전문의 버전 | AN(4) | ●   | "0A19"  <br>※ 고정값 |
| method | 결제수단 | 결제수단 | A(2) | ●   | "MP"  <br>※ 고정값 |
| bizType | 업무구분 | 업무 구분코드 | AN(2) | ●   | "C1"  <br>※ 고정값 |
| encCd | 암호화 구분 | 암호화 구분 코드 | N(2) | ●   | "23"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 환불시, 상점에서 생성하는 고유한 주문번호 | AN(100) | ●   | "ORDER20211231100000" |
| trdNo | 헥토파이낸셜 거래번호 | 헥토파이낸셜에서 생성하는 고유한 거래번호 | AN(40) | ●   | "STFP\_PGVAnx\_mid\_il00210806075210M1853381" |
| trdDt | 요청일자 | 현재 전문을 전송하는 일자(YYYYMMDD) | N(8) | ●   | "20211231" |
| trdTm | 요청시간 | 현재 전문을 전송하는 시간(HHMMSS) | N(6) | ●   | "100000" |
| outStatCd | 거래상태 | 거래상태코드(성공/실패)  <br>0021:성공  <br>0031:실패 | AN(4) | ●   | "0021" |
| outRsltCd | 거절코드 | 거래상태가 "0031"일 경우, 상세 코드 전달  <br>\[[거절 코드 표](#item-544)\] 참고 | AN(4) | ●   | "0000" |
| outRsltMsg | 결과메세지 | 결과 메세지 전달  <br>URL Encoding, UTF-8 | AHN(200) | ●   | "정상적으로 처리되었습니다." |
| data | pktHash | 해쉬값 | 요청시, hash 값 그대로 return | AN(64) | ●   |     |
| orgTrdNo | 원거래번호 | 채번 요청시, 헥토파이낸셜에서 발급한 거래번호 | AN(40) | ●   | "STFP\_PGVAnx\_mid\_il00210806075210M1853381" |
| cnclAmt | 환불금액 | 환불금액  <br>※ AES 암호화 | N(12) | ●   | "1000" |
| blcAmt | 환불가능잔액 | 환불성공시 거래번호 기준 남은 환불 가능잔액 리턴  <br>※ AES 암호화 | N(12) | ●   | "0" |

# 24.4 노티 전문 (헥토파이낸셜 → 가맹점)

※ \[[20.4 노티 전문](#item-718)\] 참고

# 25\. 틴캐시/해피머니/컬쳐캐쉬/스마트문상/도서상품권/티머니 결제 (UI)

## 25.1 요청 전문 (가맹점 → 헥토파이낸셜)

가맹점 서버에서 헥토파이낸셜측으로 요청하는 컬럼을 다음과 같이 정의합니다.

     
| 파라미터 | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- |
| mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(10) | ●   | "nx\_mid\_il" |
| method | 결제수단 | 틴캐시\[teencash\]  <br>해피머니\[happymoney\]  <br>컬쳐랜드상품권(컬쳐캐쉬)\[culturecash\]  <br>스마트문상\[smartcash\]  <br>도서상품권\[booknlife\]  <br>티머니\[tmoney\] | AN(20) | ●   | “teencash” |
| trdDt | 요청일자 | yyyyMMdd | N(8) | ●   | "20211231" |
| trdTm | 요청시간 | HH24MISS | N(6) | ●   | "100000" |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유 주문번호  <br>※ 한글 제외 | AN(100) | ●   | "ORDER20211231100000" |
| mchtName | 상점한글명 | 상점한글명 | AHN(100) | ●   | "헥토파이낸셜" |
| mchtEName | 상점영문명 | 상점영문명 | AN(100) | ●   | "Hecto Financial" |
| pmtPrdtNm | 상품명 | 결제상품명 | AHN(128) | ●   | "테스트상품" |
| trdAmt | 거래금액 | 거래금액  <br>※  AES 암 호화  <br>※ 컵 보증금 존재 시, 거래금액 + 컵 보증금 값 세팅 | N(12) | ●   | "1000" |
| taxFreeAmt | 비과세금액 | 결제 금액 중 비과세 금액  <br>(컵보증금 300원)  <br>※ AES 암호화  <br>※ 티머니만 해당 | N(12) | ○   | "300" |
| mchtCustNm | 고객명 | 고객명  <br>※ AES 암호화 | AHN(30) | ○   | "홍길동" |
| notiUrl | 결과처리 URL | 결제 후 결과 전달되는 페이지의 URL(Server To Server 연동 URL) | AN(250) | ●   | "https://example.com/notiUrl" |
| nextUrl | 결과화면 URL | 결제 후 결과 전달 및 이동페이지 URL | AN(250) | ●   | "https://example.com/nextUrl" |
| cancUrl | 결제취소 URL | 고객 강제 종료시 결과 전달 및 이동페이지 URL | AN(250) | ●   | "https://example.com/cancUrl" |
| prdtTerm | 상품제공기간 | yyyyMMddHHmmss  <br>값이 없으면 일반결제로 표기 | N(14) | ○   | "20221231235959" |
| mchtParam | 상점예약필드 | 기타 주문 정보를 입력하는 상점 예약 필드 | AHN(4000) | ○   | "name=HongGilDong&age=25" |
| mchtCustId | 상점고객아이디 | 상점에서 보내주는 고유 고객아이디 혹은 유니크키  <br>※ AES 암호화  <br>※ 컬쳐랜드상품권(컬쳐캐쉬)\[culturecash\]의 경우 필수 | AN(50) | ○   | "HongGilDong" |
| custIp | 고객 IP주소 | 상점 서버의 IP가 아닌, 고객 기기의 IP주소 | AN(15) | ○   | "127.0.0.1" |
| pktHash | hash데이터 | SHA256 방식으로 생성한 해쉬값  <br>\[[요청 전문 해쉬 코드](#item-475)\] 참고 | AN(200) | ●   | "f395b6725a9a18f2563ce34f8bc76698051d27c05e5ba815f463f00429061c0c" |

## 25.2 요청 전문 해쉬 코드

 
| 항목  | 조합 필드 |
| --- | --- |
| pktHash | 상점아이디 + 결제수단 + 상점주문번호 + 요청일자 + 요청시간 + 거래금액(평문) + 해쉬키 |

## 25.3 응답 전문 (헥토파이낸셜 → 가맹점)

틴캐시 상품권 결제창에서 가맹점측으로 응답하는 컬럼을 다음과 같이 정의 합니다.

     
| 파라미터 | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- |
| mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(10) | ●   | "nx\_mid\_il" |
| outStatCd | 거래상태 | 거래상태코드(성공/실패)  <br>0021:성공  <br>0031:실패 | AN(4) | ●   | "0021" |
| outRsltCd | 거절코드 | 거래상태가 "0031"일 경우, 상세 코드 전달  <br>\[[거절 코드 표](#item-544)\] 참고 | AN(4) | ●   | "0000" |
| outRsltMsg | 결과메세지 | 결과 메세지 전달  <br>URL Encoding, UTF-8 | AHN(200) | ●   | "결제 요청 정보 누락 (상품명)" |
| method | 결제수단 | 틴캐시\[teencash\]  <br>해피머니\[happymoney\]  <br>컬쳐랜드상품권(컬쳐캐쉬)\[culturecash\]  <br>스마트문상\[smartcash\]  <br>도서상품권\[booknlife\]  <br>티머니\[tmoney\] | AN(10) | ●   | "teencash" |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유 주문번호  <br>※ 한글 제외 | AN(100) | ●   | "ORDER20211231100000" |
| mchtCustId | 상점고객아이디 | 보내주는 고유 고객아이디 혹은 유니크 키  <br>※ AES 암호화  <br>※ 컬쳐랜드상품권(컬쳐캐쉬)\[culturecash\]의 경우 필수 | AN(50) | ○   | "HongGilDong" |
| trdNo | 거래번호 | 헥토파이낸셜 거래번호 | AN(40) | ●   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| trdAmt | 거래금액 | 거래금액  <br>※ AES 암호화 | N(12) | ●   | "1000" |
| mchtParam | 상점예약필드 | 요청으로 받은 필드값을 응답으로 Bypass | AHN(4000) | ○   | "name=HongGilDong&age=25" |
| authDt | 승인일시 | 승인일시 | N(14) | ○   | "20211231100000" |

## 25.4 노티 전문 (헥토파이낸셜 → 가맹점)

거래가 정상적으로 완료되면, 헥토파이낸셜에서 가맹점으로 노티(결과통보) 메세지가 전송됩니다.

     
| 파라미터 | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- |
| outStatCd | 거래상태 | 성공\[0021\] | N(4) | ●   | "0021" |
| trdNo | 거래번호 | 헥토파이낸셜에서 부여하는 고유 거래번호 | AN(40) | ●   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| method | 결제수단 | 티머니\[TM\], 컬쳐랜드상품권(컬쳐캐쉬)\[CG\], 스마트문상\[SG\],  <br>도서상품권\[BG\], 해피머니\[HM\], 틴캐시\[TC\],  <br>포인트다모아\[CP\] | A(2) | ●   | "TC" |
| bizType | 업무구분 | 결제\[B0\], 취소\[C0\] | AN(2) | ●   | "B0" |
| mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 상점아이디 | AN(12) | ●   | "nx\_mid\_il" |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 wnans거래번호 | AN(100) | ●   | "ORDER20211231100000" |
| mchtCustNm | 고객명 | 실제 결제자의 주문자명 | AHN(30) | ○   | "홍길동" |
| mchtName | 상점한글명 | 실판매자명, 거래요청시 실판매자명이 없는 경우 헥토파이낸셜와 계약된 상점명 | AHN(20) | ○   | "헥토파이낸셜" |
| pmtprdNm | 상품명 | 고객이 주문한 결제 상품명 | AHN(128) | ○   | "테스트상품" |
| trdDtm | 거래일시 | 승인일시, 취소 : 취소일시가 전달됩니다.  <br>형식:YYYYMMDDhhmmss | N(14) | ●   | "20211231100000" |
| trdAmt | 거래금액 | 거래금액 | N(12) | ○   | "1000" |
| email | 고객이메일 | 상점고객이메일 | AN(60) | ○   | "HongGilDong@example.com" |
| mchtCustId | 상점고객아이디 | 상점고객아이디 | AN(50) | ○   | "HongGilDong" |
| csrcIssNo | 현금영수증 승인번호 | 현금영수증 승인번호 | AN(9) | ○   | "0123456789" |
| mchtParam | 상점예약필드 | 상점에서 이용하는 추가 정보 필드로 전달한 값이 그대로 반환됩니다. | AHN(4000) | ○   | "name=HongGilDong&age=25" |
| pktHash | 해쉬값 | SHA256 (거래상태코드+거래일자+거래시간+상점아이디+상점주문번호+거래금액+해쉬키) | AN(64) | ●   | "a2d6d597d55d7c9b689baa2e08c1ddf0ce71f4248c5b9b59fe61bfbf949543e1" |

가맹점에서 헥토파이낸셜로 응답을 전송합니다.

 
| 응답 (가맹점 → 헥토파이낸셜) |     |
| --- | --- |
| 성공시 | "OK" (대문자) |
| 실패시 | "FAIL" (대문자, FAIL로 응답시 명확한 실패로 인식합니다. 노티가 재전송 됩니다.) |
| 그 외 | 비정상 실패로 인식하여, 설정된 횟수만큼 노티 재발송 처리함. |

# 26.틴캐시/해피머니/컬쳐캐쉬/스마트문상/도서상품권/티머니취소(Non-UI)

## 26.1 요청 전문 (가맹점 → 헥토파이낸셜)

가맹점 서버에서 헥토파이낸셜측으로 요청하는 컬럼을 다음과 같이 정의합니다.

      
| 파라미터 |     | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- | --- |
| params | mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(10) | ●   | "nx\_mid\_il" |
| ver | 버전  | 전문의 버전 | AN(4) | ●   | "0A19"  <br>※ 고정값 |
| method | 결제수단 | 틴캐시\[TC\], 해피머니\[HM\], 컬쳐랜드상품권(컬쳐캐쉬)\[CG\],스마트문상\[SG\], 도서상품권\[BG\], 티머니\[TM\] | A(2) | ●   | "TC" |
| bizType | 업무구분 | 업무 구분코드 | AN(2) | ●   | "C0"  <br>※ 고정값 |
| encCd | 암호화 구분 | 암호화 구분 코드 | N(2) | ●   | "23"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유한 주문번호 | AN(100) | ●   | "ORDER20211231100000" |
| trdDt | 취소요청일자 | 현재 전문을 전송하는 일자(YYYYMMDD) | N(8) | ●   | "20211231" |
| trdTm | 취소요청시간 | 현재 전문을 전송하는 시간(HHMMSS) | N(6) | ●   | "100000" |
| mobileYn | 모바일 여부 | Y:모바일웹/앱, N:PC 또는 그 외 | A(1) | ○   | "N" |
| osType | OS 구분 | A:Android, I:IOS, W:windows, M:Mac, E:기타, 공백:확인불가 | A(1) | ○   | "W" |
| data | pktHash | hash데이터 | SHA256 방식으로 생성한 해쉬값  <br>\[[요청 전문 해쉬 코드](#item-481)\] 참고 | AN(200) | ●   | "f395b6725a9a18f2563ce34f8bc76698051d27c05e5ba815f463f00429061c0c" |
| orgTrdNo | 원거래번호 | 결제 시, 헥토파이낸셜에서 발급한 거래번호 | AN(40) | ●   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| crcCd | 통화구분 | 통화 구분 값 | A(3) | ●   | "KRW"  <br>※ 고정값 |
| cnclOrd | 취소회차 | 상품권류 001 고정. | N(3) | ●   | "001"  <br>※ 고정값 |
| cnclAmt | 취소금액 | 취소금액  <br>※ AES 암호화 | N(12) | ●   | "1000" |
| cnclRsn | 취소사유내용 | 필요한 경우, 취소 사유 메세지 기재 | AHN(255) | ○   | "상품이 마음에 들지 않아서" |

## 26.2 요청 전문 해쉬 코드

 
| 항목  | 조합 필드 |
| --- | --- |
| pktHash | 취소요청일자 + 취소요청시간 + 상점아이디 + 상점주문번호 + 취소금액(평문) + 해쉬키 |

## 26.3 응답 전문 (헥토파이낸셜 → 가맹점)

헥토파이낸셜에서 가맹점측으로 응답하는 컬럼을 다음과 같이 정의합니다.

      
| 파라미터 |     | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- | --- |
| params | mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(10) | ●   | "nx\_mid\_il" |
| ver | 버전  | 전문의 버전 | AN(4) | ●   | "0A19"  <br>※ 고정값 |
| method | 결제수단 | 틴캐시\[TC\], 해피머니\[HM\], 컬쳐랜드상품권(컬쳐캐쉬)\[CG\],스마트문상\[SG\], 도서상품권\[BG\], 티머니\[TM\] | A(2) | ●   | "TC" |
| bizType | 업무구분 | 업무 구분코드 | AN(2) | ●   | "C0"  <br>※ 고정값 |
| encCd | 암호화 구분 | 암호화 구분 코드 | N(2) | ●   | "23"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유한 주문번호 | AN(100) | ●   | "ORDER20211231100000" |
| trdNo | 헥토파이낸셜 거래번호 | 헥토파이낸셜에서 생성하는 고유한 거래번호 | AN(40) | ●   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| trdDt | 취소요청일자 | 현재 전문을 전송하는 일자(YYYYMMDD) | N(8) | ●   | "20211231" |
| trdTm | 취소요청시간 | 현재 전문을 전송하는 시간(HHMMSS) | N(6) | ●   | "100000" |
| outStatCd | 거래상태 | 거래상태코드(성공/실패)  <br>0021:성공  <br>0031:실패 | AN(4) | ●   | "0021" |
| outRsltCd | 거절코드 | 거래상태가 "0031"일 경우, 상세 코드 전달  <br>\[[거절 코드 표](#item-544)\] 참고 | AN(4) | ●   | "0000" |
| outRsltMsg | 결과메세지 | 결과 메세지 전달  <br>URL Encoding, UTF-8 | AHN(200) | ●   | "정상적으로 처리되었습니다." |
| data | pktHash | 해쉬값 | 요청시, hash 값 그대로 return | AN(64) | ●   |     |
| orgTrdNo | 원거래번호 | 결제 시, 헥토파이낸셜에서 발급한 거래번호 | AN(40) | ●   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| cnclAmt | 취소금액 | 취소금액  <br>※ AES 암호화 | N(12) | ●   | "1000" |

## 26.4 노티 전문 (헥토파이낸셜 → 가맹점)

※ \[[25.4 노티 전문](#item-721)\] 참고

# 27\. 포인트다모아 결제 (UI)

## 27.1 요청 전문 (가맹점 → 헥토파이낸셜)

가맹점 서버에서 헥토파이낸셜측으로 요청하는 컬럼을 다음과 같이 정의합니다.

     
| 파라미터 | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- |
| mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(10) | ●   | "nxpt\_kt\_il" |
| method | 결제수단 | PG 서비스에 해당하는 결제 구분 코드 | AN(20) | ●   | “point”  <br>※ 고정값 |
| trdDt | 요청일자 | yyyyMMdd | N(8) | ●   | "20211231" |
| trdTm | 요청시간 | HH24MISS | N(6) | ●   | "100000" |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유 주문번호  <br>※ 한글 제외 | AN(100) | ●   | "ORDER20211231100000" |
| mchtName | 상점한글명 | 상점한글명 | AHN(100) | ●   | "헥토파이낸셜" |
| mchtEName | 상점영문명 | 상점영문명 | AN(100) | ●   | "Hecto Financial" |
| pmtPrdtNm | 상품명 | 결제상품명 | AHN(128) | ●   | "테스트상품" |
| trdAmt | 거래금액 | 거래금액  <br>※ AES 암호화 | N(12) | ●   | "1000" |
| mchtCustNm | 고객명 | 고객명  <br>※ AES 암호화 | AHN(30) | ○   | "홍길동" |
| notiUrl | 결과처리 URL | 결제 후 결과 전달되는 페이지의 URL(Server To Server 연동 URL) | AN(250) | ●   | "https://example.com/notiUrl" |
| nextUrl | 결과화면 URL | 결제 후 결과 전달 및 이동페이지 URL | AN(250) | ●   | "https://example.com/nextUrl" |
| cancUrl | 결제취소 URL | 고객 강제 종료시 결과 전달 및 이동페이지 URL | AN(250) | ●   | "https://example.com/cancUrl" |
| mchtParam | 상점예약필드 | 기타 주문 정보를 입력하는 상점 예약 필드 | AHN(4000) | ○   | "name=HongGilDong&age=25" |
| email | 이메일 | 이메일 주소  <br>※ AES 암호화 | AN(60) | ○   | "HongGilDong@example.com" |
| prdtTerm | 상품제공기간 | yyyyMMddHHmmss  <br>값이 없으면 일반결제로 표기 | N(14) | ○   | "20221231235959" |
| mchtCustId | 상점고객아이디 | 상점에서 보내주는 고유 고객아이디 혹은 유니크키  <br>※ AES 암호화 | AN(50) | ○   | "HongGilDong" |
| clipCustNm | 고객명 | 포인트다모아 사용 시  <br>※ AES 암호화 | AHN(30) | ○   | "홍길동" |
| clipCustCi | CI  | 포인트다모아 사용시  <br>※ AES 암호화 | AN(88) | ○   | "AES256 암호화 이전 CI 값 기준 88byte" |
| clipCustPhoneNo | 휴대폰번호 | 포인트다모아 사용시  <br>※ AES 암호화 | N(11) | ○   | "01012345678" |
| certNotiUrl | 인증결과 URL | 인증 결과 전달(Server To Server 연동 URL)  <br>특정상점만 사용 | AN(250) | ○   | "https://example.com/certNotiUrl" |
| skipCd | 스킵여부 | 약관동의 스킵여부 | A(1) | ○   | "N" |
| custIp | 고객 IP주소 | 상점 서버의 IP가 아닌, 고객 기기의 IP주소 | AN(15) | ○   | "127.0.0.1" |
| pktHash | hash데이터 | SHA256 방식으로 생성한 해쉬값  <br>\[[요청 전문 해쉬 코드](#item-535)\] 참고 | AN(200) | ●   | "f395b6725a9a18f2563ce34f8bc76698051d27c05e5ba815f463f00429061c0c" |

## 27.2 요청 전문 해쉬 코드

 
| 항목  | 조합 필드 |
| --- | --- |
| pktHash | 상점아이디 + 결제수단 + 상점주문번호 + 요청일자 + 요청시간 + 거래금액(평문) + 해쉬키 |

## 27.3 응답 전문 (헥토파이낸셜 → 가맹점)

포인트다모아 결제창에서 가맹점측으로 응답하는 컬럼을 다음과 같이 정의 합니다.

     
| 파라미터 | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- |
| mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(10) | ●   | "nxpt\_kt\_il" |
| outStatCd | 거래상태 | 거래상태코드(성공/실패)  <br>0021:성공  <br>0031:실패 | AN(4) | ●   | "0021" |
| outRsltCd | 거절코드 | 거래상태가 "0031"일 경우, 상세 코드 전달  <br>\[[거절 코드 표](#item-544)\] 참고 | AN(4) | ●   | "0000" |
| outRsltMsg | 결과메세지 | 결과 메세지 전달  <br>URL Encoding, UTF-8 | AHN(200) | ●   | "결제 요청 정보 누락 (상품명)" |
| method | 결제수단 | PG 서비스에 해당하는 결제 구분 코드 | AN(10) | ●   | "point"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유 주문번호  <br>※ 한글 제외 | AN(100) | ●   | "ORDER20211231100000" |
| mchtCustId | 상점고객아이디 | 보내주는 고유 고객아이디 혹은 유니크 키  <br>※ AES 암호화 | AN(50) | ○   | "HongGilDong" |
| trdNo | 거래번호 | 헥토파이낸셜 거래번호 | AN(40) | ●   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| trdAmt | 거래금액 | 거래금액  <br>※ AES 암호화 | N(12) | ●   | "1000" |
| mchtParam | 상점예약필드 | 요청으로 받은 필드값을 응답으로 Bypass | AHN(4000) | ○   | "name=HongGilDong&age=25" |
| authDt | 승인일시 | 승인일시 | N(14) | ○   | "20211231100000" |

## 27.4 노티 전문 (헥토파이낸셜 → 가맹점)

※ \[[25.4 노티 전문](#item-721)\] 참고

# 28\. 포인트다모아 취소 (Non-UI)

## 28.1 요청 전문 (가맹점 → 헥토파이낸셜)

가맹점 서버에서 헥토파이낸셜측으로 요청하는 컬럼을 다음과 같이 정의합니다.

      
| 파라미터 |     | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- | --- |
| params | mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(10) | ●   | "nxpt\_kt\_il" |
| ver | 버전  | 전문의 버전 | AN(4) | ●   | "0A19"  <br>※ 고정값 |
| method | 결제수단 | 결제수단 | A(2) | ●   | "CP"  <br>※ 고정값 |
| bizType | 업무구분 | 업무 구분코드 | AN(2) | ●   | "C0"  <br>※ 고정값 |
| encCd | 암호화 구분 | 암호화 구분 코드 | N(2) | ●   | "23"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유한 거래번호 | AN(100) | ●   | "ORDER20211231100000" |
| trdDt | 취소요청일자 | 현재 전문을 전송하는 일자(YYYYMMDD) | N(8) | ●   | "20211231" |
| trdTm | 취소요청시간 | 현재 전문을 전송하는 시간(HHMMSS) | N(6) | ●   | "100000" |
| mobileYn | 모바일 여부 | Y:모바일웹/앱, N:PC 또는 그 외 | A(1) | ○   | "N" |
| osType | OS 구분 | A:Android, I:IOS, W:windows, M:Mac, E:기타, 공백:확인불가 | A(1) | ○   | "W" |
| data | pktHash | hash데이터 | SHA256 방식으로 생성한 해쉬값  <br>\[[요청 전문 해쉬 코드](#item-541)\] 참고 | AN(200) | ●   | "f395b6725a9a18f2563ce34f8bc76698051d27c05e5ba815f463f00429061c0c" |
| orgTrdNo | 원거래번호 | 결제 시, 헥토파이낸셜에서 발급한 거래번호 | AN(40) | ●   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| crcCd | 통화구분 | 통화 구분 값 | A(3) | ●   | "KRW"  <br>※ 고정값 |
| cnclOrd | 취소회차 | 001부터 시작. 부분취소 2회차의 경우 002 | N(3) | ●   | "001" |
| cnclAmt | 취소금액 | 취소금액  <br>※ AES 암호화 | N(12) | ●   | "1000" |
| cnclRsn | 취소사유내용 | 필요한 경우, 취소 사유 메세지 기재 | AHN(255) | ○   | "상품이 마음에 들지 않아서" |

## 28.2 요청 전문 해쉬 코드

 
| 항목  | 조합 필드 |
| --- | --- |
| pktHash | 취소요청일자 + 취소요청시간 + 상점아이디 + 상점주문번호 + 취소금액(평문) + 해쉬키 |

## 28.3 응답 전문 (헥토파이낸셜 → 가맹점)

헥토파이낸셜에서 가맹점측으로 응답하는 컬럼을 다음과 같이 정의합니다.

      
| 파라미터 |     | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- | --- |
| params | mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(10) | ●   | "nxpt\_kt\_il" |
| ver | 버전  | 전문의 버전 | AN(4) | ●   | "0A19"  <br>※ 고정값 |
| method | 결제수단 | 결제수단 | A(2) | ●   | "CP"  <br>※ 고정값 |
| bizType | 업무구분 | 업무 구분코드 | AN(2) | ●   | "C0"  <br>※ 고정값 |
| encCd | 암호화 구분 | 암호화 구분 코드 | N(2) | ●   | "23"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유한 주문번호 | AN(100) | ●   | "ORDER20211231100000" |
| trdNo | 헥토파이낸셜 거래번호 | 헥토파이낸셜에서 생성하는 고유한 거래번호 | AN(40) | ●   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| trdDt | 취소요청일자 | 현재 전문을 전송하는 일자(YYYYMMDD) | N(8) | ●   | "20211231" |
| trdTm | 취소요청시간 | 현재 전문을 전송하는 시간(HHMMSS) | N(6) | ●   | "100000" |
| outStatCd | 거래상태 | 거래상태코드(성공/실패)  <br>0021:성공  <br>0031:실패 | AN(4) | ●   | "0021" |
| outRsltCd | 거절코드 | 거래상태가 "0031"일 경우, 상세 코드 전달  <br>\[[거절 코드 표](#item-544)\] 참고 | AN(4) | ●   | "0000" |
| outRsltMsg | 결과메세지 | 결과 메세지 전달  <br>URL Encoding, UTF-8 | AHN(200) | ●   | "정상적으로 처리되었습니다." |
| data | pktHash | 해쉬값 | 요청시, hash 값 그대로 return | AN(64) | ●   |     |
| orgTrdNo | 원거래번호 | 결제 시, 헥토파이낸셜에서 발급한 거래번호 | AN(40) | ●   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| cnclAmt | 취소금액 | 취소금액  <br>※ AES 암호화 | N(12) | ●   | "1000" |

## 28.4 노티 전문 (헥토파이낸셜 → 가맹점)

※ \[[25.4 노티 전문](#item-721)\] 참고

# 29\. 페이코 간편결제 (UI)

## 29.1 API URI

 
| 구분  | URL |
| --- | --- |
| 테스트베드 | https://tbnpg.settlebank.co.kr/corp/main.do |
| 상용 환경 | https://npg.settlebank.co.kr/corp/main.do |

## 29.2 요청 및 응답 헤더

 
| 구분  | 내용  |
| --- | --- |
| 요청  | Content-type=application/x-www-form-urlencoded; charset=UTF-8 |
| 응답  | Content-type=text/html; charset=UTF-8 |

## 29.3 페이코 개발계 테스트 정보

※ 페이코 개발계 회원가입*   PAYCO 개발계 회원가입은 먼저 헥토파이낸셜 페이코 결제창 API 연동 후 페이코 데모창을 통하여 회원가입을 진행합니다.
*   휴대폰이 없는 경우 "본인 명의 휴대폰이 없나요?" 문구 클릭 후 이메일로 가입을 진행합니다.
*   개발 환경에서는 내부작업 등의 이유로 테스트 불가한 경우가 종종 발생하는점 양해 부탁드립니다.

*   PAYCO 데모창 회원가입

![페이코 회원가입](/images/contents/docs/pg_payco_guide1.PNG) ![페이코 회원가입](/images/contents/docs/pg_payco_guide2.PNG) ![페이코 회원가입](/images/contents/docs/pg_payco_guide3.PNG)

*   휴대폰이 없는 경우 이메일 가입

![페이코 회원가입](/images/contents/docs/pg_payco_guide4.PNG)

 

※ 페이코 개발계 테스트 정보*   페이코 개발계 포인트 적립, 쿠폰발급, 카드번호 확인 등은 페이코 개발자센터 ▶️ 테스트하기 ▶️ 테스트 설정에서 확인하시면 됩니다.  
    ( URL : https://devcenter.payco.com/support/test?id=220401042 )
*   다음은 개발 환경에서 등록 가능한 카드입니다. 여러개 등록하시어 테스트 바라며, 오류 발생 시 다른 카드로 테스트 부탁드립니다.
*   개발 환경에서는 실제 결제가 이루어지지 않습니다.

|     | 카드번호 | 유효기간(MM/YY) | CVC | 비밀번호 |
| --- | --- | --- | --- | --- |
| 하나카드 | 9440 - 81\*\* - \*\*\*\* - \*\*\*\* | 12/25 | \*\*\* | \*\*\*\* |
| --- | --- | --- | --- | --- |
| 4570 - 47\*\* - \*\*\*\* - \*\*\*\* |
| --- | --- | --- | --- | --- |
| 신한카드 | 5107 - 3767 - 1104 - \*\*\*\* |
| --- | --- | --- | --- | --- |
| 9410 - 84\*\* - \*\*\*\* - \*\*\*\* |
| --- | --- | --- | --- | --- |
| 비씨카드 | 4906 - \*\*\*\* - \*\*\*\* - \*\*\*\* |
| --- | --- | --- | --- | --- |
| 5377 - 03\*\* - \*\*\*\* - \*\*\*\* |
| --- | --- | --- | --- | --- |
| 현대카드 | 9490 - 1907 - \*\*\*\* - \*\*\*\* |
| --- | --- | --- | --- | --- |
| 3646 - 83\*\* - \*\*\*\* - \*\*\*\* |
| --- | --- | --- | --- | --- |
| 우리(BC)카드 | 6253 - 20\*\* - \*\*\*\* - \*\*\*\* |
| --- | --- | --- | --- | --- |
| 9420 - 22\*\* - \*\*\*\* - \*\*\*\* |
| --- | --- | --- | --- | --- |
| 국민카드 | 4673 - 09\*\* - \*\*\*\* - \*\*\*\* |
| --- | --- | --- | --- | --- |
| 4579 - 92\*\* - \*\*\*\* - \*\*\*\* |
| --- | --- | --- | --- | --- |
| 농협카드 | 4988 - 19\*\* - \*\*\*\* - \*\*\*\* |
| --- | --- | --- | --- | --- |
| 신한카드 | 9710 - 10\*\* - \*\*\*\* - \*\*\*\* |
| --- | --- | --- | --- | --- |
| 우리독자카드 | 4693 - 69\*\* - \*\*\*\* - \*\*\*\* |
| --- | --- | --- | --- | --- |

**＊ 표시는 임의의 값을 넣어주시면 됩니다.**  
  
 

#### 유의사항

\[페이코 개발 APP 설치\]

*   테스트 AOS/IOS 앱 다운로드는 안내드린 개발자 센터 ▶️ 테스트하기 ▶️ APP 다운로드 페이지에서 설치하시면 됩니다.  
    ( URL : https://devcenter.payco.com/support/app?id=220401041 )

*   ※ 유의사항
*   설치 완료 후 iOS의 경우: 설정 > 일반 > 기기관리 > 'NHN'을(를) 신뢰함 팝업에서 \[신뢰\] 를 터치해 주셔야 사용 가능합니다.
*   설정하지 않으시면, IOS 앱스토어로 이동하여 PAYCO 앱을 설치 하시라는 안내 메시지를 확인 하시게 됩니다.
*   기존 PAYCO 리얼앱이 설치되어 있으시면 삭제 후 설치하시기 바랍니다.
*   안드로이드 및 IOS 앱스킴은 [앱스킴 리스트](#item-691) > \[PAYCO 간편결제\] 부분을 참고 부탁드립니다.

 

## 29.4 요청 전문 (가맹점 → 헥토파이낸셜)

가맹점 서버에서 헥토파이낸셜측으로 요청하는 컬럼을 다음과 같이 정의합니다.

     
| 파라미터 | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- |
| mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디  <br>※ 테스트용 상점아이디  <br>hecto\_test:페이코 간편결제  <br>nx\_mid\_hd:인증/승인 분리형 | AN(10) | ●   | "hecto\_test" |
| method | 결제수단 | PG 서비스에 해당하는 결제 구분 코드 | AN(20) | ●   | “corp”  <br>※ 고정값 |
| corpPayCode | 간편결제코드 | 간편결제 코드값  <br>PAC:페이코 | AN(3) | ●   | "PAC" |
| trdDt | 요청일자 | yyyyMMdd | N(8) | ●   | "20211231" |
| trdTm | 요청시간 | HH24MISS | N(6) | ●   | "100000" |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유 주문번호  <br>※ 한글 제외 | AN(100) | ●   | "ORDER20211231100000" |
| mchtName | 상점한글명 | 상점한글명 | AHN(100) | ●   | "헥토파이낸셜" |
| pmtPrdtNm | 상품명 | 결제상품명 | AHN(128) | ●   | "테스트상품" |
| trdAmt | 거래금액 | 거래금액  <br>※ AES 암호화 | N(12) | ●   | "1000" |
| taxTypeCd | 세금유형 | N : 과세, Y : 면세, G : 복합과세  <br>공백일 경우 상점 설정에 따름  <br>※ 과세 유형 별 결제 수단이 상이할 수 있으며 상단 주의 사항 참고 부탁드립니다. | A(1) | ○   | "N" |
| taxAmt | 과세금액 | 과세금액(복합과세일 경우 필수)  <br>※ AES 암호화 | N(12) | ○   | "909" |
| vatAmt | 부가세금액 | 부가세금액(복합과세일 경우 필수)  <br>※ AES 암호화 | N(12) | ○   | "91" |
| taxFreeAmt | 비과세금액 | 면세금액(복합과세일 경우 필수)  <br>※ AES 암호화 | N(12) | ○   | "0" |
| notiUrl | 결과처리 URL | 결제 후 결과 전달되는 페이지의 URL(Server To Server 연동 URL) | AN(250) | ●   | "https://example.com/notiUrl" |
| nextUrl | 결과화면 URL | 결제 후 결과 전달 및 이동페이지 URL | AN(250) | ●   | "https://example.com/nextUrl" |
| cancUrl | 결제취소 URL | 고객 강제 종료시 결과 전달 및 이동페이지 URL | AN(250) | ●   | "https://example.com/cancUrl" |
| mchtParam | 상점예약필드 | 기타 주문 정보를 입력하는 상점 예약 필드 | AHN(4000) | ○   | "name=HongGilDong&age=25" |
| mchtCustId | 상점고객아이디 | 상점에서 보내주는 고유 고객아이디 혹은 유니크키  <br>※ AES 암호화 | AN(50) | ○   | "HongGilDong" |
| appScheme | 앱스키마 | 자체앱을 구축하는 경우 사용 | AN(100) | ○   | "PAYAPPNAME" |
| pktHash | hash데이터 | SHA256 방식으로 생성한 해쉬값  <br>\[[요청 전문 해쉬 코드](#item-1025)\] 참고 | AN(200) | ●   | "f395b6725a9a18f2563ce34f8bc76698051d27c05e5ba815f463f00429061c0c" |

## 29.5 요청 전문 해쉬 코드

 
| 항목  | 조합 필드 |
| --- | --- |
| pktHash | 상점아이디 + 결제수단 + 상점주문번호 + 요청일자 + 요청시간 + 거래금액(평문) + 해쉬키 |

## 29.6 응답 전문 (헥토파이낸셜 → 가맹점)

     
| 파라미터 | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- |
| mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(10) | ●   | "hecto\_test" |
| outStatCd | 거래상태 | 거래상태코드(성공/실패)  <br>0021:성공  <br>0061:인증 성공(인증/승인 분리형)  <br>0031:실패 | AN(4) | ●   | "0021" |
| outRsltCd | 거절코드 | 거래상태가 "0031"일 경우, 상세 코드 전달  <br>\[[거절 코드 표](#item-544)\] 참고 | AN(4) | ●   | "0000" |
| outRsltMsg | 결과메세지 | 결과 메세지 전달  <br>URL Encoding, UTF-8 | AHN(200) | ●   | "결제 요청 정보 누락 (상품명)" |
| method | 결제수단 | PG 서비스에 해당하는 결제 구분 코드 | AN(20) | ●   | "corp"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유 주문번호  <br>※ 한글 제외 | AN(100) | ●   | "ORDER20211231100000" |
| mchtCustId | 상점고객아이디 | 보내주는 고유 고객아이디 혹은 유니크 키  <br>※ AES 암호화 | AN(50) | ○   | "HongGilDong" |
| trdNo | 거래번호 | 헥토파이낸셜 거래번호 | AN(40) | ●   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| trdAmt | 거래금액 | 거래금액  <br>※ AES 암호화 | N(12) | ●   | "1000" |
| mchtParam | 기타주문정보 | 요청으로 받은 필드값을 응답으로 Bypass | AHN(4000) | ○   | "name=HongGilDong&age=25" |
| authDt | 승인일시 | 승인일시 | N(14) | ○   | "20211231100000" |

## 29.7 노티 전문 (헥토파이낸셜 → 가맹점)

거래가 정상적으로 완료되면, 헥토파이낸셜에서 가맹점으로 노티(결과통보) 메세지가 전송됩니다.

     
| 파라미터 | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- |
| outStatCd | 거래상태 | 성공\[0021\] | N(4) | ●   | "0021" |
| trdNo | 거래번호 | 헥토파이낸셜에서 부여하는 고유 거래번호 | AN(40) | ●   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| method | 결제수단 | 간편결제\[PZ\] | A(2) | ●   | "PZ" |
| bizType | 업무구분 | \[페이코, 카카오페이\]  <br>\- 승인\[B0\], 취소\[C0\]  <br>\[네이버페이\]  <br>\- 포인트\[B0\], 신용카드\[B1\], 취소\[C0\] | AN(2) | ●   | "B0" |
| mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 상점아이디 | AN(12) | ●   | "hecto\_test" |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유 주문 번호 | AN(100) | ●   | "ORDER20211231100000" |
| ezpDivCd | 간편결제사  <br>구분코드 | 카카오페이\[KKP\],  <br>네이버페이\[NVP\],  <br>페이코\[PAC\] | AN(12) | ●   | "PAC" |
| mchtName | 상점한글명 | 실 판매자명, 거래 요청시 실 판매자명이 없는 경우 헥토파이낸셜와 계약된 상점명 | AHN(20) | ○   | "헥토파이낸셜" |
| pmtprdNm | 상품명 | 고객이 주문한 결제 상품명 | AHN(128) | ○   | "테스트상품" |
| trdDtm | 거래일시 | 승인일시, 취소/부분취소거래 : 취소일시가 전달됩니다.  <br>형식:YYYYMMDDhhmmss | N(14) | ●   | "20211231100000" |
| trdAmt | 거래금액 | 거래금액 | N(12) | ○   | "1000" |
| cardCd | 카드사코드 | 카드사 코드  <br>\[[신용카드 식별자 참고](#item-545)\] | AN(10) | ○   | "NHC" |
| cardNm | 카드명 | 카드사 명  <br>\[[신용카드 식별자 참고](#item-545)\] | AHN(20) | ○   | "NH 체크" |
| email | 고객이메일 | 상점 고객 이메일 | AN(60) | ○   | "HongGilDong@example.com" |
| mchtCustId | 상점고객아이디 | 상점 고객 아이디 | AN(50) | ○   | "HongGilDong" |
| cardNo | 카드번호 | 마스킹된 카드번호 123456\*\*\*\*\*\*7890  <br>\*상점 설정 정보에 따른 옵션값 | AN(20) | ○   | "123456\*\*\*\*\*\*7890" |
| cardApprNo | 카드승인번호 | 카드 승인 번호 | AN(15) | ○   | "30001234" |
| instmtMon | 할부개월수 | 할부 개월 수 | N(2) | ○   | "00" |
| instmtType | 할부타입 | 할부 개월이 카드사 이벤트에 속하는 경우 Y  <br>\*상점 설정 정보에 따른 옵션값 | A(1) | ○   | "N" |
| orgTrdNo | 원거래번호 | 취소 시, 원거래 번호 | AN(40) | ○   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| orgTrdDt | 원거래일자 | 취소 시, 원거래 일자 | N(8) | ○   | "20211231" |
| pntAmt | 포인트 금액 | 전체금액 중 포인트 금액 | N(13) | ●   | "0" |
| cardAmt | 신용카드 금액 | 전체금액 중 신용카드 금액 | N(13) | ●   | "3000" |
| coupAmt | 쿠폰 금액 | 전체금액 중 쿠폰 금액 | N(13) | ●   | "1000" |
| kkmAmt | 카카오머니 금액 | 카카오머니 금액 | N(13) | ○   | "5000" |
| csrcIssAmt | 현금영수증  <br>발행대상금액 | 현금영수증 대상금액 | N(13) | ○   | "3000" |
| cnclType | 취소거래타입 | 00:전체 취소, 10:부분 취소 | N(2) | ○   | "00" |
| csrcIssNo | 현금영수증  <br>승인번호 | 현금영수증 승인번호 | AN(30) | ○   | "0123456789" |
| mchtParam | 상점예약필드 | 상점에서 이용하는 추가 정보 필드로 전달한 값이 그대로 반환됩니다. | AHN(4000) | ○   | "name=HongGilDong&age=25" |
| pktHash | 해쉬값 | SHA256 (거래상태코드+거래일자+거래시간+상점아이디+상점주문번호+거래금액+해쉬키) | AN(64) | ●   | "a2d6d597d55d7c9b689baa2e08c1ddf0ce71f4248c5b9b59fe61bfbf949543e1" |

가맹점에서 헥토파이낸셜로 응답을 전송합니다.

 
| 응답 (가맹점 → 헥토파이낸셜) |     |
| --- | --- |
| 성공시 | "OK" (대문자) |
| 실패시 | "FAIL" (대문자, FAIL로 응답시 명확한 실패로 인식합니다. 노티가 재전송 됩니다.) |
| 그 외 | 비정상 실패로 인식하여, 설정된 횟수만큼 노티 재발송 처리함. |

# 30\. 페이코 간편결제 승인 API(Non-UI)

## 30.1 API URI

 
| 구분  | URL |
| --- | --- |
| 테스트베드 | https://tbgw.settlebank.co.kr/spay/APITrdPayco.do |
| 상용 환경 | https://gw.settlebank.co.kr/spay/APITrdPayco.do |

## 30.2 요청 및 응답 헤더

페이코 간편결제 승인 API는 Non-UI 방식으로 표준결제창을 이용하지 않습니다. ([JSON 요청 데이터](#item-584) 예시)항목을 참고 하십시오.

 
| 구분  | 내용  |
| --- | --- |
| 요청  | Content-type=application/json; charset=UTF-8 |
| 응답  | Content-type=application/json; charset=UTF-8 |

## 30.3 요청 전문 (가맹점 → 헥토파이낸셜)

가맹점 서버에서 헥토파이낸셜측으로 요청하는 컬럼을 다음과 같이 정의합니다.

      
| 파라미터 |     | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- | --- |
| params | mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(12) | ●   | "nx\_mid\_hd" |
| ver | 버전  | 전문의 버전 | AN(4) | ●   | "0A19"  <br>※ 고정값 |
| method | 결제수단 | 결제수단 | A(2) | ●   | "PZ"  <br>※ 고정값 |
| bizType | 업무구분 | 업무 구분코드 | AN(2) | ●   | "B2"  <br>※ 고정값 |
| encCd | 암호화 구분 | 암호화 구분 코드 | N(2) | ●   | "23"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | ※ 주의  <br>반드시 인증요청시에 생성한 상점주문번호를 기재해야 합니다. | AN(100) | ●   | "ORDER20230323100000" |
| trdDt | 요청일자 | 현재 전문을 전송하는 일자(YYYYMMDD) | N(8) | ●   | "20230323" |
| trdTm | 요청시간 | 현재 전문을 전송하는 시간(HHMMSS) | N(6) | ●   | "100000" |
| mobileYn | 모바일 여부 | Y:모바일웹/앱, N:PC 또는 그 외 | A(1) | ○   | "N" |
| osType | OS 구분 | A:Android, I:IOS, W:windows, M:Mac, E:기타, 공백:확인불가 | A(1) | ○   | "W" |
| data | pktHash | hash데이터 | SHA256 방식으로 생성한 해쉬값  <br>\[[요청 전문 해쉬 코드](#item-1035)\] 참고 | AN(200) | ●   | "af8c82f79a5722fffcce52323dc1859844cafa577232b3ab94535b0f469077c9" |
| authTrdNo | 인증거래번호 | ※ 인증 성공 시, 헥토파이낸셜에서 응답한 거래번호 | AN(40) | ●   | "STFP\_PGPZnx\_mid\_hd0230315153232M1196602" |
| trdAmt | 거래금액 | ※ AES 암호화 | N(12) | ●   | "1000" |

## 30.4 요청 전문 해쉬 코드

 
| 항목  | 조합 필드 |
| --- | --- |
| pktHash | 거래일자+거래시간+상점아이디+상점주문번호+거래금액(평문)+해쉬키 |

## 30.5 응답 전문 (헥토파이낸셜 → 가맹점)

헥토파이낸셜에서 가맹점측으로 응답하는 컬럼을 다음과 같이 정의합니다.

      
| 파라미터 |     | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- | --- |
| params | mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(12) | ●   | "nx\_mid\_hd" |
| ver | 버전  | 전문의 버전 | AN(4) | ○   | "0A19"  <br>※ 고정값 |
| method | 결제수단 | 결제수단 | A(2) | ○   | "PZ"  <br>※ 고정값 |
| bizType | 업무구분 | 업무 구분코드 | AN(2) | ○   | "B2"  <br>※ 고정값 |
| encCd | 암호화 구분 | 암호화 구분 코드 | N(2) | ●   | "23"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유한 주문번호 | AN(100) | ●   | "ORDER20230323100000" |
| trdNo | 헥토파이낸셜 거래번호 | 헥토파이낸셜에서 생성하는 고유한 거래번호 | AN(40) | ●   | "STFP\_PGPZnx\_mid\_hd0230315153232M1196602" |
| trdDt | 취소요청일자 | 현재 전문을 전송하는 일자(YYYYMMDD) | N(8) | ●   | "20211231" |
| trdTm | 취소요청시간 | 현재 전문을 전송하는 시간(HHMMSS) | N(6) | ●   | "100000" |
| outStatCd | 거래상태 | 거래상태코드(성공/실패)  <br>0021:성공  <br>0031:실패 | AN(4) | ●   | "0021" |
| outRsltCd | 거절코드 | 거래상태가 "0031"일 경우, 상세 코드 전달  <br>\[[거절 코드 표](#item-544)\] 참고 | AN(4) | ●   | "0000" |
| outRsltMsg | 결과메세지 | 결과 메세지 전달  <br>URL Encoding, UTF-8 | AHN(200) | ●   | "정상적으로 처리되었습니다." |
| data | pktHash | 해쉬값 | 요청시, hash 값 그대로 return | AN(64) | ●   |     |
| authTrdNo | 인증거래번호 | ※ 인증 성공 시, 헥토파이낸셜에서 응답한 거래번호 | AN(40) | ○   | "STFP\_PGPZnx\_mid\_hd0230315153232M1196602" |
| trdAmt | 거래금액 | ※ AES 암호화 | N(12) | ●   | "1000" |

## 30.6 노티 전문 (헥토파이낸셜 → 가맹점)

※ \[[29.7 노티 전문](#item-1027)\] 참고  
 

# 31\. 페이코 간편결제 취소 API (Non-UI)

## 31.1 요청 전문 (가맹점 → 헥토파이낸셜)

가맹점 서버에서 헥토파이낸셜측으로 요청하는 컬럼을 다음과 같이 정의합니다.

      
| 파라미터 |     | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- | --- |
| params | mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(12) | ●   | "hecto\_test" |
| ver | 버전  | 전문의 버전 | AN(4) | ●   | "0A19"  <br>※ 고정값 |
| method | 결제수단 | 결제수단 | A(2) | ●   | "PZ"  <br>※ 고정값 |
| bizType | 업무구분 | 업무 구분코드 | AN(2) | ●   | "C0"  <br>※ 고정값 |
| encCd | 암호화 구분 | 암호화 구분 코드 | N(2) | ●   | "23"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유한 주문번호 | AN(100) | ●   | "ORDER20211231100000" |
| trdDt | 취소요청일자 | 현재 전문을 전송하는 일자(YYYYMMDD) | N(8) | ●   | "20211231" |
| trdTm | 취소요청시간 | 현재 전문을 전송하는 시간(HHMMSS) | N(6) | ●   | "100000" |
| mobileYn | 모바일 여부 | Y:모바일웹/앱, N:PC 또는 그 외 | A(1) | ○   | "N" |
| osType | OS 구분 | A:Android, I:IOS, W:windows, M:Mac, E:기타, 공백:확인불가 | A(1) | ○   | "W" |
| data | pktHash | hash데이터 | SHA256 방식으로 생성한 해쉬값  <br>\[[요청 전문 해쉬 코드](#item-1030)\] 참고 | AN(200) | ●   | "f395b6725a9a18f2563ce34f8bc76698051d27c05e5ba815f463f00429061c0c" |
| orgTrdNo | 원거래번호 | 결제 시, 헥토파이낸셜에서 발급한 거래번호 | AN(40) | ●   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| crcCd | 통화구분 | 통화 구분 값 | A(3) | ●   | "KRW"  <br>※ 고정값 |
| cnclOrd | 취소회차 | 001부터 시작. 부분취소 2회차의 경우 002 | N(3) | ●   | "001" |
| taxTypeCd | 면세여부 | Y:면세, N:과세, G:복합과세  <br>공백일 경우 상점 기본 정보에 따름. | A(1) | ○   | "N" |
| cnclAmt | 취소금액 | 취소금액  <br>※ AES 암호화 | N(12) | ●   | "1000" |
| taxAmt | 과세금액 | 취소금액 중 과세금액(복합과세인 경우 필수)  <br>※ AES 암호화 | N(12) | ○   | "909" |
| vatAmt | 부가세금액 | 취소금액 중 부가세금액(복합과세인 경우 필수)  <br>※ AES 암호화 | N(12) | ○   | "91" |
| taxFreeAmt | 비과세금액 | 취소금액 중 면세금액(복합과세인 경우 필수)  <br>※ AES 암호화 | N(12) | ○   | "0" |
| cnclRsn | 취소사유내용 | 필요한 경우, 취소 사유 메세지 기재 | AHN(255) | ○   | "상품이 마음에 들지 않아서" |

## 31.2 요청 전문 해쉬 코드

 
| 항목  | 조합 필드 |
| --- | --- |
| pktHash | 취소요청일자 + 취소요청시간 + 상점아이디 + 상점주문번호 + 취소금액(평문) + 해쉬키 |

## 31.3 응답 전문 (헥토파이낸셜 → 가맹점)

헥토파이낸셜에서 가맹점측으로 응답하는 컬럼을 다음과 같이 정의합니다.

      
| 파라미터 |     | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- | --- |
| params | mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(12) | ●   | "hecto\_test" |
| ver | 버전  | 전문의 버전 | AN(4) | ●   | "0A19"  <br>※ 고정값 |
| method | 결제수단 | 결제수단 | A(2) | ●   | "PZ"  <br>※ 고정값 |
| bizType | 업무구분 | 업무 구분코드 | AN(2) | ●   | "C0"  <br>※ 고정값 |
| encCd | 암호화 구분 | 암호화 구분 코드 | N(2) | ●   | "23"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유한 주문번호 | AN(100) | ●   | "ORDER20211231100000" |
| trdNo | 헥토파이낸셜 거래번호 | 헥토파이낸셜에서 생성하는 고유한 거래번호 | AN(40) | ●   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| trdDt | 취소요청일자 | 현재 전문을 전송하는 일자(YYYYMMDD) | N(8) | ●   | "20211231" |
| trdTm | 취소요청시간 | 현재 전문을 전송하는 시간(HHMMSS) | N(6) | ●   | "100000" |
| outStatCd | 거래상태 | 거래상태코드(성공/실패)  <br>0021:성공  <br>0031:실패 | AN(4) | ●   | "0021" |
| outRsltCd | 거절코드 | 거래상태가 "0031"일 경우, 상세 코드 전달  <br>\[[거절 코드 표](#item-544)\] 참고 | AN(4) | ●   | "0000" |
| outRsltMsg | 결과메세지 | 결과 메세지 전달  <br>URL Encoding, UTF-8 | AHN(200) | ●   | "정상적으로 처리되었습니다." |
| data | pktHash | 해쉬값 | 요청시, hash 값 그대로 return | AN(64) | ●   |     |
| orgTrdNo | 원거래번호 | 결제 시, 헥토파이낸셜에서 발급한 거래번호 | AN(40) | ●   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| cnclAmt | 취소금액 | 취소금액  <br>※ AES 암호화 | N(12) | ●   | "6000" |
| cardCnclAmt | 신용카드 취소금액 | 전체금액 중 신용카드 취소금액  <br>※ AES 암호화 | N(12) | ●   | "5000" |
| pntCnclAmt | 포인트 취소금액 | 전체금액 중 포인트 취소금액  <br>※ AES 암호화 | N(12) | ●   | "0" |
| coupCnclAmt | 쿠폰취소금액 | 전체금액 중 쿠폰 취소금액  <br>※ AES 암호화 | N(12) | ●   | "1000" |
| blcAmt | 취소가능잔액 | 취소성공시 거래번호 기준 남은 취소 가능잔액 리턴  <br>※ AES 암호화 | N(12) | ●   | "0" |

## 31.4 노티 전문 (헥토파이낸셜 → 가맹점)

※ \[[29.7 노티 전문](#item-1027)\] 참고

# 32\. 카카오페이 간편결제 (UI)

## 32.1 API URI

 
| 구분  | URL |
| --- | --- |
| 테스트베드 | https://tbnpg.settlebank.co.kr/corp/main.do |
| 상용 환경 | https://npg.settlebank.co.kr/corp/main.do |

## 32.2 요청 및 응답 헤더

 
| 구분  | 내용  |
| --- | --- |
| 요청  | Content-type=application/x-www-form-urlencoded; charset=UTF-8 |
| 응답  | Content-type=text/html; charset=UTF-8 |

## 32.3 요청 전문 (가맹점 → 헥토파이낸셜)

####   주의사항

     
| 과세유형 | 결제수단 |
| --- | --- |
| 과세  | 신용카드, 머니, 머니+포인트 복합결제 |
| 비과세 | 신용카드, 머니, 머니+포인트 복합결제 |
| 복합과세 | 신용카드 단독만 가능 |

*   테스트환경에서도 실제 결제가 이루어지오니 주의 부탁드립니다.
*   테스트환경에서 결제된 거래는 자동 취소됩니다.
*   과세 유형 별 결제 수단 참고

     
| 파라미터 | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- |
| mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디  <br>※ 테스트용 상점아이디  <br>hecto\_test:카카오페이 간편결제 | AN(10) | ●   | "hecto\_test" |
| method | 결제수단 | PG 서비스에 해당하는 결제 구분 코드 | AN(20) | ●   | “corp”  <br>※ 고정값 |
| corpPayCode | 간편결제코드 | 간편결제 코드값  <br>KKP:카카오페이 | AN(3) | ●   | "KKP" |
| trdDt | 요청일자 | yyyyMMdd | N(8) | ●   | "20211231" |
| trdTm | 요청시간 | HH24MISS | N(6) | ●   | "100000" |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유 주문번호  <br>※ 한글 제외 | AN(100) | ●   | "ORDER20211231100000" |
| mchtName | 상점한글명 | 상점한글명 | AHN(100) | ●   | "헥토파이낸셜" |
| pmtPrdtNm | 상품명 | 결제상품명 | AHN(128) | ●   | "테스트상품" |
| trdAmt | 거래금액 | 거래금액  <br>※ AES 암호화 | N(12) | ●   | "1000" |
| notiUrl | 결과처리 URL | 결제 후 결과 전달되는 페이지의 URL(Server To Server 연동 URL) | AN(250) | ●   | "https://example.com/notiUrl" |
| nextUrl | 결과화면 URL | 결제 후 결과 전달 및 이동페이지 URL | AN(250) | ●   | "https://example.com/nextUrl" |
| cancUrl | 결제취소 URL | 고객 강제 종료시 결과 전달 및 이동페이지 URL | AN(250) | ●   | "https://example.com/cancUrl" |
| taxTypeCd | 면세여부 | N:과세, Y:면세, G:복합과세  <br>공백일 경우 상점 설정에 따름  <br>※ 과세 유형 별 결제 수단이 상이할 수 있으며 상단 주의 사항 참고 부탁드립니다. | A(1) | ○   | "N" |
| taxAmt | 과세금액 | 과세금액(복합과세일 경우 필수)  <br>※ AES 암호화 | N(12) | ○   | "909" |
| vatAmt | 부가세금액 | 부가세금액(복합과세일 경우 필수)  <br>※ AES 암호화 | N(12) | ○   | "91" |
| taxFreeAmt | 비과세금액 | 면세금액(복합과세일 경우 필수)  <br>※ AES 암호화 | N(12) | ○   | "0" |
| mchtParam | 상점예약필드 | 기타 주문 정보를 입력하는 상점 예약 필드 | AHN(4000) | ○   | "name=HongGilDong&age=25" |
| mchtCustId | 상점고객아이디 | 상점에서 보내주는 고유 고객아이디 혹은 유니크키  <br>※ AES 암호화 | AN(50) | ○   | "HongGilDong" |
| appScheme | 앱스키마 | 자체앱을 구축하는 경우 사용 | AN(100) | ○   | "PAYAPPNAME" |
| pktHash | hash데이터 | SHA256 방식으로 생성한 해쉬값  <br>\[[요청 전문 해쉬 코드](#item-1064)\] 참고 | AN(200) | ●   | "f395b6725a9a18f2563ce34f8bc76698051d27c05e5ba815f463f00429061c0c" |

## 32.4 요청 전문 해쉬 코드

 
| 항목  | 조합 필드 |
| --- | --- |
| pktHash | 상점아이디 + 결제수단 + 상점주문번호 + 요청일자 + 요청시간 + 거래금액(평문) + 해쉬키 |

## 32.5 응답 전문 (헥토파이낸셜 → 가맹점)

     
| 파라미터 | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- |
| mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(10) | ●   | "hecto\_test" |
| outStatCd | 거래상태 | 거래상태코드(성공/실패)  <br>0021:성공  <br>0031:실패 | AN(4) | ●   | "0021" |
| outRsltCd | 거절코드 | 거래상태가 "0031"일 경우, 상세 코드 전달  <br>\[[거절 코드 표](#item-544)\] 참고 | AN(4) | ●   | "0000" |
| outRsltMsg | 결과메세지 | 결과 메세지 전달  <br>URL Encoding, UTF-8 | AHN(200) | ●   | "결제 요청 정보 누락 (상품명)" |
| method | 결제수단 | PG 서비스에 해당하는 결제 구분 코드 | AN(20) | ●   | "corp"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유 주문번호  <br>※ 한글 제외 | AN(100) | ●   | "ORDER20211231100000" |
| mchtCustId | 상점고객아이디 | 보내주는 고유 고객아이디 혹은 유니크 키  <br>※ AES 암호화 | AN(50) | ○   | "HongGilDong" |
| trdNo | 거래번호 | 헥토파이낸셜 거래번호 | AN(40) | ●   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| trdAmt | 거래금액 | 거래금액  <br>※ AES 암호화 | N(12) | ●   | "1000" |
| mchtParam | 기타주문정보 | 요청으로 받은 필드값을 응답으로 Bypass | AHN(4000) | ○   | "name=HongGilDong&age=25" |
| authDt | 승인일시 | 승인일시 | N(14) | ○   | "20211231100000" |

## 32.6 노티 전문 (헥토파이낸셜 → 가맹점)

※ \[[29.7 노티 전문](#item-1027)\] 참고

# 33\. 카카오페이 간편결제 취소 API(Non-UI)

*   테스트 환경에서 카카오페이 부분 취소 지원하지 않습니다. (운영환경에서는 가능합니다.)

## 33.1 요청 전문 (가맹점 → 헥토파이낸셜)

가맹점 서버에서 헥토파이낸셜측으로 요청하는 컬럼을 다음과 같이 정의합니다.

      
| 파라미터 |     | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- | --- |
| params | mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(12) | ●   | "hecto\_test" |
| ver | 버전  | 전문의 버전 | AN(4) | ●   | "0A19"  <br>※ 고정값 |
| method | 결제수단 | 결제수단 | A(2) | ●   | "PZ"  <br>※ 고정값 |
| bizType | 업무구분 | 업무 구분코드 | AN(2) | ●   | "C0"  <br>※ 고정값 |
| encCd | 암호화 구분 | 암호화 구분 코드 | N(2) | ●   | "23"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유한 주문번호 | AN(100) | ●   | "ORDER20211231100000" |
| trdDt | 취소요청일자 | 현재 전문을 전송하는 일자(YYYYMMDD) | N(8) | ●   | "20211231" |
| trdTm | 취소요청시간 | 현재 전문을 전송하는 시간(HHMMSS) | N(6) | ●   | "100000" |
| mobileYn | 모바일 여부 | Y:모바일웹/앱, N:PC 또는 그 외 | A(1) | ○   | "N" |
| osType | OS 구분 | A:Android, I:IOS, W:windows, M:Mac, E:기타, 공백:확인불가 | A(1) | ○   | "W" |
| data | pktHash | hash데이터 | SHA256 방식으로 생성한 해쉬값  <br>\[[요청 전문 해쉬 코드](#item-1067)\] 참고 | AN(200) | ●   | "f395b6725a9a18f2563ce34f8bc76698051d27c05e5ba815f463f00429061c0c" |
| orgTrdNo | 원거래번호 | 결제 시, 헥토파이낸셜에서 발급한 거래번호 | AN(40) | ●   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| crcCd | 통화구분 | 통화 구분 값 | A(3) | ●   | "KRW"  <br>※ 고정값 |
| cnclOrd | 취소회차 | 001부터 시작. 부분취소 2회차의 경우 002 | N(3) | ●   | "001" |
| taxTypeCd | 면세여부 | Y:면세, N:과세, G:복합과세. 공백일 경우 상점 기본 정보에 따름. | A(1) | ○   | "N" |
| cnclAmt | 취소금액 | 취소금액  <br>※ AES 암호화 | N(12) | ●   | "1000" |
| taxAmt | 과세금액 | 취소금액 중 과세금액(복합과세인 경우 필수)  <br>※ AES 암호화 | N(12) | ○   | "909" |
| vatAmt | 부가세금액 | 취소금액 중 부가세금액(복합과세인 경우 필수)  <br>※ AES 암호화 | N(12) | ○   | "91" |
| taxFreeAmt | 비과세금액 | 취소금액 중 면세금액(복합과세인 경우 필수)  <br>※ AES 암호화 | N(12) | ○   | "0" |
| svcAmt | 봉사료 | 취소금액 중 봉사료  <br>※ AES 암호화 | N(12) | ○   | "0" |
| cnclRsn | 취소사유내용 | 필요한 경우, 취소 사유 메세지 기재 | AHN(255) | ○   | "상품이 마음에 들지 않아서" |

## 33.2 요청 전문 해쉬 코드

 
| 항목  | 조합 필드 |
| --- | --- |
| pktHash | 취소요청일자 + 취소요청시간 + 상점아이디 + 상점주문번호 + 취소금액(평문) + 해쉬키 |

## 33.3 응답 전문 (헥토파이낸셜 → 가맹점)

헥토파이낸셜에서 가맹점측으로 응답하는 컬럼을 다음과 같이 정의합니다.

      
| 파라미터 |     | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- | --- |
| params | mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(12) | ●   | "hecto\_test" |
| ver | 버전  | 전문의 버전 | AN(4) | ●   | "0A19"  <br>※ 고정값 |
| method | 결제수단 | 결제수단 | A(2) | ●   | "PZ"  <br>※ 고정값 |
| bizType | 업무구분 | 업무 구분코드 | AN(2) | ●   | "C0"  <br>※ 고정값 |
| encCd | 암호화 구분 | 암호화 구분 코드 | N(2) | ●   | "23"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유한 주문번호 | AN(100) | ●   | "ORDER20211231100000" |
| trdNo | 헥토파이낸셜 거래번호 | 헥토파이낸셜에서 생성하는 고유한 거래번호 | AN(40) | ●   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| trdDt | 취소요청일자 | 현재 전문을 전송하는 일자(YYYYMMDD) | N(8) | ●   | "20211231" |
| trdTm | 취소요청시간 | 현재 전문을 전송하는 시간(HHMMSS) | N(6) | ●   | "100000" |
| outStatCd | 거래상태 | 거래상태코드(성공/실패)  <br>0021:성공  <br>0031:실패 | AN(4) | ●   | "0021" |
| outRsltCd | 거절코드 | 거래상태가 "0031"일 경우, 상세 코드 전달  <br>\[[거절 코드 표](#item-544)\] 참고 | AN(4) | ●   | "0000" |
| outRsltMsg | 결과메세지 | 결과 메세지 전달  <br>URL Encoding, UTF-8 | AHN(200) | ●   | "정상적으로 처리되었습니다." |
| data | pktHash | 해쉬값 | 요청시, hash 값 그대로 return | AN(64) | ●   |     |
| orgTrdNo | 원거래번호 | 결제 시, 헥토파이낸셜에서 발급한 거래번호 | AN(40) | ●   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| cnclAmt | 취소금액 | 취소금액  <br>※ AES 암호화 | N(12) | ●   | "6000" |
| cardCnclAmt | 신용카드 취소금액 | 전체금액 중 신용카드 취소금액  <br>※ AES 암호화 | N(12) | ●   | "5000" |
| pntCnclAmt | 포인트 취소금액 | 전체금액 중 포인트 취소금액  <br>※ AES 암호화 | N(12) | ●   | "0" |
| coupCnclAmt | 쿠폰취소금액 | 전체금액 중 쿠폰 취소금액  <br>※ AES 암호화 | N(12) | ●   | "1000" |
| blcAmt | 취소가능잔액 | 취소성공시 거래번호 기준 남은 취소 가능잔액 리턴  <br>※ AES 암호화 | N(12) | ●   | "0" |

## 33.4 노티 전문 (헥토파이낸셜 → 가맹점)

※ \[[29.7 노티 전문](#item-1027)\] 참고

# 34\. 네이버페이 간편결제 (UI)

## 34.1 API URI

 
| 구분  | URL |
| --- | --- |
| 테스트베드 | https://tbnpg.settlebank.co.kr/corp/main.do |
| 상용 환경 | https://npg.settlebank.co.kr/corp/main.do |

## 34.2 요청 및 응답 헤더

 
| 구분  | 내용  |
| --- | --- |
| 요청  | Content-type=application/x-www-form-urlencoded; charset=UTF-8 |
| 응답  | Content-type=text/html; charset=UTF-8 |

## 34.3 요청 전문 (가맹점 → 헥토파이낸셜)

가맹점 서버에서 헥토파이낸셜측으로 요청하는 컬럼을 다음과 같이 정의합니다.

     
| 파라미터 | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- |
| mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디  <br>※ 테스트용 상점아이디  <br>hecto\_test:네이버페이 간편결제 | AN(10) | ●   | "hecto\_test" |
| method | 결제수단 | PG 서비스에 해당하는 결제 구분 코드 | AN(20) | ●   | “corp”  <br>※ 고정값 |
| corpPayCode | 간편결제코드 | 간편결제 코드값  <br>NVP:네이버페이 | AN(3) | ●   | "NVP" |
| trdDt | 요청일자 | yyyyMMdd | N(8) | ●   | "20211231" |
| trdTm | 요청시간 | HH24MISS | N(6) | ●   | "100000" |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유 주문번호  <br>※ 한글 제외 | AN(100) | ●   | "ORDER20211231100000" |
| mchtName | 상점한글명 | 상점한글명 | AHN(100) | ●   | "헥토파이낸셜" |
| pmtPrdtNm | 상품명 | 결제상품명 | AHN(128) | ●   | "테스트상품" |
| trdAmt | 거래금액 | 거래금액  <br>※ AES 암호화 | N(12) | ●   | "1000" |
| taxTypeCd | 세금유형 | N : 과세, Y : 면세, G : 복합과세  <br>공백일 경우 상점 설정에 따름 | A(1) | ○   | "N" |
| taxAmt | 과세금액 | 거래금액 중 과세금액  <br>(복합과세일 경우 필수)  <br>※AES 암호화 | N(12) | ○   | "909" |
| vatAmt | 부가세금액 | 거래금액 중 부가세금액  <br>(복합과세일 경우 필수)  <br>※AES 암호화 | N(12) | ○   | "91" |
| taxFreeAmt | 비과세금액 | 거래금액 중 비과세금액  <br>(복합과세일 경우 필수)  <br>※AES 암호화 | N(12) | ○   | "0" |
| notiUrl | 결과처리 URL | 결제 후 결과 전달되는 페이지의 URL(Server To Server 연동 URL) | AN(250) | ●   | "https://example.com/notiUrl" |
| nextUrl | 결과화면 URL | 결제 후 결과 전달 및 이동페이지 URL | AN(250) | ●   | "https://example.com/nextUrl" |
| cancUrl | 결제취소 URL | 고객 강제 종료시 결과 전달 및 이동페이지 URL | AN(250) | ●   | "https://example.com/cancUrl" |
| mchtParam | 상점예약필드 | 기타 주문 정보를 입력하는 상점 예약 필드 | AHN(4000) | ○   | "name=HongGilDong&age=25" |
| mchtCustId | 상점고객아이디 | 상점에서 보내주는 고유 고객아이디 혹은 유니크키  <br>※ AES 암호화 | AN(50) | ○   | "HongGilDong" |
| appScheme | 앱스키마 | 자체앱을 구축하는 경우 사용 | AN(100) | ○   | "PAYAPPNAME" |
| pktHash | hash데이터 | SHA256 방식으로 생성한 해쉬값  <br>\[[요청 전문 해쉬 코드](#item-1115)\] 참고 | AN(200) | ●   | "f395b6725a9a18f2563ce34f8bc76698051d27c05e5ba815f463f00429061c0c" |

## 34.4 요청 전문 해쉬 코드

 
| 항목  | 조합 필드 |
| --- | --- |
| pktHash | 상점아이디 + 결제수단 + 상점주문번호 + 요청일자 + 요청시간 + 거래금액(평문) + 해쉬키 |

## 34.5 응답 전문 (헥토파이낸셜 → 가맹점)

     
| 파라미터 | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- |
| mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(10) | ●   | "hecto\_test" |
| outStatCd | 거래상태 | 거래상태코드(성공/실패)  <br>0021:성공  <br>0031:실패 | AN(4) | ●   | "0021" |
| outRsltCd | 거절코드 | 거래상태가 "0031"일 경우, 상세 코드 전달  <br>\[[거절 코드 표](#item-544)\] 참고 | AN(4) | ●   | "0000" |
| outRsltMsg | 결과메세지 | 결과 메세지 전달  <br>URL Encoding, UTF-8 | AHN(200) | ●   | "결제 요청 정보 누락 (상품명)" |
| method | 결제수단 | PG 서비스에 해당하는 결제 구분 코드 | AN(20) | ●   | "corp"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유 주문번호  <br>※ 한글 제외 | AN(100) | ●   | "ORDER20211231100000" |
| mchtCustId | 상점고객아이디 | 보내주는 고유 고객아이디 혹은 유니크 키  <br>※ AES 암호화 | AN(50) | ○   | "HongGilDong" |
| trdNo | 거래번호 | 헥토파이낸셜 거래번호 | AN(40) | ●   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| trdAmt | 거래금액 | 거래금액  <br>※ AES 암호화 | N(12) | ●   | "1000" |
| mchtParam | 기타주문정보 | 요청으로 받은 필드값을 응답으로 Bypass | AHN(4000) | ○   | "name=HongGilDong&age=25" |
| authDt | 승인일시 | 승인일시 | N(14) | ○   | "20211231100000" |
| csrcAmt | 현금영수증 발급 금액 | 현금영수증 발급 금액  <br>※ AES 암호화  <br>※ 결제 금액과 상이할 수 있음 (적립성 포인트가 아닌 충전결제 포인트 금액만 현금영수증 발급) | N(12) | ●   | "1000" |

## 34.6 노티 전문 (헥토파이낸셜 → 가맹점)

※ \[[29.7 노티 전문](#item-1027)\] 참고

# 35\. 네이버페이 간편결제 취소 API(Non-UI)

## 35.1 요청 전문 (가맹점 → 헥토파이낸셜)

가맹점 서버에서 헥토파이낸셜측으로 요청하는 컬럼을 다음과 같이 정의합니다.

      
| 파라미터 |     | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- | --- |
| params | mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(12) | ●   | "hecto\_test" |
| ver | 버전  | 전문의 버전 | AN(4) | ●   | "0A19"  <br>※ 고정값 |
| method | 결제수단 | 결제수단 | A(2) | ●   | "PZ"  <br>※ 고정값 |
| bizType | 업무구분 | 업무 구분코드 | AN(2) | ●   | "C0"  <br>※ 고정값 |
| encCd | 암호화 구분 | 암호화 구분 코드 | N(2) | ●   | "23"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유한 주문번호 | AN(100) | ●   | "ORDER20211231100000" |
| trdDt | 취소요청일자 | 현재 전문을 전송하는 일자(YYYYMMDD) | N(8) | ●   | "20211231" |
| trdTm | 취소요청시간 | 현재 전문을 전송하는 시간(HHMMSS) | N(6) | ●   | "100000" |
| mobileYn | 모바일 여부 | Y:모바일웹/앱, N:PC 또는 그 외 | A(1) | ○   | "N" |
| osType | OS 구분 | A:Android, I:IOS, W:windows, M:Mac, E:기타, 공백:확인불가 | A(1) | ○   | "W" |
| data | pktHash | hash데이터 | SHA256 방식으로 생성한 해쉬값  <br>\[[요청 전문 해쉬 코드](#item-1030)\] 참고 | AN(200) | ●   | "f395b6725a9a18f2563ce34f8bc76698051d27c05e5ba815f463f00429061c0c" |
| orgTrdNo | 원거래번호 | 결제 시, 헥토파이낸셜에서 발급한 거래번호 | AN(40) | ●   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| crcCd | 통화구분 | 통화 구분 값 | A(3) | ●   | "KRW"  <br>※ 고정값 |
| cnclOrd | 취소회차 | 001부터 시작. 부분취소 2회차의 경우 002 | N(3) | ●   | "001" |
| taxTypeCd | 면세여부 | Y:면세, N:과세, G:복합과세. 공백일 경우 상점 기본 정보에 따름. | A(1) | ○   | "N" |
| cnclAmt | 취소금액 | 취소금액  <br>※ AES 암호화 | N(12) | ●   | "1000" |
| taxAmt | 과세금액 | 취소금액 중 과세금액(복합과세인 경우 필수)  <br>※ AES 암호화 | N(12) | ○   | "909" |
| vatAmt | 부가세금액 | 취소금액 중 부가세금액(복합과세인 경우 필수)  <br>※ AES 암호화 | N(12) | ○   | "91" |
| taxFreeAmt | 비과세금액 | 취소금액 중 면세금액(복합과세인 경우 필수)  <br>※ AES 암호화 | N(12) | ○   | "0" |
| svcAmt | 봉사료 | 취소금액 중 봉사료  <br>※ AES 암호화 | N(12) | ○   | "0" |
| cnclRsn | 취소사유내용 | 필요한 경우, 취소 사유 메세지 기재 | AHN(255) | ○   | "상품이 마음에 들지 않아서" |

## 35.2 요청 전문 해쉬 코드

 
| 항목  | 조합 필드 |
| --- | --- |
| pktHash | 취소요청일자 + 취소요청시간 + 상점아이디 + 상점주문번호 + 취소금액(평문) + 해쉬키 |

## 35.3 응답 전문 (헥토파이낸셜 → 가맹점)

헥토파이낸셜에서 가맹점측으로 응답하는 컬럼을 다음과 같이 정의합니다.

      
| 파라미터 |     | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- | --- |
| params | mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(12) | ●   | "hecto\_test" |
| ver | 버전  | 전문의 버전 | AN(4) | ●   | "0A19"  <br>※ 고정값 |
| method | 결제수단 | 결제수단 | A(2) | ●   | "PZ"  <br>※ 고정값 |
| bizType | 업무구분 | 업무 구분코드 | AN(2) | ●   | "C0"  <br>※ 고정값 |
| encCd | 암호화 구분 | 암호화 구분 코드 | N(2) | ●   | "23"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유한 주문번호 | AN(100) | ●   | "ORDER20211231100000" |
| trdNo | 헥토파이낸셜 거래번호 | 헥토파이낸셜에서 생성하는 고유한 거래번호 | AN(40) | ●   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| trdDt | 취소요청일자 | 현재 전문을 전송하는 일자(YYYYMMDD) | N(8) | ●   | "20211231" |
| trdTm | 취소요청시간 | 현재 전문을 전송하는 시간(HHMMSS) | N(6) | ●   | "100000" |
| outStatCd | 거래상태 | 거래상태코드(성공/실패)  <br>0021:성공  <br>0031:실패 | AN(4) | ●   | "0021" |
| outRsltCd | 거절코드 | 거래상태가 "0031"일 경우, 상세 코드 전달  <br>\[[거절 코드 표](#item-544)\] 참고 | AN(4) | ●   | "0000" |
| outRsltMsg | 결과메세지 | 결과 메세지 전달  <br>URL Encoding, UTF-8 | AHN(200) | ●   | "정상적으로 처리되었습니다." |
| data | pktHash | 해쉬값 | 요청시, hash 값 그대로 return | AN(64) | ●   |     |
| orgTrdNo | 원거래번호 | 결제 시, 헥토파이낸셜에서 발급한 거래번호 | AN(40) | ●   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| cnclAmt | 취소금액 | 취소금액  <br>※ AES 암호화 | N(12) | ●   | "6000" |
| cardCnclAmt | 신용카드 취소금액 | 전체금액 중 신용카드 취소금액  <br>※ AES 암호화 | N(12) | ●   | "5000" |
| pntCnclAmt | 포인트 취소금액 | 전체금액 중 포인트 취소금액  <br>※ AES 암호화 | N(12) | ●   | "0" |
| coupCnclAmt | 쿠폰취소금액 | 전체금액 중 쿠폰 취소금액  <br>※ AES 암호화 | N(12) | ●   | "1000" |
| blcAmt | 취소가능잔액 | 취소성공시 거래번호 기준 남은 취소 가능잔액 리턴  <br>※ AES 암호화 | N(12) | ●   | "0" |

## 35.4 노티 전문 (헥토파이낸셜 → 가맹점)

※ \[[29.7 노티 전문](#item-1027)\] 참고

# 36\. 삼성페이 간편결제(UI)

삼성페이 간편 결제 연동 방법에 대해 기술합니다. 

## 36.1 API URI

 
| 구분  | URL |
| --- | --- |
| 테스트베드 | https://tbnpg.settlebank.co.kr/card/cardDirect.do |
| 상용 환경 | https://npg.settlebank.co.kr/card/cardDirect.do |

## 36.2 요청 및 응답 헤더

 
| 구분  | 내용  |
| --- | --- |
| 요청  | Content-type=application/x-www-form-urlencoded; charset=UTF-8 |
| 응답  | Content-type=text/html; charset=UTF-8 |

## 36.3 요청 전문 (가맹점 → 헥토파이낸셜)

     
| 파라미터 | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- |
| mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(10) | ●   | "nxca\_jt\_il" |
| method | 결제수단 | PG 서비스에 해당하는 결제 구분 코드 | AN(20) | ●   | "card"  <br>※ 고정값 |
| trdDt | 요청일자 | yyyyMMdd | N(8) | ●   | "20211231" |
| trdTm | 요청시간 | HH24MISS | N(6) | ●   | "100000" |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유 주문번호  <br>※ 한글 제외 | AN(100) | ●   | "ORDER20211231100000" |
| mchtName | 상점한글명 | 상점한글명 | AHN(100) | ●   | "헥토파이낸셜" |
| mchtEName | 상점영문명 | 상점영문명 | AN(100) | ●   | "Hecto Financial" |
| pmtPrdtNm | 상품명 | 결제상품명 | AHN(128) | ●   | "테스트상품" |
| trdAmt | 거래금액 | 거래금액  <br>※ AES 암호화 | N(12) | ●   | "1000" |
| mchtCustNm | 고객명 | 실제 결제자의 주문자명 | AHN(30) | ○   | "홍길동" |
| notiUrl | 결과처리 URL | 결제 후 결과 전달되는 페이지의 URL(Server To Server 연동 URL) | AN(250) | ●   | "https://example.com/notiUrl" |
| nextUrl | 결과화면 URL | 결제 후 결과 전달 및 이동페이지 URL | AN(250) | ●   | "https://example.com/notiUrl" |
| cancUrl | 결제취소 URL | 고객 강제 종료시 결과 전달 및 이동페이지 URL | AN(250) | ●   | "https://example.com/cancUrl" |
| mchtParam | 상점예약필드 | 기타 주문 정보를 입력하는 상점 예약 필드 | AHN(4000) | ○   | "name=HongGilDong&age=25" |
| email | 이메일 | 이메일 주소  <br>※ AES 암호화 | AN(60) | ○   | "HongGilDong@example.com" |
| prdtTerm | 상품제공기간 | yyyyMMddHHmmss  <br>값이 없으면 일반결제로 표기 | N(14) | ○   | "20221231235959" |
| mchtCustId | 상점고객아이디 | 상점에서 보내주는 고유 고객아이디 혹은 유니크키  <br>※ AES 암호화 | AN(50) | ○   | "HongGilDong" |
| taxTypeCd | 면세여부 | N:과세, Y:면세, G:복합과세  <br>공백일 경우 상점 설정에 따름 | A(1) | ○   | "N" |
| taxAmt | 과세금액 | 과세금액(복합과세일 경우 필수)  <br>※ AES 암호화 | N(12) | ○   | "909" |
| vatAmt | 부가세금액 | 부가세금액(복합과세일 경우 필수)  <br>※ AES 암호화 | N(12) | ○   | "91" |
| taxFreeAmt | 비과세금액 | 면세금액(복합과세일 경우 필수)  <br>※ AES 암호화 | N(12) | ○   | "0" |
| svcAmt | 봉사료 | 신용카드 봉사료  <br>※AES 암호화 | N(12) | ○   | "10" |
| instmtMon | 할부개월수 | 신용카드-직호출 경우에만 적용 | N(2) | ○   | "00" |
| cardGb | 특정카드사 코드 | 삼성페이 카드사  <br>코드값(SSP)고정 | AN(4) | ●   | "SSP" |
| appScheme | 앱스키마 | (AppScheme://~)형식으로 사용되며, 자체앱을 구축하는 경우 사용  <br>\[[신용카드 WebView](#item-690)\] 참고 | AN(100) | ○   | "PAYAPPNAME://" |
| custIp | 고객 IP주소 | 상점 서버의 IP가 아닌, 고객 기기의 IP주소 | AN(15) | ○   | "127.0.0.1" |
| pktHash | hash데이터 | SHA256 방식으로 생성한 해쉬값  <br>\[[요청 전문 해쉬 코드](#item-1273)\] 참고 | AN(200) | ●   | "f395b6725a9a18f2563ce34f8bc76698051d27c05e5ba815f463f00429061c0c" |

## 36.4 요청 전문 해쉬 코드

 
| 항목  | 조합 필드 |
| --- | --- |
| pktHash | 상점아이디 + 결제수단 + 상점주문번호 + 요청일자 + 요청시간 + 거래금액(평문) + 해쉬키 |

## 36.5 응답 전문 (헥토파이낸셜 → 가맹점)

삼성페이 결제 후 가맹점측으로 응답하는 컬럼을 다음과 같이 정의 합니다.

     
| 파라미터 | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- |
| mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디  <br>nxca\_jt\_il:인증 | AN(10) | ●   | "nxca\_jt\_il" |
| outStatCd | 거래상태 | 거래상태코드(성공/실패)  <br>0021:성공  <br>0031:실패 | AN(4) | ●   | "0021" |
| outRsltCd | 거절코드 | 거래상태가 "0031"일 경우, 상세 코드 전달  <br>\[[거절 코드 표](#item-544)\] 참고 | AN(4) | ●   | "0000" |
| outRsltMsg | 결과메세지 | 결과 메세지 전달  <br>URL Encoding, UTF-8 | AHN(200) | ●   | "결제 요청 정보 누락 (상품명)" |
| method | 결제수단 | PG 서비스에 해당하는 결제 구분 코드 | AN(20) | ●   | "card"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유 주문번호  <br>※ 한글 제외 | AN(100) | ●   | "ORDER20211231100000" |
| mchtCustId | 상점고객아이디 | 보내주는 고유 고객아이디 혹은 유니크 키  <br>※ AES 암호화 | AN(50) | ○   | "HongGilDong" |
| trdNo | 거래번호 | 헥토파이낸셜 거래번호 | AN(40) | ●   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| trdAmt | 거래금액 | 거래금액  <br>※ AES 암호화 | N(12) | ●   | "1000" |
| mchtParam | 상점예약필드 | 요청으로 받은 필드값을 응답으로 Bypass | AHN(4000) | ○   | "name=HongGilDong&age=25" |
| authDt | 승인일시 | 결제 승인 일시 | N(14) | ○   | "20211231100000" |
| authNo | 승인번호 | 신용카드 승인 번호 | N(15) | ○   | "30001234" |
| intMon | 할부개월 수 | 신용카드 할부 개월 수 | N(2) | ○   | "00" |
| fnNm | 카드사명 | 신용카드 카드사명 | AH(20) | ○   | "우리카드" |
| fnCd | 카드사코드 | 신용카드 카드사 코드 | AN(4) | ○   | "LTC" |

## 36.6 노티 전문 (헥토파이낸셜 → 가맹점)

거래가 정상적으로 완료되면, 헥토파이낸셜에서 가맹점으로 노티(결과통보) 메세지가 전송됩니다.

     
| 파라미터 | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- |
| outStatCd | 거래상태 | 성공\[0021\] | N(4) | ●   | "0021" |
| trdNo | 거래번호 | 헥토파이낸셜에서 부여하는 고유 거래번호 | AN(40) | ●   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| method | 결제수단 | 신용카드\[CA\] | A(2) | ●   | "CA" |
| bizType | 업무구분 | 승인\[B0\], 취소\[C0\] | AN(2) | ●   | "B0" |
| mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 상점아이디 | AN(12) | ●   | "nxca\_jt\_il" |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유 주문 번호 | AN(100) | ●   | "ORDER20211231100000" |
| mchtCustNm | 고객명 | 실제 결제자의 주문자명 | AHN(30) | ○   | "홍길동" |
| mchtName | 상점한글명 | 실 판매자명, 거래 요청시 실 판매자명이 없는 경우 헥토파이낸셜와 계약된 상점명 | AHN(20) | ○   | "헥토파이낸셜" |
| pmtprdNm | 상품명 | 고객이 주문한 결제 상품명 | AHN(128) | ○   | "테스트상품" |
| trdDtm | 거래일시 | 승인일시, 취소/부분취소거래 : 취소일시가 전달됩니다.  <br>형식:YYYYMMDDhhmmss | N(14) | ●   | "20211231100000" |
| trdAmt | 거래금액 | 거래금액 | N(12) | ○   | "1000" |
| svcAmt | 봉사료 | 신용카드 봉사료  <br>※ 오프라인거래이면서 봉사료 포함거래일 경우 전달. | N(12) | ○   | "0" |
| cardCd | 카드사코드 | 카드사 코드  <br>\[[신용카드 식별자 참고](#item-545)\] | AN(10) | ○   | "NHC" |
| cardNm | 카드명 | 카드사 명  <br>\[[신용카드 식별자 참고](#item-545)\] | AHN(20) | ○   | "NH 체크" |
| email | 고객이메일 | 상점 고객 이메일 | AN(60) | ○   | "HongGilDong@example.com" |
| mchtCustId | 상점고객아이디 | 상점 고객 아이디 | AN(50) | ○   | "HongGilDong" |
| cardNo | 카드번호 | 마스킹된 카드번호 123456\*\*\*\*\*\*7890  <br>\*상점 설정 정보에 따른 옵션값 | AN(20) | ○   | "123456\*\*\*\*\*\*7890" |
| cardApprNo | 카드승인번호 | 카드 승인 번호 | AN(15) | ○   | "30001234" |
| instmtMon | 할부개월수 | 할부 개월 수 | N(2) | ○   | "00" |
| instmtType | 할부타입 | 할부 개월이 카드사 이벤트에 속하는 경우 Y  <br>\*상점 설정 정보에 따른 옵션값 | A(1) | ○   | "N" |
| orgTrdNo | 원거래번호 | 취소 시, 원거래 번호 | AN(40) | ○   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| orgTrdDt | 원거래일자 | 취소 시, 원거래 일자 | N(8) | ○   | "20211231" |
| mixTrdNo | 복합결제 거래번호 | 복합결제 거래번호 | AN(40) | ○   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| mixTrdAmt | 복합결제 금액 | \*mixTrdNo 가 존재하는 경우에만 전달 | N(12) | ○   | "1000" |
| payAmt | 실 결제금액 | 거래금액에서 복합결제 금액을 제외한 결제 금액  <br>payAmt = trdAmt - mixTrdAmt  <br>\*mixTrdNo 가 존재하는 경우에만 전달 | N(12) | ○   | "1000" |
| cnclType | 취소거래타입 | 00:전체 취소, 10:부분 취소 | N(2) | ○   | "00" |
| mchtParam | 상점예약필드 | 상점에서 이용하는 추가 정보 필드로 전달한 값이 그대로 반환됩니다. | AHN(4000) | ○   | "name=HongGilDong&age=25" |
| pktHash | 해쉬값 | SHA256 (거래상태코드+거래일자+거래시간+상점아이디+상점주문번호+거래금액+해쉬키) | AN(64) | ●   | "a2d6d597d55d7c9b689baa2e08c1ddf0ce71f4248c5b9b59fe61bfbf949543e1" |

가맹점에서 헥토파이낸셜로 응답을 전송합니다.

 
| 응답 (가맹점 → 헥토파이낸셜) |     |
| --- | --- |
| 성공시 | "OK" (대문자) |
| 실패시 | "FAIL" (대문자, FAIL로 응답시 명확한 실패로 인식합니다. 노티가 재전송 됩니다.) |
| 그 외 | 비정상 실패로 인식하여, 설정된 횟수만큼 노티 재발송 처리함. |

# 37\. 삼성페이 간편결제 취소API(Non-UI)

삼성페이 간편결제 취소 API 연동방법에 대해 기술합니다

## 37.1 요청 전문 (가맹점 → 헥토파이낸셜)

*   API URI
    *   테스트계 : https://tbgw.settlebank.co.kr/spay/APICancel.do
    *   운영계 : https://gw.settlebank.co.kr/spay/APICancel.do

  
가맹점 서버에서 헥토파이낸셜측으로 요청하는 컬럼을 다음과 같이 정의합니다.

      
| 파라미터 |     | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- | --- |
| params | mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(12) | ●   | "nxca\_jt\_il" |
| ver | 버전  | 전문의 버전 | AN(4) | ●   | "0A19"  <br>※ 고정값 |
| method | 결제수단 | 결제수단 | A(2) | ●   | "CA"  <br>※ 고정값 |
| bizType | 업무구분 | 업무 구분코드 | AN(2) | ●   | "C0"  <br>※ 고정값 |
| encCd | 암호화 구분 | 암호화 구분 코드 | N(2) | ●   | "23"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유한 주문번호 | AN(100) | ●   | "ORDER20211231100000" |
| trdDt | 취소요청일자 | 현재 전문을 전송하는 일자(YYYYMMDD) | N(8) | ●   | "20211231" |
| trdTm | 취소요청시간 | 현재 전문을 전송하는 시간(HHMMSS) | N(6) | ●   | "100000" |
| mobileYn | 모바일 여부 | Y:모바일웹/앱, N:PC 또는 그 외 | A(1) | ○   | "N" |
| osType | OS 구분 | A:Android, I:IOS, W:windows, M:Mac, E:기타, 공백:확인불가 | A(1) | ○   | "W" |
| data | pktHash | hash데이터 | SHA256 방식으로 생성한 해쉬값  <br>\[[요청 전문 해쉬 코드](#item-441)\] 참고 | AN(200) | ●   | "f395b6725a9a18f2563ce34f8bc76698051d27c05e5ba815f463f00429061c0c" |
| orgTrdNo | 원거래번호 | 결제 시, 헥토파이낸셜에서 발급한 거래번호 | AN(40) | ●   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| crcCd | 통화구분 | 통화 구분 값 | A(3) | ●   | "KRW"  <br>※ 고정값 |
| cnclOrd | 취소회차 | 001부터 시작. 부분취소 2회차의 경우 002 | N(3) | ●   | "001" |
| taxTypeCd | 면세여부 | Y:면세, N:과세, G:복합과세. 공백일 경우 상점 기본 정보에 따름. | A(1) | ○   | "N" |
| cnclAmt | 취소금액 | 취소금액  <br>※ AES 암호화 | N(12) | ●   | "1000" |
| taxAmt | 과세금액 | 취소금액 중 과세금액(복합과세인 경우 필수)  <br>※ AES 암호화 | N(12) | ○   | "909" |
| vatAmt | 부가세금액 | 취소금액 중 부가세금액(복합과세인 경우 필수)  <br>※ AES 암호화 | N(12) | ○   | "91" |
| taxFreeAmt | 비과세금액 | 취소금액 중 면세금액(복합과세인 경우 필수)  <br>※ AES 암호화 | N(12) | ○   | "0" |
| svcAmt | 봉사료 | 취소금액 중 봉사료  <br>※ AES 암호화 | N(12) | ○   | "0" |
| cnclRsn | 취소사유내용 | 필요한 경우, 취소 사유 메세지 기재 | AHN(255) | ○   | "상품이 마음에 들지 않아서" |

## 37.2 요청 전문 해쉬 코드

 
| 항목  | 조합 필드 |
| --- | --- |
| pktHash | 취소요청일자 + 취소요청시간 + 상점아이디 + 상점주문번호 + 취소금액(평문) + 해쉬키 |

## 37.3 응답 전문 (헥토파이낸셜 → 가맹점)

헥토파이낸셜에서 가맹점측으로 응답하는 컬럼을 다음과 같이 정의합니다.

      
| 파라미터 |     | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- | --- |
| params | mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(12) | ●   | "nxca\_jt\_il" |
| ver | 버전  | 전문의 버전 | AN(4) | ●   | "0A19"  <br>※ 고정값 |
| method | 결제수단 | 결제수단 | A(2) | ●   | "CA"  <br>※ 고정값 |
| bizType | 업무구분 | 업무 구분코드 | AN(2) | ●   | "C0"  <br>※ 고정값 |
| encCd | 암호화 구분 | 암호화 구분 코드 | N(2) | ●   | "23"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유한 주문번호 | AN(100) | ●   | "ORDER20211231100000" |
| trdNo | 헥토파이낸셜 거래번호 | 헥토파이낸셜에서 생성하는 고유한 거래번호 | AN(40) | ●   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| trdDt | 취소요청일자 | 현재 전문을 전송하는 일자(YYYYMMDD) | N(8) | ●   | "20211231" |
| trdTm | 취소요청시간 | 현재 전문을 전송하는 시간(HHMMSS) | N(6) | ●   | "100000" |
| outStatCd | 거래상태 | 거래상태코드(성공/실패)  <br>0021:성공  <br>0031:실패 | AN(4) | ●   | "0021" |
| outRsltCd | 거절코드 | 거래상태가 "0031"일 경우, 상세 코드 전달  <br>\[[거절 코드 표](#item-544)\] 참고 | AN(4) | ●   | "0000" |
| outRsltMsg | 결과메세지 | 결과 메세지 전달  <br>URL Encoding, UTF-8 | AHN(200) | ●   | "정상적으로 처리되었습니다." |
| data | pktHash | 해쉬값 | 요청시, hash 값 그대로 return | AN(64) | ●   |     |
| orgTrdNo | 원거래번호 | 결제 시, 헥토파이낸셜에서 발급한 거래번호 | AN(40) | ●   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |
| cnclAmt | 취소금액 | 취소금액  <br>※ AES 암호화 | N(12) | ●   | "6000" |
| cardCnclAmt | 신용카드 취소금액 | 전체금액 중 신용카드 취소금액  <br>※ AES 암호화 | N(12) | ●   | "5000" |
| pntCnclAmt | 포인트 취소금액 | 전체금액 중 포인트 취소금액  <br>※ AES 암호화 | N(12) | ●   | "1000" |
| blcAmt | 취소가능잔액 | 취소성공시 거래번호 기준 남은 취소 가능잔액 리턴  <br>※ AES 암호화 | N(12) | ●   | "0" |

## 37.4 노티 전문 (헥토파이낸셜 → 가맹점)

※ \[[6.5 노티 전문](#item-773)\] 참고

# 38\. 실시간 거래 조회 API (Non-UI)

## 38.1 연동 방법

*   요청 전문을 확인하셔서 파라미터를 세팅합니다.
*   Server to Server로 HTTP Connection 하여 JSON데이터 ([34.4 JSON 요청 데이터 예시](#item-947))로 POST 요청합니다.

#### 결제수단 별 단건 거래상태 조회

*   원 거래 일자는 조회하고자 하는 원 거래 번호의 요청 당시 일자를 입력 (해당 거래일 기준 전일 ~ 익일 사이 거래 건 조회)
*   원 거래 번호가 확인이 되는 경우 원 거래 번호를 추가 전달

## 38.2 API URI

 
| 구분  | URL |
| --- | --- |
| 테스트베드 | https://tbgw.settlebank.co.kr/spay/APITrdcheck.do |
| 상용 환경 | https://gw.settlebank.co.kr/spay/APITrdcheck.do |

## 38.3 요청 및 응답 헤더

 
| 구분  | 내용  |
| --- | --- |
| 요청  | Content-type=application/json; charset=UTF-8 |
| 응답  | Content-type=application/json; charset=UTF-8 |

## 38.4 JSON 요청 데이터 예시

```
{
"params" : {
"mchtId" : "nx_mid_il",
"ver" : "0A1M",
"mchtTrdNo" : "PG_vbank_20210806075154649",
"trdDt" : "20210806",
"trdTm" : "080101"
},
"data" : {
"pktHash" : "996E651D9435700D54E0D69B5726B5489AD0691C3FC86BE572314D39A2AE8B6D",
"method" : "VA",
"trdAmt" : "500",
"orgTrdDt" : "20210806",
"orgMchtTrdNo" : "PG_vbank_20210806075154648",
"orgTrdNo" : "STFP_PGVAnx_mid_il00210806075210M1853381"
}
}
```

## 38.5 요청 전문 (가맹점 → 헥토파이낸셜)

가맹점 서버에서 헥토파이낸셜측으로 요청하는 컬럼을 다음과 같이 정의합니다.

      
| 파라미터 |     | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- | --- |
| params | mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(12) | ●   | "nx\_mid\_il" |
| ver | 버전  | 전문의 버전 | AN(4) | ●   | "0A1M"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 상점에서 생성하는 고유한 거래번호 | AN(100) | ●   | "ORDER20211231100000" |
| trdDt | 요청일자 | 현재 전문을 전송하는 일자(YYYYMMDD) | N(8) | ●   | "20211231" |
| trdTm | 요청시간 | 현재 전문을 전송하는 시간(HHMMSS) | N(6) | ●   | "100000" |
| data | pktHash | hash데이터 | SHA256 방식으로 생성한 해쉬값  <br>\[[요청 전문 해쉬 코드](#item-948)\] 참고 | AN(200) | ●   | "f395b6725a9a18f2563ce34f8bc76698051d27c05e5ba815f463f00429061c0c" |
| method | 결제수단 | 결제수단 2자리  <br>\[[결제수단 코드](#item-951)\] 참고 | A(2) | ●   | "VA" |
| trdAmt | 거래금액 | 거래금액  <br>1,000원 -> 1000 | N(12) | ●   | "1000" |
| orgTrdDt | 원 거래 일자 | 원거래 결제 요청시 요청일자  <br>(YYYYMMDD) | N(8) | ●   | "20211231" |
| orgMchtTrdNo | 원거래 상점주문번호 | 원 거래의 상점주문번호 | AN(100) | ●   | "ORDER20211231100000" |
| orgTrdNo | 원 거래 번호 | 결제 시, 헥토파이낸셜에서 발급한 거래번호 | AN(40) | ○   | "STFP\_PGCAnxca\_jt\_il0211129135810M1494620" |

## 38.6 요청 전문 해쉬 코드

 
| 항목  | 조합 필드 |
| --- | --- |
| pktHash | 거래일자 + 거래시간 + 상점아이디 + 상점주문번호 + 거래금액(평문) + 해쉬키 |

## 38.7 응답 전문 (헥토파이낸셜 → 가맹점)

가맹점 서버에서 헥토파이낸셜측으로 요청하는 컬럼을 다음과 같이 정의합니다.

      
| 파라미터 |     | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- | --- |
| params | mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(12) | ●   | "nx\_mid\_il" |
| ver | 버전  | 전문의 버전 | AN(4) | ●   | "0A1M"  <br>※ 고정값 |
| mchtTrdNo | 상점주문번호 | 요청시의 주문번호 bypass | AN(100) | ●   | "ORDER20211231100000" |
| trdNo | 거래번호 | 헥토파이낸셜 거래번호 | AN(40) | ●   | "STFP\_PGHMnx\_mid\_il00220623130711M1872705" |
| trdDt | 요청일자 | 현재 전문을 전송하는 일자(YYYYMMDD) | N(8) | ●   | "20211231" |
| trdTm | 요청시간 | 현재 전문을 전송하는 시간(HHMMSS) | N(6) | ●   | "100000" |
| outStatCd | 거래상태코드 | 0021:성공, 0031:실패  <br>(성공건 확인: 거래상태=0021 + 결과코드=0000) | N(4) | ●   | "0000" |
| outRsltCd | 결과코드 | 결과 코드  <br>0000 : 정상거래(가상계좌는 입금성공을 의미)  <br>0001 : 취소상태(가상계좌는 환불상태를 의미)  <br>0009 : 결제실패(결제실패내역 존재)  <br>그 외 \[[거절 코드 표\]](#item-544) 참고 | AN(4) | ●   | "0000" |
| outRsltMsg | 결과메세지 | 결과메세지 | AHN(200) | ●   | "정상거래" |
| data | pktHash | 해쉬값 | 요청시, hash 값 그대로 return | AN(64) | ●   |     |
| method | 결제수단 | 결제수단 2자리  <br>\[[결제수단 코드\]](#item-951) 참고 | A(2) | ●   | "VA" |
| trdAmt | 거래금액 | 거래금액 | N(12) | ●   | "1000" |
| cnclAmt | 취소금액 | 취소금액  <br>※ 취소 건 미존재 시 0원 | N(12) | ○   | "1000" |

## 38.8 결제수단 코드

결제수단 코드는 다음과 같습니다.

   
| 코드  | 결제수단 |
| --- | --- |
| BG  | 도서상품권 |
| CG  | 컬쳐랜드상품권(컬쳐캐쉬) |
| HM  | 해피머니 |
| TC  | 틴캐시 |
| CP  | 포인트다모아 |
| WL  | 화이트라벨 |
| CA  | 신용카드 |
| MP  | 휴대폰결제 |
| RA  | 계좌이체 |
| VA  | 가상계좌 |
| TM  | 티머니 |
| SG  | 스마트문상 |
| KP  | 카카오페이 |
| NP  | 네이버페이 |
| PC  | 페이코 |

# 39\. 거래대사 API (Non-UI)

거래대사 API 연동 방법에 대해 기술합니다.

## 39.1 API 요약 설명

가맹점 서버에서 헥토파이낸셜 서버로 거래대사 조회를 위한 API 를 호출하며, 아래 호출의 결과로 헥토파이낸셜측 거래대사 결과가 응답됩니다.

## 39.2 API URI

| 서버 구분 | URI | HTTP Method |
| --- | --- | --- |
| 테스트베드 | https://tb-nspay.settlebank.co.kr/api/pg/{상점아이디}/transInfo.do | GET/POST |
| 운영환경 | https://nspay.settlebank.co.kr/api/pg/{상점아이디}/transInfo.do | GET/POST |

## 39.3 요청 및 응답 헤더

API 요청 및 응답 헤더 포맷은 다음과 같습니다.

|     |     |
| --- | --- |
| 요청  | Content-type=application/x-www-form-urlencoded;charset=UTF-8 |
| 응답  | Content-type=text/plain;charset=UTF-8 |

## 39.4 요청 전문 (가맹점 → 헥토파이낸셜)

가맹점 서버에서 헥토파이낸셜측으로 요청하는 컬럼을 다음과 같이 정의합니다.

     
| 파라미터 | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- |
| mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(10) | ●   | "nxca\_jt\_il" |
| mchtTy | 상점아이디구분 | 상점아이디구분 값 | AN(1) | ●   | "M"  <br>※고정값 |
| method | 결제수단 | 결제수단 2자리  <br>\[[결제수단 코드](#item-951)\] 참고 | AN(2) | ●   | "CA" |
| pdTy | 조회기간구분 | 조회기간 구분 코드 | AN(1) | ●   | "D"  <br>※고정값 |
| trdDtSt | 거래일자 | 거래일자  <br>yyyyMMdd | N(8) | ●   | "20211231" |
| pktHash | hash 데이터 | SHA256 방식으로 생성한 해쉬값  <br>\[[요청 전문 해쉬 코드](#item-850)\] 참고 | AN(200) | ●   | "346a2496f3e8b2cbb2ebd157eee0f7404c4e97c34d3cefe8a9b0113cc93f8cc1" |

## 39.5 요청 전문 해쉬 코드

 
| 항목  | 조합 필드 |
| --- | --- |
| pktHash | 상점아이디 + 거래일자 + 인증키 |

## 39.6 응답 전문 (헥토파이낸셜 → 가맹점)

헥토파이낸셜 서버에서 가맹점측으로 응답하는 컬럼을 다음과 같이 정의 합니다.  
 

| 순번  | Parameter 명 | 설명  | 타입(길이) | 비고  |
| --- | --- | --- | --- | --- |
| 조회결과 - 조회 시 첫 행 출력 |     |     |     |     |
| 1   | 결과코드 | API 응답 결과 코드 | AN(4) |     |
| 2   | 결과 메시지 | API 응답 결과 메시지 | AN(4) |     |
| 3   | 조회내역 건수 | 조회 성공 거래 내역 건수 | N   |     |
| 거래내역 – 조회 성공(result:0000) 시 두 번째 행부터 거래건 별 출력 (반복부) |     |     |     |     |
| 1   | 상점아이디 | 상점아이디 | AN(10) |     |
| 2   | 결제수단 | 결제수단 코드 | N(2) |     |
| 3   | 헥토파이낸셜 거래번호 | 헥토파이낸셜에서 생성한 거래번호 | AN(40) |     |
| 4   | 주문번호 | 상점주문번호 | AN(100) |     |
| 5   | 승인구분 | 승인/취소 구분 | N(1) | "0" : 승인,  <br>"1" : 취소 |
| 6   | 거래일자 | 거래일자(취소일자)  <br>yyyyMMdd | N(8) |     |
| 7   | 거래시간 | 거래시간(취소시간)  <br>hhmmss | N(6) |     |
| 8   | 거래금액 | 거래금액 | N(13) |     |
| 9   | 원거래번호 | 취소거래에 대한 원 거래번호 | AN(40) |     |
| 10  | 원거래일자 | 취소거래에 대한 원 거래일자 | N(8) |     |
| 11  | 주문자명 | 상점 주문자명 | AN(88) |     |
| 12  | 상품명 | 상점 상품명 | AN(200) |     |
| 13  | 승인번호 | 신용카드 승인번호 |     |     |
| 14  | 금융사 | 금융사 | AHN(20) |     |
| 15  | 할부개월 | 신용카드 거래 할부 개월 | N(2) |     |
| 16  | 무이자할부여부 | 가맹점부담 무이자 할부 거래 여부(신용카드) | AN(1) |     |

## 39.7 거래대사 응답 값 예시

  
예시 1. 거래대사 API 조회 시 정상처리 응답 값 예시 입니다.

```
0000|정상 처리 되었습니다.|3|
mid_test|VA|STBK_PGVAmid_test000000000000000M0000001|TEST000000000000000001|0|20211231|100001|1000|||홍길동|테스트상품||케이뱅크|||
mid_test|VA|STBK_PGVAmid_test000000000000000M0000002|TEST000000000000000002|0|20211231|100002|2000|||홍길동|테스트상품||케이뱅크|||
mid_test|VA|STBK_PGVAmid_test000000000000000M0000003|TEST000000000000000003|0|20211231|100003|3000|||홍길동|테스트상품||케이뱅크|||
```

예시 2. 거래대사 API 조회 시 실패 응답 값 예시 입니다.

```
ST92|해쉬 값 불일치.|0|
```

## 39.8 코드 표

*   대사 API 코드

   
| 코드  | 결제수단 |
| --- | --- |
| 0000 | 정상 처리 되었습니다. |
| 1001 | 조회내역 없음 |
| ST09 | 유효하지 않은 요청전문 |
| ST10 | 내부 시스템 에러 |
| ST90 | 등록되지 않은 상점 아이디 |
| ST91 | 필수 파라미터 오류 |
| ST92 | 해쉬 값 불일치 |

*   결제수단 코드 - \[[결제수단 코드](#item-951)\] 참고
*   금융기관 코드 - \[[금융기관 식별자](#item-546)\] 참고
*   카드사 코드(매입사 코드)

   
| 코드  | 카드사명 |
| --- | --- |
| 01  | BC  |
| 02  | 국민  |
| 03  | 하나  |
| 04  | 삼성  |
| 05  | 신한  |
| 08  | 현대  |
| 09  | 롯데  |
| 11  | 우리  |
| 15  | NH  |

*   통신사 코드

   
| 코드  | 통신사명 |
| --- | --- |
| SKT | SK Telecom |
| KTF | KT  |
| LGT | LG U+ |
| SKL | SK 7 Mobile |
| CJH | CJ 헬로모바일 |
| KCT | 한국케이블텔레콤 |

# 40\. 정산대사 API (Non-UI)

정산대사 API 연동 방법에 대해 기술합니다.

## 40.1 API 요약 설명

가맹점 서버에서 헥토파이낸셜 서버로 정산대사 조회를 위한 API 를 호출하며, 아래 호출의 결과로 헥토파이낸셜측 정산대사 결과가 응답됩니다.

## 40.2 API URI

| 서버 구분 | URI | HTTP Method |
| --- | --- | --- |
| 테스트베드 | https://tb-nspay.settlebank.co.kr/api/pg/{상점아이디}/sttlmntInfo.do | GET/POST |
| 운영환경 | https://nspay.settlebank.co.kr/api/pg/{상점아이디}/sttlmntInfo.do | GET/POST |

## 40.3 요청 및 응답 헤더

API 요청 및 응답 헤더 포맷은 다음과 같습니다.

|     |     |
| --- | --- |
| 요청  | Content-type=application/x-www-form-urlencoded;charset=UTF-8 |
| 응답  | Content-type=text/plain;charset=UTF-8 |

## 40.4 요청 전문 (가맹점 → 헥토파이낸셜)

가맹점 서버에서 헥토파이낸셜측으로 요청하는 컬럼을 다음과 같이 정의합니다.

     
| 파라미터 | 이름  | 설명  | 타입(길이) | 필수  | 비고  |
| --- | --- | --- | --- | --- | --- |
| mchtId | 상점아이디 | 헥토파이낸셜에서 부여하는 고유 상점아이디 | AN(10) | ●   | "nxca\_jt\_il" |
| method | 결제수단 | 결제수단 2자리  <br>\[[결제수단 코드](#item-951)\] 참고 | AN(2) | ●   | "CA" |
| crtrDt | 조회일자 | 정산예정일자  <br>yyyyMMdd | N(8) | ●   | "20211231" |
| pktHash | hash 데이터 | SHA256 방식으로 생성한 해쉬값  <br>\[[요청 전문 해쉬 코드](#item-857)\] 참고 | AN(32) | ●   | "346a2496f3e8b2cbb2ebd157eee0f7404c4e97c34d3cefe8a9b0113cc93f8cc1" |

## 40.5 요청 전문 해쉬 코드

 
| 항목  | 조합 필드 |
| --- | --- |
| pktHash | 상점아이디 + 조회일자 + 인증키 |

## 40.6 응답 전문 (헥토파이낸셜 → 가맹점)

응답 전문은 가맹점에서 요청한 거래일자에 발생한 대사 값을 헥토파이낸셜에서 가맹점으로 응답하는 전문입니다. 헥토파이낸셜 서버에서 가맹점측으로 응답하는 컬럼을 다음과 같이 정의 합니다.  
 

| 순번  | Parameter 명 | 설명  | 타입(길이) | 비고  |
| --- | --- | --- | --- | --- |
| 조회결과 - 조회 시 첫 행 출력 |     |     |     |     |
| 1   | 결과코드 | API 응답 결과 코드 | AN(4) |     |
| 2   | 결과 메시지 | API 응답 결과 메시지 | AN(4) |     |
| 3   | 조회내역 건수 | 조회 성공 거래 내역 건수 | N   |     |
| 거래내역 – 조회 성공(result:0000) 시 두 번째 행부터 거래건 별 출력 (반복부) |     |     |     |     |
| 1   | 상점아이디 | 상점아이디 | AN(10) |     |
| 2   | 헥토파이낸셜 거래번호 | 헥토파이낸셜에서 생성한 거래번호 | AN(40) |     |
| 3   | 원거래번호 | 취소거래에 대한 원 거래번호 | AN(40) |     |
| 4   | 결제수단 | 결제수단 코드 | N(2) |     |
| 5   | 승인/취소일자 | 거래일자(취소일자)  <br>yyyyMMdd | N(8) |     |
| 6   | 승인/취소 여부 | 승인/취소 구분 | N(1) | "0" : 승인,  <br>"1" : 취소 |
| 7   | 금융사/통신사코드 | 금융사 | AHN(20) |     |
| 8   | 승인번호 | 신용카드 승인번호 |     |     |
| 9   | 할부개월수 | 신용카드 거래 할부 개월 | N(2) |     |
| 10  | 주문번호 | 상점주문번호 | AN(100) |     |
| 11  | 주문자명 | 상점 주문자명 | AN(88) |     |
| 12  | 상품명 | 상점 상품명 | AN(200) |     |
| 13  | 결제금액 | 결제금액 | N(13) |     |
| 14  | 수수료 | 공금가액 | N(13) |     |
| 15  | 부가세 | 부가세 | N(13) |     |
| 16  | 정산예정금액 | 정산예정금액 | N(13) |     |
| 17  | 정산예정일자 | 정산예정일자  <br>yyyyMMdd | N(8) |     |

## 40.7 정산대사 응답 값 예시

  
예시 1. 정산대사 API 조회 시 정상처리 응답 값 예시 입니다.

```
0000|정상 처리 되었습니다.|3|
mid_test|SOFP_00000001|SOFP_00000004|VA|20211231|0|089|||TEST0000001||테스트상품|1000|20|2|978|20210514|
mid_test|SOFP_00000002|SOFP_00000005|VA|20211231|0|089|||TEST0000002||테스트상품|1000|20|2|978|20210514|
mid_test|SOFP_00000003|SOFP_00000006|VA|20211231|0|089|||TEST0000003||테스트상품|1000|20|2|978|20210514|
```

  
예시 2. 정산대사 API 조회 시 실패 응답 값 예시 입니다.

```
ST92|해쉬 값 불일치.|0|
```

# 41\. 기타

## 41.1 거절코드 표

*   PG 공통 응답 코드

   
| 코드  | 내용  | 코드  | 내용  |
| --- | --- | --- | --- |
| 0000 | 정상처리 | 0009 | 사용자취소 |
| 1001 | 결제 요청 정보 누락(상점아이디) | 1002 | 결제 요청 정보 누락(결제수단) |
| 1003 | 결제 요청 정보 누락(거래일자) | 1004 | 결제 요청 정보 누락(거래시간) |
| 1005 | 결제 요청 정보 누락(상점주문번호) | 1006 | 결제 요청 정보 누락(상점한글명) |
| 1007 | 결제 요청 정보 누락(상점영문명) | 1008 | 결제 요청 정보 누락(상품명) |
| 1009 | 결제 요청 정보 누락(거래금액) | 1010 | 결제 요청 정보 누락(결과처리URL) |
| 1011 | 결제 요청 정보 누락(결과화면URL) | 1012 | 결제 요청 정보 누락(결제취소URL) |
| 1013 | 결제 요청 정보 누락(상점고객아이디) | 1101 | 결제 요청 정보 길이 오류(상점아이디) |
| 1102 | 결제 요청 정보 길이 오류(결제수단) | 1103 | 결제 요청 정보 길이 오류(요청일자) |
| 1104 | 결제 요청 정보 길이 오류(요청시간) | 1105 | 결제 요청 정보 길이 오류(상점주문번호) |
| 1106 | 결제 요청 정보 길이 오류(상점한글명) | 1107 | 결제 요청 정보 길이 오류(상점영문명) |
| 1108 | 결제 요청 정보 길이 오류(상품명) | 1109 | 결제 요청 정보 길이 오류(거래금액) |
| 1110 | 결제 요청 정보 길이 오류(고객명) | 1111 | 결제 요청 정보 길이 오류(결과처리URL) |
| 1112 | 결제 요청 정보 길이 오류(결과화면URL) | 1113 | 결제 요청 정보 길이 오류(결제취소URL) |
| 1114 | 결제 요청 정보 길이 오류(상점예약필드) | 1115 | 결제 요청 정보 길이 오류(이메일) |
| 1116 | 결제 요청 정보 길이 오류(상품제공기간) | 1117 | 결제 요청 정보 길이 오류(상점고객아이디) |
| 1118 | 결제 요청 정보 길이 오류(면세여부) | 1119 | 결제 요청 정보 길이 오류(과세금액) |
| 1120 | 결제 요청 정보 길이 오류(부가세금액) | 1121 | 결제 요청 정보 길이 오류(비과세금액) |
| 1122 | 결제 요청 정보 길이 오류(봉사료) | 1123 | 결제 요청 정보 길이 오류(카드결제타입) |
| 1124 | 결제 요청 정보 길이 오류(특정카드사코드) | 1125 | 결제 요청 정보 길이 오류(앱스키마) |
| 1126 | 결제 요청 정보 길이 오류(고객IP주소) | 1127 | 결제 요청 정보 길이 오류(hash 데이터) |
| 1901 | 해쉬값 불일치 오류 | 1902 | 암호화 항목 미처리 오류 |
| 2001 | 보안숫자가 일치하지 않음 | 2002 | 보안숫자 인증 횟수 초과 |
| 2003 | 인증 시간 초과 | 5001 | 잘못된 경로로 접근(null error) |
| 5002 | 거래 시간 초과(expired error) | 5003 | 잘못된 경로로 접근(encoding error) |
| 5004 | 잘못된 경로로 접근(parse error) | 5005 | 잘못된 경로로 접근(mapping error) |
| 5006 | 잘못된 경로로 접근(io error) | 6001 | 유효하지 않은 요청 전문 |
| 9001 | 레거시코드 조회 오류 | 9002 | 결제창옵션 조회 오류 |
| 9003 | 결제창배너 조회 오류 | 9004 | 약관리스트 조회 오류 |
| 9005 | 공지사항 조회 오류 | 9006 | 제휴할인 조회 오류 |
| 9007 | 결제정보 조회 오류 | 9901 | 게이트웨이 요청 전문 오류 |
| 9902 | 게이트웨이 응답 전문 오류 | 9903 | 게이트웨이 요청 오류 |
| 9904 | 게이트웨이 응답 오류 | 9905 | 게이트웨이 시스템 오류 |
| 9999 | 내부 시스템 오류 | 3007 | 취소 한도 초과 |
| ST01 | 고객정보 없음 | STR1~STR8 | 내부 정책 |
| ST06 | 거래정보 없음 | ST03 | 기 결제건 |
| ST08 | 이미 등록된 계좌입니다 | ST07 | 유효하지 않은 전문 |
| ST09 | 유효하지 않은 요청전문 | ST10 | 내부 시스템 오류 |
| ST11 | 원천사 점검 시간 | ST13 | 인증내역 없음 |
| ST19 | 기타 거래 불가 | ST24 | 예금주 불일치 |
| ST25 | 중복 취소 요청 | ST26 | 취소 정보 오류 |
| ST30 | 인증 시간 만료 | ST32 | 예금주 성명 오류 |
| ST38 | 처리 진행 중 | ST39 | 환불 중복 요청 |
| ST41 | 트래픽 과다 | ST44 | 원천사 정보 오류 |
| ST45 | 취소 실패 | ST46 | 취소기간 경과 |
| ST47 | 미등록 상점 | ST48 | 미등록 가맹점 |
| ST50 | 중복요청 | ST54 | 부분취소 불가 |
| ST55 | 복합과세 금액 불일치 | ST56 | 취소회차 오류 |
| ST57 | 취소금액(환불금액)이 원거래금액을 초과합니다. | ST58 | 취소요청금액이 원거래금액과 일치하지 않습니다. |
| ST60 | 비정상 처리 | ST68 | 서비스 중지 |
| ST69 | 서비스 불가 | ST70 | 정책 차단 |
| ST79 | 시스템 오류 | ST90~ST97 | 결제 수단별 개별 정의 |
| ST99 | 기타 오류 | VTIM | 원천사 타임아웃 |

*   신용카드 응답 코드

   
| 코드  | 내용  | 코드  | 내용  |
| --- | --- | --- | --- |
| CA01 | 원천사 점검 | CA02 | 원천사 장애 |
| CA03 | 전문 유효성 체크 | CA04 | 결제 중계사 장애 |
| CA10 | 거래정보 없음 | CA11 | 기매입 거래 |
| CA12 | 기취소 거래 | CA13~CA19 | 요청정보 오류 |
| CA20 | 카드 유효기간이 유효하지 않습니다. | CA21~CA23 | 할부 관련 오류 |
| CA26 | 사용횟수 초과 | CA27~CA29 | 비밀번호 관련 오류 |
| CA30 | 식별번호 오류 | CA31~CA37 | 한도 관련 오류 |
| CA38 | 포인트한도 미달로 거래 불가 | CA40~CA41 | 거래금액 오류 |
| CA42 | 1000원 미만 99,999,999원 이상 금액 거래 불가 | CA50~CA57 | 카드상태 오류 |
| CA58 | 미등록 카드입니다. 카드사로 문의해 주세요. | CA60~CA64 | 가맹점상태 오류 |
| CA59 | 법인카드는 거래가 불가능합니다. | J999 | 카드사 전화 요망 |
| CA65 | 인증거래미약정가맹점 | CA70 | 식별번호(생년월일/사업자번호)+비밀번호가 유효하지 않음 |
| CA75 | 공동인증서 인증정보가 유효하지 않습니다. | CA80 | 서비스 불가 거래 |
| CA81 | 거래 처리 중 오류 발생 | 0905 | 본인확인요망 |
| CA82 | 카드사 전화 요망 | CA83 | 해당 거래는 취소가 불가합니다. |
| CA84 | 기타 오류가 발생하였습니다. | CA85 | 취소거래 처리 시 오류가 발생하였습니다. |
| CA86 | 이중 거래 입니다. | CA87 | 가맹점 번호가 유효하지 않습니다. |
| CA88 | 해당 선불카드(기프트카드)는 부분취소가 불가합니다. | 8373 | 카드사 전화 요망 |
| 8375 | 기타 에러 처리 |     |     |

*   티머니 응답 코드

   
| 코드  | 내용  | 코드  | 내용  |
| --- | --- | --- | --- |
| TM01 | 기 취소 거래 | TM02 | 결제정보 없음 |
| TM03 | 중복 취소 | TM04 | 취소금액 초과 |
| TM05 | 요청자료 오류 | TM11 | 취소오류 |
| TM14 | 미등록 가맹점/서비스 | TM22~TM23 | CASHBEE 거래 |
| TM30 | 환불 기간 초과 | TM40 | 취소 실패 |
| TM99 | 알수 없는 오류 |     |     |

*   휴대폰 응답 코드

   
| 코드  | 내용  | 코드  | 내용  |
| --- | --- | --- | --- |
| MP01 | 요청자료 오류 | MP02 | 요청정보 불일치 |
| MP03 | 결제정보 없음 | MP04 | 미등록 가맹점/서비스 |
| MP05~MP13 | 고객 관련결제 불가 | MP14~MP17 | 이통사소액결제 이용 불가 |
| MP18~MP19 | 이통사소액결제 이용 동의 | MP20~MP21 | 이통사소액결제 차단 요청 |
| MP22 | 이통사 자동결제 차단 | MP23~MP26 | 한도 초과 |
| MP27~MP33 | 원천사 RM(imPAY) | MP34~MP36 | 원천사 중복 처리 |
| MP37~MP40 | 원천사 부가서비스 | MP41~MP44 | 소액결제 비밀번호 |
| MP45 | 월자동결제 전월 정보 없음 |     |     |
| MP50~MP51 | 유효시간 초과 | MP60~MP77 | 인증 관련 오류 |
| MP78 | 간편결제 서비스 | MP80 | 취소 실패 |
| MP81 | 취소 기간 경과 | MP82 | 기 취소 거래 |
| MP94 | 서비스 불가 | MP95~MP96 | 원천사 트래픽 과다 |
| MP97 | 내부 오류 | MP98 | 기타 오류 |
| MP99 | 결제창 인증 취소 처리 |     |     |

*   계좌이체 응답 코드

   
| 코드  | 내용  | 코드  | 내용  |
| --- | --- | --- | --- |
| RA01 | 이체횟수 초과 | RA02~RA04 | 한도 관련 오류 |
| RA05 | 잔액부족 | RA10~RA13 | 고객정보 불일치 |
| RA14 | 금액초과 | RA15 | 금액 불일치 |
| RA16 | 중복 결제 | RA17 | 은행정보 없음 |
| RA20 | 은행정보 없음 | RA21 | 계좌번호 상태 에러 |
| RA30~RA31 | 업무시간 마감 | RA32 | 서비스 불가 상점 |
| RA33 | 기취소 거래 | RA34 | 원거래 조회 실패 |
| RA35 | 거래정보 없음 | RA40 | 수표 처리 |
| RA41 | 증서 처리 | RA80~RA81 | 원천사 네트워크 오류 |
| RA82 | 헥토파이낸셜 오류 | RA83 | 원천사 네트워크 오류 |
| RA84 | 헥토파이낸셜 오류 | RA85 | 인증 처리 |
| RA86~RA87 | 은행 오류 | RA88 | 은행 업무종료 |

*   포인트 다모아 응답 코드

   
| 코드  | 내용  | 코드  | 내용  |
| --- | --- | --- | --- |
| CP01 | 한도 초과 | CP02 | 사용가능금액 초과 |
| CP03 | 요청금액 초과 | CP04 | 금액 불일치 |
| CP10~CP11 | 고객정보조회 실패 | CP12 | 인증 관련 |
| CP13 | 고객정보 미존재 | CP14 | 약관내역 미존재 |
| CP15~CP16 | 회원정보 관련 | CP17 | 중복결제 오류 |
| CP30 | 기취소 거래 | CP31 | 거래시간 만료 |
| CP32~CP33 | 원거래 조회 실패 | CP34 | 중복결제 오류 |
| CP70 | 가맹점상태 오류 | CP71 | 광고 관련 오류 |
| CP80~CP87 | 원천사 관련 오류 | CP88 | 파일 관련 오류 |
| CP89 | 포인트 조회 관련 오류 | CP90 | 입력정보 오류 |

*   상품권 응답 코드

   
| 코드  | 내용  | 코드  | 내용  |
| --- | --- | --- | --- |
| GC01 | 요청자료 오류 | GC02 | 요청정보 불일치 |
| GC03 | 결제정보 없음 | GC04 | 미등록 가맹점/서비스 |
| GC05 | 결제정보 없음 | GC06 | 중복결제 오류 |
| GC07 | 한도초과 | GC08 | 처리완료 |
| GC09 | 인증정보 오류 | GC10 | 회원정보 관련 |
| GC11 | 한도초과 | GC12~GC13 | 가맹점상태 오류 |
| GC20~GC24 | 원천사 관련 오류 | GC40 | 취소 실패 |
| GC41 | 취소 기처리 | GC42 | 취소 불가 |
| GC94 | 서비스 불가 | GC95~GC96 | 원천사 시스템 오류 |
| GC97 | 내부 오류 | GC98 | 기타 오류 |
| ST90 | 상품권류 개별 Alert창 출력 |     |     |

 

*   간편결제 응답 코드

   
| 코드  | 내용  | 코드  | 내용  |
| --- | --- | --- | --- |
| PZ01, PZ05 | 원천사 점검 | PZ02 | 원천사 장애 |
| PZ03 | 결제 중계 오류 | PZ04 | 허용되지 않은 접근 |
| PZ06 | 유효하지 않은 계좌 | PZ07 | 유효하지 않은 카드번호 |
| PZ08 | 카드 유효기간이 유효하지 않음 | PZ09 | 요청정보 오류 |
| PZ10 | 원거래 정보 미존재 | PZ14~PZ19 | 비밀번호 관련 오류 |
| PZ26~PZ27 | 유효하지 않은 금액 | PZ31 | 해당거래불가가맹점 |
| PZ32 | 가맹점 운영 시간 종료 | PZ33~PZ35 | 결제수단 거래 불가 |
| PZ40,PZ42 | 할부 관련 오류 | PZ45 | 인증 오류 횟수 초과 |
| PZ50~PZ54 | 카드상태 오류 | PZ60~PZ65 | 회원정보 관련 오류 |
| PZ69 | 전문포맷오류 | PZ70 | 서비스 불가 거래 |
| PZ71 | 거래 처리 중 오류 발생 | PZ72 | 쿠폰 사용 불가합니다. |
| PZ73 | 사업자/법인등록번호 불일치 | PZ74 | 카드사 전화 요망 |
| PZ75 | 취소 불가 거래 | PZ76 | 기타 오류 |
| PZ77~PZ78 | 환불/취소 처리 오류 | PZ79 | 거래제한시간 만료 |
| PZ80 | 조회 가능한 기간 아님 | PZ81 | 진행 중 거래 |
| PZ82 | 승인내역 미존재 | PZ83 | 쿠폰 적용 불가 |
| PZ84 | 환불 불가 | PZ85 | 이벤트 참여 불가 |
| PZ86 | 기처리 거래 | PZ87 | 기취소 거래 |
| PZ88 | 기매입 거래 | PZ89~PZ90 | 인증정보 관련 오류 |
| PZ91 | 할인 적용 불가 |     |     |

## 41.2 신용카드 식별자

신용카드 고유 식별 코드는 다음과 같습니다.

   
| 신용카드사 코드 | 신용카드사 명 | 신용카드사 코드 | 신용카드사 명 |
| --- | --- | --- | --- |
| BCC | 비씨  | KBC | 국민  |
| HNC | 하나(외환) | SSC | 삼성  |
| SHN | 신한  | WRI | 우리  |
| HDC | 현대  | LTC | 롯데  |
| 007 | 수협  | NHC | NH농협 |
| 035 | 제주  | 034 | 광주  |
| 037 | 전북  | 027 | 시티  |
| 218 | KB증권 | 050 | 저축은행 |
| 071 | 우체국 | 048 | 신협  |
| 002 | 산업  | 090 | 카카오뱅크 |
| 089 | 케이뱅크 | KBP | KBPay |
| SSP | 삼성페이 | 1QP | 1QPay |
| 247 | 새마을 |     |     |

## 41.3 금융기관 식별자

금융기관 고유 식별 코드는 다음과 같습니다.

   
| 금융기관 코드 | 금융기관 명 | 금융기관 코드 | 금융기관 명 |
| --- | --- | --- | --- |
| 002 | 산업은행 | 088 | 신한은행 |
| 003 | 기업은행 | 089 | K뱅크 |
| 092 | 토스뱅크 | 271 | 토스증권 |
| 004 | 국민은행 | 090 | 카카오뱅크 |
| 005 | 외환은행 | 209 | 유안타증권 |
| 007 | 수협은행/수협중앙회 | 218 | KB증권 |
| 011 | NH농협 | 238 | 미래에셋증권 |
| 012 | 농협중앙회 | 240 | 삼성증권 |
| 020 | 우리은행 | 243 | 한국투자증권 |
| 023 | SC 제일은행 | 247 | NH 투자증권 |
| 027 | 한국씨티은행 | 261 | 교보증권 |
| 031 | iM뱅크(대구은행) | 262 | 하이투자증권 |
| 032 | 부산은행 | 263 | 현대차투자증권 |
| 034 | 광주은행 | 264 | 키움증권 |
| 035 | 제주은행 | 265 | 이베스트투자증권 |
| 037 | 전북은행 | 266 | SK 증권 |
| 039 | 경남은행 | 267 | 대신증권 |
| 045 | 새마을금고중앙회 | 269 | 한화투자증권 |
| 048 | 신협중앙회 | 270 | 하나금융투자 |
| 050 | 상호저축은행 | 278 | 신한금융투자 |
| 054 | HSBC 은행 | 279 | 동부증권 |
| 055 | 도이치은행 | 280 | 유진투자증권 |
| 057 | 제이피모간체이스은행 | 287 | 메리츠종합금융증권 |
| 060 | BOA은행 | 290 | 부국증권 |
| 062 | 중국공상은행 | 291 | 신영증권 |
| 064 | 산림조합중앙회 | 292 | 케이프투자증권 |
| 071 | 우체국 | 103 | SBI 저축은행 |
| 081 | KEB 하나은행 |     |     |
