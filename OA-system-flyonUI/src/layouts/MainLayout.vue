<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SidebarMenu from '../components/SidebarMenu.vue'
import MenuIcon from '../components/MenuIcon.vue'
import { flattenMenu } from '../menu.js'

const route = useRoute()
const router = useRouter()

const collapsed = ref(false)
const mobileOpen = ref(false)

const flat = flattenMenu()
const crumb = computed(() => {
  const found = flat.find((i) => i.path === route.path)
  return found || { title: route.meta?.title || '页面', parentTitle: null }
})

function logout() {
  router.push('/login')
}

function toggleTheme(e) {
  document.documentElement.setAttribute('data-theme', e.target.checked ? 'dark' : 'light')
}
</script>

<template>
  <div class="flex h-full bg-base-200/50">
    <!-- 移动端遮罩 -->
    <div
      v-if="mobileOpen"
      class="fixed inset-0 bg-black/40 z-40 lg:hidden"
      @click="mobileOpen = false"
    />

    <!-- 侧边栏 -->
    <aside
      class="fixed lg:static inset-y-0 left-0 z-50 bg-base-100 border-r border-base-300 flex flex-col transition-all duration-200"
      :class="[
        collapsed ? 'lg:w-[72px]' : 'lg:w-64',
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        'w-64',
      ]"
    >
      <div class="h-16 flex items-center gap-2 px-4 border-b border-base-300 shrink-0">
        <span class="grid place-items-center size-8 rounded-lg bg-primary text-primary-content shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="size-4.5" viewBox="0 0 24 24" fill="currentColor"><path d="M4 21V9l8-6 8 6v12M9 21v-6h6v6M4 9h16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
        <span v-if="!collapsed" class="font-bold text-lg tracking-tight whitespace-nowrap">云枢 OA</span>
      </div>

      <div class="flex-1 overflow-y-auto sidebar-scroll py-2">
        <SidebarMenu :collapsed="collapsed" />
      </div>

      <button
        type="button"
        class="hidden lg:flex items-center justify-center h-11 border-t border-base-300 text-base-content/50 hover:text-base-content hover:bg-base-200 transition-colors"
        @click="collapsed = !collapsed"
      >
        <MenuIcon name="chevron" class="size-4 transition-transform" :style="{ transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)' }" />
      </button>
    </aside>

    <!-- 主体 -->
    <div class="flex-1 flex flex-col min-w-0 h-full">
      <!-- 顶部导航 -->
      <header class="h-16 shrink-0 bg-base-100 border-b border-base-300 flex items-center gap-3 px-4 lg:px-6">
        <button class="btn btn-text btn-square btn-sm lg:hidden" @click="mobileOpen = true">
          <svg xmlns="http://www.w3.org/2000/svg" class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>

        <div class="breadcrumbs text-sm hidden sm:block">
          <ul>
            <li class="text-base-content/50">{{ crumb.parentTitle || '首页' }}</li>
            <li class="font-medium">{{ crumb.title }}</li>
          </ul>
        </div>

        <div class="flex-1"></div>

        <label class="input input-sm w-52 hidden md:flex">
          <MenuIcon name="search" class="size-4 opacity-50" />
          <input type="search" placeholder="全局搜索…" />
        </label>

        <div class="relative">
          <button class="btn btn-text btn-square btn-sm">
            <MenuIcon name="bell" class="size-5" />
          </button>
          <span class="absolute top-1 right-1 size-2 rounded-full bg-error"></span>
        </div>

        <label class="swap swap-rotate btn btn-text btn-square btn-sm">
          <input type="checkbox" class="theme-controller" value="dark" @change="toggleTheme" />
          <svg class="swap-off size-5 fill-current" viewBox="0 0 24 24"><path d="M12 4.5a1 1 0 0 1 1 1V7a1 1 0 1 1-2 0V5.5a1 1 0 0 1 1-1Zm0 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm7.5-4.5a1 1 0 0 1 1-1H22a1 1 0 1 1 0 2h-1.5a1 1 0 0 1-1-1ZM2 12a1 1 0 0 1 1-1h1.5a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1Zm14.95-6.36a1 1 0 0 1 0 1.42l-1.06 1.06a1 1 0 1 1-1.42-1.42l1.06-1.06a1 1 0 0 1 1.42 0ZM7.53 17.91a1 1 0 0 1 0 1.42l-1.06 1.06a1 1 0 1 1-1.42-1.42l1.06-1.06a1 1 0 0 1 1.42 0Zm11.42 1.42a1 1 0 0 1-1.42 0l-1.06-1.06a1 1 0 1 1 1.42-1.42l1.06 1.06a1 1 0 0 1 0 1.42ZM6.47 6.47a1 1 0 0 1-1.42 0L4 5.41A1 1 0 1 1 5.41 4l1.06 1.06a1 1 0 0 1 0 1.41ZM12 17.5a1 1 0 0 1 1 1V20a1 1 0 1 1-2 0v-1.5a1 1 0 0 1 1-1Z"/></svg>
          <svg class="swap-on size-5 fill-current" viewBox="0 0 24 24"><path d="M21.64 13.65a1 1 0 0 0-1.05-.14 8 8 0 0 1-10.1-10.1 1 1 0 0 0-1.19-1.19A10 10 0 1 0 22.83 14.7a1 1 0 0 0-1.19-1.05Z"/></svg>
        </label>

        <details class="relative">
          <summary class="list-none cursor-pointer flex items-center gap-2 pl-2">
            <div class="avatar"><div class="w-8 rounded-full bg-primary text-primary-content grid place-items-center text-xs font-semibold">陈</div></div>
            <span class="text-sm font-medium hidden sm:inline">陈嘉琪</span>
          </summary>
          <ul class="menu-box menu absolute right-0 mt-2 w-48 rounded-box border border-base-300 shadow-lg p-2 z-30">
            <li class="px-2 py-1.5 text-xs text-base-content/50">行政部 · 高级专员</li>
            <li><router-link to="/profile/info" class="dropdown-item">个人信息</router-link></li>
            <li><router-link to="/profile/message" class="dropdown-item">消息通知</router-link></li>
            <li><router-link to="/profile/password" class="dropdown-item">修改密码</router-link></li>
            <li class="border-t border-base-300 mt-1 pt-1">
              <a class="dropdown-item text-error" @click="logout">
                <MenuIcon name="logout" class="size-4" /> 退出登录
              </a>
            </li>
          </ul>
        </details>
      </header>

      <!-- 页面内容 -->
      <div class="flex-1 overflow-y-auto">
        <div class="p-4 lg:p-6 max-w-[1600px] mx-auto">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
