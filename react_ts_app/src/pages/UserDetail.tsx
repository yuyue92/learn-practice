import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { users as mockUsers } from '../mocks/data'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'

export default function UserDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const user = mockUsers.find((u) => u.id === id)

  if (!user) {
    return <Typography>未找到用户</Typography>
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">用户详情</Typography>
        <Button onClick={() => navigate(-1)}>返回</Button>
      </Stack>

      <Typography><strong>姓名：</strong>{user.name}</Typography>
      <Typography><strong>邮箱：</strong>{user.email}</Typography>
      <Typography><strong>年龄：</strong>{user.age ?? '-'}</Typography>
    </Paper>
  )
}
