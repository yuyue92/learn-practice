// src/utils/theme.js
export const themes = {
    light: {
      '--primary-color': '#42b983',
      '--secondary-color': '#34495e',
      '--background-color': '#ffffff',
      '--text-color': '#2c3e50',
      '--border-color': '#eaeaea',
      '--sidebar-bg': '#34495e',
      '--sidebar-text': '#ecf0f1',
      '--topbar-bg': '#2c3e50',
      '--topbar-text': '#ffffff'
    },
    dark: {
      '--primary-color': '#42b983',
      '--secondary-color': '#1a1a1a',
      '--background-color': '#676767',
      '--text-color': '#f5f5f5',
      '--border-color': '#333333',
      '--sidebar-bg': '#1a1a1a',
      '--sidebar-text': '#f5f5f5',
      '--topbar-bg': '#121212',
      '--topbar-text': '#ffffff'
    }
  }
  
  export function applyTheme(themeName) {
    const theme = themes[themeName] || themes.light
    Object.keys(theme).forEach(key => {
      document.documentElement.style.setProperty(key, theme[key])
    })
    localStorage.setItem('theme', themeName)
  }
  
  export function getSavedTheme() {
    return localStorage.getItem('theme') || 'light'
  }