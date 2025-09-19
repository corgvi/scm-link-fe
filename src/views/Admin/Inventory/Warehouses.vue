<template>
  <AdminLayout>
    <!-- Overview Section -->
    <div
      class="mb-6 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div class="mb-6 flex items-center justify-between">
        <h2 class="font-semibold text-gray-800 dark:text-white/90">Overview</h2>
        <button
          @click="showCreateModal = true"
          class="bg-brand-500 shadow-theme-xs hover:bg-brand-600 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none">
            <path d="M5 10h10M10 5v10" stroke="white" stroke-width="1.5" stroke-linecap="round" />
          </svg>
          Create Warehouse
        </button>
      </div>
      <div
        class="grid grid-cols-1 rounded-xl border border-gray-200 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-y-0 dark:divide-gray-800 dark:border-gray-800"
      >
        <div class="border-b p-5 sm:border-r lg:border-b-0">
          <p class="mb-1.5 text-sm text-gray-400 dark:text-gray-500">Total Warehouses</p>
          <h3 class="text-3xl text-gray-800 dark:text-white/90">{{ warehouses.length }}</h3>
        </div>
        <div class="border-b p-5 lg:border-b-0">
          <p class="mb-1.5 text-sm text-gray-400 dark:text-gray-500">Total Locations</p>
          <h3 class="text-3xl text-gray-800 dark:text-white/90">{{ totalLocations }}</h3>
        </div>
        <div class="border-b p-5 sm:border-r sm:border-b-0">
          <p class="mb-1.5 text-sm text-gray-400 dark:text-gray-500">Active Warehouses</p>
          <h3 class="text-3xl text-gray-800 dark:text-white/90">{{ activeWarehouses }}</h3>
        </div>
        <div class="p-5">
          <p class="mb-1.5 text-sm text-gray-400 dark:text-gray-500">Inactive Warehouses</p>
          <h3 class="text-3xl text-gray-800 dark:text-white/90">{{ inactiveWarehouses }}</h3>
        </div>
      </div>
    </div>

    <!-- Warehouse management -->
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
        <!-- Search & Export -->
        <div class="flex gap-3.5 mb-4">
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
              placeholder="Search warehouses..."
              class="h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pr-4 pl-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden xl:w-[300px] dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 transition duration-150"
            />
          </div>
          <button
            class="shadow-theme-xs flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-[11px] text-sm font-medium text-gray-700 sm:w-auto dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 transition duration-150"
            @click="exportCSV"
            aria-label="Export warehouses to CSV"
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

      <!-- Table & Details -->
      <!-- Loading/Error/Empty State -->
      <div v-if="loading" class="p-8 text-center text-gray-400">
        <span
          class="animate-spin mr-2 w-6 h-6 border-2 border-t-transparent border-gray-400 rounded-full inline-block"
        ></span>
        Loading categories...
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
              <template v-for="(warehouse, idx) in filteredWarehouses" :key="warehouse.id">
                <tr class="transition hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">
                    {{ idx + 1 }}
                  </td>
                  <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">
                    {{ warehouse.name }}
                  </td>
                  <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">
                    {{ warehouse.address }}
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
                      <button
                        class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow hover:bg-blue-700 transition"
                      >
                        <img src="/images/icons/edit.svg" class="w-4 h-4" alt="edit" />
                        Edit
                      </button>
                      <button
                        class="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white shadow hover:bg-red-700 transition"
                      >
                        <img src="/images/icons/delete.svg" class="w-4 h-4" alt="delete" />
                      </button>
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
                      <!-- Left: warehouseLocations -->
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
                            >
                              {{ loc.available ? 'Available' : 'Unavailable' }}
                            </span>
                          </li>
                        </ul>
                      </div>
                      <!-- Right: add location form -->
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
      </div>
    </div>

    <!-- Create Warehouse Modal -->
    <Modal
      v-if="showCreateModal"
      :fullScreenBackdrop="true"
      :backdropClass="'bg-black bg-opacity-60'"
      @close="showCreateModal = false"
    >
      <template #body>
        <div>
          <button
            @click="showCreateModal = false"
            class="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            ✕
          </button>
          <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">Create Warehouse</h3>
          <p class="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Fill in the details below to create a new warehouse.
          </p>
          <form @submit.prevent="handleCreateWarehouse" class="grid grid-cols-1 gap-6">
            <div>
              <input
                v-model="form.name"
                type="text"
                placeholder="Name"
                class="border rounded-lg px-4 py-3 w-full dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-brand-500 transition"
                :class="{ 'border-red-500': errors.name }"
                required
              />
              <span v-if="errors.name" class="text-xs text-red-500 mt-1">{{ errors.name }}</span>
            </div>
            <div>
              <input
                v-model="form.address"
                type="text"
                placeholder="Address"
                class="border rounded-lg px-4 py-3 w-full dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-brand-500 transition"
                :class="{ 'border-red-500': errors.address }"
                required
              />
              <span v-if="errors.address" class="text-xs text-red-500 mt-1">{{
                errors.address
              }}</span>
            </div>
            <div>
              <input
                v-model="form.contactPhone"
                type="text"
                placeholder="Contact Phone"
                class="border rounded-lg px-4 py-3 w-full dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-brand-500 transition"
                :class="{ 'border-red-500': errors.contactPhone }"
                required
              />
              <span v-if="errors.contactPhone" class="text-xs text-red-500 mt-1">{{
                errors.contactPhone
              }}</span>
            </div>
            <div class="mt-4 flex flex-col gap-2">
              <span v-if="createError" class="text-xs text-red-500 text-center">{{
                createError
              }}</span>
              <span v-if="createSuccess" class="text-xs text-green-500 text-center">{{
                createSuccess
              }}</span>
            </div>
            <div class="mt-6 flex justify-end gap-2">
              <button
                type="button"
                @click="showCreateModal = false"
                class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                :disabled="loadingCreate"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-6 py-2 rounded-lg bg-brand-500 text-white font-semibold hover:bg-brand-600 transition flex items-center gap-2"
                :disabled="loadingCreate"
              >
                <span
                  v-if="loadingCreate"
                  class="animate-spin mr-2 w-4 h-4 border-2 border-t-transparent border-white rounded-full inline-block"
                ></span>
                Save
              </button>
            </div>
          </form>
        </div>
      </template>
    </Modal>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import Modal from '@/components/ui/Modal.vue'

const baseURL = import.meta.env.VITE_BASE_URL
const token = localStorage.getItem('auth_token') || ''
const warehouses = ref<any[]>([])
const expandedId = ref<string | null>(null)
const showCreateModal = ref(false)
const searchQuery = ref('')
const error = ref('')
const loading = ref(false)

const form = ref({
  name: '',
  address: '',
  contactPhone: '',
})
const errors = ref({
  name: '',
  address: '',
  contactPhone: '',
})
const createError = ref('')
const createSuccess = ref('')
const loadingCreate = ref(false)

const newLocation = ref({
  locationCode: '',
  locationType: 'FLOOR',
  maxCapacityKg: null,
  available: true,
})

const totalLocations = computed(() =>
  warehouses.value.reduce((sum, w) => sum + (w.warehouseLocations?.length || 0), 0),
)
const activeWarehouses = computed(() => warehouses.value.filter((w) => w.active).length)
const inactiveWarehouses = computed(() => warehouses.value.filter((w) => !w.active).length)

const filteredWarehouses = computed(() => {
  if (!searchQuery.value) return warehouses.value
  const q = searchQuery.value.toLowerCase()
  return warehouses.value.filter(
    (w) =>
      w.name.toLowerCase().includes(q) ||
      (w.address && w.address.toLowerCase().includes(q)) ||
      (w.contactPhone && w.contactPhone.toLowerCase().includes(q)),
  )
})

async function fetchWarehouses() {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(`${baseURL}/scmlink/warehouses`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (data.code === 1000) {
      warehouses.value = data.result
    }
  } catch (err) {
    console.error(err)
    error.value = 'Network error. Please try again.'
  } finally {
    loading.value = false
  } 
}
onMounted(fetchWarehouses)

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
        ...newLocation.value,
        warehouseId,
      }),
    })
    const data = await res.json()
    if (data.code === 1000) {
      const wh = warehouses.value.find((w) => w.id === warehouseId)
      if (wh) {
        wh.warehouseLocations.push(data.result)
      }
      newLocation.value = {
        locationCode: '',
        locationType: 'FLOOR',
        maxCapacityKg: 0,
        available: true,
      }
    }
  } catch (err) {
    console.error(err)
  }
}

// Export CSV for warehouses
function exportCSV() {
  const rows = [
    ['Name', 'Address', 'Contact Phone', 'Status', 'Total Locations'],
    ...filteredWarehouses.value.map((w) => [
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

function validateForm() {
  errors.value.name = form.value.name ? '' : 'Name is required'
  errors.value.address = form.value.address ? '' : 'Address is required'
  errors.value.contactPhone = form.value.contactPhone ? '' : 'Contact phone is required'
  return !errors.value.name && !errors.value.address && !errors.value.contactPhone
}

async function handleCreateWarehouse() {
  createError.value = ''
  createSuccess.value = ''
  if (!validateForm()) return
  loadingCreate.value = true
  try {
    const res = await fetch(`${baseURL}/scmlink/warehouses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form.value),
    })
    const data = await res.json()
    if (res.ok && data.code === 1000) {
      warehouses.value.push(data.result)
      createSuccess.value = 'Warehouse created successfully.'
      setTimeout(() => {
        showCreateModal.value = false
        createSuccess.value = ''
      }, 1200)
      form.value = { name: '', address: '', contactPhone: '' }
    } else {
      createError.value = data.message || 'Failed to create warehouse'
    }
  } catch (e) {
    createError.value = 'Error creating warehouse'
  } finally {
    loadingCreate.value = false
  }
}
</script>
