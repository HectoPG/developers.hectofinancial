const fs = require('fs');
const filePath = 'src/components/ApiTestPanel.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// URL import 방식으로 수정
content = content.replace(
  /const content = await \(modules\[modulePath\] as \(\) => Promise<string>\)\(\);\s*console\.log\('ApiTestPanel - Content type:', typeof content\);\s*console\.log\('ApiTestPanel - Content preview:', content\.substring\(0, 500\)\);/,
  `const fileUrl = await (modules[modulePath] as () => Promise<string>)();
          console.log('ApiTestPanel - File URL:', fileUrl);
          
          // URL로 실제 파일 내용 fetch
          const response = await fetch(fileUrl);
          if (!response.ok) {
            throw new Error(\`Failed to fetch file: \${response.status}\`);
          }
          
          const content = await response.text();
          console.log('ApiTestPanel - Content type:', typeof content);
          console.log('ApiTestPanel - Content preview:', content.substring(0, 500));`
);

fs.writeFileSync(filePath, content);
console.log('File updated successfully');
