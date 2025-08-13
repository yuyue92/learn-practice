import { Link as RouterLink, useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'

const items = [
  { text: '首页', path: '/', icon: <DashboardIcon /> },
  { text: '用户管理', path: '/users', icon: <PeopleIcon /> },
  { text: '商品管理', path: '/products', icon: <ShoppingBagIcon /> },
  { text: '数据管理', path: '/usersPage', icon: <PeopleIcon /> },
]

type Props = {
  open: boolean
  onClose?: () => void
  variant?: 'permanent' | 'temporary'
}

export default function SideNav({ open, onClose, variant = 'permanent' }: Props) {
  const location = useLocation()

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box' }
      }}
    >
      <Box sx={{ mt: 2 }} />
      <List>
        {items.map((it) => (
          <ListItem key={it.text} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={it.path}
              selected={location.pathname === it.path}
            >
              <ListItemIcon>{it.icon}</ListItemIcon>
              <ListItemText primary={it.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
}
