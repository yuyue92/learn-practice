<script setup>
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center gap-4 bg-base-200/40 text-center p-6">
    <p class="font-display text-7xl font-bold text-primary">404</p>
    <h1 class="text-xl font-semibold">页面走丢了</h1>
    <p class="text-sm text-base-content/60 max-w-sm">你访问的页面不存在，或许它已经被移动或删除。</p>
    <router-link to="/dashboard" class="btn btn-primary mt-2">返回工作台</router-link>
  </div>
</template>
