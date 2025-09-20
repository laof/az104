import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { URL } from 'url';

const app = express();
const PORT = 3000;

// 图片下载函数
async function downloadImage(url: string, fileName: string, imgDir: string): Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            const parsedUrl = new URL(url);
            const client = parsedUrl.protocol === 'https:' ? https : http;

            // 获取文件扩展名
            const urlPath = parsedUrl.pathname;
            const ext = path.extname(urlPath) || '.jpg'; // 默认为.jpg
            const fullFileName = `${fileName}${ext}`;
            const filePath = path.join(imgDir, fullFileName);

            const file = fs.createWriteStream(filePath);

            client.get(url, (response) => {
                if (response.statusCode !== 200) {
                    reject(new Error(`下载失败，状态码: ${response.statusCode}`));
                    return;
                }

                response.pipe(file);

                file.on('finish', () => {
                    file.close();
                    resolve(filePath);
                });

                file.on('error', (err) => {
                    fs.unlink(filePath, () => { }); // 删除不完整的文件
                    reject(err);
                });
            }).on('error', (err) => {
                reject(err);
            });
        } catch (error) {
            reject(error);
        }
    });
}

// 定义图片对象接口
interface ImageObject {
    name: string;
    src: string;
}

// CORS中间件 - 允许跨域请求
app.use((req: Request, res: Response, next) => {
    // 允许所有域名访问
    res.header('Access-Control-Allow-Origin', '*');
    // 允许的请求头
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    // 允许的HTTP方法
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    // 允许浏览器发送Cookie
    res.header('Access-Control-Allow-Credentials', 'true');

    // 处理预检请求
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// POST /add 接口
app.post('/add', async (req: Request, res: Response) => {
    try {
        const { id, text, img } = req.body;

        // 添加调试日志
        console.log('解析出的参数 - id:', id, 'img数组长度:', img?.length || 0);

        // 验证参数 - 使用更严格的验证，允许id为0
        if (id === undefined || id === null || id === '' || !text) {
            console.log('参数验证失败 - id:', id, 'text:', text);
            return res.status(400).json({
                success: false,
                message: 'id and text are required'
            });
        }

        // 验证img参数格式
        if (img && (!Array.isArray(img) || img.some((item: any) => !item.name || !item.src))) {
            return res.status(400).json({
                success: false,
                message: 'img must be an array of objects with name and src properties'
            });
        }

        // 确保list文件夹存在
        const listDir = path.join(process.cwd(), 'list');
        if (!fs.existsSync(listDir)) {
            fs.mkdirSync(listDir, { recursive: true });
        }

        // 确保img文件夹存在
        const imgDir = path.join(process.cwd(), 'img');
        if (!fs.existsSync(imgDir)) {
            fs.mkdirSync(imgDir, { recursive: true });
        }

        // 下载图片（如果有的话）
        let downloadedImages: string[] = [];
        if (img && Array.isArray(img) && img.length > 0) {
            console.log(`${id}: 开始下载 ${img.length} 张图片...`);

            try {
                const downloadPromises = img.map((imageObj: ImageObject) =>
                    downloadImage(imageObj.src, imageObj.name, imgDir)
                );

                downloadedImages = await Promise.all(downloadPromises);
                console.log(id + ': 所有图片下载完成:', downloadedImages.length);
            } catch (downloadError) {
                console.error(id + ': 图片下载失败:', downloadError);
                return res.status(500).json({
                    success: false,
                    message: `图片下载失败: ${downloadError}`
                });
            }
        }

        // 写入文件
        const fileName = `${id}.html`;
        const filePath = path.join(listDir, fileName);

        await fs.promises.writeFile(filePath, text, 'utf8');

        // 返回成功响应
        res.json({
            success: true,
            message: `File ${fileName} created successfully`,
            filePath: filePath,
            downloadedImages: downloadedImages,
            imageCount: downloadedImages.length
        });

    } catch (error) {
        console.error('Error writing file:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`POST endpoint available at: http://localhost:${PORT}/add`);
});