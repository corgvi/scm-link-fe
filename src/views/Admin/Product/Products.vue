<template>
  <AdminLayout>
    <PageBreadcrumb pageTitle="Product Management" />

    <!-- Overview Section -->
    <div class="mb-6 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div class="mb-6 flex items-center justify-between">
        <h2 class="font-semibold text-gray-800 dark:text-white/90">Overview</h2>
        <button
          @click="$router.push('/admin/create-product')"
          class="bg-brand-500 shadow-theme-xs hover:bg-brand-600 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none">
            <path d="M5 10h10M10 5v10" stroke="white" stroke-width="1.5" stroke-linecap="round" />
          </svg>
          Create Product
        </button>
      </div>
      <div class="grid grid-cols-1 rounded-xl border border-gray-200 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-y-0 dark:divide-gray-800 dark:border-gray-800">
        <div class="border-b p-5 sm:border-r lg:border-b-0">
          <p class="mb-1.5 text-sm text-gray-400 dark:text-gray-500">Total Products</p>
          <h3 class="text-3xl text-gray-800 dark:text-white/90">{{ products.length }}</h3>
        </div>
        <div class="border-b p-5 lg:border-b-0">
          <p class="mb-1.5 text-sm text-gray-400 dark:text-gray-500">Categories</p>
          <h3 class="text-3xl text-gray-800 dark:text-white/90">
            {{ new Set(products.map(p => p.category?.name)).size }}
          </h3>
        </div>
        <div class="border-b p-5 sm:border-r sm:border-b-0">
          <p class="mb-1.5 text-sm text-gray-400 dark:text-gray-500">Suppliers</p>
          <h3 class="text-3xl text-gray-800 dark:text-white/90">
            {{ new Set(products.map(p => p.supplier?.name)).size }}
          </h3>
        </div>
        <div class="p-5">
          <p class="mb-1.5 text-sm text-gray-400 dark:text-gray-500">Brands</p>
          <h3 class="text-3xl text-gray-800 dark:text-white/90">
            {{ new Set(products.map(p => p.branchName)).size }}
          </h3>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md dark:border-gray-800 dark:bg-white/[0.03]">
      <div class="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
        <div>
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Products</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">Manage your products below</p>
        </div>
        <div class="flex gap-3.5">
          <!-- Search -->
          <div class="relative">
            <span class="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 dark:text-gray-400">
              <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M3.04199 9.37363C3.04199 5.87693 5.87735 3.04199 9.37533 3.04199C12.8733 3.04199 15.7087 5.87693 15.7087 9.37363C15.7087 12.8703 12.8733 15.7053 9.37533 15.7053C5.87735 15.7053 3.04199 12.8703 3.04199 9.37363ZM9.37533 1.54199C5.04926 1.54199 1.54199 5.04817 1.54199 9.37363C1.54199 13.6991 5.04926 17.2053 9.37533 17.2053C11.2676 17.2053 13.0032 16.5344 14.3572 15.4176L17.1773 18.238C17.4702 18.5309 17.945 18.5309 18.2379 18.238C18.5308 17.9451 18.5309 17.4703 18.238 17.1773L15.4182 14.3573C16.5367 13.0033 17.2087 11.2669 17.2087 9.37363C17.2087 5.04817 13.7014 1.54199 9.37533 1.54199Z" fill=""></path>
              </svg>
            </span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search products..."
              class="dark:bg-dark-900 shadow-theme-xs h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pr-4 pl-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden xl:w-[300px] dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
              aria-label="Search products"
            />
          </div>
          <button
            class="shadow-theme-xs flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-[11px] text-sm font-medium text-gray-700 sm:w-auto dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 transition duration-150"
            @click="exportCSV"
            aria-label="Export products to CSV"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M16.6671 13.3333V15.4166C16.6671 16.1069 16.1074 16.6666 15.4171 16.6666H4.58301C3.89265 16.6666 3.33301 16.1069 3.33301 15.4166V13.3333M10.0013 3.33325L10.0013 13.3333M6.14553 7.18708L9.99958 3.33549L13.8539 7.18708" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
            Export
          </button>
        </div>
      </div>

      <!-- Loading/Error/Empty State -->
      <div v-if="loading" class="p-8 text-center text-gray-400">
        <span class="animate-spin mr-2 w-6 h-6 border-2 border-t-transparent border-gray-400 rounded-full inline-block"></span>
        Loading products...
      </div>
      <div v-else-if="error" class="p-8 text-center text-red-500">
        {{ error }}
      </div>
      <div v-else>
        <div class="custom-scrollbar overflow-x-auto">
          <table class="w-full table-auto">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-800">
                <th class="p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400">Image</th>
                <th class="p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400">SKU</th>
                <th class="p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400">Name</th>
                <th class="p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400">Code</th>
                <th class="p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400">Branch</th>
                <th class="p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400">Category</th>
                <th class="p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400">Supplier</th>
                <th class="p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400">Color</th>
                <th class="p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400">Size</th>
                <th class="p-4 text-center text-xs font-medium text-gray-700 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
              <tr
                v-for="product in paginatedProducts"
                :key="product.id"
                class="transition hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer"
                @click="$router.push(`/admin/edit-product/${product.id}`)"
              >
                <td class="p-4 whitespace-nowrap">
                  <img
                    v-if="product.imageUrl"
                    :src="product.imageUrl"
                    alt="Product"
                    class="w-10 h-10 object-cover rounded cursor-pointer"
                    @click.stop="showImage(product.imageUrl)"
                  />
                  <span v-else class="text-xs text-gray-400">No image</span>
                </td>
                <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">{{ product.sku }}</td>
                <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">{{ product.name }}</td>
                <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">{{ product.code }}</td>
                <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">{{ product.branchName }}</td>
                <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">{{ product.category?.name }}</td>
                <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">{{ product.supplier?.name }}</td>
                <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">{{ product.color }}</td>
                <td class="p-4 whitespace-nowrap text-theme-sm dark:text-gray-200">{{ product.size }}</td>
                <td class="p-4 flex justify-center gap-2">
                  <button
                    @click.stop="$router.push(`/admin/edit-product/${product.id}`)"
                    class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow hover:bg-blue-700 transition"
                    aria-label="Edit product"
                  >
                    <img src="/images/icons/edit.svg" class="w-4 h-4" alt="edit" />
                    Edit
                  </button>
                </td>
              </tr>
              <tr v-if="!loading && paginatedProducts.length === 0">
                <td colspan="12" class="p-6 text-center text-gray-400">No products found.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="flex flex-col items-center justify-between border-t border-gray-200 px-5 py-4 sm:flex-row dark:border-gray-800">
          <span class="block text-sm font-medium text-gray-500 dark:text-gray-400">
            Showing
            <span class="text-gray-800 dark:text-white/90">{{ (currentPage - 1) * itemsPerPage + (paginatedProducts.length ? 1 : 0) }}</span>
            to
            <span class="text-gray-800 dark:text-white/90">{{ (currentPage - 1) * itemsPerPage + paginatedProducts.length }}</span>
            of
            <span class="text-gray-800 dark:text-white/90">{{ filteredProducts.length }}</span>
          </span>
          <div class="flex w-full items-center justify-between gap-2 rounded-lg bg-gray-50 p-4 sm:w-auto sm:justify-normal sm:bg-transparent sm:p-0 dark:bg-white/[0.03] dark:sm:bg-transparent">
            <button class="shadow-theme-xs flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 hover:text-gray-800 sm:p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200" @click="previousPage" :disabled="currentPage === 1" :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''">
              <span>
                <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M2.58203 9.99868C2.58174 10.1909 2.6549 10.3833 2.80152 10.53L7.79818 15.5301C8.09097 15.8231 8.56584 15.8233 8.85883 15.5305C9.15183 15.2377 9.152 14.7629 8.85921 14.4699L5.13911 10.7472L16.6665 10.7472C17.0807 10.7472 17.4165 10.4114 17.4165 9.99715C17.4165 9.58294 17.0807 9.24715 16.6665 9.24715L5.14456 9.24715L8.85919 5.53016C9.15199 5.23717 9.15184 4.7623 8.85885 4.4695C8.56587 4.1767 8.09099 4.17685 7.79819 4.46984L2.84069 9.43049C2.68224 9.568 2.58203 9.77087 2.58203 9.99715C2.58203 9.99766 2.58203 9.99817 2.58203 9.99868Z" fill=""></path>
                </svg>
              </span>
            </button>
            <span class="block text-sm font-medium text-gray-700 sm:hidden dark:text-gray-400">Page {{ currentPage }} of {{ totalPages }}</span>
            <ul class="hidden items-center gap-0.5 sm:flex">
              <li v-for="page in visiblePages" :key="page">
                <a href="#" @click.prevent="goToPage(page)" :class="page === currentPage ? 'bg-brand-500 text-white' : 'hover:bg-brand-500 text-gray-700 hover:text-white dark:text-gray-400 dark:hover:text-white'" class="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium" >{{ page }}</a>
              </li>
              <li v-if="visiblePages[visiblePages.length-1] < totalPages">
                <span class="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium text-gray-700 dark:text-gray-400">...</span>
              </li>
              <li v-if="visiblePages[visiblePages.length-1] < totalPages">
                <a href="#" @click.prevent="goToPage(totalPages)" class="hover:bg-brand-500 flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium text-gray-700 hover:text-white dark:text-gray-400 dark:hover:text-white">{{ totalPages }}</a>
              </li>
            </ul>
            <button class="shadow-theme-xs flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 hover:text-gray-800 sm:p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200" @click="nextPage" :disabled="currentPage === totalPages" :class="currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''">
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

    <!-- Image Modal -->
    <div v-if="modalImage" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div class="bg-white rounded-lg p-4 shadow-lg relative">
        <button @click="modalImage = null" class="absolute top-2 right-2 text-gray-500 hover:text-gray-800">
          &times;
        </button>
        <img :src="modalImage" alt="Product Image" class="max-w-full max-h-[70vh] rounded" />
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'

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
  branchName: string
  color: string
  size: string
  category: Category
  supplier: Supplier
  imageUrl?: string
  weightG?: string | null
  description?: string
}

const baseURL = import.meta.env.VITE_BASE_URL
const token = localStorage.getItem('auth_token') || ''
const products = ref<Product[]>([])
const loading = ref(true)
const error = ref('')
const modalImage = ref<string | null>(null)

const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)

async function fetchProducts() {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(`${baseURL}/scmlink/products`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (data.code === 1000) {
      products.value = data.result
    } else {
      error.value = data.message || 'Failed to fetch products.'
    }
  } catch (err) {
    error.value = 'Network error. Please try again.'
  } finally {
    loading.value = false
  }
}
onMounted(fetchProducts)

const filteredProducts = computed(() => {
  let list = products.value
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(
      p =>
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.code && p.code.toLowerCase().includes(q)) ||
        (p.branchName && p.branchName.toLowerCase().includes(q)) ||
        (p.category?.name && p.category.name.toLowerCase().includes(q)) ||
        (p.supplier?.name && p.supplier.name.toLowerCase().includes(q)) ||
        (p.color && p.color.toLowerCase().includes(q)) ||
        (p.size && p.size.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
    )
  }
  return list
})

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage.value) || 1)
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredProducts.value.slice(start, start + itemsPerPage.value)
})
const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  let start = Math.max(1, currentPage.value - 1)
  let end = Math.min(total, start + 2)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})
function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page
}
function previousPage() {
  if (currentPage.value > 1) currentPage.value--
}
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

// Export CSV
function exportCSV() {
  const rows = [
    ['SKU', 'Name', 'Code', 'Branch', 'Category', 'Supplier', 'Color', 'Size', 'Weight (g)', 'Description'],
    ...filteredProducts.value.map(p => [
      p.sku,
      p.name,
      p.code,
      p.branchName,
      p.category?.name || '',
      p.supplier?.name || '',
      p.color || '',
      p.size || '',
      p.weightG || '',
      p.description || ''
    ])
  ]
  const csvContent = rows.map(e => e.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.setAttribute('download', 'products.csv')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Show image modal
function showImage(url: string) {
  modalImage.value = url
}
</script>
