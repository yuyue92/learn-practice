<script setup>
import { reactive } from 'vue'
import { menuTree } from '../../menu.js'
import MenuIcon from '../../components/MenuIcon.vue'

const expanded = reactive(new Set(menuTree.filter((m) => m.children).map((m) => m.title)))

function toggle(title) {
  if (expanded.has(title)) expanded.delete(title)
  else expanded.add(title)
}
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between flex-wrap gap-3">
      <div>
        <h1 class="font-bold text-2xl">菜单管理</h1>
        <p class="text-sm text-base-content/60 mt-1">当前侧边栏菜单的真实配置数据（来自 src/menu.js）。</p>
      </div>
      <button class="btn btn-primary btn-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m-7-7h14"/></svg>
        新增菜单
      </button>
    </div>

    <div class="card bg-base-100 border border-base-300">
      <div class="card-body">
        <div class="overflow-x-auto rounded-box border border-base-300">
          <table class="table">
            <thead>
              <tr class="bg-base-200/60 text-xs uppercase tracking-wide">
                <th>菜单名称</th><th>路由路径</th><th class="w-24">图标</th><th class="w-24">类型</th><th class="w-20">状态</th><th class="w-24">操作</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="item in menuTree" :key="item.title">
                <tr class="row-hover">
                  <td>
                    <button
                      v-if="item.children"
                      type="button"
                      class="flex items-center gap-1.5 font-medium"
                      @click="toggle(item.title)"
                    >
                      <MenuIcon name="chevron" class="size-3 transition-transform" :style="{ transform: expanded.has(item.title) ? 'rotate(90deg)' : 'rotate(0deg)' }" />
                      {{ item.title }}
                    </button>
                    <span v-else class="font-medium pl-[18px]">{{ item.title }}</span>
                  </td>
                  <td class="text-base-content/50">{{ item.path || '—' }}</td>
                  <td><MenuIcon :name="item.icon" class="size-4 text-base-content/50" /></td>
                  <td><span class="badge badge-sm badge-soft">{{ item.children ? '目录' : '菜单' }}</span></td>
                  <td><input type="checkbox" checked class="switch switch-primary switch-sm" /></td>
                  <td>
                    <div class="flex gap-1">
                      <button class="btn btn-text btn-xs">编辑</button>
                    </div>
                  </td>
                </tr>
                <template v-if="item.children">
                  <tr v-for="child in item.children" v-show="expanded.has(item.title)" :key="child.path" class="row-hover">
                    <td class="pl-10 text-base-content/80">{{ child.title }}</td>
                    <td class="text-base-content/50">{{ child.path }}</td>
                    <td class="text-base-content/30">—</td>
                    <td><span class="badge badge-sm badge-soft">菜单</span></td>
                    <td><input type="checkbox" checked class="switch switch-primary switch-sm" /></td>
                    <td>
                      <div class="flex gap-1">
                        <button class="btn btn-text btn-xs">编辑</button>
                      </div>
                    </td>
                  </tr>
                </template>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
