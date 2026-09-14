<script setup>
import { ref } from 'vue'

const name = ref('陈嘉琪')
const phone = ref('138****2201')
const email = ref('chenjiaqi@company.com')
const bio = ref('专注于行政效率提升与流程优化。')
const saved = ref(false)

function save() {
  saved.value = true
  setTimeout(() => (saved.value = false), 2400)
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="font-bold text-2xl">个人信息</h1>
      <p class="text-sm text-base-content/60 mt-1">管理你的个人资料与联系方式。</p>
    </div>

    <div v-if="saved" role="alert" class="alert alert-success alert-soft mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" class="size-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m5 13 4 4L19 7"/></svg>
      <span>信息已保存。</span>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <div class="card bg-base-100 border border-base-300">
        <div class="card-body items-center text-center">
          <div class="avatar"><div class="w-20 rounded-full bg-primary text-primary-content grid place-items-center text-2xl font-semibold">{{ name.slice(-2) }}</div></div>
          <p class="font-semibold mt-3">{{ name }}</p>
          <p class="text-xs text-base-content/50">行政部 · 高级专员</p>
          <button class="btn btn-outline btn-sm mt-4">更换头像</button>
          <div class="divider my-4"></div>
          <div class="w-full text-left space-y-2 text-sm">
            <p class="flex justify-between"><span class="text-base-content/50">工号</span><span>EMP-00182</span></p>
            <p class="flex justify-between"><span class="text-base-content/50">入职日期</span><span>2022-07-01</span></p>
            <p class="flex justify-between"><span class="text-base-content/50">直属主管</span><span>王梓涵</span></p>
          </div>
        </div>
      </div>

      <div class="lg:col-span-2 card bg-base-100 border border-base-300">
        <div class="card-body">
          <h3 class="card-title text-base mb-4">基本资料</h3>
          <div class="grid sm:grid-cols-2 gap-4">
            <label class="input input-floating">
              <input v-model="name" type="text" placeholder=" " />
              <span class="input-floating-label">姓名</span>
            </label>
            <label class="input input-floating">
              <input v-model="phone" type="text" placeholder=" " />
              <span class="input-floating-label">手机号</span>
            </label>
            <label class="input input-floating sm:col-span-2">
              <input v-model="email" type="email" placeholder=" " />
              <span class="input-floating-label">邮箱</span>
            </label>
            <div class="sm:col-span-2">
              <label class="text-xs font-medium text-base-content/60 mb-1.5 block">个人简介</label>
              <textarea v-model="bio" class="textarea w-full" rows="3"></textarea>
            </div>
          </div>
          <div class="flex justify-end mt-6">
            <button class="btn btn-primary" @click="save">保存修改</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
