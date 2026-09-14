<script setup>
import { ref } from 'vue'

const users = ref([
  { name: '陈嘉琪', account: 'chenjiaqi', dept: '行政部', role: '超级管理员', enabled: true, lastLogin: '2026-09-13 09:02' },
  { name: '王梓涵', account: 'wangzh', dept: '研发部', role: '普通员工', enabled: true, lastLogin: '2026-09-13 08:47' },
  { name: '李思远', account: 'lisiyuan', dept: '市场部', role: '部门主管', enabled: true, lastLogin: '2026-09-12 18:20' },
  { name: '张雨桐', account: 'zhangyt', dept: '研发部', role: '普通员工', enabled: true, lastLogin: '2026-09-12 17:55' },
  { name: '刘子墨', account: 'liuzimo', dept: '产品部', role: '部门主管', enabled: false, lastLogin: '2026-08-30 10:11' },
  { name: '周雅静', account: 'zhouyj', dept: '财务部', role: '财务专员', enabled: true, lastLogin: '2026-09-13 09:10' },
])

const roleCls = {
  超级管理员: 'badge-error', 部门主管: 'badge-warning', 财务专员: 'badge-info', 普通员工: 'badge-soft',
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="font-bold text-2xl">用户管理</h1>
      <p class="text-sm text-base-content/60 mt-1">系统账号、所属部门与角色分配管理。</p>
    </div>

    <div class="flex flex-wrap items-center gap-2 mb-4">
      <label class="input input-sm w-56">
        <svg xmlns="http://www.w3.org/2000/svg" class="size-4 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path stroke-linecap="round" d="m21 21-4.3-4.3"/></svg>
        <input type="search" placeholder="搜索姓名 / 账号…" />
      </label>
      <div class="flex-1"></div>
      <button class="btn btn-primary btn-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m-7-7h14"/></svg>
        新建用户
      </button>
    </div>

    <div class="card bg-base-100 border border-base-300">
      <div class="card-body">
        <div class="overflow-x-auto rounded-box border border-base-300">
          <table class="table">
            <thead>
              <tr class="bg-base-200/60 text-xs uppercase tracking-wide">
                <th>用户</th><th>账号</th><th>部门</th><th>角色</th><th>状态</th><th>最近登录</th><th class="w-24">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="u in users" :key="u.account" class="row-hover">
                <td>
                  <div class="flex items-center gap-2">
                    <div class="avatar"><div class="w-7 rounded-full bg-primary/15 text-primary grid place-items-center text-[10px] font-semibold">{{ u.name.slice(-2) }}</div></div>
                    {{ u.name }}
                  </div>
                </td>
                <td class="text-base-content/60">{{ u.account }}</td>
                <td>{{ u.dept }}</td>
                <td><span class="badge badge-sm" :class="roleCls[u.role]">{{ u.role }}</span></td>
                <td>
                  <input type="checkbox" v-model="u.enabled" class="switch switch-primary switch-sm" />
                </td>
                <td class="text-base-content/50 text-xs">{{ u.lastLogin }}</td>
                <td>
                  <details class="relative">
                    <summary class="btn btn-text btn-xs btn-square list-none cursor-pointer">⋮</summary>
                    <ul class="menu-box menu absolute right-0 mt-1 w-36 rounded-box border border-base-300 shadow-lg p-2 z-20">
                      <li><a class="dropdown-item">编辑</a></li>
                      <li><a class="dropdown-item">重置密码</a></li>
                      <li><a class="dropdown-item text-error">删除</a></li>
                    </ul>
                  </details>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
