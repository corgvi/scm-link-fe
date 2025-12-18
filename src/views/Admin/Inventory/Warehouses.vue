<template>
  <AdminLayout>
    <div class="font-sans text-sm leading-6">
      <div
        class="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]"
      >
        <div class="mb-6 flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Overview</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Quick insights into your warehouses
            </p>
          </div>
          <div class="flex justify-end mt-6">
            <button
              @click="showCreateModal = true"
              class="bg-brand-500 shadow-theme-xs hover:bg-brand-600 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none">
                <path
                  d="M5 10h10M10 5v10"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
              Create Warehouse
            </button>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div
            class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
          >
            <p class="text-gray-500 dark:text-gray-400">Total Warehouses</p>
            <p class="text-2xl font-semibold text-gray-800 dark:text-white">{{ totalElements }}</p>
          </div>

          <div
            class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
          >
            <p class="text-gray-500 dark:text-gray-400">Total Locations</p>
            <p class="text-2xl font-semibold text-green-600">{{ totalLocations }}</p>
          </div>

          <div
            class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
          >
            <p class="text-gray-500 dark:text-gray-400">Active Warehouses</p>
            <p class="text-2xl font-semibold text-gray-800 dark:text-white">
              {{ activeWarehouses }}
            </p>
          </div>

          <div
            class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
          >
            <p class="text-gray-500 dark:text-gray-400">Inactive Warehouses</p>
            <p class="text-2xl font-semibold text-gray-800 dark:text-white">
              {{ inactiveWarehouses }}
            </p>
          </div>
        </div>
      </div>

      <div
        class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md dark:border-gray-800 dark:bg-white/[0.03]"
      >
        <div
          class="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800"
        >
          <div>
            <h2 class="font-semibold text-gray-800 dark:text-white/90">Warehouse Management</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Manage your warehouses here. You can create, edit, or delete warehouses as needed.
            </p>
          </div>
          <div class="flex gap-3.5 mb-4">
            <div class="relative">
              <span
                class="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 dark:text-gray-400"
              >
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
                placeholder="Search warehouses..."
                class="h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pr-4 pl-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden xl:w-[300px] dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 transition duration-150"
              />
            </div>
            <button
              class="shadow-theme-xs flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-[11px] text-sm font-medium text-gray-700 sm:w-auto dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 transition duration-150"
              @click="exportCSV"
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
          Loading warehouses...
        </div>
        <div v-else-if="error" class="p-8 text-center text-red-500">
          {{ error }}
        </div>
        <div v-else>
          <div class="custom-scrollbar overflow-x-auto">
            <table class="w-full table-auto">
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-800">
                  <th class="p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400">
                    #
                  </th>
                  <th class="p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400">
                    Name
                  </th>
                  <th class="p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400">
                    Address
                  </th>
                  <th class="p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400">
                    Contact Phone
                  </th>
                  <th class="p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400">
                    Status
                  </th>
                  <th class="p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
                <template v-for="(warehouse, idx) in displayedWarehouses" :key="warehouse.id">
                  <tr class="transition hover:bg-gray-50 dark:hover:bg-gray-900">
                    <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">
                      {{ idx + 1 }}
                    </td>
                    <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">
                      {{ warehouse.name }}
                    </td>
                    <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">
                      {{ warehouse.address + ',' + warehouse.city }}
                    </td>
                    <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">
                      {{ warehouse.contactPhone }}
                    </td>
                    <td class="p-4 whitespace-nowrap">
                      <span
                        :class="
                          warehouse.active
                            ? 'bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-500'
                            : 'bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500'
                        "
                        class="text-theme-xs rounded-full px-2 py-0.5 font-medium"
                      >
                        {{ warehouse.active ? 'Active' : 'Inactive' }}
                      </span>
                    </td>
                    <td class="p-4 flex items-center">
                      <div class="flex gap-2">
                        <ActionMainButton
                          text="Update"
                          type="update"
                          icon="edit"
                          @click="openUpdateModal(warehouse)"
                        />
                      </div>
                      <button
                        @click="toggleExpand(warehouse.id)"
                        class="ml-auto inline-flex items-center justify-center rounded-full w-9 h-9 bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="w-5 h-5 transition-transform"
                          :class="expandedId === warehouse.id ? 'rotate-180' : ''"
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
                      </button>
                    </td>
                  </tr>
                  <tr v-if="expandedId === warehouse.id">
                    <td colspan="6" class="p-4 bg-gray-50 dark:bg-gray-800">
                      <div
                        class="rounded-xl border border-gray-200 dark:border-gray-700 p-4 grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        <div>
                          <h4 class="font-semibold text-gray-700 dark:text-gray-200 mb-3">
                            Warehouse Locations
                          </h4>
                          <ul class="space-y-2">
                            <li
                              v-for="loc in warehouse.warehouseLocations"
                              :key="loc.id"
                              class="rounded-md border px-3 py-2 text-sm flex justify-between items-center bg-white dark:bg-gray-900"
                            >
                              <div>
                                <p class="font-medium dark:text-gray-200">{{ loc.locationCode }}</p>
                                <p class="text-xs text-gray-500">
                                  {{ loc.locationType }} • {{ loc.maxCapacityKg }} kg
                                </p>
                              </div>
                              <span
                                :class="loc.available ? 'text-green-600' : 'text-red-500'"
                                class="text-xs font-medium"
                                >{{ loc.available ? 'Available' : 'Unavailable' }}</span
                              >
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h4 class="font-semibold text-gray-700 dark:text-gray-200 mb-3">
                            Add Location
                          </h4>
                          <form @submit.prevent="addLocation(warehouse.id)" class="space-y-3">
                            <input
                              v-model="newLocation.locationCode"
                              type="text"
                              placeholder="Location Code"
                              class="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900 dark:text-white"
                              required
                            />
                            <select
                              v-model="newLocation.locationType"
                              class="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900 dark:text-white"
                            >
                              <option value="FLOOR">FLOOR</option>
                              <option value="RACK">RACK</option>
                              <option value="SHELF">SHELF</option>
                              <option value="TRACK">TRACK</option>
                            </select>
                            <input
                              v-model.number="newLocation.maxCapacityKg"
                              type="number"
                              placeholder="Max Capacity (kg)"
                              class="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900 dark:text-white"
                              required
                              min="0"
                            />
                            <button
                              type="submit"
                              class="w-full bg-brand-500 text-white rounded-lg py-2 hover:bg-brand-600"
                            >
                              Save
                            </button>
                          </form>
                        </div>
                      </div>
                    </td>
                  </tr>
                </template>
                <tr v-if="filteredWarehouses.length === 0">
                  <td colspan="6" class="p-4 text-center text-gray-400 dark:text-gray-500">
                    No warehouses found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div
            class="flex flex-col items-center justify-between border-t border-gray-200 px-5 py-4 sm:flex-row dark:border-gray-800 mt-4"
          >
            <div class="pb-3 sm:pb-0">
              <span class="block text-sm font-medium text-gray-500 dark:text-gray-400">
                Showing
                <span class="text-gray-800 dark:text-white/90">{{
                  (currentPage - 1) * itemsPerPage + (displayedWarehouses.length ? 1 : 0)
                }}</span>
                to
                <span class="text-gray-800 dark:text-white/90">{{
                  (currentPage - 1) * itemsPerPage + displayedWarehouses.length
                }}</span>
                of <span class="text-gray-800 dark:text-white/90">{{ totalElements }}</span>
              </span>
            </div>
            <div
              class="flex w-full items-center justify-between gap-2 rounded-lg bg-gray-50 p-4 sm:w-auto sm:justify-normal sm:bg-transparent sm:p-0 dark:bg-white/[0.03] dark:sm:bg-transparent"
            >
              <button
                class="shadow-theme-xs flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 hover:text-gray-800 sm:p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                @click="previousPage"
                :disabled="currentPage === 1"
                :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''"
              >
                <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M2.58203 9.99868C2.58174 10.1909 2.6549 10.3833 2.80152 10.53L7.79818 15.5301C8.09097 15.8231 8.56584 15.8233 8.85883 15.5305C9.15183 15.2377 9.152 14.7629 8.85921 14.4699L5.13911 10.7472L16.6665 10.7472C17.0807 10.7472 17.4165 10.4114 17.4165 9.99715C17.4165 9.58294 17.0807 9.24715 16.6665 9.24715L5.14456 9.24715L8.85919 5.53016C9.15199 5.23717 9.15184 4.7623 8.85885 4.4695C8.56587 4.1767 8.09099 4.17685 7.79819 4.46984L2.84069 9.43049C2.68224 9.568 2.58203 9.77087 2.58203 9.99715C2.58203 9.99766 2.58203 9.99817 2.58203 9.99868Z"
                    fill=""
                  ></path>
                </svg>
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
                    >{{ page }}</a
                  >
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
                <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M17.4165 9.9986C17.4168 10.1909 17.3437 10.3832 17.197 10.53L12.2004 15.5301C11.9076 15.8231 11.4327 15.8233 11.1397 15.5305C10.8467 15.2377 10.8465 14.7629 11.1393 14.4699L14.8594 10.7472L3.33203 10.7472C2.91782 10.7472 2.58203 10.4114 2.58203 9.99715C2.58203 9.58294 2.91782 9.24715 3.33203 9.24715L14.854 9.24715L11.1393 5.53016C10.8465 5.23717 10.8467 4.7623 11.1397 4.4695C11.4327 4.1767 11.9075 4.17685 12.2003 4.46984L17.1578 9.43049C17.3163 9.568 17.4165 9.77087 17.4165 9.99715C17.4165 9.99763 17.4165 9.99812 17.4165 9.9986Z"
                    fill=""
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <CreateWarehouseModal
        v-if="showCreateModal"
        @close="showCreateModal = false"
        @created="onWarehouseCreated"
      />

      <UpdateWarehouseModal
        v-if="showUpdateModal"
        :warehouse="selectedWarehouse"
        @close="showUpdateModal = false"
        @updated="onWarehouseUpdated"
      />
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import CreateWarehouseModal from './CreateWarehouseModal.vue'
import UpdateWarehouseModal from './UpdateWarehouseModal.vue'
import ActionMainButton from '@/components/common/ActionMainButton.vue'

const baseURL = import.meta.env.VITE_BASE_URL
const token = localStorage.getItem('auth_token') || ''

// paging state
const warehouses = ref<any[]>([])
const expandedId = ref<string | null>(null)
const showCreateModal = ref(false)
const searchQuery = ref('')
const error = ref('')
const loading = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalPages = ref(1)
const totalElements = ref(0)
const pageNumber = ref(0)
const showUpdateModal = ref(false)
const selectedWarehouse = ref<any | null>(null)

const newLocation = ref({
  locationCode: '',
  locationType: 'FLOOR',
  maxCapacityKg: null as number | null,
  available: true,
})

const totalLocations = computed(() =>
  warehouses.value.reduce((sum, w) => sum + (w.warehouseLocations?.length || 0), 0),
)
const activeWarehouses = computed(() => warehouses.value.filter((w) => w.active).length)
const inactiveWarehouses = computed(() => warehouses.value.filter((w) => !w.active).length)

// filter only within current page content
const filteredWarehouses = computed(() => {
  const list = warehouses.value.slice()
  if (!searchQuery.value) return list
  const q = searchQuery.value.toLowerCase()
  return list.filter(
    (w) =>
      (w.name || '').toLowerCase().includes(q) ||
      ((w.address || '') && w.address.toLowerCase().includes(q)) ||
      ((w.contactPhone || '') && w.contactPhone.toLowerCase().includes(q)),
  )
})

const displayedWarehouses = computed(() => filteredWarehouses.value)

async function fetchWarehouses() {
  loading.value = true
  error.value = ''
  try {
    const pageIndex = Math.max(0, currentPage.value)
    const res = await fetch(
      `${baseURL}/scmlink/warehouses?page=${pageIndex}&size=${itemsPerPage.value}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    const data = await res.json()
    const pageData = data?.result || data || {}
    const content = pageData.content || pageData.items || []
    warehouses.value = Array.isArray(content) ? content : []

    totalElements.value = pageData.totalElements ?? warehouses.value.length
    totalPages.value =
      pageData.totalPages ?? Math.max(1, Math.ceil((totalElements.value || 0) / itemsPerPage.value))
    pageNumber.value = pageData.pageNumber ?? pageIndex
    currentPage.value = (pageNumber.value || 0) + 1
  } catch (err) {
    console.error(err)
    error.value = 'Network error. Please try again.'
  } finally {
    loading.value = false
  }
}

// Xử lý khi tạo kho mới thành công
function onWarehouseCreated(newWarehouse: any) {
  // Thêm vào danh sách hiện tại
  warehouses.value.push(newWarehouse)
  // Tăng total elements
  totalElements.value++
  // Đóng modal
  showCreateModal.value = false
}

onMounted(() => fetchWarehouses())

function toggleExpand(id: string) {
  expandedId.value = expandedId.value === id ? null : id
}

async function addLocation(warehouseId: string) {
  try {
    const res = await fetch(`${baseURL}/scmlink/warehouseLocations`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        locationCode: newLocation.value.locationCode,
        locationType: newLocation.value.locationType,
        maxCapacityKg: String(newLocation.value.maxCapacityKg ?? ''),
        warehouseId: warehouseId,
        available: newLocation.value.available,
      }),
    })
    const data = await res.json()
    if (data.code === 1000) {
      const wh = warehouses.value.find((w) => w.id === warehouseId)
      if (wh) {
        if (!wh.warehouseLocations) wh.warehouseLocations = []
        wh.warehouseLocations.push(data.result)
      }
      newLocation.value = {
        locationCode: '',
        locationType: 'FLOOR',
        maxCapacityKg: null,
        available: true,
      }
    }
  } catch (err) {
    console.error(err)
  }
}
function openUpdateModal(warehouse: any) {
  selectedWarehouse.value = { ...warehouse } // clone để tránh mutate list
  showUpdateModal.value = true
}
function onWarehouseUpdated(updatedWarehouse: any) {
  const idx = warehouses.value.findIndex((w) => w.id === updatedWarehouse.id)
  if (idx !== -1) {
    warehouses.value[idx] = {
      ...warehouses.value[idx],
      ...updatedWarehouse,
    }
  }
  showUpdateModal.value = false
}


// Export CSV for warehouses
function exportCSV() {
  const rows = [
    ['Name', 'Address', 'Contact Phone', 'Status', 'Total Locations'],
    ...displayedWarehouses.value.map((w) => [
      w.name,
      w.address,
      w.contactPhone,
      w.active ? 'Active' : 'Inactive',
      w.warehouseLocations?.length || 0,
    ]),
  ]
  const csvContent = rows
    .map((e) => e.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
    .join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.setAttribute('download', 'warehouses.csv')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

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
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchWarehouses()
  }
}
function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchWarehouses()
  }
}
function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchWarehouses()
  }
}
</script>
