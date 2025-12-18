<template>
  <AdminLayout>
    <div class="font-sans text-sm leading-6">
      <Alert
        v-if="alert.show"
        :variant="alert.type"
        :title="alert.title"
        :message="alert.message"
        :duration="3000"
      />
      <PageBreadcrumb pageTitle="Supplier Management" />

      <div
        class="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]"
      >
        <div class="mb-6 flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Overview</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Quick insights into your suppliers
            </p>
          </div>
          <div class="flex justify-end mt-6">
            <button
              @click="showCreateModal = true"
              class="bg-brand-500 shadow-theme-xs hover:bg-brand-600 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none">
                <path
                  d="M5 10.0002H15.0006M10.0002 5V15.0006"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Create Supplier
            </button>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div
            class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
          >
            <p class="text-gray-500 dark:text-gray-400">Total Suppliers</p>
            <p class="text-2xl font-semibold text-gray-800 dark:text-white">
              {{ totalElements || suppliers.length }}
            </p>
          </div>

          <div
            class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
          >
            <p class="text-gray-500 dark:text-gray-400">Active</p>
            <p class="text-2xl font-semibold text-green-600">{{ activeSuppliers }}</p>
          </div>

          <div
            class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
          >
            <p class="text-gray-500 dark:text-gray-400">Inactive</p>
            <p class="text-2xl font-semibold text-red-600">{{ inactiveSuppliers }}</p>
          </div>

          <div
            class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
          >
            <p class="text-gray-500 dark:text-gray-400">Total Products</p>
            <p class="text-2xl font-semibold text-yellow-600">{{ totalProducts }}</p>
          </div>
        </div>
      </div>

      <!-- Suppliers Section -->
      <div
        class="rounded-2xl border border-gray-200 bg-white shadow-md dark:border-gray-800 dark:bg-white/[0.03]"
      >
        <div
          class="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800"
        >
          <div>
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Suppliers</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Manage and search suppliers efficiently
            </p>
          </div>
          <div class="flex items-center gap-3">
            <div class="relative">
              <svg
                class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                v-model="filters.keyword"
                @input="debouncedSearch"
                type="text"
                placeholder="Search name, code, email..."
                class="h-11 w-[360px] rounded-lg border border-gray-300 bg-transparent pl-10 pr-4 text-sm placeholder:text-gray-400 focus:ring-3 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              />
            </div>

            <button
              @click="isFilterOpen = true"
              class="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filter
            </button>

            <button
              @click="exportCSV"
              class="shadow-theme-xs flex items-center gap-2 rounded-lg bg-brand-500 px-3 py-2 text-sm font-medium text-white hover:bg-brand-600"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          Loading suppliers...
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
                    Name
                  </th>
                  <th class="p-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-400">
                    Code
                  </th>
                  <th class="p-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-400">
                    Contact
                  </th>
                  <th class="p-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-400">
                    Email
                  </th>
                  <th class="p-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-400">
                    Phone
                  </th>
                  <th class="p-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-400">
                    Address
                  </th>
                  <th class="p-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-400">
                    Note
                  </th>
                  <th class="p-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-400">
                    Status
                  </th>
                  <th
                    class="p-4 text-center text-xs font-semibold text-gray-700 dark:text-gray-400"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
                <tr
                  v-for="(s, idx) in paginatedSuppliers"
                  :key="s.id"
                  class="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">
                    {{ (currentPage - 1) * itemsPerPage + idx + 1 }}
                  </td>
                  <td
                    class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200"
                    :title="s.name"
                  >
                    <span v-if="s.name && s.name.length > 20">{{
                      s.name.slice(0, 10) + '...'
                    }}</span>
                    <span v-else>{{ s.name }}</span>
                  </td>
                  <td
                    class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200"
                    :title="s.code"
                  >
                    <span v-if="s.code && s.code.length > 10">{{
                      s.code.slice(0, 10) + '...'
                    }}</span>
                    <span v-else>{{ s.code }}</span>
                  </td>
                  <td
                    class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200"
                    :title="s.contactPerson"
                  >
                    <span v-if="s.contactPerson && s.contactPerson.length > 10">{{
                      s.contactPerson.slice(0, 10) + '...'
                    }}</span>
                    <span v-else>{{ s.contactPerson || '-' }}</span>
                  </td>
                  <td
                    class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200"
                    :title="s.email"
                  >
                    <span v-if="s.email && s.email.length > 25">{{
                      s.email.slice(0, 15) + '...'
                    }}</span>
                    <span v-else>{{ s.email }}</span>
                  </td>
                  <td
                    class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200"
                    :title="s.phoneNumber"
                  >
                    <span v-if="s.phoneNumber && s.phoneNumber.length > 15">{{
                      s.phoneNumber.slice(0, 15) + '...'
                    }}</span>
                    <span v-else>{{ s.phoneNumber }}</span>
                  </td>
                  <td
                    class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200"
                    :title="s.address"
                  >
                    <span v-if="s.address && s.address.length > 30">{{
                      s.address.slice(0, 15) + '...'
                    }}</span>
                    <span v-else>{{ s.address || '-' }}</span>
                  </td>
                  <td
                    class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200"
                    :title="s.note"
                  >
                    <span v-if="s.note && s.note.length > 10">{{
                      s.note.slice(0, 10) + '...'
                    }}</span>
                    <span v-else>{{ s.note || '-' }}</span>
                  </td>
                  <td class="p-4 whitespace-nowrap text-center">
                    <span
                      :class="
                        s.active
                          ? 'bg-success-50 dark:bg-success-500/15 text-success-700 dark:text-success-500'
                          : 'bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500'
                      "
                      class="text-theme-xs rounded-full px-2 py-0.5 font-medium"
                      >{{ s.active ? 'Active' : 'Inactive' }}</span
                    >
                  </td>
                  <td class="p-4 text-center">
                    <div class="flex items-center justify-center gap-2">
                      <ActionMainButton
                        text="Update"
                        type="update"
                        icon="edit"
                        @click="openEditModal(s)"
                      />
                      <button
                        class="inline-flex items-center justify-center rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white shadow hover:bg-red-700 transition disabled:opacity-50"
                        @click="confirmDeleteSupplier(s)"
                        :disabled="loadingDelete"
                        title="Delete"
                      >
                        <img src="/images/icons/delete.svg" alt="Delete" class="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="paginatedSuppliers.length === 0">
                  <td colspan="8" class="p-4 text-center text-gray-400">No suppliers found.</td>
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
                  (currentPage - 1) * itemsPerPage + (paginatedSuppliers.length ? 1 : 0)
                }}</span>
                to
                <span class="text-gray-800 dark:text-white/90">{{
                  (currentPage - 1) * itemsPerPage + paginatedSuppliers.length
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
                  <svg
                    class="fill-current"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
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
                    @click.prevent="goToPage(page as number)"
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

                <li v-if="(visiblePages[visiblePages.length - 1] as number) < totalPages">
                  <span
                    class="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium text-gray-700 dark:text-gray-400"
                    >...</span
                  >
                </li>

                <li v-if="(visiblePages[visiblePages.length - 1] as number) < totalPages">
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
                  <svg
                    class="fill-current"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
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
      <div
        v-if="showCreateModal"
        class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4"
      >
        <CreateSupplierModal @close="showCreateModal = false" @created="onCreated" />
      </div>

      <div
        v-if="showEditModal"
        class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4"
      >
        <UpdateSupplierModal
          :supplier="supplierToEdit"
          @close="showEditModal = false"
          @updated="onUpdated"
        />
      </div>

      <Modal
        v-if="showDeleteModal"
        :fullScreenBackdrop="true"
        :backdropClass="'bg-black bg-opacity-60'"
        @close="!loadingDelete && (showDeleteModal = false)"
      >
        <template #body>
          <div class="p-2">
            <h3 class="text-xl font-semibold text-red-600 dark:text-red-400 mb-4 text-center">
              Delete Supplier
            </h3>
            <p class="mb-6 text-center text-gray-700 dark:text-gray-300">
              Are you sure you want to delete
              <span class="font-bold text-gray-900 dark:text-white">{{
                supplierToDelete?.name
              }}</span
              >?
              <br />
              <span class="text-xs text-gray-500">(This action cannot be undone)</span>
            </p>

            <div class="flex justify-center gap-3">
              <button
                type="button"
                @click="showDeleteModal = false"
                class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 transition"
                :disabled="loadingDelete"
              >
                Cancel
              </button>
              <button
                type="button"
                @click="deleteSupplier"
                class="px-6 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition flex items-center justify-center min-w-[120px]"
                :disabled="loadingDelete"
              >
                <span
                  v-if="loadingDelete"
                  class="animate-spin mr-2 w-4 h-4 border-2 border-t-transparent border-white rounded-full"
                ></span>
                {{ loadingDelete ? 'Deleting...' : 'Confirm Delete' }}
              </button>
            </div>
          </div>
        </template>
      </Modal>
    </div>
    <FilterSidebar
      v-model="isFilterOpen"
      title="Filter Suppliers"
      :filters="filters"
      :fields="filterFields"
      @apply="applyFilters"
      @reset="resetFilters"
    />
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
import { useDebounce } from '@/composables/useDebounce'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import FilterSidebar from '@/components/layout/FilterSidebar.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import CreateSupplierModal from './CreateSupplierModal.vue'
import UpdateSupplierModal from './UpdateSupplierModal.vue'
import Alert from '@/components/ui/Alert.vue'
import ActionMainButton from '@/components/common/ActionMainButton.vue'
import Modal from '@/components/ui/Modal.vue'

interface Supplier {
  id?: string
  name: string
  code: string
  contactPerson: string
  email: string
  address: string
  phoneNumber: string
  taxId: string
  note?: string
  active: boolean
}

const baseURL = import.meta.env.VITE_BASE_URL
const suppliers = ref<Supplier[]>([])
const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalPages = ref(1)
const totalElements = ref(0)

const searchQuery = ref('')
const token = localStorage.getItem('auth_token') || ''
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const loading = ref(true)
const error = ref('')
const products = ref<any[]>([])
const categories = ref<any[]>([])
const totalProducts = computed(() => products.value.length)
const activeSuppliers = computed(() => suppliers.value.filter((s) => !!s.active).length)
const inactiveSuppliers = computed(() => suppliers.value.filter((s) => !s.active).length)

const alert = reactive({
  show: false,
  type: 'success',
  title: '',
  message: '',
})
const supplierToDelete = ref<Supplier | null>(null)
const supplierToEdit = ref<Supplier | null>(null)

function openEditModal(supplier: Supplier) {
  supplierToEdit.value = { ...supplier }
  showEditModal.value = true
}

const isFilterOpen = ref(false)
const isPageChanging = ref(false)

const filters = reactive({
  keyword: '',
  name: '',
  code: '',
  email: '',
})

const filterFields = [
  { key: 'name', label: 'Supplier Name', type: 'text' },
  { key: 'code', label: 'Code', type: 'text' },
  { key: 'email', label: 'Email', type: 'text' },
]

const debouncedSearch = useDebounce(() => {
  currentPage.value = 1
  loadSuppliers()
}, 400)

async function loadSuppliers() {
  loading.value = true
  try {
    const params = new URLSearchParams()
    params.append('page', String(currentPage.value - 1))
    params.append('size', String(itemsPerPage.value))

    if (filters.keyword) params.append('keyword', filters.keyword)
    if (filters.name) params.append('name', filters.name)
    if (filters.code) params.append('code', filters.code)
    if (filters.email) params.append('email', filters.email)

    const res = await fetch(`${baseURL}/scmlink/suppliers/filter?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()

    if (data.code === 1000 && data.result) {
      suppliers.value = data.result.content || []
      totalElements.value = data.result.totalElements || 0
      totalPages.value = data.result.totalPages || 1
    } else {
      suppliers.value = []
      totalElements.value = 0
      totalPages.value = 1
    }
  } catch (err) {
    console.error(err)
    suppliers.value = []
  } finally {
    loading.value = false
  }
}

watch(
  filters,
  () => {
    if (!isPageChanging.value) currentPage.value = 1
    debouncedSearch()
  },
  { deep: true },
)

watch(currentPage, () => loadSuppliers())

const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const total = totalPages.value
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (currentPage.value > 4) pages.push('...')
    for (let i = currentPage.value - 2; i <= currentPage.value + 2; i++) {
      if (i > 1 && i < total) pages.push(i)
    }
    if (currentPage.value < total - 3) pages.push('...')
    pages.push(total)
  }
  return pages
})

function goToPage(page: number) {
  if (page === currentPage.value) return
  isPageChanging.value = true
  currentPage.value = page
  nextTick(() => (isPageChanging.value = false))
}

function previousPage() {
  if (currentPage.value > 1) goToPage(currentPage.value - 1)
}
function nextPage() {
  if (currentPage.value < totalPages.value) goToPage(currentPage.value + 1)
}

function applyFilters(newFilters: any) {
  Object.assign(filters, newFilters)
  isFilterOpen.value = false
  currentPage.value = 1
  loadSuppliers()
}

function resetFilters() {
  ;(Object.keys(filters) as (keyof typeof filters)[]).forEach((key) => {
    filters[key] = ''
  })
  isFilterOpen.value = false
  currentPage.value = 1
  loadSuppliers()
}

async function fetchProducts() {
  try {
    const res = await fetch(`${baseURL}/scmlink/products`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (data.code === 1000) {
      products.value = data.result
    }
  } catch (e) {
    console.error(e)
  }
}

async function fetchCategories() {
  try {
    const res = await fetch(`${baseURL}/scmlink/categories`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (data.code === 1000) {
      categories.value = data.result
    }
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  loadSuppliers()
  fetchProducts()
  fetchCategories()
})

const filteredSuppliers = computed(() => {
  let list = suppliers.value.slice()
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        (s.contactPerson && s.contactPerson.toLowerCase().includes(q)) ||
        (s.email && s.email.toLowerCase().includes(q)) ||
        (s.phoneNumber && s.phoneNumber.toLowerCase().includes(q)) ||
        (s.address && s.address.toLowerCase().includes(q)) ||
        (s.taxId && s.taxId.toLowerCase().includes(q)),
    )
  }
  return list
})

const paginatedSuppliers = computed(() => filteredSuppliers.value)

const loadingDelete = ref(false)

// Mở modal xác nhận
function confirmDeleteSupplier(supplier: Supplier) {
  supplierToDelete.value = supplier
  showDeleteModal.value = true
}

// Xử lý gọi API DELETE
async function deleteSupplier() {
  if (!supplierToDelete.value || !supplierToDelete.value.id || loadingDelete.value) return

  loadingDelete.value = true
  try {
    const res = await fetch(`${baseURL}/scmlink/suppliers/${supplierToDelete.value.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    const data = await res.json()

    if (data.code === 1000) {
      // Thông báo thành công
      alert.show = true
      alert.type = 'success'
      alert.title = 'Deleted'
      alert.message = `Supplier "${supplierToDelete.value.name}" has been removed.`

      // Đóng modal và tải lại danh sách
      showDeleteModal.value = false
      await loadSuppliers()
    } else {
      alert.show = true
      alert.type = 'error'
      alert.title = 'Deleted'
      alert.message = data.message || 'Failed to delete supplier. Please try again.'
      showDeleteModal.value = false
    }
  } catch (e: any) {
    console.error('Delete error:', e)
    alert.show = true
    alert.type = 'error'
    alert.title = 'Error'
    alert.message = e.message || 'Network error, please try again.'
    showDeleteModal.value = false
  } finally {
    loadingDelete.value = false
    supplierToDelete.value = null
    showDeleteModal.value = false
    // Tự động ẩn alert sau 3 giây
    setTimeout(() => {
      alert.show = false
    }, 3000)
  }
}

function exportCSV() {
  const rows = [
    ['Name', 'Code', 'Contact Person', 'Email', 'Phone', 'Address', 'Tax ID', 'Active'],
    ...paginatedSuppliers.value.map((s) => [
      s.name,
      s.code,
      s.contactPerson,
      s.email,
      s.phoneNumber,
      s.address,
      s.taxId,
      s.active ? 'Active' : 'Inactive',
    ]),
  ]
  const csvContent = rows
    .map((e) => e.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
    .join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.setAttribute('download', 'suppliers.csv')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function onCreated() {
  showCreateModal.value = false
  loadSuppliers()
  alert.show = true
  alert.type = 'success'
  alert.title = 'Success'
  alert.message = 'Supplier created successfully.'
  setTimeout(() => (alert.show = false), 3000)
}
function onUpdated() {
  showEditModal.value = false
  loadSuppliers()
  alert.show = true
  alert.type = 'success'
  alert.title = 'Updated'
  alert.message = 'Supplier updated successfully.'
  setTimeout(() => (alert.show = false), 3000)
}
</script>
