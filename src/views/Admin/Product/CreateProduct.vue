<template>
  <!-- Alert -->
  <Alert
    v-if="alert.show"
    :variant="alert.type"
    :title="alert.title"
    :message="alert.message"
    :duration="3000"
  />

  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6">
      <!-- Header -->
      <div class="flex flex-wrap items-center justify-between gap-3 pb-6">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white/90">
          Create Product
        </h2>
        <nav>
          <ol class="flex items-center gap-1.5">
            <li>
              <router-link
                class="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
                to="/admin/products"
              >
                Home
                <svg
                  class="stroke-current"
                  width="17"
                  height="16"
                  fill="none"
                  viewBox="0 0 17 16"
                >
                  <path
                    d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                    stroke-width="1.2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </router-link>
            </li>
            <li class="text-sm text-gray-800 dark:text-white/90">
              Create Product
            </li>
          </ol>
        </nav>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Product Information -->
        <div
          class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
        >
          <div class="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
            <h2 class="text-lg font-medium text-gray-800 dark:text-white">
              Product Information
            </h2>
          </div>
          <div class="p-4 sm:p-6">
            <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
              <!-- Product Name -->
              <div>
                <label class="block mb-1.5 text-sm font-medium">Product Name</label>
                <input
                  v-model="form.name"
                  class="h-11 w-full rounded-lg border px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                  :class="{ 'border-red-500': errors.name }"
                />
                <span v-if="errors.name" class="text-xs text-red-500">{{ errors.name }}</span>
              </div>

              <!-- Product Code -->
              <div>
                <label class="block mb-1.5 text-sm font-medium">Product Code</label>
                <input
                  v-model="form.code"
                  class="h-11 w-full rounded-lg border px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                  :class="{ 'border-red-500': errors.code }"
                />
                <span v-if="errors.code" class="text-xs text-red-500">{{ errors.code }}</span>
              </div>

              <!-- Branch Name -->
              <div>
                <label class="block mb-1.5 text-sm font-medium">Branch Name</label>
                <input
                  v-model="form.branchName"
                  class="h-11 w-full rounded-lg border px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                  :class="{ 'border-red-500': errors.branchName }"
                />
                <span v-if="errors.branchName" class="text-xs text-red-500">{{ errors.branchName }}</span>
              </div>

              <!-- Size -->
              <div>
                <label class="block mb-1.5 text-sm font-medium">Size</label>
                <input v-model="form.size" class="h-11 w-full rounded-lg border px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90" />
              </div>

              <!-- Color -->
              <div>
                <label class="block mb-1.5 text-sm font-medium">Color</label>
                <input v-model="form.color" class="h-11 w-full rounded-lg border px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90" />
              </div>

              <!-- Weight -->
              <div>
                <label class="block mb-1.5 text-sm font-medium">Weight (g)</label>
                <input v-model="form.weightG" type="text" class="h-11 w-full rounded-lg border px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90" />
              </div>

              <!-- Length -->
              <div>
                <label class="block mb-1.5 text-sm font-medium">Length (cm)</label>
                <input v-model="form.lengthCm" type="text" class="h-11 w-full rounded-lg border px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90" />
              </div>

              <!-- Width -->
              <div>
                <label class="block mb-1.5 text-sm font-medium">Width (cm)</label>
                <input v-model="form.widthCm" type="text" class="h-11 w-full rounded-lg border px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90" />
              </div>

              <!-- Height -->
              <div>
                <label class="block mb-1.5 text-sm font-medium">Height (cm)</label>
                <input v-model="form.heightCm" type="text" class="h-11 w-full rounded-lg border px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90" />
              </div>

              <!-- Image URL -->
              <div>
                <label class="block mb-1.5 text-sm font-medium">Image URL</label>
                <input v-model="form.imageUrl" type="text" class="h-11 w-full rounded-lg border px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90" />
              </div>

              <!-- Category -->
              <div>
                <label class="block mb-1.5 text-sm font-medium">Category</label>
                <select
                  v-model="form.categoryCode"
                  class="h-11 w-full rounded-lg border px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                  :class="{ 'border-red-500': errors.categoryCode }"
                >
                  <option value="" disabled>Select category</option>
                  <option v-for="cat in categories" :key="cat.code" :value="cat.code">
                    {{ cat.name }}
                  </option>
                </select>
                <span v-if="errors.categoryCode" class="text-xs text-red-500">{{ errors.categoryCode }}</span>
              </div>

              <!-- Supplier -->
              <div>
                <label class="block mb-1.5 text-sm font-medium">Supplier</label>
                <select
                  v-model="form.supplierCode"
                  class="h-11 w-full rounded-lg border px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                  :class="{ 'border-red-500': errors.supplierCode }"
                >
                  <option value="" disabled>Select supplier</option>
                  <option v-for="sup in suppliers" :key="sup.code" :value="sup.code">
                    {{ sup.name }}
                  </option>
                </select>
                <span v-if="errors.supplierCode" class="text-xs text-red-500">{{ errors.supplierCode }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
            <h2 class="text-lg font-medium text-gray-800 dark:text-white">
              Description
            </h2>
          </div>
          <div class="p-4 sm:p-6">
            <textarea v-model="form.description" rows="3" class="w-full rounded-lg border px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"></textarea>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col gap-3 sm:flex-row sm:justify-end mt-6">
          <button
            type="button"
            class="shadow-theme-xs inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-medium text-gray-700 ring-1 ring-gray-300 transition hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03]"
            @click="router.push('/admin/products')"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="bg-brand-500 shadow-theme-xs hover:bg-brand-600 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition"
          >
            <span
              v-if="loading"
              class="animate-spin mr-2 w-4 h-4 border-2 border-t-transparent border-white rounded-full inline-block"
            ></span>
            Create Product
          </button>
        </div>
      </form>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import Alert from '@/components/ui/Alert.vue'

const router = useRouter()
const baseURL = import.meta.env.VITE_BASE_URL
const token = localStorage.getItem('auth_token') || ''

const loading = ref(false)
const alert = reactive({
  show: false,
  type: 'success',
  title: '',
  message: '',
})

const form = reactive({
  name: '',
  description: '',
  imageUrl: '',
  weightG: '',
  lengthCm: '',
  widthCm: '',
  heightCm: '',
  branchName: '',
  code: '',
  size: '',
  color: '',
  categoryCode: '',
  supplierCode: '',
})

const suppliers = ref<{ code: string; name: string }[]>([])
const categories = ref<{ code: string; name: string }[]>([])

const errors = reactive({
  name: '',
  code: '',
  branchName: '',
  categoryCode: '',
  supplierCode: '',
})

const isFormValid = computed(() => {
  errors.name = form.name ? '' : 'Product name is required'
  errors.code = form.code ? '' : 'Product code is required'
  errors.branchName = form.branchName ? '' : 'Branch name is required'
  errors.categoryCode = form.categoryCode ? '' : 'Category is required'
  errors.supplierCode = form.supplierCode ? '' : 'Supplier is required'
  return !errors.name && !errors.code && !errors.branchName && !errors.categoryCode && !errors.supplierCode
})

async function fetchSuppliers() {
  const res = await fetch(`${baseURL}/scmlink/suppliers`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json()
  if (data.code === 1000) {
    suppliers.value = data.result.map((s: any) => ({
      code: s.code,
      name: s.name,
    }))
  }
}

async function fetchCategories() {
  const res = await fetch(`${baseURL}/scmlink/categories`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json()
  if (data.code === 1000) {
    categories.value = data.result.map((c: any) => ({
      code: c.code,
      name: c.name,
    }))
  }
}

onMounted(() => {
  fetchSuppliers()
  fetchCategories()
})

async function handleSubmit() {
  if (!isFormValid.value) return
  loading.value = true
  try {
    const payload = { ...form }
    const res = await fetch(`${baseURL}/scmlink/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (res.ok && data.code === 1000) {
      alert.show = true
      alert.type = 'success'
      alert.title = 'Success'
      alert.message = 'Product created successfully.'
      setTimeout(() => {
        router.push('/admin/products')
      }, 1200)
    } else {
      alert.show = true
      alert.type = 'error'
      alert.title = 'Error'
      alert.message = data.message || 'Failed to create product.'
    }
  } catch {
    alert.show = true
    alert.type = 'error'
    alert.title = 'Error'
    alert.message = 'Error creating product.'
  } finally {
    loading.value = false
  }
}
</script>
