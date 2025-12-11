<template>
  <AdminLayout>
    <div class="p-6 space-y-6">
      <!-- HEADER -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white">
            {{ product.name || 'Product Name' }}
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Code: {{ product.code }} • SKU: {{ product.sku }}
          </p>
        </div>

        <div class="flex items-center gap-3">
          <span
            class="px-3 py-1 rounded-full text-white text-sm"
            :class="product.active ? 'bg-green-600' : 'bg-gray-400'"
          >
            {{ product.active ? 'ACTIVE' : 'INACTIVE' }}
          </span>
          <ActionMainButton
                  text="Update"
                  icon="edit"
                  type="update"
                  @click="goToUpdate(product.id)"
                />
        </div>
      </div>

      <!-- PRODUCT IMAGE + BASIC INFO -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- IMAGE -->
        <div>
          <img
            :src="product.imageUrl || '/placeholder.png'"
            class="w-full rounded-xl shadow object-cover"
          />
        </div>

        <!-- BASIC INFO -->
        <div class="md:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm space-y-2">
          <h2 class="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">
            Basic Information
          </h2>

          <div class="grid grid-cols-2 gap-4 text-sm">
            <p><strong>Name:</strong> {{ product.name }}</p>
            <p><strong>Code:</strong> {{ product.code }}</p>

            <p><strong>SKU:</strong> {{ product.sku }}</p>
            <p>
              <strong>Category:</strong>
              {{ product.category?.name || product.category?.code || '—' }}
            </p>

            <p>
              <strong>Supplier:</strong>
              {{ product.supplier?.name || product.supplier?.code || '—' }}
            </p>
            <p><strong>Size:</strong> {{ product.size }}</p>

            <p v-if="product.supplier?.phoneNumber">
              <strong>Phone:</strong> {{ product.supplier.phoneNumber }}
            </p>
            <p><strong>Brand:</strong> {{ product.branchName }}</p>

            <p v-if="product.supplier?.contactPerson">
              <strong>Contact:</strong> {{ product.supplier.contactPerson }}
            </p>

            <p><strong>Color:</strong> {{ product.color }}</p>
          </div>
        </div>
      </div>

      <!-- PHYSICAL ATTRIBUTES -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
        <h2 class="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
          Physical Attributes
        </h2>

        <div class="grid grid-cols-4 gap-4 text-center">
          <div class="p-3 border rounded-lg dark:border-gray-700">
            <p class="text-gray-500 text-sm">Weight (g)</p>
            <p class="font-bold text-gray-800 dark:text-white">{{ product.weightG }}</p>
          </div>

          <div class="p-3 border rounded-lg dark:border-gray-700">
            <p class="text-gray-500 text-sm">Length (cm)</p>
            <p class="font-bold text-gray-800 dark:text-white">{{ product.lengthCm }}</p>
          </div>

          <div class="p-3 border rounded-lg dark:border-gray-700">
            <p class="text-gray-500 text-sm">Width (cm)</p>
            <p class="font-bold text-gray-800 dark:text-white">{{ product.widthCm }}</p>
          </div>

          <div class="p-3 border rounded-lg dark:border-gray-700">
            <p class="text-gray-500 text-sm">Height (cm)</p>
            <p class="font-bold text-gray-800 dark:text-white">{{ product.heightCm }}</p>
          </div>
        </div>
      </div>

      <!-- DESCRIPTION -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
        <h2 class="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">Description</h2>
        <p class="text-gray-700 dark:text-gray-300 whitespace-pre-line">
          {{ product.description || 'No description.' }}
        </p>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ActionMainButton from '@/components/common/ActionMainButton.vue'

const route = useRoute()
const router = useRouter()

const productId = route.params.productId

const baseURL = import.meta.env.VITE_BASE_URL
const token = localStorage.getItem('auth_token') || ''

/* PRODUCT STATE */
const product = ref({
  name: '',
  code: '',
  description: '',
  imageUrl: '',
  weightG: '',
  lengthCm: '',
  widthCm: '',
  heightCm: '',
  branchName: '',
  size: '',
  color: '',
  category: null as any | null,
  supplier: null as any | null,
  active: false,
  sku: '',
})

/* FETCH PRODUCT DETAIL */
async function fetchProductDetail() {
  try {
    const res = await fetch(`${baseURL}/scmlink/products/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    const data = await res.json()
    if (data.code === 1000) {
      // ensure category/supplier are objects for template access
      const p = data.result || {}
      p.category = p.category || null
      p.supplier = p.supplier || null
      product.value = p
    }
  } catch (err) {
    console.error('Failed to load product:', err)
  }
}
function goToUpdate(id: string | undefined) {
  if (!id) return
  router.push(`/admin/update-product/${id}`)
}
onMounted(() => {
  fetchProductDetail()
})
</script>
