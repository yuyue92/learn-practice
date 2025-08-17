const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  getData: () => ipcRenderer.invoke('get-data'),
  addItem: (item) => ipcRenderer.invoke('add-item', item),
  updateItem: (item) => ipcRenderer.invoke('update-item', item),
  deleteItem: (id) => ipcRenderer.invoke('delete-item', id),
  exportData: () => ipcRenderer.invoke('export-data'),
  importData: () => ipcRenderer.invoke('import-data')
})