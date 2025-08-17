<template>
  <div>
    <h2>🏠 首页</h2>
    <div class="p-5 m-5 border">
      <span>按钮列表,根据当前登录用户的权限显示: {{ perlist }}</span>
        <button v-permission="'guest'" class="m-5">权限按钮-guest</button>
        <button v-permission="'admin'" class="m-5">管理员权限</button>
    </div>
    <CommonList :items="app1store.mockList1">
      <template #header>
        <p>共 {{ app1store.mockList1.length }} 个</p>
      </template>
      <!-- Footer 插槽内容 -->
      <template #footer>
        <button @click="loadMore">加载更多</button>
       </template>
    </CommonList>
  </div>
</template>
<script setup>
import { useAppStore } from '@renderer/store/appStore';
import { getPermissions } from '@renderer/utils/permission';
const app1store = useAppStore()
const perlist = getPermissions()
// 生成随机ID的方法，入参是位数，比如16位ID
const generateRandomString = (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map(byte => chars[byte % chars.length])
    .join('');
}

// 加载更多数据逻辑
const loadMore = () => {
  app1store.addToMockList1({ id: generateRandomString(16) });
  app1store.addToMockList1({ id: generateRandomString(16) });
  app1store.addToMockList1({ id: generateRandomString(16) });
}
</script>
