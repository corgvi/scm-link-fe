<!-- SmartTable.vue -->
<template>
  <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-md">
    <!-- Header: Search + Filter + Actions -->
    <div class="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
      <div>
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">{{ title }}</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ description }}</p>
      </div>
      <slot name="actions" />
    </div>

    <!-- Toolbar -->
    <div class="flex flex-col gap-4 p-5 border-b border-gray-200 dark:border-gray-800">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
        <!-- Search -->
        <div class="relative flex-1">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <SearchIcon class="w-5 h-5" />
          </span>
          <input
            v-model="searchQuery"
            @input="debouncedSearch"
            placeholder="Search..."
            class="w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900"
          />
          <button v-if="searchQuery" @click="searchQuery = ''" class="absolute right-3 top-1/2 -translate-y-1/2">
            <XIcon class="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <!-- Filter Button -->
        <button
          @click="$emit('open-filter')"
          class="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
        >
          <FilterIcon class="w-4 h-4" />
          Filter
        </button>
      </div>
    </div>

    <!-- Table Content -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <slot name="table" />
      </table>
    </div>

    <!-- Pagination -->
    <Pagination
      :currentPage="currentPage"
      :totalPages="totalPages"
      :totalElements="totalElements"
      :itemsPerPage="itemsPerPage ?? 10"
      @page-change="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { debounce } from 'lodash-es'
import Pagination from '@/components/common/Pagination.vue';

defineProps<{
  title: string
  description?: string
  currentPage: number
  totalPages: number
  totalElements: number
  itemsPerPage?: number
}>()

const emit = defineEmits(['page-change', 'search', 'open-filter'])

const searchQuery = ref('')

const debouncedSearch = debounce(() => {
  emit('search', searchQuery.value)
}, 500)

function handlePageChange(page: number) {
  emit('page-change', page)
}

watch(searchQuery, () => {
  debouncedSearch()})
</script>