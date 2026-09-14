<script setup>
defineProps({
  name: { type: String, default: 'dot' },
  class: { type: String, default: 'size-[18px]' },
})

const paths = {
  dashboard: 'M3 13h8V3H3v10Zm10 8h8V11h-8v10ZM3 21h8v-6H3v6ZM13 3v6h8V3h-8Z',
  inbox: 'M4 4h16l-1.5 9H16a4 4 0 0 1-8 0H5.5L4 4ZM4 13v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6',
  approval: 'M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  admin: 'M4 21V9l8-6 8 6v12M9 21v-6h6v6M4 9h16',
  hr: 'M17 20h5v-2a4 4 0 0 0-3-3.87M9 20H4v-2a4 4 0 0 1 3-3.87m5-.13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm6-6a4 4 0 1 1 0-8',
  finance: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
  knowledge: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15Z',
  project: 'M9 3v4M15 3v4M3 9h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z',
  report: 'M3 3v18h18M7 15l3-4 3 3 5-7',
  system: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7.4-3a7.4 7.4 0 0 1-.15 1.5l2 1.6-2 3.4-2.35-1a7.6 7.6 0 0 1-2.6 1.5L13.8 21h-4l-.5-2.5a7.6 7.6 0 0 1-2.6-1.5l-2.35 1-2-3.4 2-1.6A7.4 7.4 0 0 1 4.2 12a7.4 7.4 0 0 1 .15-1.5l-2-1.6 2-3.4 2.35 1a7.6 7.6 0 0 1 2.6-1.5L9.8 3h4l.5 2.5a7.6 7.6 0 0 1 2.6 1.5l2.35-1 2 3.4-2 1.6c.1.5.15 1 .15 1.5Z',
  dot: 'M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0',
  bell: 'M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 0 0-4-5.65V5a2 2 0 1 0-4 0v.35A6 6 0 0 0 6 11v3.2a2 2 0 0 1-.6 1.4L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm10 2-4.35-4.35',
  logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  chevron: 'm9 18 6-6-6-6',
}
</script>

<template>
  <svg :class="$props.class" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path :d="paths[name] || paths.dot" />
  </svg>
</template>
