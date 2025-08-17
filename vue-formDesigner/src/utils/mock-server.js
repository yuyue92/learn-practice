// mock-server.js
// const WebSocket = import('ws');
import WebSocket from 'ws'; // 浏览器环境不适用！

// 创建WebSocket服务器，监听8080端口
const wss = new WebSocket.Server({ port: 8080 });

// 设备状态存储
const devices = {
  'device-001': { temperature: 25, humidity: 60, status: 'online' },
  'device-002': { temperature: 22, humidity: 55, status: 'online' }
};

// 连接建立时
wss.on('connection', (ws) => {
  console.log('新的客户端连接');
  
  // 发送初始设备数据
  ws.send(JSON.stringify({
    type: 'init',
    data: devices
  }));
  
  // 定时推送模拟数据
  const interval = setInterval(() => {
    // 随机更新设备数据
    Object.keys(devices).forEach(deviceId => {
      devices[deviceId].temperature = (20 + Math.random() * 10).toFixed(1);
      devices[deviceId].humidity = (50 + Math.random() * 20).toFixed(1);
    });
    
    // 发送更新数据
    ws.send(JSON.stringify({
      type: 'update',
      data: devices
    }));
  }, 3000); // 每3秒更新一次
  
  // 连接关闭时清理
  ws.on('close', () => {
    console.log('客户端断开连接');
    clearInterval(interval);
  });
  
  // 处理客户端消息
  ws.on('message', (message) => {
    console.log('收到客户端消息:', message.toString());
    try {
      const msg = JSON.parse(message);
      if (msg.type === 'command') {
        // 处理设备控制命令
        if (devices[msg.deviceId]) {
          devices[msg.deviceId].status = msg.command;
          ws.send(JSON.stringify({
            type: 'command_response',
            deviceId: msg.deviceId,
            status: msg.command,
            success: true
          }));
        }
      }
    } catch (e) {
      console.error('消息解析错误:', e);
    }
  });
});

console.log('WebSocket Mock服务器已启动，监听 ws://localhost:8080');