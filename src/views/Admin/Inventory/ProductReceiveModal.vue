<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black/50 z-99999">
    <div
      class="no-scrollbar relative w-full max-w-[500px] overflow-y-auto rounded-3xl bg-white p-6 dark:bg-gray-900 lg:p-8"
    >
      <!-- Close -->
      <button
        @click="$emit('close')"
        class="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
      >
        ✕
      </button>

      <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">
        Receive Inventory: {{ product.productName }}
      </h3>
      <p class="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
        Add inventory for {{ product.productName }}.
      </p>

      <form @submit.prevent="submit">
        <!-- Warehouse Location -->
        <div class="mb-3">
          <label class="block text-sm mb-1">Warehouse Location</label>
          <select v-model="form.products[0].warehouseLocationId" class="w-full border rounded p-2" required>
            <option disabled value="">Select location</option>
            <option
              v-for="loc in warehouseLocations"
              :key="loc.id"
              :value="loc.id"
            >
              {{ loc.locationCode }} - {{ loc.locationType }}
            </option>
          </select>
        </div>

        <!-- Expiry Date -->
        <div class="mb-3">
          <label class="block text-sm mb-1">Expiry Date</label>
          <input v-model="form.products[0].expiryDate" type="date" class="w-full border rounded p-2" />
        </div>

        <!-- Quantity & Cost -->
        <div class="grid grid-cols-2 gap-4 mb-3">
          <div>
            <label class="block text-sm mb-1">Quantity</label>
            <input
              v-model.number="form.products[0].quantity"
              type="number"
              min="1"
              class="w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label class="block text-sm mb-1">Cost Price</label>
            <input
              v-model.number="form.products[0].costPrice"
              type="number"
              min="0"
              class="w-full border rounded p-2"
              required
            />
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-2 mt-6">
          <button type="button" @click="$emit('close')" class="px-4 py-2 border rounded">
            Cancel
          </button>
          <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded">
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"

const props = defineProps<{
  product: any,
  warehouseId: string
}>()

const emit = defineEmits(['close', 'submitted'])

const baseURL = import.meta.env.VITE_BASE_URL
const token = localStorage.getItem("auth_token") || ""

// Đúng cấu trúc form như GlobalReceiveModal
const form = ref({
  warehouse_id: props.warehouseId || '',
  totalItemsExpected: 0,
  products: [
    {
      productId: props.product.productId || '',
      quantity: null as number | null,
      costPrice: null as number | null,
      warehouseLocationId: null as string | null,
      expiryDate: null as string | null,
    },
  ],
})

const warehouseLocations = ref<any[]>([])

async function fetchWarehouseLocations() {
  if (!props.warehouseId) return
  try {
    const res = await fetch(`${baseURL}/scmlink/warehouses/${props.warehouseId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    if (data.code === 1000 && Array.isArray(data.result?.warehouseLocations)) {
      warehouseLocations.value = data.result.warehouseLocations
    } else {
      warehouseLocations.value = []
    }
  } catch {
    warehouseLocations.value = []
  }
}

function formatDateForRequest(dateStr: string | null): string | null{
  if (!dateStr) return null
  return dateStr.replace(/-/g, "/")
}

async function submit() {
  // Tính lại tổng số lượng
  form.value.totalItemsExpected = Number(form.value.products[0].quantity) || 0
  // Format ngày
  form.value.products[0].expiryDate = form.value.products[0].expiryDate
    ? formatDateForRequest(form.value.products[0].expiryDate)
    : null

  const res = await fetch(`${baseURL}/scmlink/receivingNotes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(form.value)
  })

  const data = await res.json()
  if (data.code === 1000) {
    emit("submitted")
  } else {
    alert(data.message || "Failed to receive inventory")
  }
}

onMounted(() => {
  fetchWarehouseLocations()
})
</script>
