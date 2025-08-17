const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs')

// 数据文件路径
const dataPath = path.join(app.getPath('userData'), 'data.json')

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  win.loadFile('index.html')
  // win.webContents.openDevTools() // 开发时打开开发者工具
}

// 初始化数据文件
function initDataFile() {
  if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, JSON.stringify([], null, 2))
  }
}

// 读取数据
function readData() {
  try {
    const data = fs.readFileSync(dataPath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('读取数据失败:', error)
    return []
  }
}

// 保存数据
function saveData(data) {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    console.error('保存数据失败:', error)
    return false
  }
}

// 设置IPC通信
function setupIpcHandlers() {
  // 获取所有数据
  ipcMain.handle('get-data', async () => {
    return readData()
  })

  // 添加新数据
  ipcMain.handle('add-item', async (event, item) => {
    const data = readData()
    item.id = Date.now().toString() // 生成唯一ID
    data.push(item)
    return saveData(data) ? item : null
  })

  // 更新数据
  ipcMain.handle('update-item', async (event, item) => {
    const data = readData()
    const index = data.findIndex(i => i.id === item.id)
    if (index !== -1) {
      data[index] = item
      return saveData(data)
    }
    return false
  })

  // 删除数据
  ipcMain.handle('delete-item', async (event, id) => {
    const data = readData().filter(item => item.id !== id)
    return saveData(data)
  })

  // 导出数据
  ipcMain.handle('export-data', async () => {
    const { filePath } = await dialog.showSaveDialog({
      title: '导出数据',
      defaultPath: 'data-export.json',
      filters: [{ name: 'JSON Files', extensions: ['json'] }]
    })
    
    if (filePath) {
      const data = readData()
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
      return true
    }
    return false
  })

  // 导入数据
  ipcMain.handle('import-data', async () => {
    const { filePaths } = await dialog.showOpenDialog({
      title: '导入数据',
      filters: [{ name: 'JSON Files', extensions: ['json'] }],
      properties: ['openFile']
    })
    
    if (filePaths && filePaths.length > 0) {
      const importedData = JSON.parse(fs.readFileSync(filePaths[0], 'utf8'))
      const currentData = readData()
      
      // 合并数据，避免ID冲突
      const newData = [...currentData]
      importedData.forEach(item => {
        if (!newData.some(i => i.id === item.id)) {
          newData.push(item)
        }
      })
      
      saveData(newData)
      return newData
    }
    return null
  })
}

app.whenReady().then(() => {
  initDataFile()
  setupIpcHandlers()
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})