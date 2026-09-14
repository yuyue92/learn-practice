<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const tabs = [
  { key: 'approval', title: '待我审批', path: '/todo/approval', count: 4 },
  { key: 'handle', title: '待我处理', path: '/todo/handle', count: 2 },
  { key: 'initiated', title: '我发起的', path: '/todo/initiated', count: 9 },
  { key: 'cc', title: '抄送我的', path: '/todo/cc', count: 6 },
]

const dataByTab = {
  approval: [
    { title: '王梓涵的请假申请', desc: '2026-09-15 至 2026-09-16 · 事假 2 天', dept: '行政部', time: '10 分钟前', urgent: true },
    { title: '李思远的报销申请', desc: '差旅费报销 · ¥1,280', dept: '市场部', time: '32 分钟前', urgent: false },
    { title: '张雨桐的出差申请', desc: '上海 · 3 天 2 晚', dept: '研发部', time: '1 小时前', urgent: false },
    { title: '刘子墨的采购申请', desc: '笔记本电脑 x2 · ¥15,600', dept: '产品部', time: '2 小时前', urgent: true },
  ],
  handle: [
    { title: '新员工入职资料待核实', desc: '陈曦 · 前端开发工程师', dept: '人事部', time: '1 小时前', urgent: true },
    { title: 'A栋-301 会议室冲突待协调', desc: '两个会议申请时间重叠', dept: '行政部', time: '3 小时前', urgent: false },
  ],
  initiated: Array.from({ length: 9 }, (_, i) => ({
    title: `我发起的申请 #${1000 + i}`,
    desc: ['请假申请', '报销申请', '用印申请', '采购申请'][i % 4],
    dept: '行政部',
    time: `${i + 1} 天前`,
    urgent: false,
  })),
  cc: Array.from({ length: 6 }, (_, i) => ({
    title: `抄送通知 #${2000 + i}`,
    desc: '部门预算调整审批',
    dept: '财务部',
    time: `${i + 1} 天前`,
    urgent: false,
  })),
}

const activeTab = computed(() => route.meta.tab || 'approval')
const list = computed(() => dataByTab[activeTab.value] || [])

function switchTab(path) {
  router.push(path)
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="font-bold text-2xl">我的待办</h1>
      <p class="text-sm text-base-content/60 mt-1">集中处理你的审批、任务、发起记录与抄送消息。</p>
    </div>

    <div class="tabs tabs-lifted mb-0">
      <button
        v-for="t in tabs"
        :key="t.key"
        type="button"
        class="tab gap-2"
        :class="{ 'tab-active': activeTab === t.key }"
        @click="switchTab(t.path)"
      >
        {{ t.title }}
        <span class="badge badge-sm" :class="activeTab === t.key ? 'badge-primary' : 'badge-soft'">{{ t.count }}</span>
      </button>
    </div>

    <div class="bg-base-100 border border-base-300 rounded-b-box rounded-tr-box p-4 lg:p-6 -mt-px">
      <ul class="divide-y divide-base-300">
        <li v-for="(item, i) in list" :key="i" class="py-3.5 flex items-center justify-between gap-4">
          <div class="flex items-center gap-3 min-w-0">
            <div class="avatar shrink-0"><div class="w-9 rounded-full bg-primary/15 text-primary grid place-items-center text-xs font-semibold">{{ item.dept.slice(0,1) }}</div></div>
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <p class="text-sm font-medium truncate">{{ item.title }}</p>
                <span v-if="item.urgent" class="badge badge-error badge-soft badge-sm shrink-0">加急</span>
              </div>
              <p class="text-xs text-base-content/50 truncate">{{ item.desc }} · {{ item.dept }} · {{ item.time }}</p>
            </div>
          </div>
          <div class="flex gap-2 shrink-0">
            <template v-if="activeTab === 'approval'">
              <button class="btn btn-outline btn-error btn-xs">驳回</button>
              <button class="btn btn-primary btn-xs">通过</button>
            </template>
            <template v-else>
              <button class="btn btn-outline btn-xs">查看详情</button>
            </template>
          </div>
        </li>
        <li v-if="!list.length" class="py-16 text-center text-base-content/40 text-sm">暂无数据</li>
      </ul>
    </div>
  </div>
</template>
