<script setup>
import { ref } from 'vue'

const roles = ref([
  { name: '超级管理员', desc: '拥有系统全部功能权限', users: 1 },
  { name: '部门主管', desc: '可审批本部门相关申请', users: 8 },
  { name: '财务专员', desc: '可查看与处理财务相关单据', users: 3 },
  { name: '普通员工', desc: '仅可发起申请与查看个人信息', users: 174 },
])
const activeRole = ref(roles.value[1])

const permGroups = [
  {
    title: '审批中心',
    perms: [
      { name: '请假申请', view: true, edit: true, approve: true },
      { name: '报销申请', view: true, edit: true, approve: true },
      { name: '出差申请', view: true, edit: false, approve: true },
      { name: '采购申请', view: true, edit: false, approve: false },
    ],
  },
  {
    title: '人事管理',
    perms: [
      { name: '员工档案', view: true, edit: false, approve: false },
      { name: '考勤管理', view: true, edit: true, approve: false },
      { name: '薪资管理', view: false, edit: false, approve: false },
    ],
  },
  {
    title: '系统设置',
    perms: [
      { name: '用户管理', view: false, edit: false, approve: false },
      { name: '角色权限', view: false, edit: false, approve: false },
    ],
  },
]
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="font-bold text-2xl">角色权限</h1>
      <p class="text-sm text-base-content/60 mt-1">按角色配置菜单可见性与操作权限。</p>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <div class="card bg-base-100 border border-base-300">
        <div class="card-body p-3">
          <button class="btn btn-primary btn-sm btn-block mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m-7-7h14"/></svg>
            新建角色
          </button>
          <ul class="flex flex-col gap-1">
            <li v-for="r in roles" :key="r.name">
              <button
                type="button"
                class="w-full text-left rounded-field px-3 py-2.5 transition-colors"
                :class="activeRole.name === r.name ? 'bg-primary/10' : 'hover:bg-base-200'"
                @click="activeRole = r"
              >
                <p class="text-sm font-medium" :class="activeRole.name === r.name && 'text-primary'">{{ r.name }}</p>
                <p class="text-xs text-base-content/50 mt-0.5">{{ r.desc }}</p>
                <p class="text-xs text-base-content/40 mt-1">{{ r.users }} 人</p>
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div class="lg:col-span-2 card bg-base-100 border border-base-300">
        <div class="card-body">
          <div class="flex items-center justify-between mb-4">
            <h3 class="card-title text-base">{{ activeRole.name }} · 权限配置</h3>
            <button class="btn btn-primary btn-sm">保存配置</button>
          </div>

          <div class="space-y-6">
            <div v-for="group in permGroups" :key="group.title">
              <p class="text-xs font-semibold text-base-content/50 mb-2">{{ group.title }}</p>
              <div class="overflow-x-auto rounded-box border border-base-300">
                <table class="table">
                  <thead>
                    <tr class="bg-base-200/60 text-xs uppercase tracking-wide">
                      <th>功能</th><th class="w-20">查看</th><th class="w-20">编辑</th><th class="w-20">审批</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="p in group.perms" :key="p.name" class="row-hover">
                      <td class="font-medium">{{ p.name }}</td>
                      <td><input type="checkbox" v-model="p.view" class="checkbox checkbox-primary checkbox-sm" /></td>
                      <td><input type="checkbox" v-model="p.edit" class="checkbox checkbox-primary checkbox-sm" /></td>
                      <td><input type="checkbox" v-model="p.approve" class="checkbox checkbox-primary checkbox-sm" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
