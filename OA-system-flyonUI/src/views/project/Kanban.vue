<script setup>
import { reactive } from 'vue'

const columns = reactive([
  {
    key: 'todo', title: '待处理', color: 'text-base-content/60',
    tasks: [
      { title: '梳理审批流程需求文档', tag: '需求', dept: '产品部', due: '09-16', assignee: '刘子墨' },
      { title: '设计移动端待办列表交互', tag: '设计', dept: '产品部', due: '09-18', assignee: '张雨桐' },
      { title: '调研第三方短信网关', tag: '技术', dept: '研发部', due: '09-20', assignee: '王梓涵' },
    ],
  },
  {
    key: 'doing', title: '进行中', color: 'text-info',
    tasks: [
      { title: 'OA 系统 2.0 菜单权限重构', tag: '开发', dept: '研发部', due: '09-15', assignee: '陈曦' },
      { title: '报销单据 OCR 识别接入', tag: '开发', dept: '研发部', due: '09-17', assignee: '王梓涵' },
    ],
  },
  {
    key: 'review', title: '待验收', color: 'text-warning',
    tasks: [
      { title: '组织架构可视化页面联调', tag: '联调', dept: '研发部', due: '09-14', assignee: '张雨桐' },
    ],
  },
  {
    key: 'done', title: '已完成', color: 'text-success',
    tasks: [
      { title: '会议室预订功能上线', tag: '上线', dept: '研发部', due: '09-10', assignee: '陈曦' },
      { title: '员工档案批量导入功能', tag: '开发', dept: '研发部', due: '09-08', assignee: '李思远' },
      { title: '登录页 UI 走查', tag: '设计', dept: '产品部', due: '09-06', assignee: '张雨桐' },
    ],
  },
])

const tagCls = {
  需求: 'badge-info', 设计: 'badge-secondary', 技术: 'badge-warning',
  开发: 'badge-primary', 联调: 'badge-accent', 上线: 'badge-success',
}
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between flex-wrap gap-3">
      <div>
        <h1 class="font-bold text-2xl">任务看板</h1>
        <p class="text-sm text-base-content/60 mt-1">OA 系统 2.0 迭代任务跟踪（示例项目）。</p>
      </div>
      <button class="btn btn-primary btn-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m-7-7h14"/></svg>
        新建任务
      </button>
    </div>

    <div class="grid md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
      <div v-for="col in columns" :key="col.key" class="bg-base-200/60 rounded-box p-3">
        <div class="flex items-center justify-between mb-3 px-1">
          <p class="text-sm font-semibold" :class="col.color">{{ col.title }}</p>
          <span class="badge badge-sm badge-soft">{{ col.tasks.length }}</span>
        </div>
        <div class="flex flex-col gap-2.5">
          <div v-for="t in col.tasks" :key="t.title" class="card bg-base-100 border border-base-300 hover:border-primary/40 transition-colors">
            <div class="card-body p-3.5 gap-2">
              <div class="flex items-center justify-between">
                <span class="badge badge-sm" :class="tagCls[t.tag] || 'badge-soft'">{{ t.tag }}</span>
                <span class="text-[10px] text-base-content/40">{{ t.due }}</span>
              </div>
              <p class="text-sm font-medium leading-snug">{{ t.title }}</p>
              <div class="flex items-center justify-between mt-1">
                <span class="text-xs text-base-content/40">{{ t.dept }}</span>
                <div class="avatar"><div class="w-6 rounded-full bg-primary/15 text-primary grid place-items-center text-[10px] font-semibold">{{ t.assignee.slice(-2) }}</div></div>
              </div>
            </div>
          </div>
          <button class="rounded-field border border-dashed border-base-300 text-base-content/40 hover:border-primary hover:text-primary text-xs py-2.5 transition-colors">
            + 添加任务
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
