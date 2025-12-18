<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="fixed top-20 right-4 w-[90%] max-w-sm z-[999999]"
      :class="['rounded-xl border p-4 shadow-lg', variantClasses[variant].container]"
    >
      <div class="flex items-start gap-3">
        <div :class="variantClasses[variant].icon">
          <component :is="icons[variant]" />
        </div>
        <div>
          <h4 class="font-semibold">{{ title }}</h4>
          <p class="text-sm">{{ message }}</p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { SuccessIcon, ErrorIcon, WarningIcon, InfoCircleIcon } from '@/icons'

defineProps({
  variant: { type: String, default: 'info' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  visible: { type: Boolean, default: true }
})

const variantClasses = {
  success: { container: 'border-green-500 bg-green-50', icon: 'text-green-500' },
  error: { container: 'border-red-500 bg-red-50', icon: 'text-red-500' },
  warning: { container: 'border-yellow-500 bg-yellow-50', icon: 'text-yellow-500' },
  info: { container: 'border-blue-500 bg-blue-50', icon: 'text-blue-500' }
}

const icons = {
  success: SuccessIcon,
  error: ErrorIcon,
  warning: WarningIcon,
  info: InfoCircleIcon
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(50px);
}
</style>
