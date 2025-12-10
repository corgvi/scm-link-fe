<template>
  <div
    class="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6"
  >
    <div class="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Recent Orders</h3>
      </div>
      <div class="flex items-center gap-3">
        <!-- Có thể thêm filter thực tế ở đây nếu muốn -->
        <button
          class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
        >
          Filter
        </button>
        <button
          class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
        >
          See all
        </button>
      </div>
    </div>

    <div class="max-w-full overflow-x-auto custom-scrollbar">
      <table class="min-w-full">
        <thead>
          <tr class="border-t border-gray-100 dark:border-gray-800">
            <th class="py-3 text-left">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Order</p>
            </th>
            <th class="py-3 text-left">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Product</p>
            </th>
            <th class="py-3 text-left">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Category</p>
            </th>
            <th class="py-3 text-left">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Customer</p>
            </th>
            <th class="py-3 text-left">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Total</p>
            </th>
            <th class="py-3 text-left">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Status</p>
            </th>
            <th class="py-3 text-left">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Created At</p>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="order in orders"
            :key="order.id"
            class="border-t border-gray-100 dark:border-gray-800"
          >
            <td class="py-3 whitespace-nowrap font-semibold text-theme-sm text-brand-600">
              {{ order.orderCode }}
            </td>
            <td class="py-3 whitespace-nowrap">
              <div class="flex items-center gap-3">
                <div class="h-[42px] w-[42px] overflow-hidden rounded-md bg-gray-100">
                  <img :src="order.productImage" :alt="order.productName" class="object-cover w-full h-full" />
                </div>
                <div>
                  <p class="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {{ order.productName }}
                  </p>
                  <span class="text-gray-500 text-theme-xs dark:text-gray-400">
                    {{ order.variants }} Variants
                  </span>
                </div>
              </div>
            </td>
            <td class="py-3 whitespace-nowrap">
              <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ order.category }}</p>
            </td>
            <td class="py-3 whitespace-nowrap">
              <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ order.customerName }}</p>
            </td>
            <td class="py-3 whitespace-nowrap">
              <p class="text-gray-800 font-semibold text-theme-sm dark:text-white/90">{{ formatVND(order.totalAmount) }}</p>
            </td>
            <td class="py-3 whitespace-nowrap">
              <span
                :class="{
                  'rounded-full px-2 py-0.5 text-theme-xs font-medium': true,
                  'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500': order.status === 'COMPLETED',
                  'bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-orange-400': order.status === 'PENDING',
                  'bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500': order.status === 'CANCELLED',
                }"
              >
                {{ statusLabel(order.status) }}
              </span>
            </td>
            <td class="py-3 whitespace-nowrap">
              <span class="text-gray-500 text-theme-xs dark:text-gray-400">
                {{ formatDate(order.createdAt) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const baseURL = import.meta.env.VITE_BASE_URL
const token = localStorage.getItem('auth_token') || ''

const orders = ref([])

function formatVND(val) {
  if (!val) return '₫0'
  return Number(val).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })
}

function statusLabel(status) {
  switch (status) {
    case 'COMPLETED':
      return 'Completed'
    case 'PENDING':
      return 'Pending'
    case 'CANCELLED':
      return 'Cancelled'
    default:
      return status
  }
}

async function fetchRecentOrders() {
  try {
    const res = await fetch(`${baseURL}/scmlink/orders/recent-orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (data.code === 1000 && Array.isArray(data.result)) {
      orders.value = data.result
    }
  } catch (e) {
    // handle error
  }
}

onMounted(fetchRecentOrders)
</script>
