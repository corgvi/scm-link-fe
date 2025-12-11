<template>
  <AdminLayout>
    <PageBreadcrumb pageTitle="Inventory Transactions" />

    <!-- Overview -->
    <div
      class="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Overview</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Summary of all inventory movements
          </p>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div
          class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
        >
          <p class="text-gray-500 dark:text-gray-400">Total Transactions</p>
          <p class="text-2xl font-semibold text-gray-800 dark:text-white">
            {{ totalElements }}
          </p>
        </div>
        <div
          class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
        >
          <p class="text-gray-500 dark:text-gray-400">Positive</p>
          <p class="text-2xl font-semibold text-green-600">
            {{ positiveTransactions }}
          </p>
        </div>
        <div
          class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
        >
          <p class="text-gray-500 dark:text-gray-400">Negative</p>
          <p class="text-2xl font-semibold text-red-600">{{ negativeTransactions }}</p>
        </div>
        <div
          class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
        >
          <p class="text-gray-500 dark:text-gray-400">Pending</p>
          <p class="text-2xl font-semibold text-yellow-600">{{ pendingTransactions }}</p>
        </div>
      </div>
    </div>

    <!-- Table + Search + Filter -->
    <div
      class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div
        class="flex flex-col gap-4 border-b border-gray-200 px-5 py-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">
            Inventory Transactions
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Monitor movement of inventory in your system
          </p>
        </div>

        <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
          <!-- Search -->
          <div class="relative">
            <span class="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              v-model="filters.keyword"
              type="text"
              placeholder="Search SKU..."
              class="h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-11 pr-4 text-sm placeholder:text-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </div>

          <!-- Filter Transaction Type -->
          <select
            v-model="filters.transactionType"
            class="rounded-lg border px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:text-white"
          >
            <option value="">All Types</option>
            <option value="PENDING">PENDING</option>
            <option value="DELIVERING">DELIVERING</option>
            <option value="DELIVERY_COMPLETED">DELIVERY_COMPLETED</option>
            <option value="DELIVERY_CANCELLED">DELIVERY_CANCELLED</option>
            <option value="RECEIVING">RECEIVING</option>
            <option value="RESERVED">RESERVED</option>
            <option value="INCREMENT">INCREMENT</option>
            <option value="ROLLBACK">ROLLBACK</option>
            <option value="SHIPPING">SHIPPING</option>
            <option value="OUTBOUND">OUTBOUND</option>
            <option value="ADJUSTMENT">ADJUSTMENT</option>
          </select>

          <!-- Export -->
          <button
            @click="exportCSV"
            class="flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="p-12 text-center">
        <span
          class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"
        ></span>
      </div>

      <!-- Table -->
      <div v-else class="custom-scrollbar overflow-x-auto">
        <table class="w-full table-auto">
          <thead>
            <tr
              class="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900"
            >
              <th class="p-4 text-left text-xs font-bold">#</th>
              <th class="p-4 text-left text-xs font-bold">Type</th>
              <th class="p-4 text-left text-xs font-bold">SKU</th>
              <th class="p-4 text-left text-xs font-bold">Product</th>
              <th class="p-4 text-left text-xs font-bold">Warehouse</th>
              <th class="p-4 text-left text-xs font-bold">Qty Change</th>
              <th class="p-4 text-left text-xs font-bold">User</th>
              <th class="p-4 text-left text-xs font-bold">Date</th>
              <th class="p-4 text-left text-xs font-bold">Note</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
            <tr
              v-for="(tx, idx) in transactions"
              :key="tx.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-900 transition"
            >
              <td class="p-4 text-sm">
                {{ (currentPage - 1) * itemsPerPage + idx + 1 }}
              </td>

              <td class="p-4">
                <span class="px-2 py-1 rounded-lg text-xs font-semibold" :class="badgeClass(tx.transactionType)">
                  {{ tx.transactionType }}
                </span>
              </td>

              <td class="p-4 text-sm">{{ tx.inventoryLevel?.product?.sku }}</td>
              <td class="p-4 text-sm">{{ tx.inventoryLevel?.product?.name }}</td>
              <td class="p-4 text-sm">{{ tx.inventoryLevel?.warehouse?.name }}</td>

              <td class="p-4 text-sm font-semibold" :class="tx.quantityChange >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ tx.quantityChange }}
              </td>

              <td class="p-4 text-sm">{{ tx.createdBy }}</td>

              <td class="p-4 text-sm">
                {{ formatDate(tx.createdAt) }}
              </td>

              <td class="p-4 text-sm">{{ tx.note || '-' }}</td>
            </tr>

            <tr v-if="transactions.length === 0">
              <td colspan="9" class="p-12 text-center text-gray-400">No transactions found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        class="flex items-center justify-between border-t border-gray-200 px-5 py-4 dark:border-gray-800"
      >
        <div class="text-sm text-gray-500">
          Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
          {{ Math.min(currentPage * itemsPerPage, totalElements) }} of
          {{ totalElements }} transactions
        </div>

        <div class="flex items-center gap-1">
          <button
            @click="previousPage"
            :disabled="currentPage === 1"
            class="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
          >
            <span>&lt;</span>
          </button>

          <button
            v-for="page in visiblePages"
            :key="page"
            @click="goToPage(page as number)"
            :class="page === currentPage ? 'bg-brand-500 text-white' : 'hover:bg-gray-100'"
            class="w-10 h-10 rounded-lg text-sm font-medium"
          >
            {{ page }}
          </button>

          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
          >
            <span>&gt;</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Filter Sidebar -->
    <FilterSidebar
      v-if="isFilterOpen"
      title="Filters"
      :fields="filterFields"
      :filters="filters"
      @apply="applyFilters"
      @reset="resetFilters"
    />
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import FilterSidebar from '@/components/layout/FilterSidebar.vue'
import { useDebounce } from '@/composables/useDebounce'

const baseURL = import.meta.env.VITE_BASE_URL
const token = localStorage.getItem('auth_token') || ''

const transactions = ref<any[]>([])
const totalPages = ref(1)
const totalElements = ref(0)
const currentPage = ref(1)
const itemsPerPage = 10
const loading = ref(false)

const isFilterOpen = ref(false)
const isPageChanging = ref(false)

const filters = reactive({
  keyword: '',
  transactionType: '',
})

const filterFields = [
  {
    key: 'transactionType',
    label: 'Transaction Type',
    type: 'select',
    options: [
      "PENDING",
      "DELIVERING",
      "DELIVERY_COMPLETED",
      "DELIVERY_CANCELLED",
      "RECEIVING",
      "RESERVED",
      "INCREMENT",
      "ROLLBACK",
      "SHIPPING",
      "OUTBOUND",
      "ADJUSTMENT",
    ],
  },
]

const triggerLoad = useDebounce(() => loadTransactions(), 400)

// LOAD TRANSACTIONS
async function loadTransactions() {
  loading.value = true
  try {
    const params = new URLSearchParams({
      page: String(currentPage.value),
      size: String(itemsPerPage),
    })

    if (filters.keyword) params.append('sku', filters.keyword)
    if (filters.transactionType) params.append('transactionType', filters.transactionType)

    const res = await fetch(`${baseURL}/scmlink/inventoryTransactions?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    const data = await res.json()
    if (data.code === 1000) {
      transactions.value = data.result.content
      totalElements.value = data.result.totalElements
      totalPages.value = data.result.totalPages
    }
  } finally {
    loading.value = false
  }
}

// WATCH FILTERS
watch(
  filters,
  () => {
    if (!isPageChanging.value) currentPage.value = 1
    triggerLoad()
  },
  { deep: true },
)

// WATCH PAGE
watch(currentPage, () => triggerLoad())

// PAGINATION FUNCTIONS
function goToPage(page: number) {
  if (page === currentPage.value) return
  isPageChanging.value = true
  currentPage.value = page
  nextTick(() => (isPageChanging.value = false))
}

function previousPage() {
  if (currentPage.value > 1) {
    isPageChanging.value = true
    currentPage.value--
    nextTick(() => (isPageChanging.value = false))
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    isPageChanging.value = true
    currentPage.value++
    nextTick(() => (isPageChanging.value = false))
  }
}

// Sidebar filter actions
function applyFilters(newFilters: any) {
  Object.assign(filters, newFilters)
  isFilterOpen.value = false
  currentPage.value = 1
  triggerLoad()
}

function resetFilters() {
  filters.keyword = ''
  filters.transactionType = ''
  isFilterOpen.value = false
  currentPage.value = 1
  triggerLoad()
}

// OVERVIEW METRICS
const positiveTransactions = computed(() =>
  transactions.value.filter((t) => t.quantityChange > 0).length,
)
const negativeTransactions = computed(() =>
  transactions.value.filter((t) => t.quantityChange < 0).length,
)
const pendingTransactions = computed(() =>
  transactions.value.filter((t) => t.transactionType === 'PENDING').length,
)

// FORMAT DATE
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString()
}

// BADGE COLOR
function badgeClass(type: string) {
  const map: any = {
    PENDING: "bg-yellow-100 text-yellow-700",
    DELIVERING: "bg-blue-100 text-blue-700",
    DELIVERY_COMPLETED: "bg-green-100 text-green-700",
    DELIVERY_CANCELLED: "bg-red-100 text-red-700",
    RECEIVING: "bg-indigo-100 text-indigo-700",
    RESERVED: "bg-purple-100 text-purple-700",
    INCREMENT: "bg-green-100 text-green-700",
    ROLLBACK: "bg-gray-200 text-gray-700",
    SHIPPING: "bg-orange-100 text-orange-700",
    OUTBOUND: "bg-rose-100 text-rose-700",
    ADJUSTMENT: "bg-sky-100 text-sky-700",
  }
  return map[type] || "bg-gray-100 text-gray-700"
}

// EXPORT CSV
function exportCSV() {
  const headers = [
    "ID,Type,SKU,Product,Warehouse,QtyChange,User,Date,Note",
  ]

  const rows = transactions.value.map((tx) =>
    [
      tx.id,
      tx.transactionType,
      tx.inventoryLevel?.product?.sku,
      tx.inventoryLevel?.product?.name,
      tx.inventoryLevel?.warehouse?.name,
      tx.quantityChange,
      tx.createdBy,
      tx.createdAt,
      tx.note || '',
    ].join(','),
  )

  const csvContent = headers.concat(rows).join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = 'inventory-transactions.csv'
  link.click()
  URL.revokeObjectURL(url)
}

onMounted(() => {
  loadTransactions()
})

// VISIBLE PAGES
const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const total = totalPages.value

  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  pages.push(1)
  if (currentPage.value > 4) pages.push("...")

  const start = Math.max(2, currentPage.value - 2)
  const end = Math.min(total - 1, currentPage.value + 2)

  for (let i = start; i <= end; i++) pages.push(i)

  if (currentPage.value < total - 3) pages.push("...")
  pages.push(total)

  return pages
})
</script>
