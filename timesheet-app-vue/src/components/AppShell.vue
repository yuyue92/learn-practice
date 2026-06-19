<template>
  <div>
    <div class="topbar">
      <div class="logo">TS</div>
      <div>
        <div class="product">Timesheet Management System</div>
        <div class="sub">Internal Staff Portal</div>
      </div>
      <div class="spacer" />
      <span class="pill">DD/MM/YYYY</span>
      <div class="avatar">
        <div class="dot">CW</div>
        <div>Chris Wong ▼</div>
      </div>
    </div>
    <div class="layout">
      <aside class="side">
        <div class="nav-title">Main Menu</div>
        <nav class="nav">
          <RouterLink
            v-for="p in PAGES"
            :key="p.id"
            :to="`/${p.id}`"
            :class="{ active: route.path === `/${p.id}` }"
          >
            <span class="icon">{{ p.icon }}</span>
            {{ p.label }}
          </RouterLink>
        </nav>
      </aside>
      <main class="main-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { PAGES } from '../data/mockData'

const route = useRoute()
</script>
