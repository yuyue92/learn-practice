import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { products as mockProducts } from '../mocks/data'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const product = mockProducts.find((p) => p.id === id)

  if (!product) {
    return <Typography>未找到商品</Typography>
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">商品详情</Typography>
        <Button onClick={() => navigate(-1)}>返回</Button>
      </Stack>

      <Typography><strong>名称：</strong>{product.name}</Typography>
      <Typography><strong>价格：</strong>¥{product.price}</Typography>
      <Typography><strong>库存：</strong>{product.stock}</Typography>
    </Paper>
  )
}
