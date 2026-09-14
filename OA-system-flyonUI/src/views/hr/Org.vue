<script setup>
const org = {
  name: '陈总',
  title: '总经理',
  children: [
    {
      name: '王梓涵', title: '行政部 · 总监',
      children: [
        { name: '刘子墨', title: '行政专员' },
        { name: '杨梦琪', title: '前台文员' },
      ],
    },
    {
      name: '李思远', title: '人事部 · 总监',
      children: [
        { name: '张雨桐', title: 'HRBP' },
        { name: '赵天佑', title: '招聘专员' },
      ],
    },
    {
      name: '周雅静', title: '财务部 · 总监',
      children: [
        { name: '吴俊杰', title: '会计' },
        { name: '孙艺凡', title: '出纳' },
      ],
    },
    {
      name: '陈曦', title: '研发部 · 总监',
      children: [
        { name: '王梓涵', title: '前端工程师' },
        { name: '李思远', title: '后端工程师' },
        { name: '张雨桐', title: '测试工程师' },
      ],
    },
  ],
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="font-bold text-2xl">组织架构</h1>
      <p class="text-sm text-base-content/60 mt-1">公司汇报关系与部门负责人一览。</p>
    </div>

    <div class="card bg-base-100 border border-base-300">
      <div class="card-body overflow-x-auto">
        <div class="min-w-[820px] flex flex-col items-center gap-6 py-4">
          <!-- 总经理 -->
          <div class="card bg-primary text-primary-content w-48">
            <div class="card-body p-4 items-center text-center gap-1">
              <div class="avatar"><div class="w-10 rounded-full bg-primary-content/20 grid place-items-center text-sm font-semibold">{{ org.name.slice(-2) }}</div></div>
              <p class="font-semibold text-sm">{{ org.name }}</p>
              <p class="text-xs opacity-80">{{ org.title }}</p>
            </div>
          </div>

          <div class="w-px h-6 bg-base-300"></div>
          <div class="w-full flex justify-center">
            <div class="h-px bg-base-300" style="width: 85%"></div>
          </div>

          <!-- 部门负责人 -->
          <div class="w-full flex justify-around flex-wrap gap-4">
            <div v-for="dept in org.children" :key="dept.name" class="flex flex-col items-center gap-4">
              <div class="w-px h-4 bg-base-300"></div>
              <div class="card bg-base-100 border-2 border-primary/30 w-44">
                <div class="card-body p-3 items-center text-center gap-1">
                  <div class="avatar"><div class="w-9 rounded-full bg-primary/15 text-primary grid place-items-center text-xs font-semibold">{{ dept.name.slice(-2) }}</div></div>
                  <p class="font-semibold text-sm">{{ dept.name }}</p>
                  <p class="text-xs text-base-content/50">{{ dept.title }}</p>
                </div>
              </div>
              <div class="w-px h-4 bg-base-300"></div>
              <div class="flex flex-col gap-2">
                <div v-for="m in dept.children" :key="m.name" class="card bg-base-100 border border-base-300 w-40">
                  <div class="card-body p-2.5 flex-row items-center gap-2">
                    <div class="avatar"><div class="w-7 rounded-full bg-base-200 text-base-content grid place-items-center text-[10px] font-semibold">{{ m.name.slice(-2) }}</div></div>
                    <div class="min-w-0">
                      <p class="text-xs font-medium truncate">{{ m.name }}</p>
                      <p class="text-[10px] text-base-content/50 truncate">{{ m.title }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
