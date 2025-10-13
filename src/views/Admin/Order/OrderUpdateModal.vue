<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-99999">
    <div
      class="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] p-8"
    >
      <!-- Close -->
      <button
        @click="$emit('close')"
        class="absolute top-4 right-4 text-gray-400 hover:text-gray-800 dark:hover:text-white text-2xl font-bold focus:outline-none"
        aria-label="Close"
      >&times;</button>

      <h2 class="text-2xl font-bold mb-8 text-brand-600 dark:text-brand-400 text-center">
        Update Order - {{ form.orderCode }}
      </h2>

      <!-- Form -->
      <form @submit.prevent="submitUpdate" class="space-y-8">
        <!-- ORDER INFO -->
        <div>
          <h3 class="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Order Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Customer Name -->
            <div>
              <label class="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">Customer Name</label>
              <input
                v-model="form.customerName"
                type="text"
                required
                class="w-full border border-gray-300 rounded-lg p-2.5 text-sm
                       focus:ring-2 focus:ring-blue-400 focus:outline-none
                       dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <!-- Customer Phone -->
            <div>
              <label class="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">Customer Phone</label>
              <input
                v-model="form.customerPhone"
                required
                class="w-full border border-gray-300 rounded-lg p-2.5 text-sm
                       focus:ring-2 focus:ring-blue-400 focus:outline-none
                       dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <!-- Customer Email -->
            <div>
              <label class="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">Customer Email</label>
              <input
                v-model="form.customerEmail"
                type="email"
                required
                class="w-full border border-gray-300 rounded-lg p-2.5 text-sm
                       focus:ring-2 focus:ring-blue-400 focus:outline-none
                       dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <!-- Shipping Address -->
            <div>
              <label class="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">Shipping Address</label>
              <input
                v-model="form.shippingAddress"
                required
                class="w-full border border-gray-300 rounded-lg p-2.5 text-sm
                       focus:ring-2 focus:ring-blue-400 focus:outline-none
                       dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <!-- Order Status -->
            <div>
              <label class="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">Order Status</label>
              <select
                v-model="form.orderStatus"
                class="w-full border border-gray-300 rounded-lg p-2.5 text-sm
                       focus:ring-2 focus:ring-blue-400 focus:outline-none
                       dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="PROCESSING">Processing</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <!-- Payment Status -->
            <div>
              <label class="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">Payment Status</label>
              <select
                v-model="form.paymentStatus"
                class="w-full border border-gray-300 rounded-lg p-2.5 text-sm
                       focus:ring-2 focus:ring-blue-400 focus:outline-none
                       dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
              </select>
            </div>
            <!-- Note -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">Note</label>
              <textarea
                v-model="form.note"
                rows="2"
                class="w-full border border-gray-300 rounded-lg p-2.5 text-sm
                       focus:ring-2 focus:ring-blue-400 focus:outline-none
                       dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        <!-- ORDER ITEMS -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300">Order Items</h3>
            <button
              type="button"
              @click="addItem"
              class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 border border-green-600 hover:bg-green-100 hover:text-green-800 transition font-medium text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </button>
          </div>

          <div class="space-y-2">
            <div
              v-for="(item, i) in form.items"
              :key="i"
              class="grid grid-cols-7 gap-3 items-center bg-gray-50 dark:bg-gray-800 rounded-lg p-3"
            >
              <!-- Product -->
              <select
                v-model="item.productId"
                required
                class="col-span-2 w-full border border-gray-300 rounded-lg p-2 text-sm
                       focus:ring-2 focus:ring-blue-400 focus:outline-none
                       dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option disabled value="">Select Product</option>
                <option v-for="p in products" :key="p.id" :value="p.id">
                  {{ p.name }} ({{ formatPriceRange(p) }})
                </option>
              </select>

              <!-- Quantity -->
              <input
                type="number"
                v-model.number="item.quantity"
                :max="getMaxQuantity(item.productId)"
                min="1"
                @input="validateQuantity(item)"
                required
                class="w-full border border-gray-300 rounded-lg p-2 text-sm
                       focus:ring-2 focus:ring-blue-400 focus:outline-none
                       dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />

              <!-- Available -->
              <div class="flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
                Avail:
                <span class="font-semibold ml-1">{{ getMaxQuantity(item.productId) }}</span>
              </div>

              <!-- Unit price -->
              <div class="flex items-center justify-center text-xs text-gray-600 dark:text-gray-300">
                {{ formatCurrency(getProductPrice(item.productId)) }}
              </div>

              <!-- Total -->
              <div class="flex items-center justify-center text-xs font-semibold text-gray-700 dark:text-gray-200">
                {{ formatCurrency(getProductPrice(item.productId) * item.quantity) }}
              </div>

              <!-- Delete -->
              <button
                type="button"
                @click="removeItem(i)"
                class="inline-flex items-center justify-center text-red-500 hover:text-red-700 text-sm font-semibold rounded-lg p-2 transition"
                aria-label="Remove"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- ACTIONS -->
        <div class="flex justify-end gap-3 mt-8">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
          >
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{ order: any }>()
const emit = defineEmits(['close', 'updated'])

const baseURL = import.meta.env.VITE_BASE_URL
const token = localStorage.getItem('auth_token') || ''

const form = ref({
  orderCode: props.order?.orderCode || '',
  customerName: props.order?.customerName || '',
  customerPhone: props.order?.customerPhone || '',
  customerEmail: props.order?.customerEmail || '',
  shippingAddress: props.order?.shippingAddress || '',
  note: props.order?.note || '',
  orderStatus: props.order?.orderStatus || 'PROCESSING',
  paymentStatus: props.order?.paymentStatus || 'PENDING',
  items: props.order?.orderItems?.map((i: any) => ({
    productId: i.productId,
    quantity: i.quantity,
  })) || [],
})

const products = ref<any[]>([])

onMounted(async () => {
  const res = await fetch(`${baseURL}/scmlink/products`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json()
  if (data.code === 1000) products.value = data.result
})

function addItem() {
  form.value.items.push({ productId: '', quantity: 1 })
}

function removeItem(index: number) {
  form.value.items.splice(index, 1)
}

function getMaxQuantity(productId: string) {
  const product = products.value.find((p) => p.id === productId)
  return product?.quantityAvailable ?? 0
}

function getProductPrice(productId: string) {
  const product = products.value.find((p) => p.id === productId)
  if (!product || !product.batches?.length) return 0
  const availableBatches = product.batches.filter((b: any) => b.quantityAvailable > 0)
  const prices = availableBatches.map((b: any) => b.sellPrice)
  if (prices.length === 1) return prices[0]
  return Math.min(...prices)
}

function formatPriceRange(product: any) {
  if (!product.batches || !product.batches.length) return '—'
  const prices = product.batches.filter((b: any) => b.quantityAvailable > 0).map((b: any) => b.sellPrice)
  if (prices.length === 0) return 'Out of stock'
  if (prices.length === 1) return `${formatCurrency(prices[0])}`
  return `${formatCurrency(Math.min(...prices))} - ${formatCurrency(Math.max(...prices))}`
}

function validateQuantity(item: any) {
  const max = getMaxQuantity(item.productId)
  if (item.quantity < 1) item.quantity = 1
  if (item.quantity > max) item.quantity = max
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

async function submitUpdate() {
  const res = await fetch(`${baseURL}/scmlink/orders/${props.order.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(form.value),
  })
  const data = await res.json()
  if (data.code === 1000) {
    emit('updated')
    emit('close')
  } else {
    alert(data.message || 'Failed to update order')
  }
}
</script>
