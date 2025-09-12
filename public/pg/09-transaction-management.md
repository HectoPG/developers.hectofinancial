# 📊 거래 조회 및 관리

결제 거래의 실시간 조회, 거래대사, 정산대사 등 거래 관리를 위한 API 가이드입니다. 안정적인 결제 서비스 운영을 위한 필수 기능들을 제공합니다.

## 📖 개요

### 🎯 주요 기능

### 🔧 API 종류

| API | 용도 | 주요 정보 |
|-----|------|-----------|
| **실시간 거래 조회** | 개별 거래 상태 확인 | 거래 상태, 취소 금액, 결제 정보 |
| **거래대사** | 일자별 거래 내역 조회 | 승인/취소 구분, 거래 금액, 카드사 정보 |
| **정산대사** | 정산 예정 내역 조회 | 수수료, 부가세, 정산 예정일, 정산 금액 |

---

## 🔍 실시간 거래 조회 API

개별 거래의 현재 상태와 상세 정보를 실시간으로 조회하는 API입니다.

### 📡 API 엔드포인트

| 환경 | URL |
|------|-----|
| **테스트** | `https://tbgw.settlebank.co.kr/spay/APITrdStatInq.do` |
| **운영** | `https://gw.settlebank.co.kr/spay/APITrdStatInq.do` |

### 📋 요청 파라미터

### 💻 실시간 거래 조회 구현

```javascript
const crypto = require('crypto');

// 실시간 거래 조회 API 호출
async function inquireTransactionStatus(params) {
    // 해시 생성
    const hashData = 
        params.trdDt +          // 거래일자
        params.trdTm +          // 거래시간
        params.mchtId +         // 상점아이디
        params.mchtTrdNo +      // 상점주문번호
        params.trdAmt +         // 거래금액(평문)
        params.hashKey;         // 해시키
    
    const pktHash = crypto.createHash('sha256').update(hashData, 'utf8').digest('hex');
    
    const requestData = {
        params: {
            mchtId: params.mchtId,
            ver: "0A1M",
            mchtTrdNo: params.mchtTrdNo,
            trdDt: params.trdDt,
            trdTm: params.trdTm
        },
        data: {
            pktHash: pktHash,
            method: params.method,
            trdAmt: params.trdAmt,
            orgTrdDt: params.orgTrdDt,
            orgMchtTrdNo: params.orgMchtTrdNo,
            orgTrdNo: params.orgTrdNo
        }
    };
    
    try {
        const response = await fetch('https://tbgw.settlebank.co.kr/spay/APITrdStatInq.do', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify(requestData)
        });
        
        const result = await response.json();
        
        if (result.outStatCd === '0021' && result.outRsltCd === '0000') {
            console.log('거래 조회 성공:', result);
            return {
                success: true,
                transactionInfo: {
                    mchtId: result.mchtId,
                    trdNo: result.trdNo,
                    method: result.method,
                    trdAmt: result.trdAmt,
                    cnclAmt: result.cnclAmt,
                    status: getTransactionStatus(result.outRsltCd)
                }
            };
        } else {
            console.error('거래 조회 실패:', result.outRsltMsg);
            return {
                success: false,
                error: result.outRsltMsg,
                errorCode: result.outRsltCd
            };
        }
    } catch (error) {
        console.error('API 호출 실패:', error);
        throw error;
    }
}

// 거래 상태 해석
function getTransactionStatus(resultCode) {
    const statusMap = {
        '0000': '정상거래',
        '0001': '취소상태', 
        '0009': '결제실패'
    };
    return statusMap[resultCode] || '기타 상태';
}

// 사용 예시
const inquiryParams = {
    mchtId: "nx_mid_il",
    mchtTrdNo: "ORDER20231215143022",
    trdDt: "20231215",
    trdTm: "143022",
    method: "CA",
    trdAmt: "5000",
    orgTrdDt: "20231215",
    orgMchtTrdNo: "ORDER20231215143022",
    hashKey: "your-hash-key-from-hecto"
};

inquireTransactionStatus(inquiryParams)
    .then(result => {
        if (result.success) {
            console.log('거래 상태:', result.transactionInfo.status);
            console.log('취소 금액:', result.transactionInfo.cnclAmt);
        } else {
            console.log('조회 실패:', result.error);
        }
    });
```

### 📨 응답 정보

```javascript
{
    "outStatCd": "0021",              // 거래상태코드 (0021:성공, 0031:실패)
    "outRsltCd": "0000",              // 결과코드 (0000:정상, 0001:취소, 0009:실패)
    "outRsltMsg": "정상거래",          // 결과메시지
    "mchtId": "nx_mid_il",            // 상점아이디
    "trdNo": "STFP_PGHMnx_mid_il00220623130711M1872705", // 거래번호
    "method": "CA",                   // 결제수단
    "trdAmt": "5000",                 // 거래금액
    "cnclAmt": "0"                    // 취소금액 (취소건 미존재시 0원)
}
```

---

## 📋 거래대사 API

일자별 전체 거래 내역을 조회하여 거래 데이터를 검증하는 API입니다.

### 📡 API 엔드포인트

| 환경 | URL | HTTP Method |
|------|-----|-------------|
| **테스트** | `https://tb-nspay.settlebank.co.kr/api/pg/{상점아이디}/transInfo.do` | GET/POST |
| **운영** | `https://nspay.settlebank.co.kr/api/pg/{상점아이디}/transInfo.do` | GET/POST |

### 📋 요청 파라미터

### 💻 거래대사 API 구현

```javascript
// 거래대사 API 호출
async function getTransactionReconciliation(params) {
    // 해시 생성
    const hashData = 
        params.mchtId +         // 상점아이디
        params.trdDtSt +        // 거래일자
        params.authKey;         // 인증키
    
    const pktHash = crypto.createHash('sha256').update(hashData, 'utf8').digest('hex');
    
    const requestParams = new URLSearchParams({
        mchtId: params.mchtId,
        mchtTy: 'M',
        method: params.method,
        pdTy: 'D',
        trdDtSt: params.trdDtSt,
        pktHash: pktHash
    });
    
    try {
        const response = await fetch(
            `https://tb-nspay.settlebank.co.kr/api/pg/${params.mchtId}/transInfo.do`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                body: requestParams
            }
        );
        
        const responseText = await response.text();
        const lines = responseText.trim().split('\n');
        
        // 첫 번째 줄: 결과 정보
        const [resultCode, resultMessage, recordCount] = lines[0].split('|');
        
        if (resultCode === '0000') {
            const transactions = [];
            
            // 두 번째 줄부터: 거래 내역
            for (let i = 1; i  {
        if (result.success) {
            console.log(`총 ${result.recordCount}건의 거래 조회`);
            result.transactions.forEach(tx => {
                console.log(`${tx.trdDt} ${tx.trdTm} - ${tx.prdtNm}: ${tx.trdAmt}원 (${tx.apprType === '0' ? '승인' : '취소'})`);
            });
        } else {
            console.log('거래대사 실패:', result.resultMessage);
        }
    });
```

### 📊 거래대사 응답 예시

**성공 응답:**
```
0000|정상 처리 되었습니다.|3|
mid_test|VA|STBK_PGVAmid_test000000000000000M0000001|TEST000000000000000001|0|20231215|100001|1000|||홍길동|테스트상품||케이뱅크|||
mid_test|VA|STBK_PGVAmid_test000000000000000M0000002|TEST000000000000000002|0|20231215|100002|2000|||홍길동|테스트상품||케이뱅크|||
mid_test|VA|STBK_PGVAmid_test000000000000000M0000003|TEST000000000000000003|0|20231215|100003|3000|||홍길동|테스트상품||케이뱅크|||
```

**실패 응답:**
```
ST92|해쉬 값 불일치.|0|
```

---

## 💰 정산대사 API

정산 예정 거래와 수수료 정보를 확인하는 API입니다.

### 📡 API 엔드포인트

| 환경 | URL | HTTP Method |
|------|-----|-------------|
| **테스트** | `https://tb-nspay.settlebank.co.kr/api/pg/{상점아이디}/sttlmntInfo.do` | GET/POST |
| **운영** | `https://nspay.settlebank.co.kr/api/pg/{상점아이디}/sttlmntInfo.do` | GET/POST |

### 📋 요청 파라미터

### 💻 정산대사 API 구현

```javascript
// 정산대사 API 호출
async function getSettlementReconciliation(params) {
    // 해시 생성
    const hashData = 
        params.mchtId +         // 상점아이디
        params.crtrDt +         // 조회일자
        params.authKey;         // 인증키
    
    const pktHash = crypto.createHash('sha256').update(hashData, 'utf8').digest('hex');
    
    const requestParams = new URLSearchParams({
        mchtId: params.mchtId,
        method: params.method,
        crtrDt: params.crtrDt,
        pktHash: pktHash
    });
    
    try {
        const response = await fetch(
            `https://tb-nspay.settlebank.co.kr/api/pg/${params.mchtId}/sttlmntInfo.do`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                body: requestParams
            }
        );
        
        const responseText = await response.text();
        const lines = responseText.trim().split('\n');
        
        // 첫 번째 줄: 결과 정보
        const [resultCode, resultMessage, recordCount] = lines[0].split('|');
        
        if (resultCode === '0000') {
            const settlements = [];
            
            // 두 번째 줄부터: 정산 내역
            for (let i = 1; i  {
        if (settlement.apprType === '0') { // 승인
            summary.totalPayAmt += settlement.payAmt;
            summary.totalFee += settlement.fee;
            summary.totalVat += settlement.vat;
            summary.totalSettlementAmt += settlement.settlementAmt;
            summary.approvalCount++;
        } else { // 취소
            summary.totalPayAmt -= settlement.payAmt;
            summary.totalFee -= settlement.fee;
            summary.totalVat -= settlement.vat;
            summary.totalSettlementAmt -= settlement.settlementAmt;
            summary.cancelCount++;
        }
        return summary;
    }, {
        totalPayAmt: 0,
        totalFee: 0,
        totalVat: 0,
        totalSettlementAmt: 0,
        approvalCount: 0,
        cancelCount: 0
    });
}

// 사용 예시
const settlementParams = {
    mchtId: "nxca_jt_il",
    method: "CA",
    crtrDt: "20231218", // 정산예정일자
    authKey: "your-auth-key-from-hecto"
};

getSettlementReconciliation(settlementParams)
    .then(result => {
        if (result.success) {
            console.log(`정산 대상 거래: ${result.recordCount}건`);
            console.log('정산 요약:', result.summary);
            
            result.settlements.forEach(settlement => {
                console.log(
                    `${settlement.apprDt} - ${settlement.prdtNm}: ` +
                    `${settlement.payAmt}원 (수수료: ${settlement.fee}원, 정산: ${settlement.settlementAmt}원)`
                );
            });
        } else {
            console.log('정산대사 실패:', result.resultMessage);
        }
    });
```

### 📊 정산대사 응답 예시

**성공 응답:**
```
0000|정상 처리 되었습니다.|3|
mid_test|SOFP_00000001|SOFP_00000004|VA|20231215|0|089|||TEST0000001||테스트상품|1000|20|2|978|20231218|
mid_test|SOFP_00000002|SOFP_00000005|VA|20231215|0|089|||TEST0000002||테스트상품|2000|40|4|1956|20231218|
mid_test|SOFP_00000003|SOFP_00000006|VA|20231215|0|089|||TEST0000003||테스트상품|3000|60|6|2934|20231218|
```

---

## 🔧 통합 거래 관리 시스템

세 가지 API를 통합한 완전한 거래 관리 시스템 구현 예시입니다.

```javascript
class TransactionManager {
    constructor(config) {
        this.mchtId = config.mchtId;
        this.hashKey = config.hashKey;
        this.authKey = config.authKey;
        this.isProduction = config.isProduction || false;
    }
    
    // API 엔드포인트 결정
    getApiEndpoint(apiType) {
        const baseUrl = this.isProduction ? 
            'https://gw.settlebank.co.kr' : 
            'https://tbgw.settlebank.co.kr';
        
        const nsPayUrl = this.isProduction ?
            'https://nspay.settlebank.co.kr' :
            'https://tb-nspay.settlebank.co.kr';
        
        switch (apiType) {
            case 'inquiry':
                return `${baseUrl}/spay/APITrdStatInq.do`;
            case 'reconciliation':
                return `${nsPayUrl}/api/pg/${this.mchtId}/transInfo.do`;
            case 'settlement':
                return `${nsPayUrl}/api/pg/${this.mchtId}/sttlmntInfo.do`;
            default:
                throw new Error('Unknown API type');
        }
    }
    
    // 실시간 거래 조회
    async inquireTransaction(mchtTrdNo, trdDt, trdTm, method, trdAmt) {
        return await inquireTransactionStatus({
            mchtId: this.mchtId,
            mchtTrdNo,
            trdDt,
            trdTm,
            method,
            trdAmt,
            orgTrdDt: trdDt,
            orgMchtTrdNo: mchtTrdNo,
            hashKey: this.hashKey
        });
    }
    
    // 거래대사 조회
    async getTransactionReconciliation(method, trdDtSt) {
        return await getTransactionReconciliation({
            mchtId: this.mchtId,
            method,
            trdDtSt,
            authKey: this.authKey
        });
    }
    
    // 정산대사 조회
    async getSettlementReconciliation(method, crtrDt) {
        return await getSettlementReconciliation({
            mchtId: this.mchtId,
            method,
            crtrDt,
            authKey: this.authKey
        });
    }
    
    // 일자별 전체 거래 요약
    async getDailySummary(targetDate) {
        const methods = ['CA', 'VA', 'RA', 'MP'];
        const summary = {
            date: targetDate,
            totalTransactions: 0,
            totalAmount: 0,
            byMethod: {}
        };
        
        for (const method of methods) {
            try {
                const result = await this.getTransactionReconciliation(method, targetDate);
                if (result.success) {
                    const methodSummary = {
                        count: result.recordCount,
                        amount: result.transactions.reduce((sum, tx) => {
                            return sum + (tx.apprType === '0' ? tx.trdAmt : -tx.trdAmt);
                        }, 0)
                    };
                    
                    summary.byMethod[method] = methodSummary;
                    summary.totalTransactions += methodSummary.count;
                    summary.totalAmount += methodSummary.amount;
                }
            } catch (error) {
                console.error(`${method} 거래대사 실패:`, error);
                summary.byMethod[method] = { count: 0, amount: 0, error: error.message };
            }
        }
        
        return summary;
    }
    
    // 정산 예정 요약
    async getSettlementSummary(settlementDate) {
        const methods = ['CA', 'VA', 'RA', 'MP'];
        const summary = {
            settlementDate,
            totalSettlementAmount: 0,
            totalFee: 0,
            byMethod: {}
        };
        
        for (const method of methods) {
            try {
                const result = await this.getSettlementReconciliation(method, settlementDate);
                if (result.success) {
                    summary.byMethod[method] = result.summary;
                    summary.totalSettlementAmount += result.summary.totalSettlementAmt;
                    summary.totalFee += result.summary.totalFee;
                }
            } catch (error) {
                console.error(`${method} 정산대사 실패:`, error);
                summary.byMethod[method] = { error: error.message };
            }
        }
        
        return summary;
    }
}

// 사용 예시
const txManager = new TransactionManager({
    mchtId: "nxca_jt_il",
    hashKey: "your-hash-key",
    authKey: "your-auth-key",
    isProduction: false
});

// 일자별 거래 요약 조회
txManager.getDailySummary("20231215")
    .then(summary => {
        console.log('일자별 거래 요약:', summary);
        console.log(`총 거래: ${summary.totalTransactions}건, ${summary.totalAmount.toLocaleString()}원`);
    });

// 정산 예정 요약 조회
txManager.getSettlementSummary("20231218")
    .then(summary => {
        console.log('정산 요약:', summary);
        console.log(`정산 예정 금액: ${summary.totalSettlementAmount.toLocaleString()}원`);
        console.log(`총 수수료: ${summary.totalFee.toLocaleString()}원`);
    });
```

---

## 📊 대사 API 에러 코드

### 🚨 공통 에러 코드

| 코드 | 내용 |
|------|------|
| `0000` | 정상 처리 되었습니다. |
| `1001` | 조회내역 없음 |
| `ST09` | 유효하지 않은 요청전문 |
| `ST10` | 내부 시스템 에러 |
| `ST90` | 등록되지 않은 상점 아이디 |
| `ST91` | 필수 파라미터 오류 |
| `ST92` | 해쉬 값 불일치 |

### 🔧 에러 해결 가이드

      💡

      주요 문제 해결
      
        • ST92 해시값 불일치: 해시 생성 순서와 인증키 확인
        • ST90 미등록 상점: 상점아이디 정확성 확인
        • 1001 조회내역 없음: 조회 일자와 결제수단 확인
        • ST91 필수 파라미터: 모든 필수 파라미터 포함 여부 확인

---

## 💡 자주 묻는 질문

### Q. 거래대사와 정산대사의 차이점은 무엇인가요?
A. 거래대사는 실제 발생한 모든 거래(승인/취소)를 확인하는 것이고, 정산대사는 실제 정산될 금액과 수수료를 확인하는 것입니다.

### Q. 실시간 거래 조회는 언제 사용하나요?
A. 고객 문의나 특정 거래의 현재 상태를 즉시 확인해야 할 때 사용합니다. 대량 조회에는 거래대사 API를 사용하세요.

### Q. 해시 생성 시 주의사항은 무엇인가요?
A. 각 API별로 해시 조합 순서가 다르므로 정확한 순서를 확인하고, 모든 값이 문자열로 변환된 후 조합해야 합니다.

### Q. 대사 API 호출 주기는 어떻게 설정하나요?
A. 거래대사는 일 1회(새벽 시간), 정산대사는 정산일 기준으로 호출하는 것이 일반적입니다.

### Q. 취소 거래는 어떻게 구분하나요?
A. 승인구분 필드(apprType)에서 '0'은 승인, '1'은 취소를 의미합니다. 취소 거래는 원거래번호와 원거래일자가 함께 제공됩니다.

---

## 🚀 다음 단계

거래 조회 및 관리 API를 완료했다면, 개발자 참조 자료도 확인해보세요:

        📚
      
      개발자 참조

        🚀
      
      시작하기

        💳
      
      신용카드

        ⚡
      
      간편결제