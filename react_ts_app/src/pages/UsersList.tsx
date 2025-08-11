import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { users as mockUsers, User } from '../mocks/data'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'

export default function UsersList() {
  const [list, setList] = React.useState<User[]>(mockUsers)

  function handleDelete(id: string) {
    setList((s) => s.filter((u) => u.id !== id))
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">用户管理</Typography>
        <Button variant="contained" component={RouterLink} to="/users/new">新增用户</Button>
      </Stack>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>姓名</TableCell>
            <TableCell>邮箱</TableCell>
            <TableCell>年龄</TableCell>
            <TableCell>操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list.map((u) => (
            <TableRow key={u.id}>
              <TableCell>{u.name}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>{u.age ?? '-'}</TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  <Button size="small" component={RouterLink} to={`/users/${u.id}`}>查看</Button>
                  <Button size="small" color="error" onClick={() => handleDelete(u.id)}>删除</Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}
