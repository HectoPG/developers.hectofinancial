const fs = require('fs');
const path = require('path');

// MDX를 Markdown으로 변환하는 함수 (간단한 정규식 기반)
function convertMdxToMarkdown(mdxContent, outputPath) {
  try {
    let markdownContent = mdxContent;
    
    // import 문 제거
    markdownContent = markdownContent.replace(/^import\s+.*$/gm, '');
    
    // export 문 제거
    markdownContent = markdownContent.replace(/^export\s+.*$/gm, '');
    
    // JSX 컴포넌트 제거 (멀티라인 지원)
    // ParameterCard, ConfigCard 등의 컴포넌트 제거
    markdownContent = markdownContent.replace(/<(ParameterCard|ConfigCard|FeatureGrid|NextSteps|TestScenario|ErrorGuide|DocumentFooter|EnhancedCodeBlock)[^>]*>[\s\S]*?<\/\1>/g, '');
    
    // 자체 닫는 태그 제거
    markdownContent = markdownContent.replace(/<(ParameterCard|ConfigCard|FeatureGrid|NextSteps|TestScenario|ErrorGuide|DocumentFooter|EnhancedCodeBlock)[^>]*\/>/g, '');
    
    // 일반적인 JSX 태그 제거 (단일 라인)
    markdownContent = markdownContent.replace(/<[^>]*>/g, '');
    
    // 빈 줄 정리 (3개 이상의 연속 빈 줄을 2개로)
    markdownContent = markdownContent.replace(/\n\s*\n\s*\n+/g, '\n\n');
    
    // 파일 작성
    fs.writeFileSync(outputPath, markdownContent.trim(), 'utf8');
    console.log(`✅ Generated: ${outputPath}`);
    
  } catch (error) {
    console.error(`❌ Error converting ${outputPath}:`, error.message);
  }
}

// 디렉토리에서 MDX 파일들을 찾아서 변환하는 함수
function processDirectory(srcDir, outputDir) {
  // 출력 디렉토리 생성
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const items = fs.readdirSync(srcDir);
  
  for (const item of items) {
    const srcPath = path.join(srcDir, item);
    const stat = fs.statSync(srcPath);
    
    if (stat.isDirectory()) {
      // 하위 디렉토리 처리
      const outputSubDir = path.join(outputDir, item);
      processDirectory(srcPath, outputSubDir);
    } else if (item.endsWith('.mdx')) {
      // MDX 파일 변환
      const content = fs.readFileSync(srcPath, 'utf8');
      const outputFileName = item.replace('.mdx', '.md');
      const outputPath = path.join(outputDir, outputFileName);
      convertMdxToMarkdown(content, outputPath);
    }
  }
}

// 메인 실행 함수
function generateMarkdownFiles() {
  console.log('🚀 Starting MDX to Markdown conversion...');
  
  const srcDocsDir = path.join(__dirname, '..', 'src', 'docs');
  const outputDir = path.join(__dirname, '..', 'public');
  
  try {
    processDirectory(srcDocsDir, outputDir);
    console.log('✅ All MDX files converted to Markdown successfully!');
    
    // 생성된 파일 목록 출력
    const generatedFiles = getAllMarkdownFiles(outputDir);
    console.log('\n📁 Generated Markdown files:');
    generatedFiles.forEach(file => {
      console.log(`  - ${file}`);
    });
    
  } catch (error) {
    console.error('❌ Error during conversion:', error);
    process.exit(1);
  }
}

// 재귀적으로 모든 Markdown 파일 경로를 가져오는 함수
function getAllMarkdownFiles(dir, basePath = '') {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...getAllMarkdownFiles(fullPath, path.join(basePath, item)));
    } else if (item.endsWith('.md')) {
      files.push(path.join(basePath, item));
    }
  }
  
  return files;
}

// 스크립트 실행
if (require.main === module) {
  generateMarkdownFiles();
}

module.exports = { generateMarkdownFiles, convertMdxToMarkdown };
