<script setup>
import { computed } from 'vue'

// 简化的本月日历数据：0=无记录/周末, 1=正常, 2=迟到, 3=请假
const days = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1
  const weekday = (day + 1) % 7 // 简化的星期计算
  if (weekday === 0 || weekday === 6) return { day, status: 0 }
  const r = day % 11
  if (r === 3) return { day, status: 2 }
  if (r === 7) return { day, status: 3 }
  return { day, status: 1 }
})

const statusStyle = {
  0: 'bg-base-200 text-base-content/30',
  1: 'bg-success/15 text-success',
  2: 'bg-warning/15 text-warning',
  3: 'bg-info/15 text-info',
}
const statusLabel = { 0: '休', 1: '正常', 2: '迟到', 3: '请假' }

const summary = computed(() => {
  const normal = days.filter((d) => d.status === 1).length
  const late = days.filter((d) => d.status === 2).length
  const leave = days.filter((d) => d.status === 3).length
  return { normal, late, leave }
})

const teamRows = [
  { name: '王梓涵', dept: '研发部', normal: 21, late: 1, leave: 0, rate: '100%' },
  { name: '李思远', dept: '市场部', normal: 20, late: 0, leave: 2, rate: '91%' },
  { name: '张雨桐', dept: '研发部', normal: 22, late: 0, leave: 0, rate: '100%' },
  { name: '刘子墨', dept: '产品部', normal: 18, late: 2, leave: 2, rate: '82%' },
  { name: '杨梦琪', dept: '行政部', normal: 21, late: 1, leave: 0, rate: '95%' },
]
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="font-bold text-2xl">考勤管理</h1>
      <p class="text-sm text-base-content/60 mt-1">个人打卡日历与团队考勤汇总。</p>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <!-- 我的日历 -->
      <div class="lg:col-span-2 card bg-base-100 border border-base-300">
        <div class="card-body">
          <div class="flex items-center justify-between mb-4">
            <h3 class="card-title text-base">我的考勤日历 · 2026年9月</h3>
            <div class="flex items-center gap-3 text-xs text-base-content/50">
              <span class="flex items-center gap-1.5"><span class="size-2.5 rounded-sm bg-success/40"></span>正常</span>
              <span class="flex items-center gap-1.5"><span class="size-2.5 rounded-sm bg-warning/40"></span>迟到</span>
              <span class="flex items-center gap-1.5"><span class="size-2.5 rounded-sm bg-info/40"></span>请假</span>
            </div>
          </div>
          <div class="grid grid-cols-7 gap-2">
            <div v-for="d in days" :key="d.day" class="aspect-square rounded-field flex flex-col items-center justify-center gap-0.5" :class="statusStyle[d.status]">
              <span class="text-sm font-semibold">{{ d.day }}</span>
              <span class="text-[10px]">{{ statusLabel[d.status] }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 本月统计 -->
      <div class="flex flex-col gap-4">
        <div class="stats stats-vertical border border-base-300 bg-base-100 w-full">
          <div class="stat py-3">
            <div class="stat-title text-xs">正常出勤</div>
            <div class="stat-value text-success text-2xl">{{ summary.normal }} 天</div>
          </div>
          <div class="stat py-3">
            <div class="stat-title text-xs">迟到次数</div>
            <div class="stat-value text-warning text-2xl">{{ summary.late }} 次</div>
          </div>
          <div class="stat py-3">
            <div class="stat-title text-xs">请假天数</div>
            <div class="stat-value text-info text-2xl">{{ summary.leave }} 天</div>
          </div>
        </div>
        <div class="card bg-base-100 border border-base-300">
          <div class="card-body p-4">
            <p class="text-sm font-medium mb-2">今日打卡</p>
            <div class="flex items-center justify-between text-xs mb-3">
              <span class="text-base-content/50">上班 09:02</span>
              <span class="badge badge-success badge-soft badge-sm">已打卡</span>
            </div>
            <button class="btn btn-primary btn-sm btn-block">下班打卡</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 团队考勤汇总 -->
    <div class="card bg-base-100 border border-base-300 mt-6">
      <div class="card-body">
        <h3 class="card-title text-base mb-4">团队考勤汇总</h3>
        <div class="overflow-x-auto rounded-box border border-base-300">
          <table class="table">
            <thead>
              <tr class="bg-base-200/60 text-xs uppercase tracking-wide">
                <th>姓名</th><th>部门</th><th>正常天数</th><th>迟到次数</th><th>请假天数</th><th>出勤率</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="t in teamRows" :key="t.name" class="row-hover">
                <td class="font-medium">{{ t.name }}</td>
                <td>{{ t.dept }}</td>
                <td>{{ t.normal }}</td>
                <td>{{ t.late }}</td>
                <td>{{ t.leave }}</td>
                <td>
                  <div class="flex items-center gap-2">
                    <div class="progress w-20"><div class="progress-bar progress-primary" :style="{ width: t.rate }"></div></div>
                    <span class="text-xs">{{ t.rate }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
