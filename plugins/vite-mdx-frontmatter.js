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
  prodUrl: ${JSON.stringify(frontmatter.prodUrl || '')},
  contentType: ${JSON.stringify(frontmatter.contentType || 'application/x-www-form-urlencoded')}
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
