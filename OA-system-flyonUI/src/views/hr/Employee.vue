<script setup>
import { ref, computed } from 'vue'

const employees = [
  { name: '王梓涵', dept: '研发部', role: '前端工程师', phone: '138****2201', email: 'wzh@company.com', status: 'active', joined: '2023-03-12' },
  { name: '李思远', dept: '市场部', role: '市场经理', phone: '139****5521', email: 'lsy@company.com', status: 'active', joined: '2022-07-01' },
  { name: '张雨桐', dept: '研发部', role: '测试工程师', phone: '137****9012', email: 'zyt@company.com', status: 'active', joined: '2024-01-08' },
  { name: '刘子墨', dept: '产品部', role: '产品经理', phone: '135****3345', email: 'lzm@company.com', status: 'leave', joined: '2021-11-20' },
  { name: '陈曦', dept: '研发部', role: '技术总监', phone: '136****7788', email: 'cx@company.com', status: 'active', joined: '2020-05-06' },
  { name: '杨梦琪', dept: '行政部', role: '前台文员', phone: '150****1122', email: 'ymq@company.com', status: 'active', joined: '2024-06-15' },
  { name: '赵天佑', dept: '人事部', role: '招聘专员', phone: '151****4456', email: 'zty@company.com', status: 'probation', joined: '2026-08-01' },
  { name: '周雅静', dept: '财务部', role: '财务总监', phone: '133****8899', email: 'zyj@company.com', status: 'active', joined: '2019-09-23' },
]

const statusMap = {
  active: { label: '在职', cls: 'badge-success' },
  leave: { label: '休假中', cls: 'badge-warning' },
  probation: { label: '试用期', cls: 'badge-info' },
}

const keyword = ref('')
const deptFilter = ref('all')
const depts = ['all', '研发部', '市场部', '产品部', '行政部', '人事部', '财务部']

const filtered = computed(() =>
  employees.filter((e) => {
    const k = !keyword.value || e.name.includes(keyword.value) || e.role.includes(keyword.value)
    const d = deptFilter.value === 'all' || e.dept === deptFilter.value
    return k && d
  })
)
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="font-bold text-2xl">员工档案</h1>
      <p class="text-sm text-base-content/60 mt-1">全公司员工基础信息与在职状态一览。</p>
    </div>

    <div class="flex flex-wrap items-center gap-2 mb-4">
      <label class="input input-sm w-56">
        <svg xmlns="http://www.w3.org/2000/svg" class="size-4 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path stroke-linecap="round" d="m21 21-4.3-4.3"/></svg>
        <input v-model="keyword" type="search" placeholder="搜索姓名 / 岗位…" />
      </label>
      <select v-model="deptFilter" class="select select-sm w-36">
        <option v-for="d in depts" :key="d" :value="d">{{ d === 'all' ? '全部部门' : d }}</option>
      </select>
      <div class="flex-1"></div>
      <button class="btn btn-primary btn-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m-7-7h14"/></svg>
        新增员工
      </button>
    </div>

    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="e in filtered" :key="e.name + e.email" class="card bg-base-100 border border-base-300">
        <div class="card-body p-4">
          <div class="flex items-start justify-between mb-2">
            <div class="avatar"><div class="w-11 rounded-full bg-primary/15 text-primary grid place-items-center text-sm font-semibold">{{ e.name.slice(-2) }}</div></div>
            <span class="badge badge-sm" :class="statusMap[e.status].cls">{{ statusMap[e.status].label }}</span>
          </div>
          <p class="font-semibold text-sm">{{ e.name }}</p>
          <p class="text-xs text-base-content/50 mb-3">{{ e.dept }} · {{ e.role }}</p>
          <div class="text-xs text-base-content/60 space-y-1">
            <p class="flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" class="size-3.5 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>{{ e.phone }}</p>
            <p class="flex items-center gap-1.5 truncate"><svg xmlns="http://www.w3.org/2000/svg" class="size-3.5 opacity-50 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4h16v16H4V4Zm0 0 8 8 8-8"/></svg>{{ e.email }}</p>
            <p class="flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" class="size-3.5 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path stroke-linecap="round" d="M16 2v4M8 2v4M3 10h18"/></svg>入职于 {{ e.joined }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
