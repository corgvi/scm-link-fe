<template>
  <AdminLayout>
    <div class="p-6">
      <PageBreadcrumb pageTitle="Delivery Tracking Histories" />

      <!-- Overview -->
      <div class="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="mb-6 flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Overview</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">Quick insights into tracking histories</p>
          </div>
          <div class="flex justify-end mt-6">
            <ActionMainButton text="Refresh" icon="refresh" type="default" @click="fetchHistories(1)" />
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <p class="text-gray-500 dark:text-gray-400">Total Histories</p>
            <p class="text-2xl font-semibold text-gray-800 dark:text-white">{{ totalElements }}</p>
          </div>

          <div class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <p class="text-gray-500 dark:text-gray-400">On this page</p>
            <p class="text-2xl font-semibold text-indigo-600">{{ histories.length }}</p>
          </div>

          <div class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <p class="text-gray-500 dark:text-gray-400">Unique locations</p>
            <p class="text-2xl font-semibold text-green-600">{{ uniqueLocations }}</p>
          </div>

          <div class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <p class="text-gray-500 dark:text-gray-400">Latest timestamp</p>
            <p class="text-2xl font-semibold text-yellow-600">{{ latestTimestamp }}</p>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-md">
        <div class="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
          <div>
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Tracking Histories</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Recent location updates</p>
          </div>
        </div>

        <div v-if="loading" class="p-8 text-center text-gray-400">
          <span class="animate-spin mr-2 w-6 h-6 border-2 border-t-transparent border-gray-400 rounded-full inline-block"></span>
          Loading histories...
        </div>

        <div v-else-if="error" class="p-8 text-center text-red-500">
          {{ error }}
        </div>

        <div v-else>
          <div class="overflow-x-auto custom-scrollbar">
            <table class="w-full table-auto text-sm">
              <thead class="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th class="p-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-400">#</th>
                  <th class="p-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-400">Timestamp</th>
                  <th class="p-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-400">Latitude</th>
                  <th class="p-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-400">Longitude</th>
                  <th class="p-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-400">Location</th>
                  <th class="p-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-400">Created By</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(h, idx) in histories" :key="h.id" class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <td class="p-4">{{ (currentPage - 1) * itemsPerPage + idx + 1 }}</td>
                  <td class="p-4">{{ formatDate(h.timestamp || h.createdAt) }}</td>
                  <td class="p-4">{{ h.latitude ?? '—' }}</td>
                  <td class="p-4">{{ h.longitude ?? '—' }}</td>
                  <td class="p-4 max-w-xs truncate" :title="h.locationDescription">{{ h.locationDescription || '—' }}</td>
                  <td class="p-4">{{ h.createdBy || 'System' }}</td>
                </tr>

                <tr v-if="histories.length === 0">
                  <td colspan="6" class="p-4 text-center text-gray-400">No histories found.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="flex flex-col items-center justify-between border-t border-gray-200 px-5 py-4 sm:flex-row dark:border-gray-800 mt-4">
            <div class="pb-3 sm:pb-0">
              <span class="block text-sm font-medium text-gray-500 dark:text-gray-400">
                Showing
                <span class="text-gray-800 dark:text-white/90">{{ (currentPage - 1) * itemsPerPage + (histories.length ? 1 : 0) }}</span>
                to
                <span class="text-gray-800 dark:text-white/90">{{ (currentPage - 1) * itemsPerPage + histories.length }}</span>
                of
                <span class="text-gray-800 dark:text-white/90">{{ totalElements }}</span>
              </span>
            </div>

            <div class="flex w-full items-center justify-between gap-2 rounded-lg bg-gray-50 p-4 sm:w-auto sm:justify-normal sm:bg-transparent sm:p-0 dark:bg-white/[0.03] dark:sm:bg-transparent">
              <button class="shadow-theme-xs flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 sm:p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                      @click="previousPage" :disabled="currentPage === 1" :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''">
                    <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M2.58203 9.99868C2.58174 10.1909 2.6549 10.3833 2.80152 10.53L7.79818 15.5301C8.09097 15.8231 8.56584 15.8233 8.85883 15.5305C9.15183 15.2377 9.152 14.7629 8.85921 14.4699L5.13911 10.7472L16.6665 10.7472C17.0807 10.7472 17.4165 10.4114 17.4165 9.99715C17.4165 9.58294 17.0807 9.24715 16.6665 9.24715L5.14456 9.24715L8.85919 5.53016C9.15199 5.23717 9.15184 4.7623 8.85885 4.4695C8.56587 4.1767 8.09099 4.17685 7.79819 4.46984L2.84069 9.43049C2.68224 9.568 2.58203 9.77087 2.58203 9.99715C2.58203 9.99766 2.58203 9.99817 2.58203 9.99868Z" fill=""></path>
                </svg>
                    </button>

              <span class="block text-sm font-medium text-gray-700 sm:hidden dark:text-gray-400">Page {{ currentPage }} of {{ totalPages }}</span>

              <ul class="hidden items-center gap-0.5 sm:flex">
                <li v-for="page in visiblePages" :key="page">
                  <a href="#" @click.prevent="goToPage(page)" :class="page === currentPage ? 'bg-brand-500 text-white' : 'hover:bg-brand-500 text-gray-700 hover:text-white dark:text-gray-400 dark:hover:text-white'" class="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium">
                    {{ page }}
                  </a>
                </li>

                <li v-if="visiblePages[visiblePages.length - 1] < totalPages">
                  <span class="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium text-gray-700 dark:text-gray-400">...</span>
                </li>

                <li v-if="visiblePages[visiblePages.length - 1] < totalPages">
                  <a href="#" @click.prevent="goToPage(totalPages)" class="hover:bg-brand-500 flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium text-gray-700 hover:text-white dark:text-gray-400 dark:hover:text-white">{{ totalPages }}</a>
                </li>
              </ul>

              <button class="shadow-theme-xs flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 sm:p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                      @click="nextPage" :disabled="currentPage === totalPages" :class="currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''">
                    <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M17.4165 9.9986C17.4168 10.1909 17.3437 10.3832 17.197 10.53L12.2004 15.5301C11.9076 15.8231 11.4327 15.8233 11.1397 15.5305C10.8467 15.2377 10.8465 14.7629 11.1393 14.4699L14.8594 10.7472L3.33203 10.7472C2.91782 10.7472 2.58203 10.4114 2.58203 9.99715C2.58203 9.58294 2.91782 9.24715 3.33203 9.24715L14.854 9.24715L11.1393 5.53016C10.8465 5.23717 10.8467 4.7623 11.1397 4.4695C11.4327 4.1767 11.9075 4.17685 12.2003 4.46984L17.1578 9.43049C17.3163 9.568 17.4165 9.77087 17.4165 9.99715C17.4165 9.99763 17.4165 9.99812 17.4165 9.9986Z" fill=""></path>
                </svg>
            </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ActionMainButton from '@/components/common/ActionMainButton.vue'

const baseURL = import.meta.env.VITE_BASE_URL
const token = localStorage.getItem('auth_token') || ''

const histories = ref<any[]>([])
const loading = ref(true)
const error = ref('')

const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalPages = ref(1)
const totalElements = ref(0)
const pageNumber = ref(0)

async function fetchHistories(page = 1) {
  loading.value = true
  error.value = ''
  try {
    const pageIndex = Math.max(0, page)
    const res = await fetch(`${baseURL}/scmlink/deliveryTrackingHistories?page=${pageIndex}&size=${itemsPerPage.value}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    const pageData = data?.result || data || {}
    const content = pageData.content || []
    histories.value = Array.isArray(content) ? content : []

    totalElements.value = pageData.totalElements ?? histories.value.length
    totalPages.value = pageData.totalPages ?? Math.max(1, Math.ceil((totalElements.value || 0) / itemsPerPage.value))
    pageNumber.value = pageData.pageNumber ?? pageIndex
    currentPage.value = (pageNumber.value || 0) + 1
  } catch (e) {
    console.error(e)
    error.value = 'Network error. Please try again.'
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchHistories(1))

const uniqueLocations = computed(() => new Set(histories.value.map(h => h.locationDescription || '').filter(Boolean)).size)
const latestTimestamp = computed(() => {
  if (!histories.value.length) return '—'
  const latest = histories.value.reduce((a, b) => (new Date(a.timestamp || a.createdAt) > new Date(b.timestamp || b.createdAt) ? a : b))
  return formatDate(latest.timestamp || latest.createdAt)
})

function formatDate(d?: string) {
  if (!d) return '—'
  return new Date(d).toLocaleString('vi-VN')
}

// pagination helpers
const visiblePages = computed(() => {
  const pages: number[] = []
  const total = totalPages.value
  const maxButtons = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxButtons / 2))
  let end = Math.min(total, start + maxButtons - 1)
  if (end - start + 1 < maxButtons) start = Math.max(1, end - maxButtons + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) fetchHistories(page)
}
function previousPage() {
  if (currentPage.value > 1) fetchHistories(currentPage.value - 1)
}
function nextPage() {
  if (currentPage.value < totalPages.value) fetchHistories(currentPage.value + 1)
}
</script>