import sqlite3pkg from 'sqlite3';
const sqlite3 = sqlite3pkg.verbose();

import path from 'path';
import { fileURLToPath } from 'url';

// __dirname 替代写法
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'), (err) => {
  if (err) {
    console.error('数据库连接失败:', err.message);
  } else {
    console.log('SQLite 数据库连接成功');
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      age INTEGER,
      email TEXT,
      createdBy TEXT,
      createdAt TEXT
    )
  `);
});

export default db;
