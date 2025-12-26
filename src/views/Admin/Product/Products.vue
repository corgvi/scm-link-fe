<template>
  <AdminLayout>
    <PageBreadcrumb pageTitle="Product Management" />

    <!-- Overview -->
    <div
      class="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Overview</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Quick insights into your products
          </p>
        </div>
        <ActionMainButton
          text="Create Product"
          icon="plus"
          type="create"
          @click="$router.push('/admin/create-product')"
        />
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div
          class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
        >
          <p class="text-gray-500 dark:text-gray-400">Total Products</p>
          <p class="text-2xl font-semibold text-gray-800 dark:text-white">{{ totalElements }}</p>
        </div>
        <div
          class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
        >
          <p class="text-gray-500 dark:text-gray-400">Categories</p>
          <p class="text-2xl font-semibold text-indigo-600">{{ uniqueCategories }}</p>
        </div>
        <div
          class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
        >
          <p class="text-gray-500 dark:text-gray-400">Suppliers</p>
          <p class="text-2xl font-semibold text-green-600">{{ uniqueSuppliers }}</p>
        </div>
        <div
          class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
        >
          <p class="text-gray-500 dark:text-gray-400">Brands</p>
          <p class="text-2xl font-semibold text-yellow-600">{{ uniqueBrands }}</p>
        </div>
      </div>
    </div>

    <!-- Table + Search + Filter -->
    <div
      class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div
        class="flex flex-col gap-4 border-b border-gray-200 px-5 py-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Products</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">Manage your products below</p>
        </div>

        <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
          <!-- Search -->
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
              placeholder="Search SKU, name, code..."
              class="h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-11 pr-4 text-sm placeholder:text-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </div>

          <!-- Filter Button -->
          <button
            @click="isFilterOpen = true"
            class="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M10 18h4M4 6h16M7 12h10"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            Filter
          </button>

          <!-- Export -->
          <button
            @click="exportCSV"
            class="flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
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

      <!-- Loading / Table -->
      <div v-if="loading" class="p-12 text-center">
        <span
          class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"
        ></span>
      </div>
      <div v-else class="custom-scrollbar overflow-x-auto">
        <table class="w-full table-auto">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
              <th class="p-4 text-left text-xs font-bold text-gray-700 dark:text-gray-400">#</th>
              <th class="p-4 text-left text-xs font-bold text-gray-700 dark:text-gray-400">
                Image
              </th>
              <th class="p-4 text-left text-xs font-bold text-gray-700 dark:text-gray-400">SKU</th>
              <th class="p-4 text-left text-xs font-bold text-gray-700 dark:text-gray-400">Name</th>
              <th class="p-4 text-left text-xs font-bold text-gray-700 dark:text-gray-400">Code</th>
              <th class="p-4 text-left text-xs font-bold text-gray-700 dark:text-gray-400">
                Origin
              </th>
              <th class="p-4 text-left text-xs font-bold text-gray-700 dark:text-gray-400">
                Category
              </th>
              <th class="p-4 text-left text-xs font-bold text-gray-700 dark:text-gray-400">
                Supplier
              </th>
              <th class="p-4 text-left text-xs font-bold text-gray-700 dark:text-gray-400">
                Storage Condition
              </th>
              <th class="p-4 text-left text-xs font-bold text-gray-700 dark:text-gray-400">Weight (g)</th>
              <th class="p-4 text-center text-xs font-bold text-gray-700 dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
            <tr
              v-for="(product, idx) in products"
              :key="product.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-900 transition cursor-pointer"
              @click="goToDetail(product.id)"
            >
              <td class="p-4 text-sm">{{ (currentPage - 1) * itemsPerPage + idx + 1 }}</td>
              <td class="p-4">
                <img
                  v-if="product.imageUrl"
                  :src="product.imageUrl"
                  alt="Product"
                  class="w-12 h-12 object-cover rounded-lg shadow-sm"
                  @click.stop="showImage(product.imageUrl)"
                />
                <div
                  v-else
                  class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-xs text-gray-500"
                >
                  No img
                </div>
              </td>
              <td class="p-4 text-sm font-medium">{{ product.sku }}</td>
              <td class="p-4 text-sm">{{ product.name }}</td>
              <td class="p-4 text-sm">{{ product.code }}</td>
              <td class="p-4 text-sm">{{ product.origin }}</td>
              <td class="p-4 text-sm">{{ product.category?.name || '-' }}</td>
              <td class="p-4 text-sm">{{ product.supplier?.name || '-' }}</td>
              <td class="p-4 text-sm">{{ product.storageCondition || '-' }}</td>
              <td class="p-4 text-sm">{{ product.weightG || '-' }}</td>
              <td class="p-4 text-center" @click.stop>
                <ActionMainButton
                  text="Update"
                  icon="edit"
                  type="update"
                  @click="goToUpdate(product.id)"
                />
              </td>
            </tr>
            <tr v-if="!loading && products.length === 0">
              <td colspan="11" class="p-12 text-center text-gray-400">No products found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        class="flex items-center justify-between border-t border-gray-200 px-5 py-4 dark:border-gray-800"
      >
        <div class="text-sm text-gray-500">
          Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
          {{ Math.min(currentPage * itemsPerPage, totalElements) }} of {{ totalElements }} products
        </div>
        <div class="flex items-center gap-1">
          <button
            @click="previousPage"
            :disabled="currentPage === 1"
            class="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
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
            @click="goToPage(page as number)"
            :class="page === currentPage ? 'bg-brand-500 text-white' : 'hover:bg-gray-100'"
            class="w-10 h-10 rounded-lg text-sm font-medium"
          >
            {{ page === '...' ? '...' : page }}
          </button>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
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

    <!-- Filter Sidebar (dùng lại component đẹp nhất VN 2025) -->
    <FilterSidebar
      v-model="isFilterOpen"
      title="Filter Products"
      :filters="filters"
      :fields="filterFields"
      @apply="applyFilters"
      @reset="resetFilters"
    />

    <!-- Image Modal -->
    <div
      v-if="modalImage"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      @click="modalImage = null"
    >
      <img :src="modalImage" class="max-w-4xl max-h-screen rounded-lg shadow-2xl" @click.stop />
      <button class="absolute top-4 right-4 text-white text-4xl hover:text-gray-300">
        &times;
      </button>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ActionMainButton from '@/components/common/ActionMainButton.vue'
import FilterSidebar from '@/components/layout/FilterSidebar.vue'
import { useDebounce } from '@/composables/useDebounce'
import { useRouter } from 'vue-router'

interface Category {
  id: string
  name: string
  code: string
}
interface Supplier {
  id: string
  name: string
  code: string
}
interface Product {
  id: string
  sku: string
  name: string
  code: string
  origin: string
  storageCondition: string
  weightG: number
  category: Category
  supplier: Supplier
  imageUrl?: string
}

const baseURL = import.meta.env.VITE_BASE_URL
const token = localStorage.getItem('auth_token') || ''

const products = ref<Product[]>([])
const totalPages = ref(1)
const totalElements = ref(0)
const currentPage = ref(1)
const itemsPerPage = 10
const loading = ref(false)
const modalImage = ref<string | null>(null)
const isFilterOpen = ref(false)
const isPageChanging = ref(false) // ← Quan trọng!

const router = useRouter()

// Filter state
const filters = reactive({
  keyword: '',
  sku: '',
  name: '',
  code: '',
  origin: '',
  categoryId: '',
  supplierId: '',
})

const filterFields = [
  { key: 'sku', label: 'SKU', type: 'text' },
  { key: 'name', label: 'Product Name', type: 'text' },
  { key: 'code', label: 'Code', type: 'text' },
  { key: 'branchName', label: 'Branch', type: 'text' },
  { key: 'categoryId', label: 'Category ID', type: 'text' },
  { key: 'supplierId', label: 'Supplier ID', type: 'text' },
]

function goToUpdate(id: string | undefined) {
  if (!id) return
  router.push(`/admin/update-product/${id}`)
}

// navigate to product detail page
function goToDetail(id: string | undefined) {
  if (!id) return
  router.push(`/admin/product-detail/${id}`)
}

// === CHỈ DÙNG 1 DEBOUNCE DUY NHẤT ===
const triggerLoad = useDebounce(() => {
  loadProducts()
}, 400)

// === Hàm load chính ===
async function loadProducts() {
  loading.value = true
  try {
    const params = new URLSearchParams({
      page: String(currentPage.value),
      size: String(itemsPerPage),
    })

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, String(value))
    })

    const res = await fetch(`${baseURL}/scmlink/products/filter?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (data.code === 1000) {
      products.value = data.result.content || []
      totalPages.value = data.result.totalPages || 1
      totalElements.value = data.result.totalElements || 0
    }
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

// === WATCH DUY NHẤT – THEO DÕI FILTERS + PAGE RIÊNG BIỆT ===
watch(
  filters,
  () => {
    if (!isPageChanging.value) {
      currentPage.value = 1
    }
    triggerLoad()
  },
  { deep: true },
)

watch(currentPage, () => {
  triggerLoad()
})

// Phân trang – có set flag
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

// Filter sidebar
function applyFilters(newFilters: any) {
  Object.assign(filters, newFilters)
  isFilterOpen.value = false
  currentPage.value = 1
  triggerLoad() // ← Dùng debounce luôn
}

function resetFilters() {
  (Object.keys(filters) as (keyof typeof filters)[]).forEach((key) => {
    filters[key] = ''
  })
  isFilterOpen.value = false
  currentPage.value = 1
  triggerLoad()
}

onMounted(() => {
  loadProducts()
})

// Visible pages
const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const total = totalPages.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  pages.push(1)
  if (currentPage.value > 4) pages.push('...')
  const start = Math.max(2, currentPage.value - 2)
  const end = Math.min(total - 1, currentPage.value + 2)
  for (let i = start; i <= end; i++) pages.push(i)
  if (currentPage.value < total - 3) pages.push('...')
  if (total > 1) pages.push(total)
  return pages
})

// Overview + Export + Image
const uniqueCategories = computed(
  () => new Set(products.value.map((p) => p.category?.name).filter(Boolean)).size,
)
const uniqueSuppliers = computed(
  () => new Set(products.value.map((p) => p.supplier?.name).filter(Boolean)).size,
)
const uniqueBrands = computed(
  () => new Set(products.value.map((p) => p.origin).filter(Boolean)).size,
)

function exportCSV() {
  /* giữ nguyên */
}
function showImage(url: string) {
  modalImage.value = url
}
</script>
