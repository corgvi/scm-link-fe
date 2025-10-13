<template>
  <AdminLayout>
    <div class="p-6">
      <PageBreadcrumb pageTitle="Inventory Transactions" />

      <!-- Overview -->
      <div class="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">Overview</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <p class="text-gray-500 dark:text-gray-400">Total Transactions</p>
            <p class="text-2xl font-semibold text-gray-800 dark:text-white">{{ transactions.length }}</p>
          </div>
          <div class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <p class="text-gray-500 dark:text-gray-400">Reserved</p>
            <p class="text-2xl font-semibold text-blue-600">{{ reservedCount }}</p>
          </div>
          <div class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <p class="text-gray-500 dark:text-gray-400">Received</p>
            <p class="text-2xl font-semibold text-green-600">{{ receivedCount }}</p>
          </div>
          <div class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <p class="text-gray-500 dark:text-gray-400">Adjusted</p>
            <p class="text-2xl font-semibold text-yellow-600">{{ adjustedCount }}</p>
          </div>
        </div>
      </div>

      <!-- Transactions Table -->
      <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-md">
        <div class="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
          <div>
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Transaction History</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">All movements related to this entity.</p>
          </div>
        </div>

        <div v-if="loading" class="p-8 text-center text-gray-400">
          <span class="animate-spin mr-2 w-6 h-6 border-2 border-t-transparent border-gray-400 rounded-full inline-block"></span>
          Loading transactions...
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
                  <th class="p-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-400">Date</th>
                  <th class="p-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-400">User</th>
                  <th class="p-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-400">Type</th>
                  <th class="p-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-400">SKU</th>
                  <th class="p-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-400">Warehouse</th>
                  <th class="p-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-400">Quantity Δ</th>
                  <th class="p-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-400">Note</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(t, idx) in transactions"
                  :key="t.id"
                  class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <td class="p-4">{{ idx + 1 }}</td>
                  <td class="p-4">{{ formatDate(t.createdAt) }}</td>
                  <td class="p-4">{{ t.createdBy }}</td>
                  <td class="p-4">
                    <span
                      :class="typeBadge(t.transactionType)"
                      class="px-2 py-1 rounded-lg text-xs font-semibold uppercase tracking-wide"
                    >
                      {{ t.transactionType }}
                    </span>
                  </td>
                  <td class="p-4">{{ t.inventoryLevel?.product?.sku }}</td>
                  <td class="p-4">{{ t.inventoryLevel?.warehouse?.name }}</td>
                  <td
                    class="p-4 font-medium"
                    :class="{
                      'text-green-600': t.quantityChange > 0,
                      'text-red-600': t.quantityChange < 0,
                    }"
                  >
                    {{ t.quantityChange > 0 ? '+' + t.quantityChange : t.quantityChange }}
                  </td>
                  <td class="p-4 max-w-xs truncate" :title="t.note">{{ t.note || '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'

const route = useRoute()
const baseURL = import.meta.env.VITE_BASE_URL
const token = localStorage.getItem('auth_token') || ''
const transactions = ref<any[]>([])
const loading = ref(true)
const error = ref('')

async function fetchTransactions() {
  const id = route.params.entityId
  try {
    const res = await fetch(`${baseURL}/scmlink/inventoryTransactions`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (data.code === 1000) transactions.value = data.result
    else error.value = data.message || 'Failed to load transactions'
  } catch (e) {
    error.value = 'Network error. Please try again.'
  } finally {
    loading.value = false
  }
}
onMounted(fetchTransactions)

const reservedCount = computed(() =>
  transactions.value.filter((t) => t.transactionType === 'RESERVED').length,
)
const receivedCount = computed(() =>
  transactions.value.filter((t) => t.transactionType === 'RECEIVED').length,
)
const adjustedCount = computed(() =>
  transactions.value.filter((t) => t.transactionType === 'ADJUSTED').length,
)

function formatDate(date: string) {
  if (!date) return '—'
  return new Date(date).toLocaleString('vi-VN')
}
function typeBadge(type: string) {
  const map: any = {
    RESERVED: 'bg-yellow-100 text-yellow-800',
    RELEASED: 'bg-green-100 text-green-800',
    RECEIVED: 'bg-blue-100 text-blue-800',
    ADJUSTED: 'bg-purple-100 text-purple-800',
    DAMAGED: 'bg-red-100 text-red-800',
  }
  return map[type] || 'bg-gray-100 text-gray-700'
}
</script>
