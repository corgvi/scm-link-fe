<template>
  <AdminLayout>
    <PageBreadcrumb pageTitle="Vehicles" />

    <!-- Overview -->
    <div
      class="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Overview</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Quick insights into your vehicles
          </p>
        </div>
        <div class="flex justify-end mt-6">
          <ActionMainButton
            text="Create Vehicle"
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
          <p class="text-gray-500 dark:text-gray-400">Total Vehicles</p>
          <p class="text-2xl font-semibold text-gray-800 dark:text-white">{{ totalElements }}</p>
        </div>

        <div
          class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
        >
          <p class="text-gray-500 dark:text-gray-400">Available</p>
          <p class="text-2xl font-semibold text-green-600">{{ availableCount }}</p>
        </div>

        <div
          class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
        >
          <p class="text-gray-500 dark:text-gray-400">Unavailable</p>
          <p class="text-2xl font-semibold text-red-600">{{ unavailableCount }}</p>
        </div>

        <div
          class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
        >
          <p class="text-gray-500 dark:text-gray-400">Page Capacity (kg)</p>
          <p class="text-2xl font-semibold text-indigo-600">{{ pageTotalCapacity }}</p>
        </div>
      </div>
    </div>

    <!-- Vehicles Table -->
    <div
      class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-md"
    >
    
      <div
        class="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800"
      >
        <div>
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Vehicle List</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">Manage fleet below</p>
        </div>
        <div class="flex items-center gap-3.5">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full sm:w-auto">
            <input
              v-model="filters.licensePlate"
              type="text"
              placeholder="License plate"
              class="h-10 rounded-lg border border-gray-300 bg-transparent py-2 px-3 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              aria-label="Filter by license plate"
            />
            <select
              v-model="filters.type"
              class="h-10 rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm text-gray-800 focus:ring-2 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
              aria-label="Filter by type"
            >
              <option value="">All</option>
              <option value="TRUCK">TRUCK</option>
              <option value="MOTORBIKE">MOTORBIKE</option>
              <option value="CONTAINER">CONTAINER</option>
              <option value="VAN">VAN</option>
            </select>
            <select
              v-model="filters.isAvailable"
              class="h-10 rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm text-gray-800 focus:ring-2 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
              aria-label="Filter by availability"
            >
              <option value="">All</option>
              <option value="true">Available</option>
              <option value="false">Unavailable</option>
            </select>
          </div>
          <ActionMainButton
            text="Export"
            icon="download"
            type="export"
            @click="exportVehicles"
          />
        </div>
      </div>
      
      <div v-if="loading" class="p-8 text-center text-gray-400">
        <span
          class="animate-spin mr-2 w-6 h-6 border-2 border-t-transparent border-gray-400 rounded-full inline-block"
        ></span>
        Loading vehicles...
      </div>

      <div v-else-if="error" class="p-8 text-center text-red-500">
        {{ error }}
      </div>

      <div v-else>
        <div class="overflow-x-auto custom-scrollbar">
          <table class="w-full table-auto text-sm">
            <thead
              class="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700"
            >
              <tr>
                <th class="p-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-400">
                  #
                </th>
                <th class="p-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-400">
                  License
                </th>
                <th class="p-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-400">
                  Type
                </th>
                <th class="p-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-400">
                  Capacity (kg)
                </th>
                <th class="p-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-400">
                  Available
                </th>
                <th class="p-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-400">
                  Created At
                </th>
                <th class="p-4 text-center text-xs font-semibold text-gray-700 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(v, idx) in filteredVehicles"
                :key="v.id"
                class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <td class="p-4">{{ (currentPage - 1) * itemsPerPage + idx + 1 }}</td>
                <td class="p-4">{{ v.licensePlate || '—' }}</td>
                <td class="p-4">{{ v.type || '—' }}</td>
                <td class="p-4">{{ v.capacityKg ?? '—' }}</td>
                <td class="p-4">
                  <span :class="v.available ? 'text-green-600' : 'text-red-600'">
                    {{ v.available ? 'Yes' : 'No' }}
                  </span>
                </td>
                <td class="p-4">{{ formatDate(v.createdAt) }}</td>
                <td class="p-4 text-center">
                  <div class="flex justify-center gap-2">
                    <ActionMainButton text="Detail" type="detail" icon="detail" />
                    <ActionMainButton text="Update" type="update" icon="edit" @click="openUpdate(v)" />
                  </div>
                </td>
              </tr>

              <tr v-if="vehicles.length === 0">
                <td colspan="7" class="p-4 text-center text-gray-400">No vehicles found.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div
          class="flex flex-col items-center justify-between border-t border-gray-200 px-5 py-4 sm:flex-row dark:border-gray-800 mt-4"
        >
          <div class="pb-3 sm:pb-0">
            <span class="block text-sm font-medium text-gray-500 dark:text-gray-400">
              Showing
              <span class="text-gray-800 dark:text-white/90">{{
                (currentPage - 1) * itemsPerPage + (filteredVehicles.length ? 1 : 0)
              }}</span>
              to
              <span class="text-gray-800 dark:text-white/90">{{
                (currentPage - 1) * itemsPerPage + filteredVehicles.length
              }}</span>
              of
              <span class="text-gray-800 dark:text-white/90">{{ totalElements }}</span>
            </span>
          </div>

          <div
            class="flex w-full items-center justify-between gap-2 rounded-lg bg-gray-50 p-4 sm:w-auto sm:justify-normal sm:bg-transparent sm:p-0 dark:bg-white/[0.03] dark:sm:bg-transparent"
          >
            <button
              class="shadow-theme-xs flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 sm:p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
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
              class="shadow-theme-xs flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 sm:p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
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
    <CreateVehicleModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @created="fetchVehicles"
    />
    <UpdateVehicleModal
      v-if="showUpdateModal"
      :vehicle="selectedVehicle"
      @close="showUpdateModal = false"
      @updated="fetchVehicles"
    />
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
 import AdminLayout from '@/components/layout/AdminLayout.vue'
 import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
 import ActionMainButton from '@/components/common/ActionMainButton.vue'
 import CreateVehicleModal from './CreateVehicleModal.vue'
 import UpdateVehicleModal from './UpdateVehicleModal.vue'
 
 const baseURL = import.meta.env.VITE_BASE_URL
 const token = localStorage.getItem('auth_token') || ''
 
 const vehicles = ref<any[]>([])
 const loading = ref(true)
 const error = ref('')
 
 const currentPage = ref(1)
 const itemsPerPage = ref(10)
 const totalPages = ref(1)
 const totalElements = ref(0)
 const pageNumber = ref(0)
 const showCreateModal = ref(false)
 const showUpdateModal = ref(false)
 const selectedVehicle = ref<any | null>(null)
 
// filters: licensePlate, type, isAvailable (client-side)
const filters = reactive({
  licensePlate: '',
  type: '',
  isAvailable: '', // '' | 'true' | 'false'
})

 function openUpdate(vehicle: any) {
   selectedVehicle.value = vehicle
   showUpdateModal.value = true
 }
 
 async function fetchVehicles(page = 1) {
   loading.value = true
   error.value = ''
   try {
     const pageIndex = Math.max(0, page)
     const res = await fetch(
       `${baseURL}/scmlink/vehicles?page=${pageIndex}&size=${itemsPerPage.value}`,
       {
         headers: { Authorization: `Bearer ${token}` },
       },
     )
     const data = await res.json()
     const pageData = data?.result || data || {}
     const content = pageData.content || []
     vehicles.value = Array.isArray(content) ? content : []

     totalElements.value = pageData.totalElements ?? vehicles.value.length
     totalPages.value =
       pageData.totalPages ?? Math.max(1, Math.ceil((totalElements.value || 0) / itemsPerPage.value))
     pageNumber.value = pageData.pageNumber ?? pageIndex
     currentPage.value = (pageNumber.value || 0) + 1
   } catch (e) {
     console.error(e)
     error.value = 'Network error. Please try again.'
   } finally {
     loading.value = false
   }
 }
 
 onMounted(() => fetchVehicles(1))
 
 const availableCount = computed(() => vehicles.value.filter((v) => v.available).length)
 const unavailableCount = computed(() => vehicles.value.filter((v) => !v.available).length)
 const pageTotalCapacity = computed(() =>
   vehicles.value.reduce((s, v) => s + (v.capacityKg || 0), 0),
 )
 
 function formatDate(d?: string) {
   if (!d) return '—'
   return new Date(d).toLocaleString('vi-VN')
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
   if (page >= 1 && page <= totalPages.value) fetchVehicles(page)
 }
 function previousPage() {
   if (currentPage.value > 1) fetchVehicles(currentPage.value - 1)
 }
 function nextPage() {
   if (currentPage.value < totalPages.value) fetchVehicles(currentPage.value + 1)
 }
 
 // client-side filtered list (applies to current page items)
 const filteredVehicles = computed(() => {
   const qLicense = (filters.licensePlate || '').toString().trim().toLowerCase()
   const qType = (filters.type || '').toString().trim().toUpperCase()
   const avail = filters.isAvailable
   return vehicles.value.filter((v) => {
     if (qLicense && !(v.licensePlate || '').toString().toLowerCase().includes(qLicense)) return false
     if (qType && ((v.type || '').toString().toUpperCase() !== qType)) return false
     if (avail === 'true' && !v.available) return false
     if (avail === 'false' && v.available) return false
     return true
   })
 })
 
 // Export current filtered list as CSV
 function exportVehicles() {
   try {
     const rows: any[] = []
     rows.push(['License', 'Type', 'CapacityKg', 'Available', 'CreatedAt'])
     filteredVehicles.value.forEach((v: any) => {
       rows.push([
         v.licensePlate ?? '',
         v.type ?? '',
         v.capacityKg ?? '',
         v.available ? 'Yes' : 'No',
         v.createdAt ?? '',
       ])
     })

     const csv = rows
       .map((r) =>
         r
           .map((c) => `"${String(c).replace(/"/g, '""')}"`)
           .join(','),
       )
       .join('\n')

     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
     const url = URL.createObjectURL(blob)
     const a = document.createElement('a')
     a.href = url
     a.download = `vehicles_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'_')}.csv`
     document.body.appendChild(a)
     a.click()
     a.remove()
     URL.revokeObjectURL(url)
   } catch (e) {
     console.error('Export failed', e)
   }
 }
 </script>
