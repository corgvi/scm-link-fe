<template>
  <div
    v-if="totalPages > 1"
    class="flex flex-col items-center justify-between border-t border-gray-200 px-5 py-4 sm:flex-row dark:border-gray-800 mt-4"
  >
    <!-- Left summary -->
    <div class="pb-3 sm:pb-0">
      <span class="block text-sm font-medium text-gray-500 dark:text-gray-400">
        Showing
        <span class="text-gray-800 dark:text-white/90">{{ start }}</span>
        to
        <span class="text-gray-800 dark:text-white/90">{{ end }}</span>
        of
        <span class="text-gray-800 dark:text-white/90">{{ totalElements }}</span>
      </span>
    </div>

    <!-- Controls -->
    <div class="flex items-center gap-2">
      <button
        class="pagination-btn"
        :class="current === 1 ? 'opacity-50 cursor-not-allowed' : ''"
        @click="$emit('page-change', current - 1)"
        :disabled="current === 1"
      >
        <span>
          <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M2.58203 9.99868C2.58174 10.1909 2.6549 10.3833 2.80152 10.53L7.79818 15.5301C8.09097 15.8231 8.56584 15.8233 8.85883 15.5305C9.15183 15.2377 9.152 14.7629 8.85921 14.4699L5.13911 10.7472L16.6665 10.7472C17.0807 10.7472 17.4165 10.4114 17.4165 9.99715C17.4165 9.58294 17.0807 9.24715 16.6665 9.24715L5.14456 9.24715L8.85919 5.53016C9.15199 5.23717 9.15184 4.7623 8.85885 4.4695C8.56587 4.1767 8.09099 4.17685 7.79819 4.46984L2.84069 9.43049C2.68224 9.568 2.58203 9.77087 2.58203 9.99715C2.58203 9.99766 2.58203 9.99817 2.58203 9.99868Z"
              fill=""
            ></path>
          </svg>
        </span>
      </button>

      <ul class="hidden items-center gap-0.5 sm:flex">
        <li v-for="page in visiblePages" :key="page">
          <a
            href="#"
            @click.prevent="$emit('page-change', page)"
            :class="[
              'flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition',
              page === current
                ? 'bg-brand-500 text-white'
                : 'hover:bg-brand-500 hover:text-white',
            ]"
          >
            {{ page }}
          </a>
        </li>
      </ul>

      <button
        class="pagination-btn"
        :class="current === totalPages ? 'opacity-50 cursor-not-allowed' : ''"
        @click="$emit('page-change', current + 1)"
        :disabled="current === totalPages"
      >
        <span>
          <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M17.4165 9.9986C17.4168 10.1909 17.3437 10.3832 17.197 10.53L12.2004 15.5301C11.9076 15.8231 11.4327 15.8233 11.1397 15.5305C10.8467 15.2377 10.8465 14.7629 11.1393 14.4699L14.8594 10.7472L3.33203 10.7472C2.91782 10.7472 2.58203 10.4114 2.58203 9.99715C2.58203 9.58294 2.91782 9.24715 3.33203 9.24715L14.854 9.24715L11.1393 5.53016C10.8465 5.23717 10.8467 4.7623 11.1397 4.4695C11.4327 4.1767 11.9075 4.17685 12.2003 4.46984L17.1578 9.43049C17.3163 9.568 17.4165 9.77087 17.4165 9.99715C17.4165 9.99763 17.4165 9.99812 17.4165 9.9986Z"
              fill=""
            ></path>
          </svg>
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  currentPage: number
  totalPages: number
  totalElements: number
  itemsPerPage: number
}

const props = withDefaults(defineProps<Props>(), {
  currentPage: 1,        // giá trị mặc định nếu cha không truyền
  totalPages: 1,
  totalElements: 0,
  itemsPerPage: 10,
})

// Bây giờ TS biết chắc chắn props không bao giờ undefined
const start = computed(() => 
  props.totalElements === 0 ? 0 : (props.currentPage - 1) * props.itemsPerPage + 1
)

const end = computed(() => 
  Math.min(props.currentPage * props.itemsPerPage, props.totalElements)
)

const visiblePages = computed(() => {
  const total = props.totalPages
  const current = props.currentPage
  const maxButtons = 5
  const pages: number[] = []

  let startPage = Math.max(1, current - Math.floor(maxButtons / 2))
  let endPage = Math.min(total, startPage + maxButtons - 1)

  if (endPage - startPage + 1 < maxButtons) {
    startPage = Math.max(1, endPage - maxButtons + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }
  return pages
})
</script>
