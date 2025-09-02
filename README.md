# 헥토파이낸셜 개발자 문서 사이트

React + Vite + MDX 기반의 헥토파이낸셜 개발자 문서 사이트입니다.

## 🚀 실행 방법

### 개발 서버 실행
```bash
npm install
npm run dev
```
브라우저에서 `http://localhost:5173` 접속

### 빌드
```bash
npm run build
```

### 빌드 결과 미리보기
```bash
npm run preview
```

## 📁 프로젝트 구조

```
src/
├── components/        # React 컴포넌트
├── docs/             # MDX 문서 파일
│   ├── pg/           # PG 결제 문서 (10개 챕터)
│   ├── ezauth/       # 내통장결제 문서
│   ├── ezcp/         # 간편현금결제 문서
│   └── whitelabel/   # 화이트라벨 문서
├── pages/            # 페이지 컴포넌트
└── types/            # TypeScript 타입 정의
```

## 🎨 기술 스택

- **React 18** + **TypeScript**
- **Vite** (빌드 도구)
- **MDX** (마크다운 + JSX)
- **Tailwind CSS** (스타일링)
- **React Router** (라우팅)
- **Lucide React** (아이콘)

## 📖 문서 카테고리

- **PG 결제**: 신용카드, 가상계좌, 계좌이체, 간편결제 등
- **내통장결제**: 간편 계좌 결제 서비스
- **간편현금결제**: 현금 결제 서비스
- **화이트라벨**: 통합 결제 서비스

## 🛠️ 개발 명령어

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 타입 체크
npm run type-check

# 린트 검사
npm run lint

# 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

## 📝 문서 추가/수정

1. `src/docs/` 폴더에 MDX 파일 추가
2. `src/pages/DocsPage.tsx`에서 라우팅 설정
3. `src/components/Layout.tsx`에서 네비게이션 메뉴 추가

---

**헥토파이낸셜 개발팀** | [GitHub](https://github.com/HectoPG/developers.hectofinancial)