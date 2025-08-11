import React from 'react'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'

export default function Dashboard() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4">概览</Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">活动</Typography>
          <Typography>这里放一些统计或图表（示例）</Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">快速链接</Typography>
          <Typography>用户/商品列表，新增按钮等</Typography>
        </Paper>
      </Grid>
    </Grid>
  )
}
