<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const account = ref('chenjiaqi')
const password = ref('')
const loading = ref(false)

function login() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    router.push('/dashboard')
  }, 500)
}
</script>

<template>
  <div class="min-h-screen grid lg:grid-cols-2 bg-base-200/40">
    <!-- 左侧品牌区 -->
    <div class="hidden lg:flex flex-col justify-between bg-neutral text-neutral-content p-12">
      <div class="flex items-center gap-2 font-bold text-lg">
        <span class="grid place-items-center size-8 rounded-lg bg-primary text-primary-content">
          <svg xmlns="http://www.w3.org/2000/svg" class="size-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V9l8-6 8 6v12M9 21v-6h6v6M4 9h16"/></svg>
        </span>
        云枢 OA
      </div>
      <div>
        <h1 class="font-display text-4xl font-bold leading-tight mb-4">让审批、协同<br/>与行政管理更简单</h1>
        <p class="opacity-70 max-w-md">集成审批中心、人事管理、行政办公与财务流程，为企业打造统一的数字化办公入口。</p>
      </div>
      <p class="text-xs opacity-40">© 2026 云枢 OA · 演示环境，数据均为模拟生成</p>
    </div>

    <!-- 右侧登录表单 -->
    <div class="flex items-center justify-center p-6">
      <div class="w-full max-w-sm">
        <div class="lg:hidden flex items-center gap-2 font-bold text-lg mb-8">
          <span class="grid place-items-center size-8 rounded-lg bg-primary text-primary-content">
            <svg xmlns="http://www.w3.org/2000/svg" class="size-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V9l8-6 8 6v12M9 21v-6h6v6M4 9h16"/></svg>
          </span>
          云枢 OA
        </div>

        <h2 class="font-display text-2xl font-bold mb-1">欢迎回来</h2>
        <p class="text-sm text-base-content/60 mb-8">登录以继续访问你的工作台</p>

        <div class="flex flex-col gap-4">
          <label class="input input-floating">
            <input v-model="account" type="text" placeholder=" " />
            <span class="input-floating-label">账号</span>
          </label>
          <label class="input input-floating">
            <input v-model="password" type="password" placeholder=" " />
            <span class="input-floating-label">密码</span>
          </label>
          <div class="flex items-center justify-between text-sm">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked class="checkbox checkbox-primary checkbox-sm" />
              <span class="text-base-content/70">记住我</span>
            </label>
            <a class="link link-primary no-underline">忘记密码？</a>
          </div>
          <button class="btn btn-primary btn-block" :disabled="loading" @click="login">
            <span v-if="loading" class="loading loading-spinner loading-xs"></span>
            {{ loading ? '登录中…' : '登 录' }}
          </button>
          <p class="text-center text-xs text-base-content/40">演示环境无需真实账号，点击「登录」即可直接进入</p>
        </div>
      </div>
    </div>
  </div>
</template>
