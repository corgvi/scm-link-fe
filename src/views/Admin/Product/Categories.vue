<template>
  <AdminLayout>
    <Alert
      v-if="alert.show"
      :variant="alert.type"
      :title="alert.title"
      :message="alert.message"
      :duration="3000"
    />
    <PageBreadcrumb pageTitle="Category Management" />

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
            <path
              d="M5 10.0002H15.0006M10.0002 5V15.0006"
              stroke="white"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Create Category
        </button>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div
          class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
        >
          <p class="text-gray-500 dark:text-gray-400">Total Categories</p>
          <h3 class="text-2xl font-semibold text-gray-800 dark:text-white">{{ totalElements }}</h3>
        </div>
        <div
          class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
        >
          <p class="text-gray-500 dark:text-gray-400">Total Products</p>
          <h3 class="text-2xl font-semibold text-indigo-600">{{ totalProducts }}</h3>
        </div>
        <div
          class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
        >
          <p class="text-gray-500 dark:text-gray-400">Suppliers</p>
          <h3 class="text-2xl font-semibold text-green-600">{{ totalSuppliers }}</h3>
        </div>
        <div
          class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
        >
          <p class="text-gray-500 dark:text-gray-400">Brands</p>
          <h3 class="text-2xl font-semibold text-yellow-600">{{ totalBrands }}</h3>
        </div>
      </div>
    </div>

    <div
      class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div
        class="flex flex-col gap-4 border-b border-gray-200 px-5 py-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Categories</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">Manage your categories below</p>
        </div>

        <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div class="relative">
              <span class="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>
              <input
                v-model="filters.keyword"
                type="text"
                placeholder="Search name, code..."
                class="h-11 w-full rounded-xl border border-gray-300 bg-transparent py-2.5 pl-11 pr-4 text-sm placeholder:text-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>

            <button
              @click="isFilterOpen = true"
              class="flex items-center gap-2.5 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              class="flex items-center gap-2.5 rounded-xl bg-brand-500 px-5 py-3 text-sm font-medium text-white hover:bg-brand-600"
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
      </div>
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
              <tr class="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                <th class="p-4 text-left text-xs font-bold text-gray-700 dark:text-gray-400">#</th>
                <th class="p-4 text-left text-xs font-bold text-gray-700 dark:text-gray-400">
                  Name
                </th>
                <th class="p-4 text-left text-xs font-bold text-gray-700 dark:text-gray-400">
                  Code
                </th>
                <th class="p-4 text-left text-xs font-bold text-gray-700 dark:text-gray-400">
                  Description
                </th>
                <th class="p-4 text-left text-xs font-bold text-gray-700 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(category, idx) in displayedCategories"
                :key="category.id"
                class="transition hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">
                  {{ (currentPage - 1) * itemsPerPage + idx + 1 }}
                </td>
                <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">
                  {{ category.name }}
                </td>
                <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">
                  {{ category.code }}
                </td>
                <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">
                  {{ category.description }}
                </td>
                <td class="p-4 flex gap-2">
                  <ActionMainButton
                    text="Update"
                    type="update"
                    icon="edit"
                    @click="openEditModal(category)"
                  />
                  <button
                    @click="confirmDeleteCategory(category)"
                    class="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                  >
                    <img src="/images/icons/delete.svg" alt="Delete" class="w-4 h-4" />
                  </button>
                </td>
              </tr>
              <tr v-if="!displayedCategories.length && !loading" class="text-center">
                <td colspan="5" class="py-8 text-gray-500">No categories found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div
        class="flex items-center justify-between border-t border-gray-200 px-5 py-4 dark:border-gray-800"
      >
        <div class="text-sm text-gray-500">
          Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
          {{ Math.min(currentPage * itemsPerPage, totalElements) }} of
          {{ totalElements }} categories
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="previousPage"
            :disabled="currentPage === 1"
                class="shadow-theme-xs flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 sm:p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
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
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="goToPage(page)"
            :class="page === currentPage ? 'bg-brand-500 text-white' : 'hover:bg-gray-100'"
            class="w-10 h-10 rounded-lg text-sm font-medium"
          >
            {{ page === '...' ? '...' : page }}
          </button>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="shadow-theme-xs flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 sm:p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
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

    <div v-if="showCreateModal" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4">
      <CreateCategoryModal @close="showCreateModal = false" @created="onCreated" />
    </div>

    <div v-if="showEditModal" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4">
      <UpdateCategoryModal :category="editForm" @close="showEditModal = false" @updated="onUpdated" />
    </div>

    <Modal
      v-if="showDeleteModal"
      :fullScreenBackdrop="true"
      :backdropClass="'bg-black bg-opacity-60'"
      @close="showDeleteModal = false"
    >
      <template #body>
        <div class="">
          <button
            @click="showDeleteModal = false"
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-800 dark:hover:text-white text-2xl font-bold focus:outline-none"
            aria-label="Close"
          >
            &times;
          </button>
          <h3 class="text-xl font-semibold text-red-600 dark:text-red-400 mb-4 text-center">
            Delete Category
          </h3>
          <p class="mb-6 text-center text-gray-700 dark:text-gray-300">
            Are you sure you want to delete
            <span class="font-bold">{{ categoryToDelete?.name }}</span
            >?
          </p>
          <div class="flex justify-end gap-2">
            <button
              type="button"
              @click="showDeleteModal = false"
              class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              :disabled="loadingDelete"
            >
              Cancel
            </button>
            <button
              type="button"
              @click="handleDeleteCategory"
              class="px-6 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition flex items-center gap-2"
              :disabled="loadingDelete"
            >
              <span
                v-if="loadingDelete"
                class="animate-spin mr-2 w-4 h-4 border-2 border-t-transparent border-white rounded-full inline-block"
              ></span>
              Delete
            </button>
          </div>
        </div>
      </template>
    </Modal>
    <FilterSidebar
      v-model="isFilterOpen"
      title="Filter Categories"
      :filters="filters"
      :fields="filterFields"
      @apply="applyFilters"
      @reset="resetFilters"
    />
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive, watch, nextTick } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import CreateCategoryModal from './CreateCategoryModal.vue'
import UpdateCategoryModal from './UpdateCategoryModal.vue'
import Alert from '@/components/ui/Alert.vue'
import { useDebounce } from '@/composables/useDebounce'
import FilterSidebar from '@/components/layout/FilterSidebar.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ActionMainButton from '@/components/common/ActionMainButton.vue'

interface Category {
  id?: string
  name: string
  code: string
  description: string
}

const baseURL = import.meta.env.VITE_BASE_URL
const categories = ref<Category[]>([])
const products = ref<any[]>([])
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const token = localStorage.getItem('auth_token') || ''
const loading = ref(true)
const error = ref('')

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const loadingCreate = ref(false)
const loadingEdit = ref(false)
const loadingDelete = ref(false)
const createError = ref('')
const createSuccess = ref('')
const editError = ref('')
const editSuccess = ref('')
const alert = reactive({
  show: false,
  type: 'success',
  title: '',
  message: '',
})

const form = ref<Category>({
  name: '',
  code: '',
  description: '',
})
const errors = ref({
  name: '',
  code: '',
})

const editForm = ref<Category>({
  id: '',
  name: '',
  code: '',
  description: '',
})
const editErrors = ref({
  name: '',
  code: '',
})

const categoryToDelete = ref<Category | null>(null)

const totalPages = ref(1)
const totalElements = ref(0)
const pageNumber = ref(0)
const isFilterOpen = ref(false)
const isPageChanging = ref(false)

const filters = reactive({
  keyword: '',
  name: '',
  code: '',
  email: '',
})

const filterFields = [
  { key: 'name', label: 'Category Name', type: 'text' },
  { key: 'code', label: 'Code', type: 'text' },
]

const triggerLoad = useDebounce(() => loadCategories(), 400)

async function loadCategories() {
  loading.value = true
  try {
    const params = new URLSearchParams({
      page: String(currentPage.value),
      size: String(itemsPerPage.value),
    })

    if (filters.keyword) params.append('keyword', filters.keyword)
    if (filters.name) params.append('name', filters.name)
    if (filters.code) params.append('code', filters.code)

    const res = await fetch(`${baseURL}/scmlink/categories/filter?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()

    if (data.code === 1000 && data.result) {
      categories.value = data.result.content || []
      totalElements.value = data.result.totalElements || 0
      totalPages.value = data.result.totalPages || 1
    } else {
      categories.value = []
      totalElements.value = 0
      totalPages.value = 1
    }
  } catch (err) {
    console.error('Load categories error:', err)
    categories.value = []
  } finally {
    loading.value = false
  }
}
watch(
  filters,
  () => {
    if (!isPageChanging.value) currentPage.value = 1
    triggerLoad()
  },
  { deep: true },
)

watch(currentPage, () => triggerLoad())

const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  if (totalPages.value <= 7) {
    for (let i = 1; i <= totalPages.value; i++) pages.push(i)
  } else {
    pages.push(1)
    if (currentPage.value > 4) pages.push('...')
    for (let i = currentPage.value - 2; i <= currentPage.value + 2; i++) {
      if (i > 1 && i < totalPages.value) pages.push(i)
    }
    if (currentPage.value < totalPages.value - 3) pages.push('...')
    pages.push(totalPages.value)
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
  if (currentPage.value > 1) {
    isPageChanging.value = true
    currentPage.value--
    nextTick(() => (isPageChanging.value = false))
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    isPageChanging.value = true
    currentPage.value++
    nextTick(() => (isPageChanging.value = false))
  }
}

function applyFilters(newFilters: any) {
  Object.assign(filters, newFilters)
  isFilterOpen.value = false
  currentPage.value = 1
  triggerLoad()
}

function resetFilters() {
  Object.keys(filters).forEach((k) => (filters[k] = ''))
  isFilterOpen.value = false
  currentPage.value = 1
  triggerLoad()
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

onMounted(() => {
  loadCategories()
  fetchProducts()
})

const totalProducts = 0
const totalSuppliers = 0
const totalBrands = 0

const filteredCategories = computed(() => {
  let list = categories.value.slice()
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(
      (c) =>
        (c.name || '').toLowerCase().includes(q) ||
        (c.code || '').toLowerCase().includes(q) ||
        ((c.description || '') && c.description.toLowerCase().includes(q)),
    )
  }
  return list
})

const displayedCategories = computed(() => filteredCategories.value)

function openEditModal(category: Category) {
  editForm.value = { ...category }
  showEditModal.value = true
  editError.value = ''
  editSuccess.value = ''
  editErrors.value = { name: '', code: '' }
}

function confirmDeleteCategory(category: Category) {
  categoryToDelete.value = category
  showDeleteModal.value = true
}

async function handleDeleteCategory() {
  if (!categoryToDelete.value) return
  loadingDelete.value = true
  try {
    const res = await fetch(`${baseURL}/scmlink/categories/${categoryToDelete.value.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await res.json()
    if (res.ok && data.code === 1000) {
      alert.show = true
      alert.type = 'success'
      alert.title = 'Deleted'
      alert.message = 'Category deleted successfully.'
      setTimeout(() => {
        alert.show = false
      }, 3000)
      showDeleteModal.value = false
      // reload current page (if page becomes empty, backend paging should handle)
      await loadCategories()
    } else {
      alert.show = true
      alert.type = 'error'
      alert.title = 'Error'
      alert.message = data.message || 'Failed to delete category'
      setTimeout(() => {
        alert.show = false
      }, 3000)
    }
  } catch (e) {
    alert.show = true
    alert.type = 'error'
    alert.title = 'Error'
    alert.message = 'Network error. Please try again.'
    setTimeout(() => {
      alert.show = false
    }, 3000)
    console.error(e)
  } finally {
    loadingDelete.value = false
    categoryToDelete.value = null
  }
}

// Export CSV for categories (exports filtered items on current page)
function exportCSV() {
  const rows = [
    ['Name', 'Code', 'Description'],
    ...displayedCategories.value.map((c) => [c.name, c.code, c.description || '']),
  ]
  const csvContent = rows
    .map((e) => e.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
    .join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.setAttribute('download', 'categories.csv')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// add handlers to reload & show alert after child events
function onCreated() {
  showCreateModal.value = false
  loadCategories()
  alert.show = true
  alert.type = 'success'
  alert.title = 'Success'
  alert.message = 'Category created successfully.'
  setTimeout(() => (alert.show = false), 3000)
}

function onUpdated() {
  showEditModal.value = false
  loadCategories()
  alert.show = true
  alert.type = 'success'
  alert.title = 'Updated'
  alert.message = 'Category updated successfully.'
  setTimeout(() => (alert.show = false), 3000)
}
</script>
