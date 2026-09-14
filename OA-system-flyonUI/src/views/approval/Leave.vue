<script setup>
import { ref } from 'vue'

const leaveType = ref('事假')
const startDate = ref('')
const endDate = ref('')
const reason = ref('')
const showSuccess = ref(false)

const history = [
  { no: 'QJ20250912', type: '年假', range: '09-05 ~ 09-06（2天）', status: 'approved', time: '2026-09-05' },
  { no: 'QJ20250830', type: '病假', range: '08-28 ~ 08-28（1天）', status: 'approved', time: '2026-08-28' },
  { no: 'QJ20250801', type: '事假', range: '07-30 ~ 07-31（2天）', status: 'rejected', time: '2026-07-30' },
]
const statusMap = {
  approved: { label: '已通过', cls: 'badge-success' },
  rejected: { label: '已驳回', cls: 'badge-error' },
  pending: { label: '审批中', cls: 'badge-warning' },
}

function submit() {
  showSuccess.value = true
  setTimeout(() => (showSuccess.value = false), 2600)
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="font-bold text-2xl">请假申请</h1>
      <p class="text-sm text-base-content/60 mt-1">填写请假信息并提交，审批结果将通过站内消息通知你。</p>
    </div>

    <div v-if="showSuccess" role="alert" class="alert alert-success alert-soft mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" class="size-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m5 13 4 4L19 7"/></svg>
      <span>提交成功，已自动流转至你的直属主管审批。</span>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <!-- 申请表单 -->
      <div class="lg:col-span-2 card bg-base-100 border border-base-300">
        <div class="card-body">
          <h3 class="card-title text-base mb-4">申请信息</h3>
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="text-xs font-medium text-base-content/60 mb-1.5 block">请假类型</label>
              <select v-model="leaveType" class="select w-full">
                <option>事假</option>
                <option>年假</option>
                <option>病假</option>
                <option>调休</option>
                <option>婚假</option>
                <option>产假 / 陪产假</option>
              </select>
            </div>
            <div>
              <label class="text-xs font-medium text-base-content/60 mb-1.5 block">请假天数</label>
              <label class="input w-full"><input type="text" value="2 天（自动计算）" disabled /></label>
            </div>
            <div>
              <label class="text-xs font-medium text-base-content/60 mb-1.5 block">开始日期</label>
              <input v-model="startDate" type="date" class="input w-full" />
            </div>
            <div>
              <label class="text-xs font-medium text-base-content/60 mb-1.5 block">结束日期</label>
              <input v-model="endDate" type="date" class="input w-full" />
            </div>
            <div class="sm:col-span-2">
              <label class="text-xs font-medium text-base-content/60 mb-1.5 block">请假事由</label>
              <textarea v-model="reason" class="textarea w-full" rows="4" placeholder="请简要说明请假事由…"></textarea>
            </div>
            <div class="sm:col-span-2">
              <label class="text-xs font-medium text-base-content/60 mb-1.5 block">附件（可选）</label>
              <input type="file" class="input w-full" />
            </div>
            <div class="sm:col-span-2 flex items-center gap-3">
              <input type="checkbox" checked class="switch switch-primary switch-sm" />
              <span class="text-sm text-base-content/70">同时抄送给我的直属主管与人事部</span>
            </div>
          </div>

          <div class="flex justify-end gap-2 mt-6">
            <button class="btn btn-outline">存为草稿</button>
            <button class="btn btn-primary" @click="submit">提交申请</button>
          </div>
        </div>
      </div>

      <!-- 审批流程 -->
      <div class="card bg-base-100 border border-base-300">
        <div class="card-body">
          <h3 class="card-title text-base mb-4">审批流程</h3>
          <ul class="timeline timeline-vertical timeline-compact">
            <li>
              <div class="timeline-start text-xs text-base-content/50">09-13 09:20</div>
              <div class="timeline-middle text-success">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
              </div>
              <div class="timeline-end timeline-box text-sm">
                <p class="font-medium">提交申请</p>
                <p class="text-xs text-base-content/50">陈嘉琪</p>
              </div>
              <hr class="bg-success" />
            </li>
            <li>
              <hr class="bg-success" />
              <div class="timeline-start text-xs text-base-content/50">09-13 11:05</div>
              <div class="timeline-middle text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
              </div>
              <div class="timeline-end timeline-box text-sm">
                <p class="font-medium">直属主管审批中</p>
                <p class="text-xs text-base-content/50">王梓涵</p>
              </div>
              <hr />
            </li>
            <li>
              <hr />
              <div class="timeline-start text-xs text-base-content/30">待处理</div>
              <div class="timeline-middle text-base-content/30">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
              </div>
              <div class="timeline-end timeline-box text-sm text-base-content/40">
                <p class="font-medium">人事部备案</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 历史记录 -->
    <div class="card bg-base-100 border border-base-300 mt-6">
      <div class="card-body">
        <h3 class="card-title text-base mb-4">我的请假记录</h3>
        <div class="overflow-x-auto rounded-box border border-base-300">
          <table class="table">
            <thead>
              <tr class="bg-base-200/60 text-xs uppercase tracking-wide">
                <th>单号</th><th>类型</th><th>时间范围</th><th>状态</th><th>提交日期</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="h in history" :key="h.no" class="row-hover">
                <td class="font-medium">{{ h.no }}</td>
                <td>{{ h.type }}</td>
                <td>{{ h.range }}</td>
                <td><span class="badge badge-sm" :class="statusMap[h.status].cls">{{ statusMap[h.status].label }}</span></td>
                <td class="text-base-content/60">{{ h.time }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
