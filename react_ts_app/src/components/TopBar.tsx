import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'

type Props = { onMenuToggle?: () => void }

export default function TopBar({ onMenuToggle }: Props) {
  return (
    <AppBar position="fixed" color="primary">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          onClick={onMenuToggle}
          sx={{ mr: 2, display: { md: 'none' } }} // 中屏及以上隐藏按钮
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          管理后台示例
        </Typography>
        <Typography variant="body2">当前用户: yue</Typography>
      </Toolbar>
    </AppBar>
  )
}
