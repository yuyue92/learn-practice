<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { genericData } from '../mock/genericData.js'
import MenuIcon from '../components/MenuIcon.vue'

const route = useRoute()
const data = computed(() => genericData[route.meta.dataKey] || { title: route.meta.title, description: '', columns: [], rows: [] })

const keyword = ref('')
const statusFilter = ref('all')

const statusMap = {
  pending: { label: '待审批', cls: 'badge-warning' },
  approved: { label: '已通过', cls: 'badge-success' },
  processing: { label: '处理中', cls: 'badge-info' },
  rejected: { label: '已驳回', cls: 'badge-error' },
  done: { label: '已完成', cls: 'badge-soft' },
}

function initials(name) {
  return (name || '').slice(-2)
}

const filteredRows = computed(() => {
  return data.value.rows.filter((row) => {
    const matchKeyword = !keyword.value || JSON.stringify(row).includes(keyword.value)
    const matchStatus = statusFilter.value === 'all' || row.status === statusFilter.value
    return matchKeyword && matchStatus
  })
})
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="font-bold text-2xl">{{ data.title }}</h1>
      <p class="text-sm text-base-content/60 mt-1">{{ data.description }}</p>
    </div>

    <div class="card bg-base-100 border border-base-300">
      <div class="card-body">
        <!-- 工具栏 -->
        <div class="flex flex-wrap items-center gap-2 mb-4">
          <label class="input input-sm w-56">
            <MenuIcon name="search" class="size-4 opacity-50" />
            <input v-model="keyword" type="search" placeholder="搜索关键字…" />
          </label>
          <select v-model="statusFilter" class="select select-sm w-36">
            <option value="all">全部状态</option>
            <option value="pending">待审批</option>
            <option value="processing">处理中</option>
            <option value="approved">已通过</option>
            <option value="done">已完成</option>
            <option value="rejected">已驳回</option>
          </select>
          <div class="flex-1"></div>
          <button class="btn btn-outline btn-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.6M20 20v-5h-.6M4.6 9a8 8 0 0 1 14.9-3M19.4 15a8 8 0 0 1-14.9 3"/></svg>
            刷新
          </button>
          <button class="btn btn-primary btn-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m-7-7h14"/></svg>
            新建
          </button>
        </div>

        <!-- 表格 -->
        <div class="overflow-x-auto rounded-box border border-base-300">
          <table class="table">
            <thead>
              <tr class="bg-base-200/60 text-xs uppercase tracking-wide">
                <th v-for="col in data.columns" :key="col.key" :class="col.width">{{ col.label }}</th>
                <th class="w-24">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in filteredRows" :key="idx" class="row-hover">
                <td v-for="col in data.columns" :key="col.key">
                  <template v-if="col.type === 'status'">
                    <span class="badge badge-sm" :class="statusMap[row[col.key]]?.cls || 'badge-soft'">
                      {{ statusMap[row[col.key]]?.label || row[col.key] }}
                    </span>
                  </template>
                  <template v-else-if="col.type === 'user'">
                    <div class="flex items-center gap-2">
                      <div class="avatar"><div class="w-6 rounded-full bg-primary/15 text-primary grid place-items-center text-[10px] font-semibold">{{ initials(row[col.key]) }}</div></div>
                      {{ row[col.key] }}
                    </div>
                  </template>
                  <template v-else>{{ row[col.key] }}</template>
                </td>
                <td>
                  <details class="relative">
                    <summary class="btn btn-text btn-xs btn-square list-none cursor-pointer">⋮</summary>
                    <ul class="menu-box menu absolute right-0 mt-1 w-32 rounded-box border border-base-300 shadow-lg p-2 z-20">
                      <li><a class="dropdown-item">查看</a></li>
                      <li><a class="dropdown-item">编辑</a></li>
                      <li><a class="dropdown-item text-error">删除</a></li>
                    </ul>
                  </details>
                </td>
              </tr>
              <tr v-if="!filteredRows.length">
                <td :colspan="data.columns.length + 1" class="text-center py-10 text-base-content/40">
                  暂无匹配数据
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 分页 -->
        <div class="flex justify-between items-center mt-4">
          <p class="text-xs text-base-content/50">共 {{ filteredRows.length }} 条记录</p>
          <div class="join">
            <button class="join-item btn btn-sm">«</button>
            <button class="join-item btn btn-sm btn-active">1</button>
            <button class="join-item btn btn-sm">»</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
