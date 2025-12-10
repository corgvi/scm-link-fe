<template>
  <!-- Overlay -->
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
      @click="$emit('update:modelValue', false)"
    />
  </Teleport>

  <!-- Sidebar -->
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-hidden transition-all duration-300 ease-out overflow-y-auto"
      :class="modelValue ? 'translate-x-0' : 'translate-x-full'"
    >
      <!-- Header -->
      <div class="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-5 z-10">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ title }}</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Refine your search results</p>
          </div>
          <button
            @click="$emit('update:modelValue', false)"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Body -->
      <div class="px-6 py-6 space-y-7 overflow-y-auto flex-1">
        <template v-for="field in fields" :key="field.key">
          <!-- Text Input -->
          <div v-if="field.type === 'text'" class="group">
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2.5">
              {{ field.label }}
            </label>
            <div class="relative">
              <input
                v-model="localFilters[field.key]"
                type="text"
                :placeholder="`Enter ${field.label.toLowerCase()}...`"
                class="w-full px-4 py-3.5 pl-11 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 outline-none transition-all duration-200"
              />
              <div class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Multiple Select với Chip đẹp -->
          <div v-else-if="field.type === 'select-multiple'">
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2.5">
              {{ field.label }}
            </label>
            <div class="space-y-3">
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="selected in localFilters[field.key]"
                  :key="selected"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300"
                >
                  {{ selected }}
                  <button @click="removeRole(field.key, selected)" class="hover:text-brand-900">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
                <span v-if="!localFilters[field.key]?.length" class="text-gray-400 text-sm">
                  No roles selected
                </span>
              </div>

              <select
                @change="addRole(field.key, $event)"
                class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 outline-none transition-all"
              >
                <option value="" disabled selected>Choose roles...</option>
                <option v-for="opt in field.options" :key="opt" :value="opt" :disabled="localFilters[field.key]?.includes(opt)">
                  {{ opt }}
                </option>
              </select>
            </div>
          </div>
        </template>
      </div>

      <!-- Footer -->
      <div class="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-6 py-5">
        <div class="flex gap-3">
          <button
            @click="reset"
            class="flex-1 px-6 py-3.5 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            Reset All
          </button>
          <button
            @click="apply"
            class="flex-1 px-6 py-3.5 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive, watch } from "vue"

const props = defineProps({
  modelValue: Boolean,
  title: { type: String, default: "Filter Users" },
  fields: { type: Array<any>, required: true },
  filters: { type: Object, required: true }
})

const emit = defineEmits(["update:modelValue", "apply", "reset"])

const localFilters = reactive({ ...props.filters })

watch(() => props.modelValue, (open) => {
  if (open) Object.assign(localFilters, props.filters)
})

function addRole(key: string, event: Event) {
  const select = event.target as HTMLSelectElement
  const value = select.value
  if (value && !localFilters[key].includes(value)) {
    localFilters[key].push(value)
  }
  select.value = ""
}

function removeRole(key: string, role: string) {
  localFilters[key] = localFilters[key].filter((r: string) => r !== role)
}

function apply() {
  emit("apply", { ...localFilters })
  emit("update:modelValue", false)
}

function reset() {
  Object.keys(localFilters).forEach(k => {
    localFilters[k] = Array.isArray(localFilters[k]) ? [] : ""
  })
  emit("reset")
  emit("update:modelValue", false)
}
</script>

<style scoped>
select {
  scrollbar-width: thin;
}
select::-webkit-scrollbar {
  width: 6px;
}
select::-webkit-scrollbar-thumb {
  background: #94a3b8;
  border-radius: 3px;
}
</style>