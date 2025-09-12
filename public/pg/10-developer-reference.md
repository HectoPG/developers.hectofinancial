# 📚 개발자 참조

PG 결제 서비스 개발에 필요한 에러 코드, 카드사 식별자, 금융기관 코드 등 모든 참조 정보를 제공합니다.

## 📖 개요

### 🎯 참조 정보 종류

---

## ⚠️ 에러 코드표

### 🔧 PG 공통 응답 코드

결제 서비스 전반에서 사용되는 공통 에러 코드입니다.

        코드
        내용
        코드
        내용

        0000
        정상처리
        0009
        사용자취소

        1001
        결제 요청 정보 누락(상점아이디)
        1002
        결제 요청 정보 누락(결제수단)

        1003
        결제 요청 정보 누락(거래일자)
        1004
        결제 요청 정보 누락(거래시간)

        1005
        결제 요청 정보 누락(상점주문번호)
        1006
        결제 요청 정보 누락(상점한글명)

        1007
        결제 요청 정보 누락(상점영문명)
        1008
        결제 요청 정보 누락(상품명)

        1009
        결제 요청 정보 누락(거래금액)
        1010
        결제 요청 정보 누락(결과처리URL)

        1011
        결제 요청 정보 누락(결과화면URL)
        1012
        결제 요청 정보 누락(결제취소URL)

        1901
        해쉬값 불일치 오류
        1902
        암호화 항목 미처리 오류

        2001
        보안숫자가 일치하지 않음
        2002
        보안숫자 인증 횟수 초과

        2003
        인증 시간 초과
        9999
        내부 시스템 오류

### 💳 신용카드 응답 코드

신용카드 결제 관련 상세 에러 코드입니다.

        코드
        내용
        코드
        내용

        CA01
        원천사 점검
        CA02
        원천사 장애

        CA03
        전문 유효성 체크
        CA04
        결제 중계사 장애

        CA10
        거래정보 없음
        CA11
        기매입 거래

        CA12
        기취소 거래
        CA20
        카드 유효기간이 유효하지 않습니다

        CA26
        사용횟수 초과
        CA30
        식별번호 오류

        CA38
        포인트한도 미달로 거래 불가
        CA42
        1000원 미만 99,999,999원 이상 금액 거래 불가

        CA58
        미등록 카드입니다. 카드사로 문의해 주세요
        CA59
        법인카드는 거래가 불가능합니다

        CA70
        식별번호(생년월일/사업자번호)+비밀번호가 유효하지 않음
        CA82
        카드사 전화 요망

        CA86
        이중 거래 입니다
        CA88
        해당 선불카드(기프트카드)는 부분취소가 불가합니다

### 📱 휴대폰 결제 응답 코드

        코드
        내용
        코드
        내용

        MP01
        요청자료 오류
        MP02
        요청정보 불일치

        MP03
        결제정보 없음
        MP04
        미등록 가맹점/서비스

        MP14&#126;MP17
        이통사소액결제 이용 불가
        MP18&#126;MP19
        이통사소액결제 이용 동의

        MP22
        이통사 자동결제 차단
        MP23&#126;MP26
        한도 초과

        MP45
        월자동결제 전월 정보 없음
        MP80
        취소 실패

        MP81
        취소 기간 경과
        MP82
        기 취소 거래

        MP99
        결제창 인증 취소 처리
        -
        -

### 🏦 계좌이체 응답 코드

        코드
        내용
        코드
        내용

        RA01
        이체횟수 초과
        RA05
        잔액부족

        RA14
        금액초과
        RA16
        중복 결제

        RA20
        은행정보 없음
        RA21
        계좌번호 상태 에러

        RA33
        기취소 거래
        RA88
        은행 업무종료

### ⚡ 간편결제 응답 코드

        코드
        내용
        코드
        내용

        PZ01, PZ05
        원천사 점검
        PZ02
        원천사 장애

        PZ03
        결제 중계 오류
        PZ04
        허용되지 않은 접근

        PZ06
        유효하지 않은 계좌
        PZ07
        유효하지 않은 카드번호

        PZ31
        해당거래불가가맹점
        PZ45
        인증 오류 횟수 초과

        PZ72
        쿠폰 사용 불가합니다
        PZ74
        카드사 전화 요망

        PZ87
        기취소 거래
        PZ91
        할인 적용 불가

### 🎁 상품권 응답 코드

        코드
        내용
        코드
        내용

        GC01
        요청자료 오류
        GC03
        결제정보 없음

        GC06
        중복결제 오류
        GC07
        한도초과

        GC40
        취소 실패
        GC41
        취소 기처리

        GC42
        취소 불가
        ST90
        상품권류 개별 Alert창 출력

### 🔧 에러 코드 활용 예시

```javascript
// 에러 코드 분석 함수
function analyzeErrorCode(errorCode, paymentMethod) {
    const errorInfo = {
        code: errorCode,
        method: paymentMethod,
        category: getErrorCategory(errorCode),
        severity: getErrorSeverity(errorCode),
        userMessage: getUserMessage(errorCode),
        techMessage: getTechMessage(errorCode),
        retryable: isRetryable(errorCode),
        actionRequired: getRequiredAction(errorCode)
    };
    
    return errorInfo;
}

// 에러 카테고리 분류
function getErrorCategory(errorCode) {
    if (errorCode.startsWith('CA')) return 'credit_card';
    if (errorCode.startsWith('MP')) return 'mobile_payment';
    if (errorCode.startsWith('RA')) return 'bank_transfer';
    if (errorCode.startsWith('PZ')) return 'simple_payment';
    if (errorCode.startsWith('GC')) return 'gift_card';
    if (errorCode.startsWith('ST')) return 'system';
    if (errorCode.startsWith('19')) return 'security';
    return 'general';
}

// 에러 심각도 판정
function getErrorSeverity(errorCode) {
    const criticalCodes = ['9999', 'ST10', 'CA02', 'PZ02'];
    const warningCodes = ['0009', '2003', 'CA01', 'PZ01'];
    
    if (criticalCodes.includes(errorCode)) return 'critical';
    if (warningCodes.includes(errorCode)) return 'warning';
    return 'normal';
}

// 사용자 메시지 생성
function getUserMessage(errorCode) {
    const userMessages = {
        '0009': '결제가 취소되었습니다.',
        '1901': '결제 정보에 오류가 있습니다. 다시 시도해주세요.',
        'CA20': '카드 유효기간을 확인해주세요.',
        'CA58': '등록되지 않은 카드입니다. 카드사에 문의해주세요.',
        'MP23': '휴대폰 결제 한도를 초과했습니다.',
        'RA05': '계좌 잔액이 부족합니다.',
        'PZ72': '쿠폰을 사용할 수 없습니다.',
        'GC07': '상품권 결제 한도를 초과했습니다.'
    };
    
    return userMessages[errorCode] || '결제 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
}

// 재시도 가능 여부 판정
function isRetryable(errorCode) {
    const nonRetryableCodes = [
        'CA58', 'CA59', 'CA88', // 카드 상태 문제
        'MP81', 'MP82',         // 취소 관련
        'RA33',                 // 기취소 거래
        'PZ87',                 // 기취소 거래
        'GC41', 'GC42'          // 취소 관련
    ];
    
    return !nonRetryableCodes.includes(errorCode);
}

// 사용 예시
const error = analyzeErrorCode('CA20', 'credit_card');
console.log('에러 분석 결과:', error);

if (error.retryable) {
    console.log('재시도 가능한 오류입니다.');
} else {
    console.log('사용자 액션이 필요한 오류입니다:', error.userMessage);
}
```

---

## 💳 신용카드 식별자

모든 신용카드사의 고유 식별 코드와 명칭입니다.

        카드사 코드
        카드사 명
        카드사 코드
        카드사 명

        BCC
        비씨
        KBC
        국민

        HNC
        하나(외환)
        SSC
        삼성

        SHN
        신한
        WRI
        우리

        HDC
        현대
        LTC
        롯데

        007
        수협
        NHC
        NH농협

        035
        제주
        034
        광주

        037
        전북
        027
        시티

        218
        KB증권
        050
        저축은행

        071
        우체국
        048
        신협

        002
        산업
        090
        카카오뱅크

        089
        케이뱅크
        KBP
        KBPay

        SSP
        삼성페이
        1QP
        1QPay

        247
        새마을
        -
        -

### 💻 카드사 코드 활용 예시

```javascript
// 카드사 정보 매핑
const CARD_COMPANIES = {
    'BCC': { name: '비씨', type: 'major', logo: 'bc.png' },
    'KBC': { name: '국민', type: 'major', logo: 'kb.png' },
    'HNC': { name: '하나(외환)', type: 'major', logo: 'hana.png' },
    'SSC': { name: '삼성', type: 'major', logo: 'samsung.png' },
    'SHN': { name: '신한', type: 'major', logo: 'shinhan.png' },
    'WRI': { name: '우리', type: 'major', logo: 'woori.png' },
    'HDC': { name: '현대', type: 'major', logo: 'hyundai.png' },
    'LTC': { name: '롯데', type: 'major', logo: 'lotte.png' },
    'NHC': { name: 'NH농협', type: 'major', logo: 'nh.png' },
    '090': { name: '카카오뱅크', type: 'digital', logo: 'kakao.png' },
    '089': { name: '케이뱅크', type: 'digital', logo: 'kbank.png' },
    'SSP': { name: '삼성페이', type: 'pay', logo: 'samsungpay.png' }
};

// 카드사 정보 조회 함수
function getCardCompanyInfo(cardCode) {
    const company = CARD_COMPANIES[cardCode];
    if (!company) {
        return {
            code: cardCode,
            name: '기타 카드사',
            type: 'other',
            logo: 'default.png'
        };
    }
    
    return {
        code: cardCode,
        ...company
    };
}

// 결제 완료 후 카드 정보 표시
function displayPaymentResult(paymentResult) {
    const cardInfo = getCardCompanyInfo(paymentResult.cardCd);
    
    console.log(`결제 완료: ${cardInfo.name} (${paymentResult.cardNo})`);
    console.log(`승인번호: ${paymentResult.cardApprNo}`);
    console.log(`할부: ${paymentResult.instmtMon === '00' ? '일시불' : paymentResult.instmtMon + '개월'}`);
    
    // UI에 카드사 로고 표시
    document.getElementById('card-logo').src = `/images/cards/${cardInfo.logo}`;
    document.getElementById('card-name').textContent = cardInfo.name;
}

// 카드사별 특별 처리
function handleSpecialCardRules(cardCode, amount) {
    const rules = {
        'BCC': { minAmount: 1000, maxInstallment: 24 },
        'SSP': { minAmount: 100, maxInstallment: 0 }, // 삼성페이는 할부 불가
        '090': { minAmount: 1000, maxInstallment: 12 }, // 카카오뱅크
        '089': { minAmount: 1000, maxInstallment: 12 }  // 케이뱅크
    };
    
    const rule = rules[cardCode];
    if (rule) {
        if (amount 

        기관 코드
        금융기관 명
        기관 코드
        금융기관 명

        주요 은행

        002
        산업은행
        003
        기업은행

        004
        국민은행
        007
        수협은행/수협중앙회

        011
        NH농협
        020
        우리은행

        023
        SC 제일은행
        027
        한국씨티은행

        081
        KEB 하나은행
        088
        신한은행

        디지털 은행

        089
        K뱅크
        090
        카카오뱅크

        092
        토스뱅크
        -
        -

        지방은행

        031
        iM뱅크(대구은행)
        032
        부산은행

        034
        광주은행
        035
        제주은행

        037
        전북은행
        039
        경남은행

        증권사

        209
        유안타증권
        218
        KB증권

        238
        미래에셋증권
        240
        삼성증권

        243
        한국투자증권
        264
        키움증권

        270
        하나금융투자
        271
        토스증권

        278
        신한금융투자
        287
        메리츠종합금융증권

        기타 금융기관

        045
        새마을금고중앙회
        048
        신협중앙회

        050
        상호저축은행
        071
        우체국

        103
        SBI 저축은행
        -
        -

### 💻 금융기관 코드 활용 예시

```javascript
// 금융기관 정보 매핑
const FINANCIAL_INSTITUTIONS = {
    // 주요 은행
    '004': { name: '국민은행', type: 'bank', group: 'major' },
    '020': { name: '우리은행', type: 'bank', group: 'major' },
    '081': { name: 'KEB 하나은행', type: 'bank', group: 'major' },
    '088': { name: '신한은행', type: 'bank', group: 'major' },
    
    // 디지털 은행
    '089': { name: 'K뱅크', type: 'bank', group: 'digital' },
    '090': { name: '카카오뱅크', type: 'bank', group: 'digital' },
    '092': { name: '토스뱅크', type: 'bank', group: 'digital' },
    
    // 지방은행
    '031': { name: 'iM뱅크(대구은행)', type: 'bank', group: 'regional' },
    '032': { name: '부산은행', type: 'bank', group: 'regional' },
    
    // 증권사
    '238': { name: '미래에셋증권', type: 'securities', group: 'major' },
    '240': { name: '삼성증권', type: 'securities', group: 'major' },
    '264': { name: '키움증권', type: 'securities', group: 'major' },
    '271': { name: '토스증권', type: 'securities', group: 'digital' }
};

// 금융기관 정보 조회
function getFinancialInstitutionInfo(bankCode) {
    const institution = FINANCIAL_INSTITUTIONS[bankCode];
    if (!institution) {
        return {
            code: bankCode,
            name: '기타 금융기관',
            type: 'other',
            group: 'other'
        };
    }
    
    return {
        code: bankCode,
        ...institution
    };
}

// 가상계좌 은행 선택 UI 생성
function createBankSelectionUI() {
    const banksByGroup = {
        major: [],
        digital: [],
        regional: [],
        securities: []
    };
    
    // 금융기관을 그룹별로 분류
    Object.entries(FINANCIAL_INSTITUTIONS).forEach(([code, info]) => {
        if (info.type === 'bank') {
            banksByGroup[info.group].push({ code, ...info });
        }
    });
    
    // HTML 생성
    let html = '';
    
    // 주요 은행
    html += '주요 은행';
    banksByGroup.major.forEach(bank => {
        html += `${bank.name}`;
    });
    html += '';
    
    // 디지털 은행
    html += '디지털 은행';
    banksByGroup.digital.forEach(bank => {
        html += `${bank.name}`;
    });
    html += '';
    
    html += '';
    return html;
}

// 계좌이체 결과에서 은행 정보 표시
function displayBankTransferResult(transferResult) {
    const bankInfo = getFinancialInstitutionInfo(transferResult.fnCd);
    
    console.log(`계좌이체 완료: ${bankInfo.name}`);
    console.log(`이체 금액: ${transferResult.trdAmt.toLocaleString()}원`);
    
    // 디지털 은행인 경우 특별 표시
    if (bankInfo.group === 'digital') {
        console.log('💳 디지털 은행 이체');
    }
}
```

---

## 🔍 결제수단 코드

모든 결제수단의 식별 코드입니다.

        코드
        결제수단
        코드
        결제수단

        CA
        신용카드
        VA
        가상계좌

        RA
        계좌이체
        MP
        휴대폰결제

        BG
        도서상품권
        CG
        컬쳐랜드상품권(컬쳐캐쉬)

        HM
        해피머니
        TC
        틴캐시

        TM
        티머니
        SG
        스마트문상

        CP
        포인트다모아
        WL
        화이트라벨

        KP
        카카오페이
        NP
        네이버페이

        PC
        페이코
        -
        -

### 📞 통신사 코드

휴대폰 결제에 사용되는 통신사 식별 코드입니다.

        코드
        통신사명
        코드
        통신사명

        SKT
        SK Telecom
        KTF
        KT

        LGT
        LG U+
        SKL
        SK 7 Mobile

        CJH
        CJ 헬로모바일
        KCT
        한국케이블텔레콤

---

## 🛠️ 개발 도구

### 📊 에러 통계 분석 도구

```javascript
class ErrorAnalyzer {
    constructor() {
        this.errorStats = new Map();
        this.errorPatterns = new Map();
    }
    
    // 에러 통계 수집
    recordError(errorCode, paymentMethod, context = {}) {
        const key = `${paymentMethod}_${errorCode}`;
        
        if (!this.errorStats.has(key)) {
            this.errorStats.set(key, {
                count: 0,
                firstOccurrence: new Date(),
                lastOccurrence: new Date(),
                contexts: []
            });
        }
        
        const stats = this.errorStats.get(key);
        stats.count++;
        stats.lastOccurrence = new Date();
        stats.contexts.push({
            timestamp: new Date(),
            ...context
        });
        
        // 최근 100개만 유지
        if (stats.contexts.length > 100) {
            stats.contexts = stats.contexts.slice(-100);
        }
    }
    
    // 에러 패턴 분석
    analyzePatterns(timeWindow = 3600000) { // 1시간
        const now = Date.now();
        const patterns = [];
        
        for (const [key, stats] of this.errorStats) {
            const recentErrors = stats.contexts.filter(
                ctx => now - ctx.timestamp.getTime() = 5) { // 임계값
                patterns.push({
                    errorKey: key,
                    frequency: recentErrors.length,
                    trend: this.calculateTrend(recentErrors),
                    severity: this.calculateSeverity(key, recentErrors.length)
                });
            }
        }
        
        return patterns.sort((a, b) => b.severity - a.severity);
    }
    
    // 에러 트렌드 계산
    calculateTrend(errors) {
        if (errors.length  firstHalf * 1.5) return 'increasing';
        if (secondHalf  sum + stats.count, 0);
        
        return {
            summary: {
                totalErrors,
                uniqueErrorTypes: this.errorStats.size,
                criticalPatterns: patterns.filter(p => p.severity >= 50).length
            },
            patterns,
            recommendations: this.generateRecommendations(patterns)
        };
    }
    
    // 개선 권고사항 생성
    generateRecommendations(patterns) {
        const recommendations = [];
        
        patterns.forEach(pattern => {
            const [method, code] = pattern.errorKey.split('_');
            
            if (code === '1901') {
                recommendations.push({
                    priority: 'high',
                    message: '해시값 불일치 오류가 빈번합니다. 해시 생성 로직을 점검하세요.',
                    action: 'hash_validation_review'
                });
            }
            
            if (code.startsWith('CA') && pattern.frequency > 10) {
                recommendations.push({
                    priority: 'medium',
                    message: '신용카드 오류가 증가하고 있습니다. 카드사 연동 상태를 확인하세요.',
                    action: 'card_gateway_check'
                });
            }
        });
        
        return recommendations;
    }
}

// 사용 예시
const analyzer = new ErrorAnalyzer();

// 에러 발생 시 기록
analyzer.recordError('1901', 'credit_card', {
    mchtId: 'test_merchant',
    amount: 5000,
    userAgent: 'Mozilla/5.0...'
});

// 정기적인 분석 (예: 매시간)
setInterval(() => {
    const report = analyzer.generateReport();
    console.log('에러 분석 리포트:', report);
    
    // 심각한 패턴이 발견되면 알림
    if (report.summary.criticalPatterns > 0) {
        sendAlert('Critical error patterns detected', report);
    }
}, 3600000); // 1시간마다
```

### 🔍 코드 검증 도구

```javascript
// 코드 검증 유틸리티
class CodeValidator {
    // 카드사 코드 검증
    static validateCardCode(cardCode) {
        const validCodes = [
            'BCC', 'KBC', 'HNC', 'SSC', 'SHN', 'WRI', 'HDC', 'LTC',
            '007', 'NHC', '035', '034', '037', '027', '218', '050',
            '071', '048', '002', '090', '089', 'KBP', 'SSP', '1QP', '247'
        ];
        
        return {
            isValid: validCodes.includes(cardCode),
            message: validCodes.includes(cardCode) 
                ? '유효한 카드사 코드입니다.' 
                : '등록되지 않은 카드사 코드입니다.'
        };
    }
    
    // 금융기관 코드 검증
    static validateBankCode(bankCode) {
        const validCodes = [
            '002', '003', '004', '007', '011', '020', '023', '027',
            '031', '032', '034', '035', '037', '039', '081', '088',
            '089', '090', '092', '209', '218', '238', '240', '243',
            '264', '270', '271', '278', '287'
        ];
        
        return {
            isValid: validCodes.includes(bankCode),
            message: validCodes.includes(bankCode)
                ? '유효한 금융기관 코드입니다.'
                : '등록되지 않은 금융기관 코드입니다.'
        };
    }
    
    // 결제수단 코드 검증
    static validatePaymentMethod(methodCode) {
        const validMethods = {
            'CA': '신용카드',
            'VA': '가상계좌', 
            'RA': '계좌이체',
            'MP': '휴대폰결제',
            'BG': '도서상품권',
            'CG': '컬쳐랜드상품권',
            'HM': '해피머니',
            'TC': '틴캐시',
            'TM': '티머니',
            'SG': '스마트문상',
            'CP': '포인트다모아',
            'WL': '화이트라벨',
            'KP': '카카오페이',
            'NP': '네이버페이',
            'PC': '페이코'
        };
        
        return {
            isValid: methodCode in validMethods,
            method: validMethods[methodCode],
            message: methodCode in validMethods
                ? `유효한 결제수단입니다: ${validMethods[methodCode]}`
                : '지원하지 않는 결제수단입니다.'
        };
    }
    
    // 종합 검증
    static validateAll(codes) {
        const results = {};
        
        if (codes.cardCode) {
            results.cardCode = this.validateCardCode(codes.cardCode);
        }
        
        if (codes.bankCode) {
            results.bankCode = this.validateBankCode(codes.bankCode);
        }
        
        if (codes.paymentMethod) {
            results.paymentMethod = this.validatePaymentMethod(codes.paymentMethod);
        }
        
        return results;
    }
}

// 사용 예시
const validationResult = CodeValidator.validateAll({
    cardCode: 'BCC',
    bankCode: '004',
    paymentMethod: 'CA'
});

console.log('검증 결과:', validationResult);
```

---

## 💡 자주 묻는 질문

### Q. 에러 코드가 문서에 없는 경우 어떻게 해야 하나요?
A. 새로운 에러 코드가 발생하면 헥토파이낸셜 기술지원팀에 문의하세요. 시스템 업데이트로 인해 새로운 에러 코드가 추가될 수 있습니다.

### Q. 카드사 코드와 은행 코드가 다른 이유는 무엇인가요?
A. 카드사 코드는 신용카드 결제 시 사용되고, 은행 코드는 계좌이체나 가상계좌 발급 시 사용됩니다. 같은 기관이라도 서로 다른 코드를 사용할 수 있습니다.

### Q. 디지털 은행들의 특별한 처리가 필요한가요?
A. 기본적으로는 동일하게 처리하지만, 일부 디지털 은행은 서비스 시간이나 한도 정책이 다를 수 있으므로 확인이 필요합니다.

### Q. 에러 코드 분석 도구를 실제 서비스에 적용해도 되나요?
A. 네, 제공된 분석 도구는 실제 서비스에서 사용할 수 있도록 설계되었습니다. 단, 메모리 사용량과 성능을 고려하여 적절히 조정하세요.

### Q. 새로운 간편결제 서비스가 추가되면 어떻게 대응해야 하나요?
A. 새로운 서비스 추가 시 헥토파이낸셜에서 별도 공지와 함께 관련 코드 정보를 제공합니다. 개발자 참조 문서도 함께 업데이트됩니다.

---

## 🚀 마무리

이제 PG 결제 서비스의 모든 참조 정보를 확인했습니다. 이 문서를 북마크하여 개발 중 언제든지 참조하세요.

        🚀
      
      시작하기

        📊
      
      거래관리

        💳
      
      신용카드

        ⚡
      
      간편결제