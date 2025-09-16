const fs = require('fs');
const path = require('path');

// src/docs 디렉토리에서 모든 .mdx 파일을 찾아서 public/ 디렉토리에 .md 파일로 변환
function convertMdxToMarkdown() {
  const srcDocsDir = path.join(__dirname, '..', 'src', 'docs');
  const publicDir = path.join(__dirname, '..', 'public');
  
  // public 디렉토리가 없으면 생성
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  function processDirectory(dir, relativePath = '') {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        // 디렉토리인 경우 재귀적으로 처리
        const newRelativePath = relativePath ? path.join(relativePath, item) : item;
        processDirectory(itemPath, newRelativePath);
      } else if (item.endsWith('.mdx')) {
        // .mdx 파일인 경우 변환
        convertMdxFile(itemPath, relativePath);
      }
    });
  }
  
  function convertMdxFile(filePath, relativePath) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // MDX 파일의 frontmatter 제거 (---로 시작하고 끝나는 부분)
      content = content.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '');
      
      // import 문들 제거
      content = content.replace(/^import\s+.*?from\s+['"][^'"]+['"];?\s*$/gm, '');
      
      // export 문들 제거
      content = content.replace(/^export\s+.*?;?\s*$/gm, '');
      
      // JSX 컴포넌트들을 제거하되 내용은 유지
      // ParameterCard, ConfigCard, FeatureGrid 등의 컴포넌트 내용 추출
      content = content.replace(/<ParameterCard[^>]*>([\s\S]*?)<\/ParameterCard>/g, (match, innerContent) => {
        // ParameterCard 내부의 title, type, description 등을 추출해서 일반 텍스트로 변환
        return extractComponentContent(innerContent);
      });
      
      content = content.replace(/<ConfigCard[^>]*>([\s\S]*?)<\/ConfigCard>/g, (match, innerContent) => {
        return extractComponentContent(innerContent);
      });
      
      content = content.replace(/<FeatureGrid[^>]*>([\s\S]*?)<\/FeatureGrid>/g, (match, innerContent) => {
        return extractComponentContent(innerContent);
      });
      
      content = content.replace(/<TestScenario[^>]*>([\s\S]*?)<\/TestScenario>/g, (match, innerContent) => {
        return extractComponentContent(innerContent);
      });
      
      content = content.replace(/<ErrorGuide[^>]*>([\s\S]*?)<\/ErrorGuide>/g, (match, innerContent) => {
        return extractComponentContent(innerContent);
      });
      
      content = content.replace(/<NextSteps[^>]*>([\s\S]*?)<\/NextSteps>/g, (match, innerContent) => {
        return extractComponentContent(innerContent);
      });
      
      content = content.replace(/<DocumentFooter[^>]*>([\s\S]*?)<\/DocumentFooter>/g, (match, innerContent) => {
        return extractComponentContent(innerContent);
      });
      
      // 남은 JSX 태그들 제거 (단순한 태그들)
      content = content.replace(/<[^>]+>/g, '');
      
      // 파일명을 .md로 변경
      const fileName = path.basename(filePath, '.mdx') + '.md';
      
      // public 디렉토리에 같은 구조로 저장
      const targetDir = path.join(publicDir, relativePath);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      
      const targetPath = path.join(targetDir, fileName);
      fs.writeFileSync(targetPath, content, 'utf8');
      
      console.log(`변환 완료: ${filePath} -> ${targetPath}`);
      
    } catch (error) {
      console.error(`파일 변환 중 오류 발생: ${filePath}`, error.message);
    }
  }
  
  // 컴포넌트 내용을 일반 텍스트로 추출하는 함수
  function extractComponentContent(jsxContent) {
    // JSX 내용에서 텍스트만 추출
    let text = jsxContent;
    
    // JSX 태그들 제거
    text = text.replace(/<[^>]+>/g, '');
    
    // 중괄호로 감싸진 JavaScript 표현식 제거
    text = text.replace(/\{[^}]*\}/g, '');
    
    // 여러 공백을 하나로 정리
    text = text.replace(/\s+/g, ' ').trim();
    
    return text;
  }
  
  console.log('MDX to Markdown 변환 시작...');
  processDirectory(srcDocsDir);
  console.log('변환 완료!');
}

// 스크립트 실행
convertMdxToMarkdown();
