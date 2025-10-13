<template>
  <AdminLayout>
    <PageBreadcrumb pageTitle="Receive Inventory" />

    <div class="max-w-5xl mx-auto bg-white dark:bg-gray-900 shadow-md rounded-xl p-6 space-y-6">
      <!-- General Info -->
      <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Receiving Note</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-600 dark:text-gray-300"
            >Warehouse</label
          >
          <select
            v-model="form.warehouse_id"
            class="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2.5"
          >
            <option value="">-- Select warehouse --</option>
            <option v-for="w in warehouses" :key="w.id" :value="w.id">{{ w.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 dark:text-gray-300">Supplier</label>
          <select
            v-model="form.supplier_id"
            class="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white p-2.5"
          >
            <option value="">-- Select supplier --</option>
            <option v-for="s in suppliers" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select>
        </div>
      </div>

      <!-- Products -->
      <div>
        <h3 class="text-lg font-medium text-gray-800 dark:text-white mb-2">Products</h3>
        <table
          class="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
        >
          <thead class="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th class="p-2">Product</th>
              <th class="p-2">Quantity</th>
              <th class="p-2">Batch</th>
              <th class="p-2">Expiry</th>
              <th class="p-2">Cost Price</th>
              <th class="p-2">Location</th>
              <th class="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(p, idx) in form.products" :key="idx" class="border-t dark:border-gray-700">
              <td class="p-2">
                <select
                  v-model="p.productId"
                  class="w-full p-1.5 rounded border dark:bg-gray-900 dark:border-gray-700"
                >
                  <option value="">-- Select product --</option>
                  <option v-for="pr in products" :key="pr.id" :value="pr.id">{{ pr.name }}</option>
                </select>
              </td>
              <td class="p-2">
                <input
                  type="number"
                  v-model.number="p.quantity"
                  class="w-20 p-1.5 rounded border dark:bg-gray-900 dark:border-gray-700"
                />
              </td>
              <td class="p-2">
                <input
                  type="text"
                  v-model="p.batchNumber"
                  class="w-24 p-1.5 rounded border dark:bg-gray-900 dark:border-gray-700"
                />
              </td>
              <td class="p-2">
                <input
                  type="date"
                  v-model="p.expiryDate"
                  class="p-1.5 rounded border dark:bg-gray-900 dark:border-gray-700"
                />
              </td>
              <td class="p-2">
                <input
                  type="number"
                  v-model.number="p.costPrice"
                  class="w-28 p-1.5 rounded border dark:bg-gray-900 dark:border-gray-700"
                />
              </td>
              <td class="p-2">
                <select v-model="p.warehouseLocationId">
                  <option disabled value="">Location</option>
                  <option v-for="loc in selectedWarehouseLocations" :key="loc.id" :value="loc.id">
                    {{ loc.name }}
                  </option>
                </select>
              </td>
              <td class="p-2">
                <button @click="removeRow(idx)" class="text-red-500 hover:underline">Remove</button>
              </td>
            </tr>
          </tbody>
        </table>
        <button @click="addRow" class="mt-3 px-3 py-1.5 bg-blue-600 text-white rounded">
          + Add Product
        </button>
      </div>

      <!-- Submit -->
      <div class="flex justify-end">
        <button
          @click="submitForm"
          class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
        >
          Save Receiving Note
        </button>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'

const baseURL = import.meta.env.VITE_BASE_URL
const token = localStorage.getItem('auth_token') || ''

const props = defineProps<{
  warehouses: any[],
  suppliers: any[],
  products: any[]
}>()
const emit = defineEmits(['close'])

const form = ref({
  warehouse_id: '',
  supplier_id: '',
  totalItemsExpected: 0,
  products: [
    {
      productId: '',
      quantity: 0,
      batchNumber: '',
      expiryDate: '',
      costPrice: 0,
      warehouseLocationId: '',
    },
  ],
})

// Fetch initial data
async function fetchWarehouses() {
  const res = await fetch(`${baseURL}/scmlink/warehouses`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json()
  if (data.code === 1000) warehouses.value = data.result
}
async function fetchSuppliers() {
  const res = await fetch(`${baseURL}/scmlink/suppliers`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json()
  if (data.code === 1000) suppliers.value = data.result
}
async function fetchProducts() {
  const res = await fetch(`${baseURL}/scmlink/products`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json()
  if (data.code === 1000) products.value = data.result
}
onMounted(() => {
  fetchWarehouses()
  fetchSuppliers()
  fetchProducts()
})

const selectedWarehouseLocations = computed(() => {
  const warehouse = props.warehouses.find((w) => w.id === form.value.warehouse_id)
  return warehouse ? warehouse.warehouseLocations || [] : []
})

// Add/remove rows
function addRow() {
  form.value.products.push({
    productId: '',
    quantity: 0,
    batchNumber: '',
    expiryDate: '',
    costPrice: 0,
    warehouseLocationId: '',
  })
}
function removeRow(idx: number) {
  form.value.products.splice(idx, 1)
}

// Submit
async function submitForm() {
  form.value.totalItemsExpected = form.value.products.reduce((sum, p) => sum + (p.quantity || 0), 0)

  try {
    const res = await fetch(`${baseURL}/scmlink/receivingNotes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form.value),
    })
    const data = await res.json()
    if (data.code === 1000) {
      alert('Receiving note created successfully!')
    } else {
      alert(data.message || 'Failed to create receiving note')
    }
  } catch (e) {
    alert('Network error')
  }
}
</script>
