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
            {{ inventorySummary.length }}
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
      <div v-else-if="error" class="p-8 text-center text-red-500">{{ error }}</div>
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
                  {{ item.warehouseName }}
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
                      @click="toggleExpand(item.productId)"
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
              <tr v-if="expandedId === item.productId">
                <td colspan="8" class="p-4 bg-gray-50 dark:bg-gray-800">
                  <div
                    v-if="batchDetails[item.productId] && batchDetails[item.productId].length"
                    class="space-y-2 rounded-xl border border-gray-200 dark:border-gray-700 p-4"
                  >
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
                          <td class="p-2">
                            {{ formatCurrency(batch.sellPrice) }}
                          </td>
                          <td class="p-2">{{ formatCurrency(batch.totalCost) }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div
                    v-else-if="
                      batchDetails[item.productId] && batchDetails[item.productId].length === 0
                    "
                    class="text-gray-500"
                  >
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
      @close="showProductReceiveModal = false"
      @submitted="handleProductSubmit"
      :warehouses="warehouses"
      :suppliers="suppliers"
      :products="products"
    />
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
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
const expandedId = ref<string | null>(null)
const batchDetails = ref<Record<string, any[]>>({})
const warehouses = ref<any[]>([])
const suppliers = ref<any[]>([])
const products = ref<any[]>([])
const warehouseLocations = ref<any[]>([])

const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const alert = reactive({
  show: false,
  type: 'success',
  title: '',
  message: '',
})
// Modals
const showGlobalReceiveModal = ref(false)
const showProductReceiveModal = ref(false)
const selectedProduct = ref<any>(null)

function openGlobalReceiveModal() {
  showGlobalReceiveModal.value = true
}
function openReceiveModal(product: any) {
  selectedProduct.value = product
  showProductReceiveModal.value = true
}

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
  } catch (e) {
    error.value = 'Network error. Please try again.'
    console.error(e)
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
    if (data.code === 1000) warehouses.value = data.result
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
    if (data.code === 1000) suppliers.value = data.result
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
    if (data.code === 1000) products.value = data.result
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
    if (data.code === 1000) warehouseLocations.value = data.result
  } catch (e) {
    console.error(e)
  }
}
onMounted(async () => {
  await Promise.all([
    fetchWarehouseLocations(),
    fetchInventory(),
    fetchWarehouses(),
    fetchSuppliers(),
    fetchProducts(),
  ])
})

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

// Submit handlers
function handleGlobalSubmit() {
  fetchInventory()
  showGlobalReceiveModal.value = false
}
function handleProductSubmit() {
  fetchInventory()
  showProductReceiveModal.value = false
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
const totalPages = computed(
  () => Math.ceil(filteredInventory.value.length / itemsPerPage.value) || 1,
)
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
</script>
