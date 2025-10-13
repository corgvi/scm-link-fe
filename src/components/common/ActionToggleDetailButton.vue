<!-- src/components/common/ActionDetailButton.vue -->
<template>
  <button
    :class="btnClass"
    @click="$emit('click')"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="w-5 h-5 transition-transform duration-300"
      :style="{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M19 9l-7 7-7-7"
      />
    </svg>
    <span class="font-semibold">{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  expanded?: boolean
  label?: string
}>()

const btnClass =
  'inline-flex items-center gap-2 rounded-lg border border-brand-600 bg-brand-50 px-3 py-1.5 text-sm font-semibold text-brand-700 hover:bg-brand-100 hover:border-brand-700 hover:text-brand-700 transition duration-150 shadow'
</script>
