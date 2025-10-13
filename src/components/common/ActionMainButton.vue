<!-- filepath: d:\scm-link\scm-link-fe\src\components\common\ActionButton.vue -->
<template>
  <button
    :class="btnClass"
    @click="$emit('click')"
  >
    <svg v-if="icon === 'detail'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <svg v-else-if="icon === 'edit'" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 20h9" />
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16.5 3.5a2.121 2.121 0 113 3L7 19.5l-4 1 1-4L16.5 3.5z" />
    </svg>
    <svg v-else-if="icon === 'plus'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
    </svg>
    <slot>{{ text }}</slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{
  text?: string
  icon?: 'detail' | 'edit' | 'plus'
  type?: 'detail' | 'update' | 'receive' | 'create'
}>()

const btnClass = computed(() => {
  if (props.type === 'detail') {
    return 'inline-flex items-center gap-2 rounded-lg border border-brand-600 bg-brand-50 px-3 py-1.5 text-sm font-semibold text-brand-700 hover:bg-brand-100 hover:border-brand-700 transition duration-150 shadow'
  }
  if (props.type === 'create') {
    return 'inline-flex items-center gap-2 rounded-lg border border-brand-600 bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 hover:border-brand-700 transition duration-150 shadow'
  }
  if (props.type === 'receive') {
    return 'inline-flex items-center gap-2 rounded-lg border border-green-600 bg-green-50 px-3 py-1.5 text-sm font-semibold text-green-700 hover:bg-green-100 hover:border-green-700 transition duration-150 shadow'
  }
  // default update
  return 'inline-flex items-center gap-2 rounded-lg border border-green-600 bg-green-50 px-3 py-1.5 text-sm font-semibold text-green-700 hover:bg-green-100 hover:border-green-700 transition duration-150 shadow'
})
</script>