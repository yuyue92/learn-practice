import { app, shell, BrowserWindow, ipcMain, globalShortcut, Tray, Menu, dialog, screen } from 'electron'
import path, { join } from 'path'
const fs = require('fs');
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/apps.png?asset'
import app1icon from '../../resources/app1.png?asset'
let mainWindow;
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })
  // 设置任务栏图标（Windows）
  if (process.platform === 'win32') {
      mainWindow.setIcon(icon)
  }
  
  //设置托盘图标
  const tray = new Tray(app1icon);
  tray.setToolTip('myVue3App');
  const contextMenu = Menu.buildFromTemplate([
    { label: '显示', click: () => { mainWindow.show() } },
    { label: '退出', click: () => { app.quit() } }
  ])
  tray.setContextMenu(contextMenu);

  //读写文件操作的
  ipcMain.handle('read-file', async(event, msg) =>{
    try {
      const res = await openAndReadFile(msg);
      return res;
    } catch (error) {
      console.error('readerr: ', error)
      return error.message;
    }
  })
  ipcMain.handle('save-file', async(event, content) =>{
    try {
      const savePath = await saveFile(content);
      return {success: true, path: savePath}
    } catch (error) {
      console.error('saveerr: ', error)
      return { success: false, error: error.message };
    }
  })
  // 监听来自渲染进程的消息并弹出对话框
  ipcMain.handle('show-message-box', async (event, options) => {
    const result = await dialog.showMessageBox(mainWindow, options);
    return result; // 返回结果给渲染进程
  });
  
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
  // ✅ 注册全局快捷键：Ctrl+Shift+I 打开 DevTools
  globalShortcut.register('F12', () => {
    if (mainWindow) {
      const isOpen = mainWindow.webContents.isDevToolsOpened();
      isOpen ? mainWindow.webContents.closeDevTools() : mainWindow.webContents.openDevTools();
    }
  });

  // ✅ 注册全局快捷键：Ctrl+R 强制刷新
  globalShortcut.register('Control+R', () => {
    if (mainWindow) {
      mainWindow.webContents.reloadIgnoringCache();
    }
  });
  
}

// 窗口控制方法
function setupWindowControls() {
  // 最小化窗口
  ipcMain.handle('window:minimize', () => {
    if (mainWindow) mainWindow.minimize()
  })

  // 最大化/还原窗口
  ipcMain.handle('window:maximize', () => {
    if (mainWindow) {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize()
      } else {
        mainWindow.maximize()
      }
    }
  })

  // 关闭窗口
  ipcMain.handle('window:close', () => {
    if (mainWindow) mainWindow.close()
  })

  // 隐藏窗口
  ipcMain.handle('window:hide', () => {
    if (mainWindow) mainWindow.hide()
  })
  const boundsX = screen.getPrimaryDisplay().bounds.width;
  const boundsY = screen.getPrimaryDisplay().bounds.height;
  console.log('width&&height==>:', boundsX,  boundsY );

  // 设置窗口位置
  ipcMain.handle('window:setPosition', (_, x, y) => {
    if((Math.abs(x) > boundsX) || (Math.abs(y) > boundsY)) {
      return dialog.showMessageBox(mainWindow, {
        type: 'info', // 类型: "none", "info", "error", "question", "warning"
        title: '提示信息',
        message: `设置位置x: ${x}, y: ${y}超出视口范围!`,
        buttons: ['确定'],
        defaultId: 0
      });
    } else {
      if (mainWindow) mainWindow.setPosition(x, y)
    }
  })

  // 获取窗口位置
  ipcMain.handle('window:getPosition', async () => {
    if (mainWindow) {
      const position = mainWindow.getPosition()
      return { x: position[0], y: position[1] }
    }
    return { x: 0, y: 0 }
  })

  // 检查窗口是否最大化
  ipcMain.handle('window:isMaximized', () => {
    return mainWindow ? mainWindow.isMaximized() : false
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow();
  setupWindowControls();
  

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
// 清理快捷键
app.on('will-quit', () => {
  console.log('========app-quit==========')
  globalShortcut.unregisterAll();
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
/**
 * 打开文件选择对话框并读取文件内容
 * @param {BrowserWindow} window - 关联的浏览器窗口
 * @param {Object} [options] - 对话框选项
 * @returns {Promise<{path: string, content: string}>}
 */
async function openAndReadFile(msg, options = {}) {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: '选择文件',
    properties: ['openFile'],
    filters: [
      { name: '文本文件', extensions: ['txt', 'json', 'md'] },
      { name: '所有文件', extensions: ['*'] }
    ],
    ...options
  });

  if (canceled || filePaths.length === 0) {
    throw new Error('用户取消了文件选择');
  }

  const filePath = filePaths[0];
  const content = await fs.promises.readFile(filePath, 'utf8');
  
  return { path: filePath, content };
}

/**
 * 打开文件保存对话框并写入内容
 * @param {BrowserWindow} window - 关联的浏览器窗口
 * @param {string} content - 要保存的内容
 * @param {Object} [options] - 对话框选项
 * @returns {Promise<string>} - 返回保存的文件路径
 */
async function saveFile( content, options = {}) {
  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
    title: '保存文件',
    defaultPath: path.join(app.getPath('documents'), 'untitled.txt'),
    filters: [
      { name: '文本文件', extensions: ['txt'] },
      { name: 'Markdown', extensions: ['md'] },
      { name: 'JSON', extensions: ['json'] }
    ],
    ...options
  });

  if (canceled || !filePath) {
    throw new Error('用户取消了保存操作');
  }
  await fs.promises.writeFile(filePath, content, 'utf8');
  return filePath;
}