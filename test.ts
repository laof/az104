import fs from 'fs';
import path from 'path';

// 测试函数
async function testFileCreation() {
  try {
    const id = "test001";
    const text = "这是一个测试内容";

    // 确保list文件夹存在
    const listDir = path.join(process.cwd(), 'list');
    if (!fs.existsSync(listDir)) {
      fs.mkdirSync(listDir, { recursive: true });
    }

    // 创建HTML文件内容
    const htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Content ${id}</title>
</head>
<body>
    <h1>ID: ${id}</h1>
    <div class="content">
        <p>${text}</p>
    </div>
</body>
</html>`;

    // 写入文件
    const fileName = `${id}.html`;
    const filePath = path.join(listDir, fileName);
    
    await fs.promises.writeFile(filePath, htmlContent, 'utf8');
    
    console.log(`✅ 文件 ${fileName} 创建成功!`);
    console.log(`📁 文件路径: ${filePath}`);
    
    return true;
  } catch (error) {
    console.error('❌ 创建文件时出错:', error);
    return false;
  }
}

// 运行测试
testFileCreation();