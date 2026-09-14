<script setup>
import { reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import { menuTree } from '../menu.js'
import MenuIcon from './MenuIcon.vue'

const props = defineProps({
  collapsed: { type: Boolean, default: false },
})

const route = useRoute()
const openGroups = reactive(new Set())

function groupContainsCurrent(item) {
  return item.children?.some((c) => c.path === route.path)
}

// 默认展开当前路由所在的分组
menuTree.forEach((item) => {
  if (item.children && groupContainsCurrent(item)) openGroups.add(item.title)
})

watch(
  () => route.path,
  () => {
    menuTree.forEach((item) => {
      if (item.children && groupContainsCurrent(item)) openGroups.add(item.title)
    })
  }
)

function toggleGroup(title) {
  if (openGroups.has(title)) openGroups.delete(title)
  else openGroups.add(title)
}
</script>

<template>
  <nav class="menu p-2 gap-0.5 text-sm">
    <template v-for="item in menuTree" :key="item.title">
      <!-- 一级叶子节点（无子菜单，如工作台） -->
      <router-link
        v-if="!item.children"
        :to="item.path"
        class="flex items-center gap-3 rounded-field px-3 py-2.5 font-medium transition-colors"
        :class="route.path === item.path
          ? 'bg-primary text-primary-content'
          : 'text-base-content/80 hover:bg-base-200'"
      >
        <MenuIcon :name="item.icon" class="size-[18px] shrink-0" />
        <span v-if="!collapsed">{{ item.title }}</span>
      </router-link>

      <!-- 一级分组节点 -->
      <div v-else>
        <button
          type="button"
          class="w-full flex items-center gap-3 rounded-field px-3 py-2.5 font-medium text-base-content/80 hover:bg-base-200 transition-colors"
          :class="{ 'bg-base-200': groupContainsCurrent(item) }"
          @click="toggleGroup(item.title)"
        >
          <MenuIcon :name="item.icon" class="size-[18px] shrink-0" />
          <span v-if="!collapsed" class="flex-1 text-left">{{ item.title }}</span>
          <MenuIcon
            v-if="!collapsed"
            name="chevron"
            class="size-3.5 shrink-0 transition-transform"
            :style="{ transform: openGroups.has(item.title) ? 'rotate(90deg)' : 'rotate(0deg)' }"
          />
        </button>

        <div v-show="openGroups.has(item.title) && !collapsed" class="mt-0.5 mb-1 ml-[1.65rem] pl-2.5 border-l border-base-300 flex flex-col gap-0.5">
          <router-link
            v-for="child in item.children"
            :key="child.path"
            :to="child.path"
            class="rounded-field px-3 py-2 text-[13px] transition-colors"
            :class="route.path === child.path
              ? 'bg-primary/10 text-primary font-semibold'
              : 'text-base-content/65 hover:bg-base-200 hover:text-base-content'"
          >
            {{ child.title }}
          </router-link>
        </div>
      </div>
    </template>
  </nav>
</template>
