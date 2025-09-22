# Az104 Backend Service

https://laof.github.io/az104/view/101-200

一个用 TypeScript 编写的 Node.js 后端服务，提供文件创建API。

## 功能

- POST `/add` 接口：接收 `id` 和 `text` 参数
- 将内容写入到 `list` 文件夹下的 `${id}.html` 文件
- 返回操作成功状态

## 项目结构

```
az104/
├── main.ts                 # 主服务器文件
├── test.ts                 # 测试脚本
├── package.json            # 项目配置
├── tsconfig.json           # TypeScript配置
├── dist/                   # 编译后的JavaScript文件
│   └── main.js
└── list/                   # 生成的HTML文件存储目录
    └── *.html
```

## 安装依赖

```bash
npm install
```

## 运行方式

### 1. 开发模式（TypeScript直接运行）
```bash
npm run dev
```

### 2. 编译并运行
```bash
npm run build
npm start
```

### 3. 直接运行编译后的文件
```bash
npx tsc
node dist/main.js
```

## API使用示例

### 请求格式
```bash
curl -X POST http://localhost:3000/add \
  -H "Content-Type: application/json" \
  -d '{"id": "test001", "text": "这是测试内容"}'
```

### 成功响应
```json
{
  "success": true,
  "message": "File test001.html created successfully",
  "filePath": "/path/to/list/test001.html"
}
```

### 错误响应
```json
{
  "success": false,
  "message": "id and text are required"
}
```

## 生成的HTML文件格式

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Content {id}</title>
</head>
<body>
    <h1>ID: {id}</h1>
    <div class="content">
        <p>{text}</p>
    </div>
</body>
</html>
```

## 测试

运行测试脚本来验证文件创建功能：
```bash
npx ts-node test.ts
```

## 注意事项

1. 服务器默认运行在端口 3000
2. `list` 文件夹会自动创建
3. 如果同名文件存在，会被覆盖
4. 支持中文内容# az104
