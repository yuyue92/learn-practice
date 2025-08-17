<template>
  <div class="setting_wrapper">
    <div class="border p-5 m-5">
      <p>这里是设置内容。</p>
      <textarea v-model="content" rows="8" class="border p-2 w-full mb-2" placeholder="文件内容" />
      <p>
        <span>按钮列表,需要管理员权限才可进行文件读写操作</span>
        <button v-permission="'admin'" @click="writeFile" class="p-5 m-5">写入</button>
        <button v-permission="'admin'" @click="readFileSync" class="p-5 m-5">同步读取文件</button>
      </p>
      <div>{{ showTxt }}</div>
    </div>
    <div class="border p-5 m-5">
      <div class="window-controls">
        x: <input type="number" v-model="xpos" class="w-100 p-5 m-5" />
        y: <input type="number" v-model="ypos" class="w-100 p-5 m-5" />
        <button @click="setPositionclick" class=" p-5 m-5">设置窗口位置</button>
        <button @click="getPositionclick" class=" p-5 m-5">获取窗口位置</button>
        <button @click="showDialog" class=" p-5 m-5">触发提示框</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';

const content = ref('');
const showTxt =ref('');
const xpos =ref('');
const ypos =ref('');
const setPositionclick = ()=>{
  const x = Number(xpos.value) ||300
  const y = Number(ypos.value) ||300
  window.api.setWindowPosition(x, y)
}
const getPositionclick = async()=>{
  const pos = await window.api.getWindowPosition()
  xpos.value = pos.x
  ypos.value = pos.y
}
const readFileSync = async()=>{
  try {
    const result = await window.api.handleReadfile('message1')
    showTxt.value = '文件read成功';
    content.value = result.content;
  } catch (error) {
    console.error(`read_file_err: ${error}`);
    showTxt.value = `read_file_err: ${error}`
  }
}
const writeFile = async()=>{
  try {
    const result = await window.api.handleSavefile(content.value)
    showTxt.value = `文件保存成功: ${result.path}`;
  } catch (error) {
    showTxt.value = `write_file_err: ${error}`
    console.error( `write_file_err: ${error}` )
  }
}
// 示例：Vue3 中点击按钮触发提示框
const showDialog = ()=> {
  window.api.showMessageBox({
    type: 'info',
    title: '来自主进程的提示',
    message: '你点击了按钮，主进程收到请求后弹出提示！',
    buttons: ['好的', '取消']
  }).then(result => {
    console.log('用户点击按钮索引:', result.response);
  });
}


</script>
  