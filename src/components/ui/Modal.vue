<template>
  <div class="fixed inset-0 flex items-center justify-center z-[999999]">
    <!-- Backdrop -->
    <div
      v-if="fullScreenBackdrop"
      class="fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-[32px]"
      @click="$emit('close')"
    ></div>

    <!-- Nội dung modal -->
    <div class="relative z-10 w-full max-w-2xl 
             bg-white dark:bg-gray-900 
             rounded-lg shadow-xl p-6 
             overflow-y-auto max-h-[90vh]">
      <slot name="body"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ModalProps {
  fullScreenBackdrop?: boolean
}
defineProps<ModalProps>()
defineEmits(['close'])
</script>
