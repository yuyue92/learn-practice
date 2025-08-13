import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import db from './db.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs-extra';

const app = express();
const PORT = 5000;

import { fileURLToPath } from 'url';

// 获取 __filename 和 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// / 确保uploads目录存在
const uploadsDir = path.join(__dirname, 'uploads');
fs.ensureDirSync(uploadsDir);

// 配置multer存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir)
  },
  filename: function (req, file, cb) {
    // 生成唯一文件名：时间戳_原文件名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname)
    const name = path.basename(file.originalname, ext)
    cb(null, name + '_' + uniqueSuffix + ext)
  }
})

// 文件过滤器：只允许图片
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('只允许上传图片文件！'), false)
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
})

app.use(cors());
app.use(bodyParser.json());

// 静态文件服务 - 提供上传的图片访问
app.use('/uploads', express.static(uploadsDir));
/**
 * 1. 查询所有用户
 */
app.get('/users', (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

/**
 * 2. 查询单个用户
 */
app.get('/users/:id', (req, res) => {
  db.get('SELECT * FROM users WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ message: '用户不存在' });
    res.json(row);
  });
});

/**
 * 3. 新增用户
 */
app.post('/users', (req, res) => {
  const { name, age, email, createdBy } = req.body;
  if (!name) return res.status(400).json({ message: 'name 必填' });

  const createdAt = new Date().toISOString();
  const sql = `INSERT INTO users (name, age, email, createdBy, createdAt) VALUES (?, ?, ?, ?, ?)`;
  db.run(sql, [name, age, email, createdBy, createdAt], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, name, age, email, createdBy, createdAt });
  });
});

/**
 * 4. 更新用户
 */
app.put('/users/:id', (req, res) => {
  const { name, age, email, createdBy } = req.body;
  const sql = `UPDATE users SET name = ?, age = ?, email = ?, createdBy = ? WHERE id = ?`;
  db.run(sql, [name, age, email, createdBy, req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ message: '用户不存在' });
    res.json({ id: req.params.id, name, age, email, createdBy });
  });
});

/**
 * 5. 删除用户
 */
app.delete('/users/:id', (req, res) => {
  db.run(`DELETE FROM users WHERE id = ?`, [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ message: '用户不存在' });
    res.json({ message: '删除成功' });
  });
});

// 文件上传相关API
app.post('/api/upload/avatar', upload.single('avatar'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: '请选择要上传的文件' });
      }
  
      const fileUrl = `/uploads/${req.file.filename}`;
      
      res.json({
        message: '头像上传成功',
        file: {
          originalName: req.file.originalname,
          filename: req.file.filename,
          size: req.file.size,
          url: fileUrl
        }
      });
    } catch (error) {
      res.status(500).json({ message: '文件上传失败', error: error.message });
    }
  });
  
  // 通用文件上传（支持多文件）
  app.post('/api/upload/files', upload.array('files', 10), (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: '请选择要上传的文件' });
      }
  
      const uploadedFiles = req.files.map(file => ({
        originalName: file.originalname,
        filename: file.filename,
        size: file.size,
        url: `/uploads/${file.filename}`
      }));
  
      res.json({
        message: `成功上传 ${req.files.length} 个文件`,
        files: uploadedFiles
      });
    } catch (error) {
      res.status(500).json({ message: '文件上传失败', error: error.message });
    }
  });
  
  // 删除文件
  app.delete('/api/upload/:filename', async (req, res) => {
    try {
      const { filename } = req.params;
      const filePath = path.join(uploadsDir, filename);
      
      if (await fs.pathExists(filePath)) {
        await fs.remove(filePath);
        res.json({ message: '文件删除成功' });
      } else {
        res.status(404).json({ message: '文件不存在' });
      }
    } catch (error) {
      res.status(500).json({ message: '文件删除失败', error: error.message });
    }
  });
  
  // 更新用户头像
  app.put('/api/users/:id/avatar', (req, res) => {
    const { id } = req.params;
    const { avatarUrl } = req.body;
    
    const userIndex = users.findIndex(u => u.id === parseInt(id));
    if (userIndex === -1) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    users[userIndex].avatar = avatarUrl;
    
    res.json({
      message: '头像更新成功',
      user: users[userIndex]
    });
  });
  
  // 获取文件列表
  app.get('/api/files', async (req, res) => {
    try {
      const files = await fs.readdir(uploadsDir);
      const fileList = await Promise.all(
        files.map(async (filename) => {
          const filePath = path.join(uploadsDir, filename);
          const stats = await fs.stat(filePath);
          return {
            filename,
            size: stats.size,
            uploadTime: stats.mtime,
            url: `/uploads/${filename}`
          };
        })
      );
      
      res.json({
        files: fileList.sort((a, b) => new Date(b.uploadTime) - new Date(a.uploadTime))
      });
    } catch (error) {
      res.status(500).json({ message: '获取文件列表失败', error: error.message });
    }
  });
  
  // 错误处理中间件
  app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: '文件大小超过限制(5MB)' });
      }
      if (error.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({ message: '文件数量超过限制' });
      }
    }
    
    if (error.message === '只允许上传图片文件！') {
      return res.status(400).json({ message: error.message });
    }
    
    res.status(500).json({ message: '服务器错误', error: error.message });
  });

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
