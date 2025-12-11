<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black/50 z-99999">
    <div
      class="no-scrollbar relative w-full max-w-[750px] overflow-y-auto rounded-3xl bg-white p-6 dark:bg-gray-900 lg:p-10 shadow-lg"
    >
      <!-- Close -->
      <button
        @click="$emit('close')"
        class="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
      >
        ✕
      </button>

      <h3 class="text-2xl font-semibold text-gray-800 dark:text-white mb-2">Create New Order</h3>
      <p class="mb-6 text-sm text-gray-500 dark:text-gray-400">
        Fill in customer information and add items to create an order.
      </p>

      <form @submit.prevent="submitOrder" class="space-y-5">
        <!-- Customer Info -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm mb-1">Customer Name</label>
            <input v-model="form.customerName" required class="w-full border rounded p-2" />
          </div>
          <div>
            <label class="block text-sm mb-1">Phone</label>
            <input v-model="form.customerPhone" required class="w-full border rounded p-2" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm mb-1">Email</label>
            <input v-model="form.customerEmail" type="email" required class="w-full border rounded p-2" />
          </div>
          <div>
            <label class="block text-sm mb-1">Shipping Address</label>
            <input v-model="form.shippingAddress" required class="w-full border rounded p-2" />
          </div>
          <div>
            <label class="block text-sm mb-1">Shipping City</label>
            <input v-model="form.shippingCity" required class="w-full border rounded p-2" />
          </div>
        </div>

        <!-- Products -->
        <h3 class="font-semibold text-lg mt-6 text-gray-800 dark:text-white">Order Items</h3>
        <div
          v-for="(item, idx) in form.items"
          :key="idx"
          class="grid grid-cols-6 gap-2 items-center mb-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg"
        >
          <!-- Product -->
          <div class="col-span-2">
            <select
              v-model="item.productId"
              @change="fetchBatchDetails(item.productId, idx)"
              class="w-full border rounded p-2"
              required
            >
              <option disabled value="">Select Product</option>
              <option v-for="p in availableProducts(idx)" :key="p.id" :value="p.id">
                {{ p.name }}
              </option>
            </select>
          </div>

          <!-- Quantity -->
          <div>
            <input
              v-model.number="item.quantity"
              type="number"
              min="1"
              :max="item.maxQuantity"
              placeholder="Qty"
              class="w-full border rounded p-2"
              :disabled="item.maxQuantity === 0"
              required
              @input="validateQuantity(idx)"
              @keypress="preventInvalidInput"
            />
            <p v-if="item.maxQuantity !== null" class="text-xs text-gray-500 mt-0.5">
              Available: {{ item.maxQuantity }}
            </p>
          </div>

          <!-- Price -->
          <div class="col-span-2">
            <p v-if="item.priceDisplay" class="text-sm text-gray-700 dark:text-gray-300">
              {{ item.priceDisplay }}
            </p>
            <p v-else class="text-sm text-gray-400 italic">Select product</p>
          </div>

          <!-- Delete -->
          <div class="text-center">
            <button
              type="button"
              @click="removeItem(idx)"
              class="text-red-500 hover:text-red-700 text-lg"
              title="Remove"
            >
              ✕
            </button>
          </div>
        </div>

        <button type="button" @click="addItem" class="text-sm font-medium text-green-600 hover:text-green-700">
          + Add another product
        </button>

        <!-- Actions -->
        <div class="flex justify-end gap-2 pt-6">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300"
          >
            Cancel
          </button>
          <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Create Order
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{ products: any[] }>()
const emit = defineEmits(['close', 'submitted'])

const baseURL = import.meta.env.VITE_BASE_URL
const token = localStorage.getItem('auth_token') || ''

// ✅ Form
const form = ref({
  customerName: '',
  customerPhone: '',
  customerEmail: '',
  shippingAddress: '',
  shippingCity: '',
  items: [
    {
      productId: '',
      quantity: 1,
      maxQuantity: null as number | null,
      priceDisplay: '',
    },
  ],
})

// ✅ Khi modal được mount → tự động fill thông tin khách hàng
async function fetchCustomerProfile() {
  try {
    const res = await fetch(`${baseURL}/scmlink/users/my-info`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (data.code === 1000 && data.result) {
      const u = data.result
      form.value.customerName = u.fullName || ''
      form.value.customerEmail = u.email || ''
      form.value.customerPhone = u.phone || ''
      form.value.shippingAddress = u.address || ''
    }
  } catch (e) {
    console.warn('Không thể load thông tin khách hàng', e)
  }
}
onMounted(fetchCustomerProfile)

// ✅ Add / Remove
function addItem() {
  form.value.items.push({
    productId: '',
    quantity: 1,
    maxQuantity: null,
    priceDisplay: '',
  })
}
function removeItem(index: number) {
  form.value.items.splice(index, 1)
}

// ✅ Không chọn trùng product
function availableProducts(currentIndex: number) {
  const selectedIds = form.value.items.map((i, idx) => (idx !== currentIndex ? i.productId : null))
  return props.products.filter((p) => !selectedIds.includes(p.id))
}

// ✅ Format
function formatCurrency(v: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v)
}
function getProductPriceRange(batches: any[]) {
  const available = batches.filter((b) => b.quantityAvailable > 0)
  if (available.length === 0) return 'Out of stock'
  const prices = available.map((b) => b.sellPrice)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  return min === max ? formatCurrency(min) : `${formatCurrency(min)} - ${formatCurrency(max)}`
}
function getTotalAvailable(batches: any[]) {
  return batches.filter((b) => b.quantityAvailable > 0).reduce((sum, b) => sum + b.quantityAvailable, 0)
}

// ✅ Fetch batch details
async function fetchBatchDetails(productId: string, idx: number) {
  if (!productId) return
  form.value.items[idx].priceDisplay = 'Loading...'
  try {
    const res = await fetch(`${baseURL}/scmlink/inventoryLocationDetails/batchDetails/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (data.code === 1000) {
      const available = getTotalAvailable(data.result)
      form.value.items[idx].maxQuantity = available
      form.value.items[idx].priceDisplay = getProductPriceRange(data.result)
      if (available === 0) {
        form.value.items[idx].quantity = 0
      }
    } else {
      form.value.items[idx].priceDisplay = '—'
      form.value.items[idx].maxQuantity = 0
    }
  } catch {
    form.value.items[idx].priceDisplay = '—'
    form.value.items[idx].maxQuantity = 0
  }
}

// ✅ Validate quantity
function validateQuantity(idx: number) {
  const item = form.value.items[idx]
  if (!item) return
  if (item.quantity < 1) item.quantity = 1
  if (item.maxQuantity !== null && item.quantity > item.maxQuantity) {
    item.quantity = item.maxQuantity
  }
}

// ✅ Ngăn nhập ký tự không hợp lệ
function preventInvalidInput(e: KeyboardEvent) {
  if (e.key === '-' || e.key === '+' || e.key === 'e') e.preventDefault()
}

// ✅ Submit
async function submitOrder() {
  const payload = {
    customerName: form.value.customerName,
    customerPhone: form.value.customerPhone,
    customerEmail: form.value.customerEmail,
    shippingAddress: form.value.shippingAddress,
    shippingCity: form.value.shippingCity,
    items: form.value.items
      .filter((i) => i.productId && i.quantity > 0)
      .map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
      })),
  }

  console.log('Submitting order', payload)

  const res = await fetch(`${baseURL}/scmlink/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (data.code === 1000) {
    emit('submitted')
  } else {
    alert(data.message || 'Failed to create order')
  }
}
</script>
