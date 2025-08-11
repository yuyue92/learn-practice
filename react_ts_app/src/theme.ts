import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    background: {
      default: '#f5f5f5', // 全局浅灰
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    fontSize: 14,
  },
  components: {
    MuiAppBar: {
      defaultProps: { elevation: 1 },
    },
  },
})

export default theme
