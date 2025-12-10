// composables/useDebounce.ts
import { ref } from 'vue'

export function useDebounce<T extends (...args: any[]) => any>(fn: T, delay = 300) {
  const timer = ref<number | null>(null)
  return (...args: Parameters<T>) => {
    if (timer.value) clearTimeout(timer.value)
    timer.value = window.setTimeout(() => fn(...args), delay)
  }
}