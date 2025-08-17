import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  handleReadfile: (fpath)=> ipcRenderer.invoke('read-file', fpath),
  handleSavefile: (content)=> ipcRenderer.invoke('save-file', content),
  // 窗口控制
  minimizeWindow: () => ipcRenderer.invoke('window:minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window:maximize'),
  closeWindow: () => ipcRenderer.invoke('window:close'),
  hideWindow: () => ipcRenderer.invoke('window:hide'),
  setWindowPosition: (x, y) => ipcRenderer.invoke('window:setPosition', x, y),
  getWindowPosition: () => ipcRenderer.invoke('window:getPosition'),
  isWindowMaximized: () => ipcRenderer.invoke('window:isMaximized'),
  showMessageBox: (options) => ipcRenderer.invoke('show-message-box', options),
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}

// const { contextBridge, ipcRenderer } = require('electron')

/* contextBridge.exposeInMainWorld('electronAPI', {
  sendToSecondary: (message) => ipcRenderer.send('send-to-secondary', message),
  sendToMain: (message) => ipcRenderer.send('send-to-main', message),
  onMessageFromMain: (callback) => ipcRenderer.on('message-from-main', callback),
  onMessageFromSecondary: (callback) => ipcRenderer.on('message-from-secondary', callback),
  handleReadfile: (content1)=> ipcRenderer.invoke('read-file', content1),
  handleSavefile: (content)=> ipcRenderer.invoke('save-file', content),
  execCmd: (cmd) => ipcRenderer.invoke('execcmd', cmd),
  execute: (cmd, args, options) => ipcRenderer.invoke('execute-command', { cmd, args, options }),
  getServerStatus: () => ipcRenderer.invoke('get-server-status')
}) */