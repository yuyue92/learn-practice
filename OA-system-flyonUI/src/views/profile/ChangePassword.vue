<script setup>
import { ref } from 'vue'

const oldPwd = ref('')
const newPwd = ref('')
const confirmPwd = ref('')
const saved = ref(false)

function submit() {
  saved.value = true
  setTimeout(() => (saved.value = false), 2400)
}
</script>

<template>
  <div class="max-w-lg">
    <div class="mb-6">
      <h1 class="font-bold text-2xl">修改密码</h1>
      <p class="text-sm text-base-content/60 mt-1">建议定期修改密码以保障账号安全。</p>
    </div>

    <div v-if="saved" role="alert" class="alert alert-success alert-soft mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" class="size-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m5 13 4 4L19 7"/></svg>
      <span>密码修改成功，请妥善保管。</span>
    </div>

    <div class="card bg-base-100 border border-base-300">
      <div class="card-body gap-4">
        <label class="input input-floating">
          <input v-model="oldPwd" type="password" placeholder=" " />
          <span class="input-floating-label">当前密码</span>
        </label>
        <label class="input input-floating">
          <input v-model="newPwd" type="password" placeholder=" " />
          <span class="input-floating-label">新密码</span>
        </label>
        <label class="input input-floating">
          <input v-model="confirmPwd" type="password" placeholder=" " />
          <span class="input-floating-label">确认新密码</span>
        </label>
        <ul class="text-xs text-base-content/50 space-y-1 mt-1">
          <li>· 长度至少 8 位，包含大小写字母与数字</li>
          <li>· 不能与最近 3 次使用过的密码相同</li>
        </ul>
        <button class="btn btn-primary btn-block mt-2" @click="submit">确认修改</button>
      </div>
    </div>
  </div>
</template>
