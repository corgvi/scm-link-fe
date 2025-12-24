<template>
  <AdminLayout>
    <!-- Alert -->
    <Alert
      v-if="alert.show"
      :variant="alert.type"
      :title="alert.title"
      :message="alert.message"
      :duration="3000"
    />
    <PageBreadcrumb pageTitle="Inventory Management" />

    <!-- Overview -->
    <div
      class="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Overview</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Quick insights into your inventory
          </p>
        </div>
        <div class="flex justify-end mt-6">
          <ActionMainButton
            text="Receive Inventory"
            icon="plus"
            type="create"
            @click="openGlobalReceiveModal"
          />
        </div>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div
          class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
        >
          <p class="text-gray-500 dark:text-gray-400">Total Products</p>
          <p class="text-2xl font-semibold text-gray-800 dark:text-white">
            {{ totalElements }}
          </p>
        </div>
        <div
          class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
        >
          <p class="text-gray-500 dark:text-gray-400">Total Quantity</p>
          <p class="text-2xl font-semibold text-green-600">
            {{ inventorySummary.reduce((sum, i) => sum + (i.totalQuantity || 0), 0) }}
          </p>
        </div>
        <div
          class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
        >
          <p class="text-gray-500 dark:text-gray-400">Total Value</p>
          <p class="text-2xl font-semibold text-yellow-600">
            {{ formatCurrency(inventorySummary.reduce((sum, i) => sum + (i.totalValue || 0), 0)) }}
          </p>
        </div>
        <div
          class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
        >
          <p class="text-gray-500 dark:text-gray-400">Warehouses</p>
          <p class="text-2xl font-semibold text-indigo-600">
            {{ new Set(inventorySummary.map((i) => i.warehouseName)).size }}
          </p>
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
            <span class="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 dark:text-gray-400">
              <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none">
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
          <button
            class="shadow-theme-xs flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-[11px] text-sm font-medium text-gray-700 sm:w-auto dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 transition duration-150"
            @click="exportCSV"
            aria-label="Export products to CSV"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M16.6671 13.3333V15.4166C16.6671 16.1069 16.1074 16.6666 15.4171 16.6666H4.58301C3.89265 16.6666 3.33301 16.1069 3.33301 15.4166V13.3333M10.0013 3.33325L10.0013 13.3333M6.14553 7.18708L9.99958 3.33549L13.8539 7.18708"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
            Export
          </button>
        </div>
      </div>

      <div v-if="loading" class="p-8 text-center text-gray-400">Loading inventory...</div>
      <div v-else>
        <table class="w-full table-auto">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
              <th class="p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400">#</th>
              <th class="p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400">
                SKU
              </th>
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
          <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
            <template v-for="(item, idx) in paginatedInventory" :key="item.productId">
              <tr
                class="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">
                  {{ (currentPage - 1) * itemsPerPage + idx + 1 }}
                </td>
                <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">
                  {{ item.sku }}
                </td>
                <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">
                  {{ item.productName }}
                </td>
                <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">
                  <span v-if="item.warehouseName">{{ item.warehouseName }}</span>
                  <span v-else-if="item.warehouseId">
                    {{ warehouseNameMap[item.warehouseId] || '...' }}
                  </span>
                </td>
                <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">
                  {{ item.totalQuantity }}
                </td>
                <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">
                  {{ formatCurrency(item.totalValue) }}
                </td>
                <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">
                  <span
                    :class="item.status === 'IN_STOCK' ? 'text-green-600' : 'text-red-500'"
                    class="font-medium"
                  >
                    {{ item.status }}
                  </span>
                </td>
                <td class="p-4 text-center">
                  <div class="flex justify-center gap-2">
                    <button
                      @click="toggleExpand(item.productId, item.warehouseId)"
                      class="inline-flex items-center gap-2 rounded-lg border border-brand-600 bg-brand-50 px-3 py-1.5 text-sm font-semibold text-brand-700 hover:bg-brand-100 hover:border-brand-700 hover:text-brand-700 transition duration-150 shadow"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-5 h-5 transition-transform duration-300"
                        :style="{
                          transform:
                            expandedId === item.productId ? 'rotate(180deg)' : 'rotate(0deg)',
                        }"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                      <span class="font-semibold">Details</span>
                    </button>
                    <ActionMainButton
                      text="Receive"
                      icon="plus"
                      type="receive"
                      @click="openReceiveModal(item)"
                    />
                  </div>
                </td>
              </tr>
              <!-- Expand batches -->
              <tr v-if="expandedKey === `${item.productId}_${item.warehouseId}`">
                <td colspan="8" class="p-4 bg-gray-50 dark:bg-gray-800">
                  <div
                    v-if="
                      batchDetails[`${item.productId}_${item.warehouseId}`] &&
                      batchDetails[`${item.productId}_${item.warehouseId}`].length
                    "
                    class="space-y-2 ..."
                  >
                    <h4 class="font-semibold ...">Batch Details</h4>
                    <table class="w-full ...">
                      <thead>
                        <tr class="bg-gray-100 dark:bg-gray-700">
                          <th class="p-2 text-left">Batch</th>
                          <th class="p-2 text-left">Location</th>
                          <th class="p-2 text-left">Expiry</th>
                          <th class="p-2 text-left">Quantity</th>
                          <th class="p-2 text-left">Available</th>
                          <th class="p-2 text-left">Cost Price</th>
                          <th class="p-2 text-left">Sell Price</th>
                          <th class="p-2 text-left">Total Cost</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="batch in batchDetails[`${item.productId}_${item.warehouseId}`]"
                          :key="batch.batchNumber"
                        >
                          <td class="p-2">{{ batch.batchNumber }}</td>
                          <td class="p-2">{{ batch.locationCode }}</td>
                          <td class="p-2">{{ formatDate(batch.expiryDate) }}</td>
                          <td class="p-2 text-green-600 font-medium">{{ batch.quantity }}</td>
                          <td class="p-2">{{ batch.quantityAvailable }}</td>
                          <td class="p-2">{{ formatCurrency(batch.costPrice) }}</td>
                          <td class="p-2">{{ formatCurrency(batch.sellPrice) }}</td>
                          <td class="p-2 font-bold">{{ formatCurrency(batch.totalCost) }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div
                    v-else-if="batchDetails[`${item.productId}_${item.warehouseId}`]?.length === 0"
                    class="text-gray-500 text-center py-2"
                  >
                    No batch details found for this warehouse.
                  </div>

                  <div
                    v-else
                    class="text-gray-500 text-center py-2 flex items-center justify-center gap-2"
                  >
                    <div
                      class="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"
                    ></div>
                    Loading batch details...
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
        <!-- Pagination -->
        <div
          class="flex flex-col items-center justify-between border-t border-gray-200 px-5 py-4 sm:flex-row dark:border-gray-800 mt-4"
        >
          <!-- Left summary -->
          <div class="pb-3 sm:pb-0">
            <span class="block text-sm font-medium text-gray-500 dark:text-gray-400">
              Showing
              <span class="text-gray-800 dark:text-white/90">{{
                (currentPage - 1) * itemsPerPage + (paginatedInventory.length ? 1 : 0)
              }}</span>
              to
              <span class="text-gray-800 dark:text-white/90">{{
                (currentPage - 1) * itemsPerPage + paginatedInventory.length
              }}</span>
              of
              <span class="text-gray-800 dark:text-white/90">{{ totalElements }}</span>
            </span>
          </div>

          <!-- Controls -->
          <div
            class="flex w-full items-center justify-between gap-2 rounded-lg bg-gray-50 p-4 sm:w-auto sm:justify-normal sm:bg-transparent sm:p-0 dark:bg-white/[0.03] dark:sm:bg-transparent"
          >
            <button
              class="shadow-theme-xs flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 hover:text-gray-800 sm:p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
              @click="previousPage"
              :disabled="currentPage === 1"
              :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''"
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

            <span class="block text-sm font-medium text-gray-700 sm:hidden dark:text-gray-400"
              >Page {{ currentPage }} of {{ totalPages }}</span
            >

            <ul class="hidden items-center gap-0.5 sm:flex">
              <li v-for="page in visiblePages" :key="page">
                <a
                  href="#"
                  @click.prevent="goToPage(page)"
                  :class="
                    page === currentPage
                      ? 'bg-brand-500 text-white'
                      : 'hover:bg-brand-500 text-gray-700 hover:text-white dark:text-gray-400 dark:hover:text-white'
                  "
                  class="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium"
                >
                  {{ page }}
                </a>
              </li>

              <li v-if="visiblePages[visiblePages.length - 1] < totalPages">
                <span
                  class="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium text-gray-700 dark:text-gray-400"
                  >...</span
                >
              </li>

              <li v-if="visiblePages[visiblePages.length - 1] < totalPages">
                <a
                  href="#"
                  @click.prevent="goToPage(totalPages)"
                  class="hover:bg-brand-500 flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium text-gray-700 hover:text-white dark:text-gray-400 dark:hover:text-white"
                  >{{ totalPages }}</a
                >
              </li>
            </ul>

            <button
              class="shadow-theme-xs flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 hover:text-gray-800 sm:p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
              @click="nextPage"
              :disabled="currentPage === totalPages"
              :class="currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''"
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
      </div>
    </div>
    <!-- Modals -->
    <GlobalReceiveModal
      v-if="showGlobalReceiveModal"
      @close="showGlobalReceiveModal = false"
      @submitted="handleGlobalSubmit"
      :warehouses="warehouses"
      :suppliers="suppliers"
      :products="products"
    />
    <ProductReceiveModal
      v-if="showProductReceiveModal"
      :product="selectedProduct"
      :warehouseId="selectedProduct?.warehouseId"
      @close="showProductReceiveModal = false"
      @submitted="handleProductSubmit"
      :warehouses="warehouses"
      :products="products"
    />
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive, watch } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import GlobalReceiveModal from './GlobalReceiveModal.vue'
import ProductReceiveModal from './ProductReceiveModal.vue'
import ActionMainButton from '@/components/common/ActionMainButton.vue'

const baseURL = import.meta.env.VITE_BASE_URL
const token = localStorage.getItem('auth_token') || ''

const inventorySummary = ref<any[]>([])
const loading = ref(true)
const error = ref('')
// server-side pagination meta
const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalPages = ref(1)
const totalElements = ref(0)
const pageNumber = ref(0)

const expandedId = ref<string | null>(null)
const batchDetails = ref<Record<string, any[]>>({})
const warehouses = ref<any[]>([])
const suppliers = ref<any[]>([])
const products = ref<any[]>([])
const warehouseLocations = ref<any[]>([])

const searchQuery = ref('')
import Alert from '@/components/ui/Alert.vue'
const alert = reactive({
  show: false,
  type: 'success',
  title: '',
  message: '',
})
function alertState(type: string, title: string, message: string) {
  alert.show = true
  alert.type = type
  alert.title = title
  alert.message = message
  setTimeout(() => {
    alert.show = false
  }, 3000)
}
// Modals
const showGlobalReceiveModal = ref(false)
const showProductReceiveModal = ref(false)
const selectedProduct = ref<any>(null)
const warehouseNameMap = ref<Record<string, string>>({})

function openGlobalReceiveModal() {
  showGlobalReceiveModal.value = true
}

// Hàm lấy tên kho từ API và cache lại
async function getWarehouseName(warehouseId: string) {
  if (!warehouseId) return ''
  if (warehouseNameMap.value[warehouseId]) return warehouseNameMap.value[warehouseId]
  try {
    const res = await fetch(`${baseURL}/scmlink/warehouses/${warehouseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (data.code === 1000 && data.result?.name) {
      warehouseNameMap.value[warehouseId] = data.result.name
      return data.result.name
    }
  } catch (e) {
    // fallback
  }
  return warehouseId
}

// Khi mở modal nhận hàng, truyền warehouseId
function openReceiveModal(product: any) {
  selectedProduct.value = product
  showProductReceiveModal.value = true
}

// Fetch summary
async function fetchInventory(page = 1) {
  loading.value = true
  error.value = ''
  try {
    const pageIndex = Math.max(0, page)
    const res = await fetch(
      `${baseURL}/scmlink/inventoryLevels/summary?page=${pageIndex}&size=${itemsPerPage.value}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    const data = await res.json()
    const pageData = data?.result || data || {}
    const content = pageData.content || pageData.items || []
    inventorySummary.value = Array.isArray(content) ? content : []

    totalElements.value = pageData.totalElements ?? inventorySummary.value.length
    totalPages.value =
      pageData.totalPages ?? Math.max(1, Math.ceil((totalElements.value || 0) / itemsPerPage.value))
    pageNumber.value = pageData.pageNumber ?? pageIndex
    currentPage.value = (pageNumber.value || 0) + 1
  } catch (e) {
    console.error(e)
    alertState('error', 'Error', 'Network error. Please try again.')
  } finally {
    loading.value = false
  }
}
async function fetchWarehouses() {
  try {
    const res = await fetch(`${baseURL}/scmlink/warehouses`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (data.code === 1000) warehouses.value = data.result.content
    console.log(warehouses.value)
  } catch (e) {
    console.error(e)
  }
}
async function fetchSuppliers() {
  try {
    const res = await fetch(`${baseURL}/scmlink/suppliers`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (data.code === 1000) suppliers.value = data.result.content
  } catch (e) {
    console.error(e)
  }
}
async function fetchProducts() {
  try {
    const res = await fetch(`${baseURL}/scmlink/products`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (data.code === 1000) products.value = data.result.content
  } catch (e) {
    console.error(e)
  }
}
async function fetchWarehouseLocations() {
  try {
    const res = await fetch(`${baseURL}/scmlink/warehouseLocations`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (data.code === 1000) warehouseLocations.value = data.result.content
  } catch (e) {
    console.error(e)
  }
}
onMounted(async () => {
  await Promise.all([
    fetchWarehouseLocations(),
    fetchInventory(1),
    fetchWarehouses(),
    fetchSuppliers(),
    fetchProducts(),
  ])
})

// Hàm fetch Batch Details
async function fetchBatchDetails(productId: string, warehouseId: string) {
  const cacheKey = `${productId}_${warehouseId}`
  try {
    const res = await fetch(
      `${baseURL}/scmlink/inventoryLocationDetails/batchDetails/${productId}/${warehouseId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    const data = await res.json()
    if (data.code === 1000) {
      // Lưu vào object với key kết hợp
      batchDetails.value[cacheKey] = data.result
    }
  } catch {
    batchDetails.value[cacheKey] = []
  }
}

// Sử dụng một ref để lưu ID dòng đang mở (kết hợp cả Prod + Warehouse)
const expandedKey = ref<string | null>(null)

function toggleExpand(productId: string, warehouseId: string) {
  const currentKey = `${productId}_${warehouseId}`

  if (expandedKey.value === currentKey) {
    expandedKey.value = null
  } else {
    expandedKey.value = currentKey
    // Chỉ gọi API nếu chưa có dữ liệu trong cache
    if (!batchDetails.value[currentKey]) {
      fetchBatchDetails(productId, warehouseId)
    }
  }
}

// Submit handlers
function handleGlobalSubmit() {
  fetchInventory()
  showGlobalReceiveModal.value = false
}
function handleProductSubmit() {
  fetchInventory()
  showProductReceiveModal.value = false
}

// filter only within current page content
const filteredInventory = computed(() => {
  let list = inventorySummary.value.slice()
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(
      (i) =>
        (i.sku || '').toLowerCase().includes(q) ||
        (i.productName || '').toLowerCase().includes(q) ||
        (i.warehouseName || '').toLowerCase().includes(q) ||
        (i.status || '').toLowerCase().includes(q),
    )
  }
  return list
})
// paginatedInventory is the displayed rows for current page (after client-side filter)
const paginatedInventory = computed(() => filteredInventory.value)

// pagination helpers (visiblePages / navigation)
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
  if (page >= 1 && page <= totalPages.value) fetchInventory(page)
}
function previousPage() {
  if (currentPage.value > 1) fetchInventory(currentPage.value - 1)
}
function nextPage() {
  if (currentPage.value < totalPages.value) fetchInventory(currentPage.value + 1)
}

// Utils
function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}
function formatDate(date: string) {
  return new Date(date).toLocaleDateString('vi-VN')
}

function exportCSV() {
  const rows = [
    [
      'SKU',
      'Product',
      'Warehouse',
      'Quantity',
      'Value',
      'Status',
      'Batch Number',
      'Batch Created',
      'Batch Expiry',
      'Batch Quantity',
      'Batch Cost Price',
      'Batch Sell Price',
      'Batch Total Cost',
    ],
  ]

  // For each inventory, include batch details if available
  filteredInventory.value.forEach((item) => {
    const batches = batchDetails.value[item.productId] || []
    if (batches.length) {
      batches.forEach((batch) => {
        rows.push([
          item.sku,
          item.productName,
          item.warehouseName,
          item.totalQuantity,
          item.totalValue,
          item.status,
          batch.batchNumber,
          formatDate(batch.createdAt),
          formatDate(batch.expiryDate),
          batch.quantity,
          batch.costPrice,
          batch.sellPrice ?? batch.costPrice * 1.2,
          batch.totalCost,
        ])
      })
    } else {
      // No batch details, just inventory row
      rows.push([
        item.sku,
        item.productName,
        item.warehouseName,
        item.totalQuantity,
        item.totalValue,
        item.status,
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ])
    }
  })

  const csvContent = rows
    .map((e) => e.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
    .join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.setAttribute('download', 'inventories.csv')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

watch(inventorySummary, (list) => {
  list.forEach((item) => {
    if (item.warehouseId && !warehouseNameMap.value[item.warehouseId]) {
      getWarehouseName(item.warehouseId)
    }
  })
})
</script>
