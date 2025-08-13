import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import db from './db.js';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

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

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
