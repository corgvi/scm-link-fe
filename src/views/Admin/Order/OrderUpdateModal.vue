<template>
  <div class="fixed inset-0 bg-black/50 z-[99999] flex items-center justify-center">
    <div
      class="relative w-full max-w-[850px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 lg:p-10 overflow-y-auto max-h-[90vh] no-scrollbar"
    >
      <!-- Close -->
      <button
        @click="$emit('close')"
        class="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
      >
        ✕
      </button>

      <h3 class="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
        Update Order - {{ form.orderCode }}
      </h3>
      <p class="mb-6 text-sm text-gray-500 dark:text-gray-400">
        Update customer info, modify products, or adjust quantities.
      </p>

      <form @submit.prevent="submitUpdate" class="space-y-6">
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

        <!-- Order Status -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm mb-1">Order Status</label>
            <select v-model="form.orderStatus" class="w-full border rounded p-2">
              <option value="PROCESSING">PROCESSING</option>
              <option value="SHIPPING">SHIPPING</option>
              <option value="CANCELLED">CANCELLED</option>
              <option value="DELIVERED">DELIVERED</option>
            </select>
          </div>
          <div>
            <label class="block text-sm mb-1">Payment Status</label>
            <select v-model="form.paymentStatus" class="w-full border rounded p-2">
              <option value="PENDING">PENDING</option>
              <option value="PAID">PAID</option>
              <option value="REFUND">REFUND</option>
            </select>
          </div>
        </div>

        <!-- Note -->
        <div>
          <label class="block text-sm mb-1">Note</label>
          <textarea v-model="form.note" rows="2" class="w-full border rounded p-2"></textarea>
        </div>

        <!-- Products -->
        <div class="flex items-center justify-between mt-6">
          <h3 class="font-semibold text-lg text-gray-800 dark:text-white">Order Items</h3>
          <button
            type="button"
            @click="addItem"
            :disabled="!itemsEditable"
            class="text-sm font-medium text-green-600 hover:text-green-700 disabled:opacity-50"
          >
            + Add another product
          </button>
        </div>

        <div v-for="(item, idx) in form.items" :key="idx" class="grid grid-cols-6 gap-3 items-center bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mb-3">
          <!-- Product -->
          <div class="col-span-2">
            <select
              v-model="item.productId"
              @change="fetchBatchDetails(item.productId, idx)"
              class="w-full border rounded p-2"
              required
              :disabled="!itemsEditable"
            >
              <option disabled value="">Select Product</option>
              <option v-for="p in availableProducts(idx)" :key="p.id" :value="p.id">
                {{ p.name }}
              </option>
            </select>
          </div>

          <!-- Quantity controls -->
          <div class="flex flex-col items-center">
            <div class="flex items-center gap-2">
              <button
                type="button"
                @click="decreaseQuantity(idx)"
                :disabled="!itemsEditable"
                class="w-7 h-7 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
              >
                −
              </button>
              <input
                v-model.number="item.quantity"
                type="number"
                min="1"
                :max="item.maxQuantity"
                class="w-16 text-center border rounded p-1"
                @input="validateQuantity(idx)"
                @keypress="preventInvalidInput"
                :disabled="!itemsEditable"
              />
              <button
                type="button"
                @click="increaseQuantity(idx)"
                :disabled="!itemsEditable"
                class="w-7 h-7 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
              >
                +
              </button>
            </div>
            <p v-if="item.maxQuantity !== null" class="text-xs text-gray-500 mt-0.5">
              Available: {{ item.maxQuantity }}
            </p>
          </div>

          <!-- Price -->
          <div class="col-span-2 text-center">
            <p v-if="item.priceDisplay" class="text-sm text-gray-700 dark:text-gray-300">
              {{ item.priceDisplay }}
            </p>
            <p v-else class="text-sm text-gray-400 italic">Select product</p>
          </div>

          <!-- Delete -->
          <div class="text-center">
            <button
              type="button"
              @click="confirmRemove(idx)"
              :disabled="!itemsEditable"
              class="text-red-500 hover:text-red-700 text-lg disabled:opacity-50"
              title="Remove"
            >
              ✕
            </button>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-2 pt-6">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300"
          >
            Cancel
          </button>
          <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

const props = defineProps<{ orderId: string }>()
const emit = defineEmits(['close', 'updated'])

const baseURL = import.meta.env.VITE_BASE_URL
const token = localStorage.getItem('auth_token') || ''

const form = ref({
  orderCode: '',
  customerName: '',
  customerPhone: '',
  customerEmail: '',
  shippingAddress: '',
  shippingCity: '',
  note: '',
  orderStatus: 'PROCESSING',
  paymentStatus: 'PENDING',
  items: [] as any[],
})

const allProducts = ref<any[]>([])

// snapshot of original relevant fields for diffing
const originalOrder = ref<any | null>(null)

// computed to control whether items are editable
const itemsEditable = computed(() => {
  return form.value.orderStatus === 'PROCESSING' && form.value.paymentStatus === 'PENDING'
})

// 🧩 Fetch order detail
async function fetchOrderDetail() {
  const res = await fetch(`${baseURL}/scmlink/orders/details/${props.orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json()
  if (data.code === 1000 && data.result) {
    const o = data.result
    form.value = {
      orderCode: o.orderCode,
      customerName: o.customerName,
      customerPhone: o.customerPhone,
      customerEmail: o.customerEmail,
      shippingAddress: o.shippingAddress,
      shippingCity: o.shippingCity ?? '',
      note: o.note || '',
      orderStatus: o.orderStatus,
      paymentStatus: o.paymentStatus,
      items: o.orderItems.map((i: any) => ({
        productId: i.batchAllocations?.[0]?.productId ?? '',
        productName: i.batchAllocations?.[0]?.productName ?? '',
        quantity: i.quantity,
        maxQuantity: null,
        priceDisplay: '',
      })),
    }

    // create original snapshot (only fields we want to diff)
    originalOrder.value = {
      customerName: form.value.customerName,
      customerPhone: form.value.customerPhone,
      customerEmail: form.value.customerEmail,
      shippingAddress: form.value.shippingAddress,
      shippingCity: form.value.shippingCity,
      note: form.value.note,
      orderStatus: form.value.orderStatus,
      paymentStatus: form.value.paymentStatus,
      items: form.value.items.map((it: any) => ({ productId: it.productId, quantity: it.quantity })),
    }

    // Fetch batch info for each product (keeps UI data like price/max)
    for (let idx = 0; idx < form.value.items.length; idx++) {
      const item = form.value.items[idx]
      if (item.productId) await fetchBatchDetails(item.productId, idx)
    }
  }
}

// 🧩 Fetch all products
async function fetchAllProducts() {
  const res = await fetch(`${baseURL}/scmlink/products`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json()
  if (data.code === 1000) allProducts.value = Array.isArray(data.result) ? data.result : (data.result?.content || [])
}

onMounted(async () => {
  await fetchOrderDetail()
  await fetchAllProducts()
})

// 🧩 Handle add/remove
function addItem() {
  if (!itemsEditable.value) {
    alert('Items can only be edited when Order Status is PROCESSING and Payment Status is PENDING.')
    return
  }
  form.value.items.push({
    productId: '',
    quantity: 1,
    maxQuantity: null,
    priceDisplay: '',
  })
}
function confirmRemove(idx: number) {
  if (!itemsEditable.value) {
    alert('Items are not editable in current status.')
    return
  }
  if (confirm('Bạn có chắc muốn xoá sản phẩm này khỏi đơn hàng không?')) {
    removeItem(idx)
  }
}
function removeItem(index: number) {
  if (!itemsEditable.value) return
  form.value.items.splice(index, 1)
}

// 🧩 Quantity controls
function increaseQuantity(idx: number) {
  if (!itemsEditable.value) return
  const item = form.value.items[idx]
  if (item.maxQuantity !== null && item.quantity < item.maxQuantity) {
    item.quantity++
  }
}
function decreaseQuantity(idx: number) {
  if (!itemsEditable.value) return
  const item = form.value.items[idx]
  if (item.quantity > 1) {
    item.quantity--
  } else {
    if (confirm('Giảm xuống 0 sẽ xoá sản phẩm này khỏi đơn hàng. Bạn có chắc không?')) {
      removeItem(idx)
    }
  }
}

// 🧩 Fetch batch details
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
      if (available === 0) form.value.items[idx].quantity = 0
    } else {
      form.value.items[idx].priceDisplay = '—'
      form.value.items[idx].maxQuantity = 0
    }
  } catch {
    form.value.items[idx].priceDisplay = '—'
    form.value.items[idx].maxQuantity = 0
  }
}

// 🧩 Helpers
function availableProducts(currentIndex: number) {
  const selectedIds = form.value.items.map((i, idx) => (idx !== currentIndex ? i.productId : null))
  return allProducts.value.filter((p) => !selectedIds.includes(p.id))
}
function getTotalAvailable(batches: any[]) {
  return batches.filter((b) => b.quantityAvailable > 0).reduce((sum, b) => sum + b.quantityAvailable, 0)
}
function getProductPriceRange(batches: any[]) {
  const available = batches.filter((b) => b.quantityAvailable > 0)
  if (available.length === 0) return 'Out of stock'
  const prices = available.map((b) => b.sellPrice)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  return min === max ? formatCurrency(min) : `${formatCurrency(min)} - ${formatCurrency(max)}`
}
function formatCurrency(v: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v)
}
function validateQuantity(idx: number) {
  const item = form.value.items[idx]
  if (!item) return
  if (item.quantity > item.maxQuantity) {
    item.quantity = item.maxQuantity
  } else if (item.quantity < 1) {
    item.quantity = 1
  }
}

// Prevent invalid input (e.g., letters in quantity)
function preventInvalidInput(e: KeyboardEvent) {
  const invalidChars = ['e', 'E', '+', '-']
  if (invalidChars.includes(e.key)) {
    e.preventDefault()
  }
}

// 🧩 Submit update — only send changed fields, but always include orderStatus & paymentStatus
async function submitUpdate() {
  if (!originalOrder.value) {
    // fallback: send full payload if snapshot missing
    return await submitFull()
  }

  const payload: any = {}

  // always include these two
  payload.orderStatus = form.value.orderStatus
  payload.paymentStatus = form.value.paymentStatus

  if (form.value.customerName !== originalOrder.value.customerName) payload.customerName = form.value.customerName
  if (form.value.customerPhone !== originalOrder.value.customerPhone) payload.customerPhone = form.value.customerPhone
  if (form.value.customerEmail !== originalOrder.value.customerEmail) payload.customerEmail = form.value.customerEmail
  if (form.value.shippingAddress !== originalOrder.value.shippingAddress) payload.shippingAddress = form.value.shippingAddress
  if (form.value.shippingCity !== originalOrder.value.shippingCity) payload.shippingCity = form.value.shippingCity
  if (form.value.note !== originalOrder.value.note) payload.note = form.value.note

  // compare items array (order matters). If different length or any productId/quantity differs -> include items
  const origItems = originalOrder.value.items || []
  const newItems = form.value.items.map((i: any) => ({ productId: i.productId, quantity: i.quantity })).filter((i: any) => i.productId && i.quantity > 0)

  let itemsChanged = false
  if (origItems.length !== newItems.length) itemsChanged = true
  else {
    for (let i = 0; i < origItems.length; i++) {
      if (origItems[i].productId !== newItems[i].productId || Number(origItems[i].quantity) !== Number(newItems[i].quantity)) {
        itemsChanged = true
        break
      }
    }
  }
  // include items only if changed AND itemsEditable (per requirement items editable only in processing/pending)
  if (itemsChanged && itemsEditable.value) payload.items = newItems

  // if payload only contains orderStatus & paymentStatus but nothing else, it's still allowed (we always send those)
  // send minimal payload
  try {
    const res = await fetch(`${baseURL}/scmlink/orders/${props.orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (data.code === 1000) {
      // refresh original snapshot for subsequent edits
      originalOrder.value = {
        customerName: form.value.customerName,
        customerPhone: form.value.customerPhone,
        customerEmail: form.value.customerEmail,
        shippingAddress: form.value.shippingAddress,
        shippingCity: form.value.shippingCity,
        note: form.value.note,
        orderStatus: form.value.orderStatus,
        paymentStatus: form.value.paymentStatus,
        items: form.value.items.map((it: any) => ({ productId: it.productId, quantity: it.quantity })),
      }
      emit('updated')
      emit('close')
    } else {
      alert(data.message || 'Failed to update order')
    }
  } catch (err) {
    console.error(err)
    alert('Network error. Please try again.')
  }
}

// fallback full submit if needed
async function submitFull() {
  const payload = {
    customerName: form.value.customerName,
    customerPhone: form.value.customerPhone,
    customerEmail: form.value.customerEmail,
    shippingAddress: form.value.shippingAddress,
    shippingCity: form.value.shippingCity,
    note: form.value.note,
    orderStatus: form.value.orderStatus,
    paymentStatus: form.value.paymentStatus,
    items: form.value.items
      .filter((i) => i.productId && i.quantity > 0)
      .map((i) => ({ productId: i.productId, quantity: i.quantity })),
  }
  try {
    const res = await fetch(`${baseURL}/scmlink/orders/${props.orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (data.code === 1000) {
      emit('updated')
      emit('close')
    } else {
      alert(data.message || 'Failed to update order')
    }
  } catch {
    alert('Network error. Please try again.')
  }
}
</script>
