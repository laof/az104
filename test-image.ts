import fs from 'fs';
import path from 'path';

// 测试图片下载功能
async function testImageDownload() {
  try {
    const testData = {
      id: 0,
      text: "测试内容，包含图片下载",
      img: [
        {
          name: "test-image-1",
          src: "https://via.placeholder.com/300x200/FF5733/FFFFFF?text=Image1"
        },
        {
          name: "test-image-2", 
          src: "https://via.placeholder.com/400x300/33FF57/000000?text=Image2"
        }
      ]
    };

    console.log('发送测试请求...');
    
    const response = await fetch('http://localhost:3000/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    console.log('响应结果:', result);

    if (result.success) {
      console.log('✅ 测试成功!');
      console.log(`📁 创建文件: ${result.filePath}`);
      console.log(`🖼️  下载图片数量: ${result.imageCount}`);
      console.log('📸 下载的图片:', result.downloadedImages);
    } else {
      console.log('❌ 测试失败:', result.message);
    }

  } catch (error) {
    console.error('❌ 测试出错:', error);
  }
}

// 测试空图片数组
async function testEmptyImageArray() {
  try {
    const testData = {
      id: 1,
      text: "测试内容，空图片数组",
      img: []
    };

    console.log('\n发送空图片数组测试请求...');
    
    const response = await fetch('http://localhost:3000/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    console.log('空数组响应结果:', result);

  } catch (error) {
    console.error('❌ 空数组测试出错:', error);
  }
}

// 运行测试
console.log('开始测试图片下载功能...');
testImageDownload().then(() => {
  return testEmptyImageArray();
});