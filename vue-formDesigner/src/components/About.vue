<template>
  <div>
    <h2>list-items
    </h2>
    <CommonList :items="users">
      <template #header>
        <p>共 {{ users.length }} 个</p>
      </template>
      <template #default="{unit}">
        <span>{{ unit.id }}</span>
      </template>
      <!-- Footer 插槽内容 -->
       <template #footer>
        <button @click="loadMore">加载更多</button>
       </template>
    </CommonList>
  </div>
</template>
  
<script setup>
import { ref } from 'vue';
// 生成随机ID的方法，入参是位数，比如16位ID
const generateRandomString = (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map(byte => chars[byte % chars.length])
    .join('');
}
// 初始化user数据列表，生成几条
const users = ref([]);
for(let i=0;i<5;i++) {
  users.value.push({ id: generateRandomString(16) })
}

const loadMore = () => {
  // 加载更多数据逻辑
  const ulen = users.value.length
  console.log('加载更多数据', ulen)
  users.value.push({ id: generateRandomString(16) })
}

</script>
