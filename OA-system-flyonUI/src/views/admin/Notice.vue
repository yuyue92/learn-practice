<script setup>
import { ref } from 'vue'

const notices = [
  { id: 1, title: '国庆节放假安排及值班表通知', tag: '重要', tagCls: 'badge-error', author: '行政部', date: '2026-09-12', content: '根据国家法定节假日安排，结合公司实际情况，现将 2026 年国庆节放假安排通知如下：10月1日至10月7日放假调休，共7天。请各部门提前做好工作安排，值班表见附件，如有紧急事务请联系行政部值班电话。' },
  { id: 2, title: 'OA 系统将于本周六凌晨维护升级', tag: '通知', tagCls: 'badge-info', author: '信息技术部', date: '2026-09-11', content: '为提升系统稳定性与性能，OA 系统将于本周六 00:00-06:00 进行例行维护升级，期间系统将无法访问，请提前保存好未提交的表单内容，给您带来的不便敬请谅解。' },
  { id: 3, title: '2026 年第三季度全员大会安排', tag: '常规', tagCls: 'badge-soft', author: '总经理办公室', date: '2026-09-10', content: '定于 9 月 20 日下午 14:00 在总部大礼堂召开第三季度全员大会，请各部门负责人提前准备季度总结材料，全体员工准时参加，会议将同步在线上直播。' },
  { id: 4, title: '关于开展年度体检的通知', tag: '福利', tagCls: 'badge-success', author: '人事部', date: '2026-09-08', content: '公司将于 9 月 22 日至 10 月 10 日期间统一组织年度员工体检，具体安排请查看人事部发送的排期表，体检机构为城东医院体检中心，请合理安排时间。' },
  { id: 5, title: '办公区网络优化施工通知', tag: '通知', tagCls: 'badge-info', author: '行政部', date: '2026-09-05', content: '为提升办公区网络体验，将于本周三晚间对三层至五层网络机房进行升级施工，期间可能出现短暂断网，预计影响时长 30 分钟，请知悉。' },
]

const active = ref(notices[0])
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="font-bold text-2xl">通知公告</h1>
      <p class="text-sm text-base-content/60 mt-1">公司全员通知、行政公告与制度发布。</p>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <div class="card bg-base-100 border border-base-300">
        <div class="card-body p-3">
          <button class="btn btn-primary btn-sm btn-block mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m-7-7h14"/></svg>
            发布公告
          </button>
          <ul class="flex flex-col gap-1">
            <li v-for="n in notices" :key="n.id">
              <button
                type="button"
                class="w-full text-left rounded-field px-3 py-2.5 transition-colors"
                :class="active.id === n.id ? 'bg-primary/10' : 'hover:bg-base-200'"
                @click="active = n"
              >
                <div class="flex items-center gap-2 mb-1">
                  <span class="badge badge-sm" :class="n.tagCls">{{ n.tag }}</span>
                  <span class="text-xs text-base-content/40">{{ n.date }}</span>
                </div>
                <p class="text-sm font-medium truncate" :class="active.id === n.id && 'text-primary'">{{ n.title }}</p>
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div class="lg:col-span-2 card bg-base-100 border border-base-300">
        <div class="card-body">
          <div class="flex items-center gap-2 mb-3">
            <span class="badge badge-sm" :class="active.tagCls">{{ active.tag }}</span>
            <span class="text-xs text-base-content/50">{{ active.author }} · {{ active.date }} 发布</span>
          </div>
          <h2 class="font-display font-bold text-xl mb-4">{{ active.title }}</h2>
          <p class="text-sm text-base-content/70 leading-relaxed">{{ active.content }}</p>

          <div class="divider"></div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="avatar-group -space-x-2">
                <div class="avatar"><div class="w-7 rounded-full bg-primary text-primary-content grid place-items-center text-[10px] font-semibold">王</div></div>
                <div class="avatar"><div class="w-7 rounded-full bg-accent text-accent-content grid place-items-center text-[10px] font-semibold">李</div></div>
                <div class="avatar avatar-placeholder"><div class="w-7 rounded-full bg-base-300 grid place-items-center text-[10px] font-semibold">+52</div></div>
              </div>
              <span class="text-xs text-base-content/50">52 人已读</span>
            </div>
            <button class="btn btn-outline btn-sm">标记为已读</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
