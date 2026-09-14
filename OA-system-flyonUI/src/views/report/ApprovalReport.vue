<script setup>
const monthly = [
  { m: '3月', total: 120, avgHours: 6.2 },
  { m: '4月', total: 142, avgHours: 5.8 },
  { m: '5月', total: 135, avgHours: 5.1 },
  { m: '6月', total: 168, avgHours: 4.6 },
  { m: '7月', total: 155, avgHours: 4.2 },
  { m: '8月', total: 189, avgHours: 3.8 },
  { m: '9月', total: 96, avgHours: 3.5 },
]
const maxTotal = Math.max(...monthly.map((m) => m.total))

const byType = [
  { name: '请假申请', count: 312, cls: 'bg-primary' },
  { name: '报销申请', count: 268, cls: 'bg-accent' },
  { name: '出差申请', count: 154, cls: 'bg-info' },
  { name: '采购申请', count: 98, cls: 'bg-warning' },
  { name: '用印申请', count: 45, cls: 'bg-secondary' },
]
const maxType = Math.max(...byType.map((t) => t.count))

const rank = [
  { name: '王梓涵', dept: '研发部', count: 42, avg: '2.1h' },
  { name: '李思远', dept: '市场部', count: 38, avg: '3.4h' },
  { name: '周雅静', dept: '财务部', count: 35, avg: '4.6h' },
  { name: '陈曦', dept: '研发部', count: 29, avg: '2.8h' },
  { name: '赵天佑', dept: '人事部', count: 21, avg: '5.2h' },
]
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="font-bold text-2xl">审批效率统计</h1>
      <p class="text-sm text-base-content/60 mt-1">近 7 个月的审批总量与平均处理时长趋势。</p>
    </div>

    <div class="stats stats-horizontal shadow-sm border border-base-300 w-full bg-base-100 flex flex-wrap overflow-visible mb-6">
      <div class="stat">
        <div class="stat-title">本月审批总量</div>
        <div class="stat-value text-primary">96</div>
        <div class="stat-desc">预计月末达 210 单</div>
      </div>
      <div class="stat">
        <div class="stat-title">平均处理时长</div>
        <div class="stat-value">3.5h</div>
        <div class="stat-desc text-success">较上月 ↓ 0.3h</div>
      </div>
      <div class="stat">
        <div class="stat-title">超时未处理</div>
        <div class="stat-value text-error">7</div>
        <div class="stat-desc">占比 3.6%</div>
      </div>
      <div class="stat">
        <div class="stat-title">审批通过率</div>
        <div class="stat-value text-success">94.2%</div>
        <div class="stat-desc">较上月持平</div>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-6 mb-6">
      <div class="lg:col-span-2 card bg-base-100 border border-base-300">
        <div class="card-body">
          <h3 class="card-title text-base mb-4">月度审批总量趋势</h3>
          <div class="flex items-end gap-4 h-48">
            <div v-for="m in monthly" :key="m.m" class="flex-1 flex flex-col items-center gap-2">
              <span class="text-[11px] text-base-content/50">{{ m.total }}</span>
              <div class="w-full rounded-t-field bg-primary/80 hover:bg-primary transition-colors" :style="{ height: (m.total / maxTotal) * 100 + '%' }"></div>
              <span class="text-xs text-base-content/50">{{ m.m }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="card bg-base-100 border border-base-300">
        <div class="card-body">
          <h3 class="card-title text-base mb-4">按类型分布</h3>
          <div class="space-y-3">
            <div v-for="t in byType" :key="t.name">
              <div class="flex justify-between text-xs mb-1">
                <span>{{ t.name }}</span>
                <span class="text-base-content/50">{{ t.count }}</span>
              </div>
              <div class="progress"><div class="progress-bar" :class="t.cls" :style="{ width: (t.count / maxType) * 100 + '%' }"></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card bg-base-100 border border-base-300">
      <div class="card-body">
        <h3 class="card-title text-base mb-4">审批人效率排行（近 30 天）</h3>
        <div class="overflow-x-auto rounded-box border border-base-300">
          <table class="table">
            <thead>
              <tr class="bg-base-200/60 text-xs uppercase tracking-wide">
                <th class="w-16">排名</th><th>审批人</th><th>部门</th><th>处理单量</th><th>平均耗时</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(r, i) in rank" :key="r.name" class="row-hover">
                <td>
                  <span class="badge badge-sm" :class="i < 3 ? 'badge-primary' : 'badge-soft'">{{ i + 1 }}</span>
                </td>
                <td class="font-medium">{{ r.name }}</td>
                <td>{{ r.dept }}</td>
                <td>{{ r.count }} 单</td>
                <td>{{ r.avg }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
