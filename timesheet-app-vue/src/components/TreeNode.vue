<template>
  <li>
    <div
      class="tree-node"
      :data-selected="isSelected || undefined"
      @click="handleClick"
    >
      <span class="tree-arrow">
        {{ hasChildren ? (open ? '▾' : '▸') : '·' }}
      </span>
      {{ node.label }}
    </div>

    <ul v-if="hasChildren && open">
      <TreeNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :selected-id="selectedId"
        :default-open="child.id === 'itd'"
        @select="$emit('select', $event)"
      />
    </ul>
  </li>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  node:        { type: Object,  required: true },
  selectedId:  { type: String,  default: null  },
  defaultOpen: { type: Boolean, default: false },
})

const emit = defineEmits(['select'])

const open       = ref(props.defaultOpen)
const hasChildren = computed(() => props.node.children && props.node.children.length > 0)
const isSelected  = computed(() => props.node.id === props.selectedId)

function handleClick() {
  if (hasChildren.value) open.value = !open.value
  emit('select', props.node)
}
</script>

<style scoped>
li { list-style: none; }
ul { list-style: none; margin: 0; padding-left: 18px; }

.tree-node {
  display: flex; align-items: center; gap: 6px;
  padding: 7px 8px; border-radius: 8px;
  font-size: 14px; cursor: pointer;
  user-select: none; transition: background 0.15s;
}
.tree-node:hover { background: #f0f7ff; }
.tree-node[data-selected] {
  background: #eaf4ff; color: #0b5cab; font-weight: 700;
}
.tree-arrow {
  width: 14px; text-align: center; font-size: 12px;
  color: #94a3b8; flex-shrink: 0;
}
.tree-node[data-selected] .tree-arrow { color: #0b5cab; }
</style>
