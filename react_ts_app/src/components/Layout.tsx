import React from 'react'
import Box from '@mui/material/Box'
import { Outlet } from 'react-router-dom'
import TopBar from './TopBar'
import SideNav from './SideNav'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

export default function Layout() {
  const theme = useTheme()
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'))
  const [open, setOpen] = React.useState<boolean>(isMdUp)

  React.useEffect(() => setOpen(isMdUp), [isMdUp])

  const drawerWidth = 240

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <TopBar onMenuToggle={() => setOpen((s) => !s)} />
      <SideNav
        open={open}
        variant={isMdUp ? 'permanent' : 'temporary'}
        onClose={() => setOpen(false)}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          width: { md: `calc(100% - ${open && isMdUp ? drawerWidth : 0}px)` },
          overflowX: 'hidden',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}
