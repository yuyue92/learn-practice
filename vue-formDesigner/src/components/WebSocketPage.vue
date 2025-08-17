<template>
    <div class="div_wrapper">
        <h2>物联网设备状态 (状态: {{connectionStatus}})</h2>
        <div class="device-list">
            <div v-for="deviceId in Object.keys(deviceData)" :key="deviceId" class="device-card">
                <h3>设备ID: {{ deviceId }}</h3>
                <p>温度: {{ deviceData[deviceId].temperature }}°C</p>
                <p>湿度: {{ deviceData[deviceId].humidity }}%</p>
                <p>状态: {{ deviceData[deviceId].status }}</p>
                <div class="device-actions">
                    <button @click="sendCommand(deviceId, 'online')">上线</button>
                    <button @click="sendCommand(deviceId, 'offline')">下线</button>
                    <button @click="sendCommand(deviceId, 'restart')">重启</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

const deviceData = ref({});
const connectionStatus = ref('disconnected');
const ws = ref(null);
// 初始化WebSocket连接
onMounted(() => {
    // 使用 ws://127.0.0.1:8080 有时比 localhost 更可靠
    const websocket = new WebSocket('ws://127.0.0.1:8080');

    websocket.onopen = () => {
        connectionStatus.value = 'connected';
        console.log('WebSocket连接已建立');
    };

    websocket.onerror = (error) => {
        connectionStatus.value = 'error';
        console.error('WebSocket错误:', error);
    };

    websocket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        // console.log('收到服务器消息:', message);
        if (message.type === 'init') {
            console.log('initttt: ', message.data)
            deviceData.value = message.data
        } else if (message.type === 'update') {
            deviceData.value = message.data
            // console.log('upoppp: ', message.data )
        } else if (message.type === 'command_response') {
            console.log('command_response_: ', message )
            //
        }
    };

    ws.value = websocket;
});

const sendCommand = (deviceId, command) => {
    if(ws.value) {
        ws.value.send(JSON.stringify({
            type: 'command',
            deviceId,
            command
        }));
    }
}

onUnmounted(()=>{
    if (ws.value) {
        console.log('leave,close ws!')
        ws.value.close();
    }
})
</script>
<style scoped>
/* WebSocketComponent.css */
.device-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 20px;
  }
  
  .device-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px;
    background-color: #f9f9f9;
  }
  
  .device-card h3 {
    margin-top: 0;
    color: #333;
  }
  
  .device-actions {
    margin-top: 15px;
    display: flex;
    gap: 10px;
  }
  
  .device-actions button {
    padding: 5px 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .device-actions button:hover {
    background-color: #45a049;
  }
  
  .device-actions button:nth-child(2) {
    background-color: #f44336;
  }
  
  .device-actions button:nth-child(2):hover {
    background-color: #d32f2f;
  }
  
  .device-actions button:nth-child(3) {
    background-color: #2196F3;
  }
  
  .device-actions button:nth-child(3):hover {
    background-color: #0b7dda;
  }
</style>