import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3001;

// 静态资源服务，将img目录暴露出来
app.use('/img', express.static(path.join(process.cwd(), 'img')));
app.use('/css', express.static(path.join(process.cwd(), 'css')));
app.use('/js', express.static(path.join(process.cwd(), 'js')));

// 访问 /x-y，拼接list目录下x到y的html内容
app.get('/:range', async (req: Request, res: Response) => {
    const { range } = req.params;
    // 解析x-y
    const match = /^([0-9]+)-([0-9]+)$/.exec(range);
    if (!match) {
        return res.status(400).send('range参数格式错误，应为x-y');
    }
    const x = parseInt(match[1], 10);
    const y = parseInt(match[2], 10);
    if (isNaN(x) || isNaN(y) || x > y) {
        return res.status(400).send('range参数无效');
    }
    const listDir = path.join(process.cwd(), 'list');
    let htmls: string[] = [];
    for (let i = x; i <= y; i++) {
        const filePath = path.join(listDir, `${i}.html`);
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            htmls.push(`<div class="item" data-index="${i}"><h4 class="lova-title">Q ${i}</h4>${content}</div>`);
        }
    }
    res.send(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>.</title><link rel="stylesheet" href="css/css.css"></head><body><div id="all-html">${htmls.join('')}</div><script src="js/script.js"></script></body></html>`);
});

app.listen(PORT, () => {
    console.log(`Page server running at http://localhost:${PORT}`);
});