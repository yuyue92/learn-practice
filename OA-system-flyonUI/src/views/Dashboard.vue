<script setup>
const quickLinks = [
  { title: '请假申请', path: '/approval/leave', color: 'bg-primary/10 text-primary' },
  { title: '报销申请', path: '/approval/expense', color: 'bg-accent/10 text-accent' },
  { title: '会议室预订', path: '/admin/meeting-room', color: 'bg-info/10 text-info' },
  { title: '通知公告', path: '/admin/notice', color: 'bg-warning/10 text-warning' },
  { title: '员工档案', path: '/hr/employee', color: 'bg-secondary/10 text-secondary' },
  { title: '用印申请', path: '/approval/seal', color: 'bg-success/10 text-success' },
]

const todoPreview = [
  { title: '王梓涵的请假申请', dept: '行政部', time: '10 分钟前' },
  { title: '李思远的报销申请 · ¥1,280', dept: '市场部', time: '32 分钟前' },
  { title: '张雨桐的出差申请', dept: '研发部', time: '1 小时前' },
  { title: '刘子墨的采购申请', dept: '产品部', time: '2 小时前' },
]

const weekData = [62, 78, 55, 90, 70, 40, 20]
const weekLabels = ['一', '二', '三', '四', '五', '六', '日']

const deptDist = [
  { name: '研发部', value: 42, color: 'bg-primary' },
  { name: '市场部', value: 20, color: 'bg-accent' },
  { name: '行政部', value: 14, color: 'bg-info' },
  { name: '财务部', value: 10, color: 'bg-warning' },
  { name: '其他', value: 14, color: 'bg-base-300' },
]
</script>

<template>
  <div>
    <div class="flex flex-wrap items-end justify-between gap-3 mb-6">
      <div>
        <h1 class="font-bold text-2xl">早安，陈嘉琪 👋</h1>
        <p class="text-sm text-base-content/60 mt-1">今天是 2026 年 9 月 13 日，星期日，你有 4 项待办等待处理。</p>
      </div>
      <div class="flex gap-2">
        <router-link to="/approval/leave" class="btn btn-outline btn-sm">发起请假</router-link>
        <router-link to="/approval/expense" class="btn btn-primary btn-sm">发起报销</router-link>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats stats-horizontal shadow-sm border border-base-300 w-full bg-base-100 flex flex-wrap overflow-visible mb-6">
      <div class="stat">
        <div class="stat-title">待我审批</div>
        <div class="stat-value text-primary">4</div>
        <div class="stat-desc">较昨日 ↗ 2 项</div>
      </div>
      <div class="stat">
        <div class="stat-title">本月加班时长</div>
        <div class="stat-value">18.5h</div>
        <div class="stat-desc">较上月 ↘ 3.2h</div>
      </div>
      <div class="stat">
        <div class="stat-title">在职员工</div>
        <div class="stat-value">186</div>
        <div class="stat-desc">较上季度 ↗ 12 人</div>
      </div>
      <div class="stat">
        <div class="stat-title">本月报销总额</div>
        <div class="stat-value text-accent">¥48,320</div>
        <div class="stat-desc">预算执行率 62%</div>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <!-- 快捷入口 -->
      <div class="lg:col-span-3 grid sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <router-link
          v-for="link in quickLinks"
          :key="link.path"
          :to="link.path"
          class="card bg-base-100 border border-base-300 hover:border-primary/40 transition-colors"
        >
          <div class="card-body p-4 items-center text-center gap-2">
            <div class="size-10 rounded-field grid place-items-center" :class="link.color">
              <svg xmlns="http://www.w3.org/2000/svg" class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m-7-7h14"/></svg>
            </div>
            <p class="text-xs font-medium">{{ link.title }}</p>
          </div>
        </router-link>
      </div>

      <!-- 本周审批趋势 -->
      <div class="lg:col-span-2 card bg-base-100 border border-base-300">
        <div class="card-body">
          <h3 class="card-title text-base mb-4">本周审批处理量</h3>
          <div class="flex items-end gap-3 h-40">
            <div v-for="(v, i) in weekData" :key="i" class="flex-1 flex flex-col items-center gap-2">
              <div class="w-full rounded-t-field bg-primary/80 hover:bg-primary transition-colors" :style="{ height: v + '%' }"></div>
              <span class="text-xs text-base-content/50">{{ weekLabels[i] }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 部门人数分布 -->
      <div class="card bg-base-100 border border-base-300">
        <div class="card-body">
          <h3 class="card-title text-base mb-4">部门人数占比</h3>
          <div class="space-y-3">
            <div v-for="d in deptDist" :key="d.name">
              <div class="flex justify-between text-xs mb-1">
                <span>{{ d.name }}</span>
                <span class="text-base-content/50">{{ d.value }}%</span>
              </div>
              <div class="progress"><div class="progress-bar" :class="d.color" :style="{ width: d.value + '%' }"></div></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 待办预览 -->
      <div class="card bg-base-100 border border-base-300">
        <div class="card-body">
          <div class="flex items-center justify-between mb-2">
            <h3 class="card-title text-base">待我审批</h3>
            <router-link to="/todo/approval" class="link link-primary text-xs no-underline">查看全部</router-link>
          </div>
          <ul class="divide-y divide-base-300">
            <li v-for="(t, i) in todoPreview" :key="i" class="py-2.5 flex items-center justify-between gap-2">
              <div class="min-w-0">
                <p class="text-sm font-medium truncate">{{ t.title }}</p>
                <p class="text-xs text-base-content/50">{{ t.dept }} · {{ t.time }}</p>
              </div>
              <button class="btn btn-primary btn-xs shrink-0">审批</button>
            </li>
          </ul>
        </div>
      </div>

      <!-- 通知公告 -->
      <div class="card bg-base-100 border border-base-300">
        <div class="card-body">
          <div class="flex items-center justify-between mb-2">
            <h3 class="card-title text-base">最新公告</h3>
            <router-link to="/admin/notice" class="link link-primary text-xs no-underline">查看全部</router-link>
          </div>
          <ul class="space-y-3">
            <li class="flex gap-2">
              <span class="badge badge-error badge-soft badge-sm shrink-0">重要</span>
              <p class="text-sm">国庆节放假安排及值班表通知</p>
            </li>
            <li class="flex gap-2">
              <span class="badge badge-info badge-soft badge-sm shrink-0">通知</span>
              <p class="text-sm">OA 系统将于本周六凌晨维护升级</p>
            </li>
            <li class="flex gap-2">
              <span class="badge badge-soft badge-sm shrink-0">常规</span>
              <p class="text-sm">2026 年第三季度全员大会安排</p>
            </li>
          </ul>
        </div>
      </div>

      <!-- 常用文档 -->
      <div class="card bg-base-100 border border-base-300">
        <div class="card-body">
          <h3 class="card-title text-base mb-2">常用文档</h3>
          <ul class="space-y-2">
            <li v-for="doc in ['员工手册.pdf', '报销指南.pdf', '费用报销制度.pdf']" :key="doc" class="flex items-center gap-2 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="size-4 text-base-content/40 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7 4h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/></svg>
              <router-link to="/knowledge/docs" class="link link-hover truncate">{{ doc }}</router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
