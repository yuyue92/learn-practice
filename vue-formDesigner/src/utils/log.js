// src/utils/log.js

// 日志配置
const logConfig = {
    appName: 'MyVueApp',      // 应用名称
    version: '1.0.0',         // 应用版本
    env: process.env.NODE_ENV, // 环境
    logServer: 'https://api.yourdomain.com/logs', // 日志服务器地址
    maxQueueSize: 20,         // 最大队列长度
    flushInterval: 10000      // 自动刷新间隔(ms)
  }
  
  // 日志队列
  let logQueue = []
  let flushTimer = null
  
  // 获取用户信息（根据实际项目调整）
  function getUserInfo() {
    // 这里可以从Vuex/Pinia或本地存储获取用户信息
    return {
      userId: localStorage.getItem('userId') || 'anonymous',
      sessionId: sessionStorage.getItem('sessionId') || generateSessionId()
    }
  }
  
  // 生成会话ID
  function generateSessionId() {
    const id = 'sess_' + Math.random().toString(36).substr(2, 9)
    sessionStorage.setItem('sessionId', id)
    return id
  }
  
  // 获取页面信息
  function getPageInfo() {
    return {
      url: window.location.href,
      path: window.location.pathname,
      title: document.title,
      referrer: document.referrer
    }
  }
  
  // 发送日志到服务器
  function sendLogToServer(logData) {
    // 使用navigator.sendBeacon优先
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(logData)], { type: 'application/json' })
      navigator.sendBeacon(logConfig.logServer, blob)
      return true
    }
    
    // 回退方案使用fetch
    fetch(logConfig.logServer, {
      method: 'POST',
      body: JSON.stringify(logData),
      headers: { 'Content-Type': 'application/json' },
      keepalive: true
    }).catch(error => {
      console.error('日志发送失败:', error)
      // 存储失败日志
      storeFailedLog(logData)
    })
  }
  
  // 批量发送日志
  function sendBatchLogs(logs) {
    const batchData = {
      app: logConfig.appName,
      env: logConfig.env,
      version: logConfig.version,
      logs: logs,
      timestamp: new Date().toISOString()
    }
    
    sendLogToServer(batchData)
  }
  
  // 存储失败日志
  function storeFailedLog(log) {
    const failedLogs = JSON.parse(localStorage.getItem('failed_logs') || '[]')
    failedLogs.push(log)
    localStorage.setItem('failed_logs', JSON.stringify(failedLogs))
  }
  
  // 处理日志队列
  function processLogQueue() {
    if (logQueue.length === 0) return
    
    const logsToSend = [...logQueue]
    logQueue = [] // 清空队列
    
    sendBatchLogs(logsToSend)
  }
  
  // 定时刷新日志
  function scheduleFlush() {
    if (flushTimer) clearTimeout(flushTimer)
    
    flushTimer = setTimeout(() => {
      processLogQueue()
      flushTimer = null
    }, logConfig.flushInterval)
  }
  
  // 记录日志
  export function logEvent(eventType, eventData = {}) {
    const logEntry = {
      eventType,
      timestamp: new Date().toISOString(),
      user: getUserInfo(),
      page: getPageInfo(),
      data: eventData
    }
    
    logQueue.push(logEntry)
    
    // 达到最大队列长度立即发送
    if (logQueue.length >= logConfig.maxQueueSize) {
      processLogQueue()
      return
    }
    
    // 安排定时发送
    scheduleFlush()
  }
  
  // 初始化时发送失败的日志
  export function retryFailedLogs() {
    const failedLogs = JSON.parse(localStorage.getItem('failed_logs') || '[]')
    if (failedLogs.length === 0) return
    
    sendBatchLogs(failedLogs).then(() => {
      localStorage.removeItem('failed_logs')
    }).catch(error => {
      console.error('重试失败日志发送失败:', error)
    })
  }
  
  // 页面离开时发送剩余日志
  export function setupPageUnloadHandler() {
    window.addEventListener('beforeunload', () => {
      if (logQueue.length > 0) {
        processLogQueue()
      }
      
      // 发送失败日志
      retryFailedLogs()
    })
  }
  
  // 全局挂载
  export function installLogTracker(app) {
    // 使logEvent在组件内可通过this.$log访问
    app.config.globalProperties.$log = {
      event: logEvent
    }
    
    // 初始化
    setupPageUnloadHandler()
    retryFailedLogs()
  }

  export function logToLocalStorage(data) {
    // 存储日志---路由切换记录
    const logs = JSON.parse(localStorage.getItem('userLogs') || '[]');
    logs.push(data)
    localStorage.setItem('userLogs', JSON.stringify(logs));
  }
  export function logEvtToLocalStorage(data) {
    // 存储日志，各种点击事件
    const logs = JSON.parse(localStorage.getItem('evtLogs') || '[]');
    logs.push(data)
    localStorage.setItem('evtLogs', JSON.stringify(logs));
  }