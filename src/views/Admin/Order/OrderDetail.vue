<template>
  <AdminLayout>
    <div class="p-6">
      <PageBreadcrumb :pageTitle="`Order Detail - ${order?.orderCode || '...'}`" />

      <!-- Order Overview -->
      <div
        class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 shadow-md"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Order Information</h2>
          <span
            :class="statusBadge(order?.orderStatus)"
            class="px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wide"
          >
            {{ order?.orderStatus }}
          </span>
          <div class="flex gap-2">
            <ActionMainButton
              text="Edit Order"
              type="update"
              icon="edit"
              @click="showUpdateModal = true"
            />
            <button
              @click="exportAllCSV"
              class="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Export CSV
            </button>
          </div>
        </div>
        <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 text-theme-sm dark:text-gray-200">
          <div><strong>Order Code:</strong> {{ order?.orderCode }}</div>
          <div><strong>Created At:</strong> {{ formatDate(order?.createdAt) }}</div>
          <div><strong>Created By:</strong> {{ order?.createdBy }}</div>
          <div><strong>Customer:</strong> {{ order?.customerName }}</div>
          <div><strong>Phone:</strong> {{ order?.customerPhone }}</div>
          <div><strong>Email:</strong> {{ order?.customerEmail }}</div>
          <div><strong>Shipping Address:</strong> {{ order?.shippingAddress + ', ' + order?.shippingCity }}</div>
          <div><strong>Total Amount:</strong> {{ formatCurrency(order?.totalAmount) }}</div>
          <div><strong>Payment Status:</strong> {{ order?.paymentStatus }}</div>
          <div class="col-span-2"><strong>Note:</strong> {{ order?.note || '—' }}</div>
        </div>
      </div>

      <!-- Products & Batch Allocations -->
      <div
        class="mt-6 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 shadow-md"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white">
            Order Items & Batch Allocations
          </h2>
        </div>
        <table class="w-full text-sm border border-gray-200 dark:border-gray-800 rounded-lg">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="p-4 text-left text-xs font-bold text-gray-700 dark:text-gray-400">#</th>
              <th class="p-4 text-left text-xs font-bold text-gray-700 dark:text-gray-400">
                Product
              </th>
              <th class="p-4 text-left text-xs font-bold text-gray-700 dark:text-gray-400">SKU</th>
              <th class="p-4 text-left text-xs font-bold text-gray-700 dark:text-gray-400">
                Batch
              </th>
              <th class="p-4 text-left text-xs font-bold text-gray-700 dark:text-gray-400">
                Expiry
              </th>
              <th class="p-4 text-left text-xs font-bold text-gray-700 dark:text-gray-400">
                Quantity
              </th>
              <th class="p-4 text-left text-xs font-bold text-gray-700 dark:text-gray-400">
                Unit Price
              </th>
              <th class="p-4 text-left text-xs font-bold text-gray-700 dark:text-gray-400">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, i) in order?.orderItems || []" :key="item.id">
              <tr
                v-for="(batch, j) in item.batchAllocations"
                :key="batch.batchNumber + '-' + j"
                class="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">{{ i + 1 }}</td>
                <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">
                  {{ batch.productName }}
                </td>
                <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">
                  {{ batch.sku }}
                </td>
                <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">
                  {{ batch.batchNumber }}
                </td>
                <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">
                  {{ formatDate(batch.expirationDate) }}
                </td>
                <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">
                  {{ batch.quantityAllocated }}
                </td>
                <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">
                  {{ formatCurrency(item.priceAtOrder) }}
                </td>
                <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">
                  {{ formatCurrency(item.priceAtOrder * batch.quantityAllocated) }}
                </td>
              </tr>
            </template>
          </tbody>
        </table>
        <!-- Summary -->
        <div class="text-right mt-4 text-gray-700 dark:text-gray-300">
          <div>
            <strong>Total Amount:</strong>
            {{ formatCurrency(order?.totalAmount) }}
          </div>
        </div>
      </div>
      <!-- 🧾 Order Transactions -->
      <div
        class="mt-6 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 shadow-md"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white">
            Inventory Transactions
          </h2>
          
        </div>

        <div v-if="loadingTransactions" class="p-8 text-center text-gray-400">
          <span
            class="animate-spin mr-2 w-6 h-6 border-2 border-t-transparent border-gray-400 rounded-full inline-block"
          ></span>
          Loading transactions...
        </div>

        <div v-else-if="transactionError" class="p-8 text-center text-red-500">
          {{ transactionError }}
        </div>

        <div v-else>
          <div class="overflow-x-auto custom-scrollbar">
            <table class="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg">
              <thead class="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th class="p-3 text-left text-xs font-bold text-gray-700 dark:text-gray-400">
                    #
                  </th>
                  <th class="p-3 text-left text-xs font-bold text-gray-700 dark:text-gray-400">
                    Date
                  </th>
                  <th class="p-3 text-left text-xs font-bold text-gray-700 dark:text-gray-400">
                    User
                  </th>
                  <th class="p-3 text-left text-xs font-bold text-gray-700 dark:text-gray-400">
                    Type
                  </th>
                  <th class="p-3 text-left text-xs font-bold text-gray-700 dark:text-gray-400">
                    SKU
                  </th>
                  <th class="p-3 text-left text-xs font-bold text-gray-700 dark:text-gray-400">
                    Warehouse
                  </th>
                  <th class="p-3 text-left text-xs font-bold text-gray-700 dark:text-gray-400">
                    Qty Δ
                  </th>
                  <th class="p-3 text-left text-xs font-bold text-gray-700 dark:text-gray-400">
                    Note
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(t, idx) in transactions"
                  :key="t.id"
                  class="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td class="p-3">{{ idx + 1 }}</td>
                  <td class="p-3">{{ formatDateTime(t.createdAt) }}</td>
                  <td class="p-3">{{ t.createdBy }}</td>
                  <td class="p-3">
                    <span
                      :class="typeBadge(t.transactionType)"
                      class="px-2 py-1 rounded-lg text-xs font-semibold uppercase tracking-wide"
                    >
                      {{ t.transactionType }}
                    </span>
                  </td>
                  <td class="p-3">{{ t.inventoryLevel?.product?.sku }}</td>
                  <td class="p-3">{{ t.inventoryLevel?.warehouse?.name }}</td>
                  <td
                    class="p-3 font-semibold"
                    :class="{
                      'text-green-600': t.quantityChange > 0,
                      'text-red-600': t.quantityChange < 0,
                    }"
                  >
                    {{ t.quantityChange > 0 ? '+' + t.quantityChange : t.quantityChange }}
                  </td>
                  <td class="p-3 truncate max-w-[250px]" :title="t.note">{{ t.note || '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <OrderUpdateModal
      v-if="showUpdateModal"
      :orderId="order.id"
      @close="showUpdateModal = false"
      @updated="fetchOrderDetail(); fetchOrderTransactions()"
    />
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import OrderUpdateModal from './OrderUpdateModal.vue'
import ActionMainButton from '@/components/common/ActionMainButton.vue'

const showUpdateModal = ref(false)
const baseURL = import.meta.env.VITE_BASE_URL
const token = localStorage.getItem('auth_token') || ''
const route = useRoute()
const transactions = ref<any[]>([])
const loadingTransactions = ref(true)
const transactionError = ref('')

const order = ref<any>(null)

async function fetchOrderDetail() {
  const id = route.params.orderId
  try {
    const res = await fetch(`${baseURL}/scmlink/orders/details/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (data.code === 1000) order.value = data.result
  } catch {
    order.value = null
  }
}

async function fetchOrderTransactions() {
  try {
    const res = await fetch(
      `${baseURL}/scmlink/inventoryTransactions/relatedEntity/${route.params.orderId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    const data = await res.json()
    if (data.code === 1000) {
      transactions.value = data.result.content
    } else {
      transactionError.value = data.message || 'Failed to load transactions'
    }
  } catch (e) {
    transactionError.value = 'Network error.'
  } finally {
    loadingTransactions.value = false
  }
}

onMounted(() => {
  fetchOrderDetail()
  fetchOrderTransactions()
})

function formatDateTime(date: string) {
  if (!date) return '—'
  return new Date(date).toLocaleString('vi-VN')
}
function typeBadge(type: string) {
  const map: any = {
    RESERVED: 'bg-yellow-100 text-yellow-800',
    RELEASED: 'bg-green-100 text-green-800',
    RECEIVED: 'bg-blue-100 text-blue-800',
    ADJUSTED: 'bg-purple-100 text-purple-800',
  }
  return map[type] || 'bg-gray-100 text-gray-700'
}

function formatCurrency(value: number) {
  if (!value) return '0₫'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}
function formatDate(date: string) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('vi-VN')
}
function statusBadge(status: string) {
  const map: any = {
    PROCESSING: 'bg-yellow-100 text-yellow-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    PAID: 'bg-green-100 text-green-800',
    FAILED: 'bg-red-100 text-red-800',
  }
  return map[status] || 'bg-gray-100 text-gray-800'
}

function exportAllCSV() {
  if (!order.value) return
  const rows = [
    ['Order Code', order.value.orderCode],
    ['Created At', formatDate(order.value.createdAt)],
    ['Created By', order.value.createdBy],
    ['Customer', order.value.customerName],
    ['Phone', order.value.customerPhone],
    ['Email', order.value.customerEmail],
    ['Shipping Address', order.value.shippingAddress + ', ' + order.value.shippingCity],
    ['Total Amount', formatCurrency(order.value.totalAmount)],
    ['Payment Status', order.value.paymentStatus],
    ['Order Status', order.value.orderStatus],
    ['Note', order.value.note || '—'],
    [],
    ['Product', 'SKU', 'Batch', 'Expiry', 'Quantity', 'Unit Price', 'Total'],
  ]
  order.value.orderItems.forEach((item: any) => {
    item.batchAllocations.forEach((batch: any) => {
      rows.push([
        batch.productName,
        batch.sku,
        batch.batchNumber,
        formatDate(batch.expirationDate),
        batch.quantityAllocated,
        item.priceAtOrder,
        item.priceAtOrder * batch.quantityAllocated,
      ])
    })
  })
  rows.push([])
  rows.push(['Inventory Transactions'])
  rows.push(['Date', 'User', 'Type', 'SKU', 'Warehouse', 'Qty Change', 'Note'])
  transactions.value.forEach((t) => {
    rows.push([
      formatDateTime(t.createdAt),
      t.createdBy,
      t.transactionType,
      t.inventoryLevel?.product?.sku,
      t.inventoryLevel?.warehouse?.name,
      t.quantityChange,
      t.note || '—',
    ])
  })
  const csv = rows.map((r) => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${order.value.orderCode || 'order'}_all.csv`
  link.click()
}
</script>
