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
        <div
          class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
        >
          <p class="text-gray-500 dark:text-gray-400">Total Orders</p>
          <p class="text-2xl font-semibold text-gray-800 dark:text-white">
            {{ totalElements }}
          </p>
        </div>
        <div
          class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
        >
          <p class="text-gray-500 dark:text-gray-400">Processing</p>
          <p class="text-2xl font-semibold text-yellow-600">
            {{ processingOrders }}
          </p>
        </div>
        <div
          class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
        >
          <p class="text-gray-500 dark:text-gray-400">Paid</p>
          <p class="text-2xl font-semibold text-green-600">
            {{ paidOrders }}
          </p>
        </div>
        <div
          class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
        >
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
          <!-- Filter Status -->
          <select v-model="filterStatus" class="rounded-lg border px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:text-white">
            <option value="">All Status</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
          <!-- Filter Payment -->
          <select v-model="filterPayment" class="rounded-lg border px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:text-white">
            <option value="">All Payment</option>
            <option value="PENDING">PENDING</option>
            <option value="PAID">PAID</option>
          </select>
          <!-- Export CSV Button -->
          <button
            @click="exportCSV"
            class="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export
          </button>
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
              <template v-for="(order, idx) in displayedOrders" :key="order.id">
                <tr
                  class="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">
                    {{ (currentPage - 1) * itemsPerPage + idx + 1 }}
                  </td>
                  <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">
                    {{ order.code }}
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
                        @click="openUpdate(order.id)"
                        :disabled="order.orderStatus === 'COMPLETED' || order.orderStatus === 'CANCELLED'"
                        :class="order.orderStatus === 'COMPLETED' || order.orderStatus === 'CANCELLED' ? 'opacity-50 pointer-events-none grayscale' : ''"
                      />
                    </div>
                  </td>
                </tr>
              </template>
              <tr v-if="displayedOrders.length === 0">
                <td colspan="10" class="p-4 text-center text-gray-400">Không có đơn hàng nào.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="flex flex-col items-center justify-between border-t border-gray-200 px-5 py-4 sm:flex-row dark:border-gray-800 mt-4">
          <!-- Left summary -->
          <div class="pb-3 sm:pb-0">
            <span class="block text-sm font-medium text-gray-500 dark:text-gray-400">
              Showing
              <span class="text-gray-800 dark:text-white/90">{{ (currentPage - 1) * itemsPerPage + (displayedOrders.length ? 1 : 0) }}</span>
              to
              <span class="text-gray-800 dark:text-white/90">{{ (currentPage - 1) * itemsPerPage + displayedOrders.length }}</span>
              of
              <span class="text-gray-800 dark:text-white/90">{{ totalElements }}</span>
            </span>
          </div>

          <!-- Controls -->
          <div class="flex w-full items-center justify-between gap-2 rounded-lg bg-gray-50 p-4 sm:w-auto sm:justify-normal sm:bg-transparent sm:p-0 dark:bg-white/[0.03] dark:sm:bg-transparent">
            <!-- Prev -->
            <button
              class="shadow-theme-xs flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 hover:text-gray-800 sm:p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
              @click="previousPage"
              :disabled="currentPage === 1"
              :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''"
            >
              <span>
                <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M2.58203 9.99868C2.58174 10.1909 2.6549 10.3833 2.80152 10.53L7.79818 15.5301C8.09097 15.8231 8.56584 15.8233 8.85883 15.5305C9.15183 15.2377 9.152 14.7629 8.85921 14.4699L5.13911 10.7472L16.6665 10.7472C17.0807 10.7472 17.4165 10.4114 17.4165 9.99715C17.4165 9.58294 17.0807 9.24715 16.6665 9.24715L5.14456 9.24715L8.85919 5.53016C9.15199 5.23717 9.15184 4.7623 8.85885 4.4695C8.56587 4.1767 8.09099 4.17685 7.79819 4.46984L2.84069 9.43049C2.68224 9.568 2.58203 9.77087 2.58203 9.99715C2.58203 9.99766 2.58203 9.99817 2.58203 9.99868Z" fill=""></path>
                </svg>
              </span>
            </button>

            <!-- Mobile page display -->
            <span class="block text-sm font-medium text-gray-700 sm:hidden dark:text-gray-400">Page {{ currentPage }} of {{ totalPages }}</span>

            <!-- Page list -->
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

            <!-- Next -->
            <button
              class="shadow-theme-xs flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 hover:text-gray-800 sm:p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
              @click="nextPage"
              :disabled="currentPage === totalPages"
              :class="currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''"
            >
              <span>
                <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M17.4165 9.9986C17.4168 10.1909 17.3437 10.3832 17.197 10.53L12.2004 15.5301C11.9076 15.8231 11.4327 15.8233 11.1397 15.5305C10.8467 15.2377 10.8465 14.7629 11.1393 14.4699L14.8594 10.7472L3.33203 10.7472C2.91782 10.7472 2.58203 10.4114 2.58203 9.99715C2.58203 9.58294 2.91782 9.24715 3.33203 9.24715L14.854 9.24715L11.1393 5.53016C10.8465 5.23717 10.8467 4.7623 11.1397 4.4695C11.4327 4.1767 11.9075 4.17685 12.2003 4.46984L17.1578 9.43049C17.3163 9.568 17.4165 9.77087 17.4165 9.99715C17.4165 9.99763 17.4165 9.99812 17.4165 9.9986Z" fill=""></path>
                </svg>
              </span>
            </button>
          </div>
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
    <!-- Modal Update -->
    <OrderUpdateModal
      v-if="showUpdateModal"
      :order-id="selectedOrderId"
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

// paging state
const orders = ref<any[]>([])
const loading = ref(true)
const error = ref('')
const searchQuery = ref('')
const filterStatus = ref('')
const filterPayment = ref('')

const showCreateModal = ref(false)
const showDetailModal = ref(false)
const showUpdateModal = ref(false)
const selectedOrder = ref<any>(null)

const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalPages = ref(1)
const totalElements = ref(0)
const pageNumber = ref(0)

async function fetchOrders(page = 1) {
  loading.value = true
  error.value = ''
  try {
    const pageIndex = Math.max(0, page)
    const res = await fetch(`${baseURL}/scmlink/orders?page=${pageIndex}&size=${itemsPerPage.value}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    const pageData = data?.result || data || {}
    const content = pageData.content || []
    orders.value = Array.isArray(content) ? content : []

    totalElements.value = pageData.totalElements ?? orders.value.length
    totalPages.value = pageData.totalPages ?? Math.max(1, Math.ceil((totalElements.value || 0) / itemsPerPage.value))
    pageNumber.value = pageData.pageNumber ?? pageIndex
    currentPage.value = (pageNumber.value || 0) + 1
  } catch (e) {
    error.value = 'Lỗi mạng. Vui lòng thử lại.'
    console.error(e)
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
  if (data.code === 1000) products.value = data.result.content
}
onMounted(() => {
  fetchOrders(1)
  fetchProducts()
})

// filter only within current page content
const filteredOrders = computed(() => {
  if (!searchQuery.value && !filterStatus.value && !filterPayment.value) return orders.value
  const q = searchQuery.value.toLowerCase()
  return orders.value.filter(
    (o) =>
      (o.customerName?.toLowerCase().includes(q) ||
      o.customerPhone?.toLowerCase().includes(q) ||
      o.customerEmail?.toLowerCase().includes(q) ||
      o.shippingAddress?.toLowerCase().includes(q)) &&
      (!filterStatus.value || o.orderStatus === filterStatus.value) &&
      (!filterPayment.value || o.paymentStatus === filterPayment.value),
  )
})

const displayedOrders = computed(() => filteredOrders.value)

const selectedOrderId = ref<string | null>(null)

function openUpdate(orderId: string) {
  selectedOrderId.value = orderId
  showUpdateModal.value = true
}

const processingOrders = computed(
  () => orders.value.filter((o) => o.orderStatus === 'PROCESSING').length,
)
const paidOrders = computed(() => orders.value.filter((o) => o.paymentStatus === 'PAID').length)
const totalAmount = computed(() => orders.value.reduce((sum, o) => sum + (o.totalAmount || 0), 0))

function formatCurrency(val: number) {
  return val?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || '0₫'
}

const router = useRouter()

function goToOrderDetail(orderId: string) {
  if (!orderId) return
  router.push(`/admin/order-detail/${orderId}`)
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
  if (page >= 1 && page <= totalPages.value) fetchOrders(page)
}
function previousPage() {
  if (currentPage.value > 1) fetchOrders(currentPage.value - 1)
}
function nextPage() {
  if (currentPage.value < totalPages.value) fetchOrders(currentPage.value + 1)
}

function exportCSV() {
  const rows = [
    [
      'Code',
      'Customer',
      'Phone',
      'Email',
      'Address',
      'Total',
      'Status',
      'Payment',
    ],
    ...displayedOrders.value.map(o => [
      o.code,
      o.customerName,
      o.customerPhone,
      o.customerEmail,
      o.shippingAddress,
      o.totalAmount,
      o.orderStatus,
      o.paymentStatus,
    ])
  ]
  const csvContent = rows.map(e => e.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'orders.csv'
  link.click()
}
</script>
