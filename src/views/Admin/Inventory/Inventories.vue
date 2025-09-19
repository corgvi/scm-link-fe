<template>
  <AdminLayout>
    <PageBreadcrumb pageTitle="Inventory Management" />

    <!-- Overview -->
    <div
      class="mb-6 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div class="mb-6 flex items-center justify-between">
        <h2 class="font-semibold text-gray-800 dark:text-white/90">Overview</h2>
      </div>
      <div
        class="grid grid-cols-1 rounded-xl border border-gray-200 sm:grid-cols-2 lg:grid-cols-4 dark:divide-gray-800 dark:border-gray-800"
      >
        <div class="border-b p-5 sm:border-r lg:border-b-0">
          <p class="mb-1.5 text-sm text-gray-400 dark:text-gray-500">
            Total Products
          </p>
          <h3 class="text-3xl text-gray-800 dark:text-white/90">
            {{ inventorySummary.length }}
          </h3>
        </div>
        <div class="border-b p-5 lg:border-b-0">
          <p class="mb-1.5 text-sm text-gray-400 dark:text-gray-500">
            Total Quantity
          </p>
          <h3 class="text-3xl text-gray-800 dark:text-white/90">
            {{ inventorySummary.reduce((sum, i) => sum + (i.totalQuantity || 0), 0) }}
          </h3>
        </div>
        <div class="border-b p-5 sm:border-r sm:border-b-0">
          <p class="mb-1.5 text-sm text-gray-400 dark:text-gray-500">Total Value</p>
          <h3 class="text-3xl text-gray-800 dark:text-white/90">
            {{ formatCurrency(inventorySummary.reduce((sum, i) => sum + (i.totalValue || 0), 0)) }}
          </h3>
        </div>
        <div class="p-5">
          <p class="mb-1.5 text-sm text-gray-400 dark:text-gray-500">Warehouses</p>
          <h3 class="text-3xl text-gray-800 dark:text-white/90">
            {{ new Set(inventorySummary.map((i) => i.warehouseName)).size }}
          </h3>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div
      class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div
        class="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800"
      >
        <div>
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Inventory</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">Manage your inventory below</p>
        </div>
        <div class="flex gap-3.5">
          <!-- Search -->
          <div class="relative">
            <span
              class="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 dark:text-gray-400"
            >
              <svg
                class="fill-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M3.04199 9.37363C3.04199 5.87693 5.87735 3.04199 9.37533 3.04199C12.8733 3.04199 15.7087 5.87693 15.7087 9.37363C15.7087 12.8703 12.8733 15.7053 9.37533 15.7053C5.87735 15.7053 3.04199 12.8703 3.04199 9.37363ZM9.37533 1.54199C5.04926 1.54199 1.54199 5.04817 1.54199 9.37363C1.54199 13.6991 5.04926 17.2053 9.37533 17.2053C11.2676 17.2053 13.0032 16.5344 14.3572 15.4176L17.1773 18.238C17.4702 18.5309 17.945 18.5309 18.2379 18.238C18.5308 17.9451 18.5309 17.4703 18.238 17.1773L15.4182 14.3573C16.5367 13.0033 17.2087 11.2669 17.2087 9.37363C17.2087 5.04817 13.7014 1.54199 9.37533 1.54199Z"
                  fill=""
                />
              </svg>
            </span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search inventory..."
              class="dark:bg-dark-900 shadow-theme-xs h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pr-4 pl-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden xl:w-[300px] dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
              aria-label="Search inventory"
            />
          </div>
        </div>
      </div>

      <div v-if="loading" class="p-8 text-center text-gray-400">Loading inventory...</div>
      <div v-else-if="error" class="p-8 text-center text-red-500">{{ error }}</div>
      <div v-else>
        <table class="w-full table-auto">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
              <th class="p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400">#</th>
              <th class="p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400">SKU</th>
              <th class="p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400">
                Product
              </th>
              <th class="p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400">
                Warehouse
              </th>
              <th class="p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400">
                Quantity
              </th>
              <th class="p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400">
                Value
              </th>
              <th class="p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400">
                Status
              </th>
              <th class="p-4 text-center text-xs font-medium text-gray-700 dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, idx) in paginatedInventory" :key="item.productId">
              <tr class="transition hover:bg-gray-50 dark:hover:bg-gray-900">
                <td class="p-4">{{ (currentPage - 1) * itemsPerPage + idx + 1 }}</td>
                <td class="p-4">{{ item.sku }}</td>
                <td class="p-4">{{ item.productName }}</td>
                <td class="p-4">{{ item.warehouseName }}</td>
                <td class="p-4">{{ item.totalQuantity }}</td>
                <td class="p-4">{{ formatCurrency(item.totalValue) }}</td>
                <td class="p-4">
                  <span
                    :class="item.status === 'IN_STOCK' ? 'text-green-600' : 'text-red-500'"
                    class="font-medium"
                  >
                    {{ item.status }}
                  </span>
                </td>
                <td class="p-4 text-center">
                  <button
                    @click="toggleExpand(item.productId)"
                    class="inline-flex items-center gap-2 rounded-lg bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-300 transition"
                  >
                    Details
                  </button>
                </td>
              </tr>
              <!-- Expand batches -->
              <tr v-if="expandedId === item.productId">
                <td colspan="8" class="p-4 bg-gray-50 dark:bg-gray-800">
                  <div v-if="batchDetails[item.productId] && batchDetails[item.productId].length" class="space-y-2">
                    <h4 class="font-semibold text-gray-700 dark:text-gray-200">Batch Details</h4>
                    <table class="w-full text-sm border border-gray-200 dark:border-gray-700">
                      <thead>
                        <tr class="bg-gray-100 dark:bg-gray-700">
                          <th class="p-2 text-left">Batch</th>
                          <th class="p-2 text-left">Created</th>
                          <th class="p-2 text-left">Expiry</th>
                          <th class="p-2 text-left">Quantity</th>
                          <th class="p-2 text-left">Cost Price</th>
                          <th class="p-2 text-left">Sell Price</th>
                          <th class="p-2 text-left">Total Cost</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="batch in batchDetails[item.productId]" :key="batch.batchNumber">
                          <td class="p-2">{{ batch.batchNumber }}</td>
                          <td class="p-2">{{ formatDate(batch.createdAt) }}</td>
                          <td class="p-2">{{ formatDate(batch.expiryDate) }}</td>
                          <td class="p-2">{{ batch.quantity }}</td>
                          <td class="p-2">{{ formatCurrency(batch.costPrice) }}</td>
                          <td class="p-2">{{ formatCurrency(batch.sellPrice ?? batch.costPrice * 1.2) }}</td>
                          <td class="p-2">{{ formatCurrency(batch.totalCost) }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div v-else-if="batchDetails[item.productId] && batchDetails[item.productId].length === 0" class="text-gray-500">
                    No batch details found.
                  </div>
                  <div v-else class="text-gray-500">Loading batch details...</div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'

const baseURL = import.meta.env.VITE_BASE_URL
const token = localStorage.getItem('auth_token') || ''

const inventorySummary = ref<any[]>([])
const loading = ref(true)
const error = ref('')
const expandedId = ref<string | null>(null)
const batchDetails = ref<Record<string, any[]>>({})

const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Fetch summary
async function fetchInventory() {
  loading.value = true
  try {
    const res = await fetch(`${baseURL}/scmlink/inventoryLevels/summary`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (data.code === 1000) {
      inventorySummary.value = data.result
    } else {
      error.value = data.message || 'Failed to fetch inventory'
    }
  } catch {
    error.value = 'Network error. Please try again.'
  } finally {
    loading.value = false
  }
}
onMounted(fetchInventory)

// Fetch batch details
async function fetchBatchDetails(productId: string) {
  try {
    const res = await fetch(
      `${baseURL}/scmlink/inventoryLocationDetails/batchDetails/${productId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    const data = await res.json()
    if (data.code === 1000) {
      batchDetails.value[productId] = data.result
    }
  } catch {
    batchDetails.value[productId] = []
  }
}

function toggleExpand(productId: string) {
  if (expandedId.value === productId) {
    expandedId.value = null
  } else {
    expandedId.value = productId
    if (!batchDetails.value[productId]) {
      fetchBatchDetails(productId)
    }
  }
}

// Filtering & pagination
const filteredInventory = computed(() => {
  let list = inventorySummary.value
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(
      (i) =>
        i.sku.toLowerCase().includes(q) ||
        i.productName.toLowerCase().includes(q) ||
        i.warehouseName.toLowerCase().includes(q) ||
        i.status.toLowerCase().includes(q),
    )
  }
  return list
})
const totalPages = computed(() => Math.ceil(filteredInventory.value.length / itemsPerPage.value) || 1)
const paginatedInventory = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredInventory.value.slice(start, start + itemsPerPage.value)
})

// Utils
function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}
function formatDate(date: string) {
  return new Date(date).toLocaleDateString('vi-VN')
}
</script>
