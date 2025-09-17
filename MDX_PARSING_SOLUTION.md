# MDX Frontmatter 파싱 해결 방안

## 🔍 문제 상황
- Vite 개발 환경에서 MDX 파일이 JavaScript로 컴파일되어 frontmatter가 사라짐
- `import.meta.glob`의 `?raw` 쿼리가 실제 원본 파일이 아닌 컴파일된 결과 반환
- 개발/프로덕션 환경 간 일관성 부족

## ✅ 최종 해결 방안: Vite 플러그인 + 자동 Export

### 1. Vite 플러그인 생성
```javascript
// plugins/vite-mdx-frontmatter.js
import matter from 'gray-matter';

export default function mdxFrontmatterPlugin() {
  return {
    name: 'vite-mdx-frontmatter',
    enforce: 'pre',
    transform(code, id) {
      // MDX 파일만 처리
      if (id.endsWith('.mdx')) {
        try {
          // frontmatter 파싱
          const { data: frontmatter, content } = matter(code);
          
          // API 정보가 있는 경우에만 export 추가
          if (frontmatter.title && frontmatter.path && frontmatter.method) {
            const apiInfoExport = `
export const apiInfo = {
  title: ${JSON.stringify(frontmatter.title)},
  description: ${JSON.stringify(frontmatter.description || '')},
  category: ${JSON.stringify(frontmatter.category || '')},
  path: ${JSON.stringify(frontmatter.path)},
  method: ${JSON.stringify(frontmatter.method)},
  testUrl: ${JSON.stringify(frontmatter.testUrl || '')},
  prodUrl: ${JSON.stringify(frontmatter.prodUrl || '')}
};
`;
            
            // frontmatter 제거하고 export 추가
            return apiInfoExport + '\n' + content;
          }
        } catch (error) {
          console.warn(`Failed to parse frontmatter in ${id}:`, error);
        }
      }
      
      return null; // 다른 플러그인이 처리하도록
    }
  };
}
```

### 2. Vite 설정에 플러그인 추가
```typescript
// vite.config.ts
import mdxFrontmatterPlugin from './plugins/vite-mdx-frontmatter.js'

export default defineConfig({
  plugins: [
    mdxFrontmatterPlugin(), // frontmatter를 apiInfo로 자동 export
    {
      enforce: 'pre',
      ...mdx({
        providerImportSource: '@mdx-js/react',
        remarkPlugins: [remarkGfm, remarkFrontmatter],
        rehypePlugins: [rehypePrism, rehypeMdxCodeProps],
      })
    },
    react()
  ],
})
```

### 3. MDX 파일 작성
```markdown
---
title: 신용카드 결제 (Non-UI)
description: 신용카드 결제 및 빌키 결제 API
category: 결제 API
path: /spay/APICardActionPay.do
method: POST
testUrl: https://tbgw.settlebank.co.kr/spay/APICardActionPay.do
prodUrl: https://gw.settlebank.co.kr/spay/APICardActionPay.do
---

# 신용카드 결제 (Non-UI)

API 문서 내용...
```

### 4. 컴포넌트에서 사용
```typescript
// ApiTestPanel.tsx
const modules = import.meta.glob('../docs/api/**/*.mdx');
const modulePath = selectedApi.path.replace('/docs/', '../docs/') + '.mdx';

if (modules[modulePath]) {
  const module = await modules[modulePath]();
  if (module.apiInfo) {
    setApiInfo(module.apiInfo); // 자동 생성된 apiInfo 사용
  }
}
```

## 🌟 장점

1. **✅ 하드코딩 없음**: 모든 정보가 frontmatter에서 추출
2. **✅ 환경 일관성**: 개발/프로덕션에서 동일하게 작동
3. **✅ 자동화**: 플러그인이 모든 변환 처리
4. **✅ 타입 안전성**: TypeScript 지원
5. **✅ 유지보수성**: frontmatter만 수정하면 끝

## 🔧 작동 원리

1. **빌드 타임**: Vite 플러그인이 MDX 파일의 frontmatter를 파싱
2. **자동 변환**: frontmatter 데이터를 `export const apiInfo` 형태로 변환
3. **런타임**: `import.meta.glob`으로 MDX 모듈을 동적 로딩
4. **데이터 사용**: export된 `apiInfo` 객체를 바로 사용

## 📂 최종 파일 구조
```
plugins/
├── vite-mdx-frontmatter.js    # Vite 플러그인

src/docs/api/
├── pg/credit-card/
│   └── 01-card-payment.mdx    # frontmatter + 문서 내용

src/components/
└── ApiTestPanel.tsx           # 자동 생성된 apiInfo 사용
```

이 방식으로 완전히 자동화된 MDX frontmatter 파싱을 구현했습니다! 🎉
