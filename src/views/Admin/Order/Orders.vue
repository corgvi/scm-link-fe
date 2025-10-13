<template>
  <AdminLayout>
    <PageBreadcrumb pageTitle="Order management" />

    <!-- Overview -->
    <div
      class="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Overview</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Quick insights into your orders
          </p>
        </div>
        <div class="flex justify-end mt-6">
          <ActionMainButton
            text="Create Order"
            icon="plus"
            type="create"
            @click="showCreateModal = true"
          />
        </div>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <p class="text-gray-500 dark:text-gray-400">Total Orders</p>
          <p class="text-2xl font-semibold text-gray-800 dark:text-white">
            {{ orders.length }}
          </p>
        </div>
        <div class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <p class="text-gray-500 dark:text-gray-400">Processing</p>
          <p class="text-2xl font-semibold text-yellow-600">
            {{ processingOrders }}
          </p>
        </div>
        <div class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <p class="text-gray-500 dark:text-gray-400">Paid</p>
          <p class="text-2xl font-semibold text-green-600">
            {{ paidOrders }}
          </p>
        </div>
        <div class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <p class="text-gray-500 dark:text-gray-400">Total Amount</p>
          <p class="text-2xl font-semibold text-indigo-600">
            {{ formatCurrency(totalAmount) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Danh sách đơn hàng -->
    <div
      class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div
        class="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800"
      >
        <div>
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Orders</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">Manage the orders below</p>
        </div>
        <div class="flex gap-3.5">
          <div class="relative">
            <span class="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 dark:text-gray-400">
              <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M3.04199 9.37363C3.04199 5.87693 5.87735 3.04199 9.37533 3.04199C12.8733 3.04199 15.7087 5.87693 15.7087 9.37363C15.7087 12.8703 12.8733 15.7053 9.37533 15.7053C5.87735 15.7053 3.04199 12.8703 3.04199 9.37363ZM9.37533 1.54199C5.04926 1.54199 1.54199 5.04817 1.54199 9.37363C1.54199 13.6991 5.04926 17.2053 9.37533 17.2053C11.2676 17.2053 13.0032 16.5344 14.3572 15.4176L17.1773 18.238C17.4702 18.5309 17.945 18.5309 18.2379 18.238C18.5308 17.9451 18.5309 17.4703 18.238 17.1773L15.4182 14.3573C16.5367 13.0033 17.2087 11.2669 17.2087 9.37363C17.2087 5.04817 13.7014 1.54199 9.37533 1.54199Z"
                  fill=""
                ></path>
              </svg>
            </span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search orders..."
              class="h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pr-4 pl-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden xl:w-[300px] dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
            />
          </div>
        </div>
      </div>
      <div v-if="loading" class="p-8 text-center text-gray-400">
        <span
          class="animate-spin mr-2 w-6 h-6 border-2 border-t-transparent border-gray-400 rounded-full inline-block"
        ></span>
        Loading...
      </div>
      <div v-else-if="error" class="p-8 text-center text-red-500">
        {{ error }}
      </div>
      <div v-else>
        <div class="custom-scrollbar overflow-x-auto">
          <table class="w-full table-auto">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                <th class="p-4 text-left text-xs font-bold text-gray-700 dark:text-gray-400">#</th>
                <th class="p-4 text-left text-xs font-bold text-gray-700 dark:text-gray-400">
                  Code
                </th>
                <th class="p-4 text-left text-xs font-bold text-gray-700 dark:text-gray-400">
                  Customer
                </th>
                <th class="p-4 text-left text-xs font-bold text-gray-700 dark:text-gray-400">
                  Phone
                </th>
                <th class="p-4 text-left text-xs font-bold text-gray-700 dark:text-gray-400">
                  Email
                </th>
                <th class="p-4 text-left text-xs font-bold text-gray-700 dark:text-gray-400">
                  Address
                </th>
                <th class="p-4 text-left text-xs font-bold text-gray-700 dark:text-gray-400">
                  Total
                </th>
                <th class="p-4 text-left text-xs font-bold text-gray-700 dark:text-gray-400">
                  Status
                </th>
                <th class="p-4 text-left text-xs font-bold text-gray-700 dark:text-gray-400">
                  Payment
                </th>
                <th class="p-4 text-center text-xs font-bold text-gray-700 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
              <template v-for="(order, idx) in filteredOrders" :key="order.id">
                <tr
                  class="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">
                    {{ idx + 1 }}
                  </td>
                  <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">
                    {{ order.orderCode }}
                  </td>
                  <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">
                    {{ order.customerName }}
                  </td>
                  <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">
                    {{ order.customerPhone }}
                  </td>
                  <td
                    class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200 max-w-[100px] truncate"
                    :title="order.customerEmail"
                  >
                    {{ order.customerEmail }}
                  </td>
                  <td
                    class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200 max-w-[100px] truncate"
                    :title="order.shippingAddress"
                  >
                    {{ order.shippingAddress }}
                  </td>
                  <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">
                    {{ formatCurrency(order.totalAmount) }}
                  </td>
                  <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">
                    <span
                      :class="
                        order.orderStatus === 'PROCESSING' ? 'text-yellow-600' : 'text-green-600'
                      "
                    >
                      {{ order.orderStatus }}
                    </span>
                  </td>
                  <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">
                    <span
                      :class="order.paymentStatus === 'PENDING' ? 'text-red-600' : 'text-green-600'"
                    >
                      {{ order.paymentStatus }}
                    </span>
                  </td>
                  <td class="p-4 text-center">
                    <div class="flex justify-center gap-2">
                      <ActionMainButton
                        text="Detail"
                        type="detail"
                        icon="detail"
                        @click="goToOrderDetail(order.id)"
                      />
                      <ActionMainButton
                        text="Update"
                        type="update"
                        icon="edit"
                        @click="openUpdate(order)"
                      />
                    </div>
                  </td>
                </tr>
              </template>
              <tr v-if="filteredOrders.length === 0">
                <td colspan="10" class="p-4 text-center text-gray-400">Không có đơn hàng nào.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <OrderCreateModal
      v-if="showCreateModal"
      :products="products"
      @close="showCreateModal = false"
      @submitted="fetchOrders"
    />
    <OrderUpdateModal
      v-if="showUpdateModal"
      :order="selectedOrder"
      @close="showUpdateModal = false"
      @updated="fetchOrders"
    />
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import OrderCreateModal from './OrderCreateModal.vue'
import OrderUpdateModal from './OrderUpdateModal.vue'
import ActionMainButton from '@/components/common/ActionMainButton.vue'
import { useRouter } from 'vue-router'

const baseURL = import.meta.env.VITE_BASE_URL
const token = localStorage.getItem('auth_token') || ''

const orders = ref<any[]>([])
const loading = ref(true)
const error = ref('')
const searchQuery = ref('')

const showCreateModal = ref(false)
const showDetailModal = ref(false)
const showUpdateModal = ref(false)
const selectedOrder = ref<any>(null)

async function fetchOrders() {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(`${baseURL}/scmlink/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (data.code === 1000) {
      orders.value = data.result
    } else {
      error.value = data.message || 'Không thể tải đơn hàng.'
    }
  } catch (e) {
    error.value = 'Lỗi mạng. Vui lòng thử lại.'
  } finally {
    loading.value = false
  }
}
const products = ref<any[]>([])

async function fetchProducts() {
  const res = await fetch(`${baseURL}/scmlink/products`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json()
  if (data.code === 1000) products.value = data.result
}
onMounted(() => {
  fetchOrders()
  fetchProducts()
})

const filteredOrders = computed(() => {
  if (!searchQuery.value) return orders.value
  const q = searchQuery.value.toLowerCase()
  return orders.value.filter(
    (o) =>
      o.customerName?.toLowerCase().includes(q) ||
      o.customerPhone?.toLowerCase().includes(q) ||
      o.customerEmail?.toLowerCase().includes(q) ||
      o.shippingAddress?.toLowerCase().includes(q),
  )
})

const processingOrders = computed(
  () => orders.value.filter((o) => o.orderStatus === 'PROCESSING').length,
)
const paidOrders = computed(() => orders.value.filter((o) => o.paymentStatus === 'PAID').length)
const totalAmount = computed(() => orders.value.reduce((sum, o) => sum + (o.totalAmount || 0), 0))

function formatCurrency(val: number) {
  return val?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || '0₫'
}
function openCreate() {
  showCreateModal.value = true
}
function openDetail(order: any) {
  selectedOrder.value = order
  showDetailModal.value = true
}
function openUpdate(order: any) {
  selectedOrder.value = order
  showUpdateModal.value = true
}

const router = useRouter()

function goToOrderDetail(orderId: string) {
  if (!orderId) return
  router.push(`/admin/order-detail/${orderId}`)
}
</script>
