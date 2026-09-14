<script setup>
import { ref } from 'vue'

const rooms = [
  { name: 'A栋-301', cap: 12, floor: 'A栋 3楼', equip: '投影 · 视频会议' },
  { name: 'A栋-灵感室', cap: 6, floor: 'A栋 5楼', equip: '白板 · 投屏' },
  { name: 'B栋-云端会议室', cap: 20, floor: 'B栋 8楼', equip: '投影 · 视频会议 · 录制' },
  { name: 'A栋-102', cap: 4, floor: 'A栋 1楼', equip: '投屏' },
]

const slots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']

// 0 = 空闲, 1 = 已预订, 2 = 我预订的
const bookingMatrix = ref([
  [0, 1, 1, 0, 2, 0, 0],
  [1, 0, 0, 0, 0, 1, 1],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 1],
])

const selectedRoom = ref(0)

function toggle(roomIdx, slotIdx) {
  const v = bookingMatrix.value[roomIdx][slotIdx]
  if (v === 1) return
  bookingMatrix.value[roomIdx][slotIdx] = v === 2 ? 0 : 2
}

function cellClass(v) {
  if (v === 1) return 'bg-base-300 text-base-content/40 cursor-not-allowed'
  if (v === 2) return 'bg-primary text-primary-content cursor-pointer'
  return 'bg-base-100 border border-dashed border-base-300 hover:border-primary text-base-content/50 cursor-pointer'
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="font-bold text-2xl">会议室预订</h1>
      <p class="text-sm text-base-content/60 mt-1">点击空闲时段即可快速预订，蓝色为你已预订的时段。</p>
    </div>

    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <button
        v-for="(r, i) in rooms"
        :key="r.name"
        type="button"
        class="card border transition-colors text-left"
        :class="selectedRoom === i ? 'border-primary bg-primary/5' : 'border-base-300 bg-base-100 hover:border-primary/40'"
        @click="selectedRoom = i"
      >
        <div class="card-body p-4">
          <p class="font-semibold text-sm">{{ r.name }}</p>
          <p class="text-xs text-base-content/50">{{ r.floor }} · 容纳 {{ r.cap }} 人</p>
          <p class="text-xs text-base-content/40 mt-1">{{ r.equip }}</p>
        </div>
      </button>
    </div>

    <div class="card bg-base-100 border border-base-300">
      <div class="card-body">
        <div class="flex items-center justify-between mb-4">
          <h3 class="card-title text-base">{{ rooms[selectedRoom].name }} · 今日排期</h3>
          <div class="flex items-center gap-4 text-xs text-base-content/50">
            <span class="flex items-center gap-1.5"><span class="size-2.5 rounded-sm bg-base-100 border border-dashed border-base-300"></span>空闲</span>
            <span class="flex items-center gap-1.5"><span class="size-2.5 rounded-sm bg-base-300"></span>已占用</span>
            <span class="flex items-center gap-1.5"><span class="size-2.5 rounded-sm bg-primary"></span>我的预订</span>
          </div>
        </div>
        <div class="overflow-x-auto">
          <div class="min-w-[560px] grid grid-cols-7 gap-2">
            <button
              v-for="(v, si) in bookingMatrix[selectedRoom]"
              :key="si"
              type="button"
              class="rounded-field py-3 text-xs font-medium transition-colors flex flex-col items-center gap-1"
              :class="cellClass(v)"
              @click="toggle(selectedRoom, si)"
            >
              <span>{{ slots[si] }}</span>
              <span class="text-[10px] opacity-70">{{ v === 1 ? '已占用' : v === 2 ? '我的预订' : '可预订' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
