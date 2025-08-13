import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Paper,
  Stack, Typography,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
interface User {
    id?: number;
    name: string;
    age: number;
    email: string;
    createdBy: string;
    createdAt?: string;
  }
  

const API_BASE = 'http://localhost:5000'; // Express API 地址

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // 表单数据
  const [formData, setFormData] = useState<User>({
    name: '',
    age: 0,
    email: '',
    createdBy: '',
  });

  // 获取用户数据
  const fetchUsers = async () => {
    const res = await fetch(`${API_BASE}/users`);
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 打开新增
  const handleAdd = () => {
    setEditingUser(null);
    setFormData({ name: '', age: 0, email: '', createdBy: '' });
    setOpen(true);
  };

  // 打开编辑
  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData(user);
    setOpen(true);
  };

  // 删除
  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!window.confirm('确定要删除该用户吗？')) return;
    await fetch(`${API_BASE}/users/${id}`, { method: 'DELETE' });
    fetchUsers();
  };

  // 提交新增/更新
  const handleSubmit = async () => {
    if (editingUser?.id) {
      // 更新
      await fetch(`${API_BASE}/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    } else {
      // 新增
      await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    }
    setOpen(false);
    fetchUsers();
  };

  return (
    <Box p={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">用户管理</Typography>
            <Button variant="contained" onClick={handleAdd}>新增用户</Button>
        </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>姓名</TableCell>
              <TableCell>年龄</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>创建人</TableCell>
              <TableCell>创建时间</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.age}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.createdBy}</TableCell>
                <TableCell>{user.createdAt}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(user)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(user.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 弹窗 */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editingUser ? '编辑用户' : '新增用户'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="姓名"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="年龄"
            type="number"
            fullWidth
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="创建人"
            fullWidth
            value={formData.createdBy}
            onChange={(e) => setFormData({ ...formData, createdBy: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>取消</Button>
          <Button variant="contained" onClick={handleSubmit}>保存</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
