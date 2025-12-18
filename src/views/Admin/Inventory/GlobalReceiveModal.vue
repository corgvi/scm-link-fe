<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black/50 z-99999">
    <div
      class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11"
    >
      <!-- close btn -->
      <button
        @click="$emit('close')"
        class="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
      >
        ✕
      </button>

      <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">Receive Inventory</h3>
      <p class="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
        Receive inventory information below.
      </p>

      <form @submit.prevent="submit">
        <!-- Warehouse -->
        <div class="mb-4">
          <label class="block text-sm mb-1">Warehouse</label>
          <select v-model="form.warehouse_id" class="w-full border rounded p-2">
            <option disabled value="">Select warehouse</option>
            <option v-for="w in warehouses" :key="w.id" :value="w.id">
              {{ w.name }}
            </option>
          </select>
        </div>

        <!-- Total Items (auto sum, disabled) -->
        <div class="mb-4">
          <label class="block text-sm mb-1">Total Items Expected</label>
          <input
            :value="totalItemsExpected"
            type="number"
            class="w-full border rounded p-2 bg-gray-100 text-gray-500"
            disabled
          />
        </div>

        <!-- Products -->
        <h3 class="font-medium mb-2">Products</h3>
        <div v-for="(p, idx) in form.products" :key="idx" class="grid grid-cols-5 gap-2 mb-2">
          <select v-model="p.productId">
            <option disabled value="">Product</option>
            <option
              v-for="prod in products"
              :key="prod.id"
              :value="prod.id"
              :disabled="form.products.some((other, i) => i !== idx && other.productId === prod.id)"
            >
              {{ prod.name }}
            </option>
          </select>
          <input
            v-model="p.expiryDate"
            type="date"
            class="border p-2 rounded"
          />
          <input
            v-model.number="p.quantity"
            type="number"
            placeholder="Quantity"
            class="border p-2 rounded"
            required
            min="1"
            max="99999"
          />
          <input
            v-model.number="p.costPrice"
            type="number"
            placeholder="Cost"
            class="border p-2 rounded"
            required
            min="1"
          />
          <select v-model="p.warehouseLocationId">
            <option disabled value="">Location</option>
            <option v-for="loc in selectedWarehouseLocations" :key="loc.id" :value="loc.id">
              {{ loc.locationCode }}
            </option>
          </select>
        </div>
        <button type="button" @click="addProduct" class="text-sm text-green-600">
          + Add product
        </button>

        <!-- Actions -->
        <div class="flex justify-end gap-2 mt-6">
          <button type="button" @click="$emit('close')" class="px-4 py-2 border rounded">
            Cancel
          </button>
          <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded">Submit</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
const emit = defineEmits(['close', 'submitted'])
const baseURL = import.meta.env.VITE_BASE_URL
const token = localStorage.getItem('auth_token') || ''




interface Product {
  id: string;
  name: string;
}
const products = ref<Product[]>([])

interface Warehouse {
  id: string;
  name: string;
  warehouseLocations?: Array<{ id: string; locationCode: string }>;
}
const warehouses = ref<Warehouse[]>([])
const form = ref({
  warehouse_id: '',
  totalItemsExpected: 0,
  products: [
    {
      productId: '',
      quantity: null as number | null,
      costPrice: null as number | null,
      warehouseLocationId: '',
      expiryDate: '',
    },
  ],
})

const selectedWarehouseLocations = computed(() => {
  const warehouse = warehouses.value.find((w) => w.id === form.value.warehouse_id)
  return warehouse ? warehouse.warehouseLocations || [] : []
})

async function fetchWarehouses() {
  try {
    const res = await fetch(`${baseURL}/scmlink/warehouses`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (data.code === 1000) {
      warehouses.value = data.result.content || data.result || []
    }
  } catch {
    warehouses.value = []
  }
}

import { onMounted } from 'vue'
async function fetchProducts() {
  try {
    const res = await fetch(`${baseURL}/scmlink/products`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (data.code === 1000) {
      products.value = data.result.content || data.result || []
    }
  } catch {
    products.value = []
  }
}
onMounted(() => {
  fetchWarehouses()
  fetchProducts()
})
// Tính tổng quantity của tất cả sản phẩm
const totalItemsExpected = computed(() =>
  form.value.products.reduce((sum, p) => sum + (Number(p.quantity) || 0), 0)
)

function addProduct() {
  form.value.products.push({
    productId: '',
    quantity: 0,
    costPrice: 0,
    warehouseLocationId: '',
    expiryDate: '',
  })
}

async function submit() {
  form.value.totalItemsExpected = totalItemsExpected.value
  const res = await fetch(`${baseURL}/scmlink/receivingNotes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(form.value),
  })
  const data = await res.json()
  if (data.code === 1000) {
    emit('submitted')
  } else {
    alert(data.message || 'Failed to submit')
  }
}
</script>
