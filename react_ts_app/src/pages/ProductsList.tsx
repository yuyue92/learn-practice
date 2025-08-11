import React from 'react'
import { products as mockProducts, Product } from '../mocks/data'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { Link as RouterLink } from 'react-router-dom'

export default function ProductsList() {
  const [list, setList] = React.useState<Product[]>(mockProducts)

  function decStock(id: string) {
    setList((s) => s.map((p) => p.id === id ? { ...p, stock: p.stock - 1 } : p))
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">商品管理</Typography>
        <Button variant="contained" component={RouterLink} to="/products/new">新增商品</Button>
      </Stack>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>名称</TableCell>
            <TableCell>价格</TableCell>
            <TableCell>库存</TableCell>
            <TableCell>操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.name}</TableCell>
              <TableCell>¥{p.price}</TableCell>
              <TableCell>{p.stock}</TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  <Button size="small" component={RouterLink} to={`/products/${p.id}`}>查看</Button>
                  <Button size="small" onClick={() => decStock(p.id)}>售出 1 件</Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}
