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

      <!-- Header -->
      <h3 class="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
        Update Delivery - {{ deliveryCode }}
      </h3>
      <p class="mb-6 text-sm text-gray-500 dark:text-gray-400">
        Update assigned driver, vehicle, delivery status and delivery orders.
      </p>

      <!-- Form -->
      <form @submit.prevent="submitUpdate" class="space-y-6">
        <!-- Delivery Information -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm mb-1">Delivery Status</label>
            <select v-model="form.deliveryStatus" class="w-full border rounded p-2">
              <option v-for="s in allowedStatuses" :key="s" :value="s">
                {{ s }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm mb-1">Note</label>
            <input v-model="form.note" class="w-full border rounded p-2" />
          </div>
        </div>

        <!-- Driver & Vehicle -->
        <h3 class="font-semibold text-lg text-gray-800 dark:text-white pt-4">Driver & Vehicle</h3>

        <div class="grid grid-cols-2 gap-4">
          <!-- Driver -->
          <div>
            <label class="block text-sm mb-1">Assigned Driver</label>
            <select v-model="form.driverId" class="w-full border rounded p-2" required>
              <option disabled value="">Select Driver</option>
              <option v-for="d in drivers" :key="d.id" :value="d.id">
                {{ d.fullName }} – {{ d.phoneNumber }}
              </option>
            </select>
          </div>

          <!-- Vehicle -->
          <div>
            <label class="block text-sm mb-1">Vehicle</label>
            <select v-model="form.vehicleLicensePlate" class="w-full border rounded p-2" required>
              <option disabled value="">Select Vehicle</option>
              <option v-for="v in vehicles" :key="v.licensePlate" :value="v.licensePlate">
                {{ v.licensePlate }} ({{ v.type }})
              </option>
            </select>
          </div>
        </div>

        <!-- Delivery Orders -->
        <div>
          <div class="flex items-center justify-between mt-6">
            <h3 class="font-semibold text-lg text-gray-800 dark:text-white">Orders in Delivery</h3>
          </div>

          <!-- Smart Scrollable List -->
          <div
            class="mt-4 max-h-[260px] overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 divide-y dark:divide-gray-800"
          >
            <div
              v-for="order in allOrders"
              :key="order.id"
              class="flex items-center justify-between p-3 cursor-pointer transition"
              :class="[
                selectedOrders.includes(order.id) ? 'bg-blue-50 dark:bg-blue-900/30' : '',
                isOrderSelectionDisabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800',
              ]"
              @click="toggleOrder(order.id)"
            >
              <div>
                <p class="font-medium text-gray-800 dark:text-white">#{{ order.code }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ order.customerName }}
                </p>
              </div>

              <span
                v-if="selectedOrders.includes(order.id)"
                class="px-2 py-0.5 rounded bg-blue-600 text-white text-xs"
              >
                Selected
              </span>
            </div>
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
import { ref, onMounted, computed, watch } from 'vue'

const props = defineProps<{ deliveryId: string }>()
const emit = defineEmits(['close', 'updated'])

const baseURL = import.meta.env.VITE_BASE_URL
const token = localStorage.getItem('auth_token') || ''

/* ======================================
   FORM STATE
====================================== */
const deliveryCode = ref('')
const isOrderSelectionDisabled = computed(() => {
  return form.value.deliveryStatus !== 'PENDING'
})
const allStatuses = ['PENDING', 'DELIVERING', 'DELIVERY_COMPLETED', 'DELIVERY_CANCELLED']
const allowedStatuses = ref([...allStatuses])

const form = ref({
  note: '',
  driverId: '',
  vehicleLicensePlate: '',
  deliveryStatus: 'PENDING',
})

const selectedOrders = ref<string[]>([])

// --- preserve original delivery snapshot for diffing ---
const originalDelivery = ref<any | null>(null)

const drivers = ref<any[]>([])
const vehicles = ref<any[]>([])
const allOrders = ref<any[]>([])

/* preserve assigned objects from delivery so we can include them if missing from API lists */
const assignedDriverOriginal = ref<any | null>(null)
const assignedVehicleOriginal = ref<any | null>(null)

/* ======================================
   LOAD DATA
====================================== */
function toggleOrder(id: string) {
  if (isOrderSelectionDisabled.value) return

  if (selectedOrders.value.includes(id)) {
    selectedOrders.value = selectedOrders.value.filter((o) => o !== id)
  } else {
    selectedOrders.value.push(id)
  }
}

watch(
  () => form.value.deliveryStatus,
  (newStatus) => {
    if (newStatus === 'DELIVERING') {
      // ❌ Không cho quay lại PENDING
      allowedStatuses.value = allStatuses.filter((s) => s !== 'PENDING')
    } else if (newStatus === 'PENDING') {
      // Trường hợp hiếm khi user tạo mới: cho phép toàn bộ
      allowedStatuses.value = [...allStatuses]
    }
  },
)

async function fetchDelivery() {
  const res = await fetch(`${baseURL}/scmlink/deliveries/${props.deliveryId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json()

  if (data.code === 1000) {
    const d = data.result

    deliveryCode.value = d.deliveryCode || d.id

    form.value.note = d.note || ''
    form.value.driverId = d.assignedDriver?.id || ''
    form.value.vehicleLicensePlate = d.assignedVehicle?.licensePlate || ''
    form.value.deliveryStatus = d.deliveryStatus || 'PENDING'

    selectedOrders.value = (d.deliveryOrders || []).map((o: any) => o.orderId) || []

    assignedDriverOriginal.value = d.assignedDriver || null
    assignedVehicleOriginal.value = d.assignedVehicle || null

    // snapshot original data for comparison on submit
    originalDelivery.value = {
      note: form.value.note,
      driverId: form.value.driverId,
      vehicleLicensePlate: form.value.vehicleLicensePlate,
      deliveryStatus: form.value.deliveryStatus,
      deliveryOrders: selectedOrders.value.slice(),
    }
  }

  if (form.value.deliveryStatus !== 'PENDING') {
    // ❌ Không cho chọn quay lại PENDING
    allowedStatuses.value = allowedStatuses.value.filter((s) => s !== 'PENDING')
  }
}

/** Fetch users with role SHIPPER */
async function fetchDrivers() {
  try {
    const res = await fetch(`${baseURL}/scmlink/users/role/SHIPPER`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (data.code === 1000 && data.result?.content) {
      drivers.value = data.result.content
    } else {
      drivers.value = []
    }
    // ensure assigned driver is present in the list
    if (
      assignedDriverOriginal.value &&
      !drivers.value.find((d: any) => d.id === assignedDriverOriginal.value.id)
    ) {
      drivers.value.unshift(assignedDriverOriginal.value)
    }
  } catch (e) {
    console.error('Error fetching shippers:', e)
    // still try to include assigned driver if available
    if (assignedDriverOriginal.value) drivers.value = [assignedDriverOriginal.value]
    else drivers.value = []
  }
}

/** Fetch available vehicles; include assigned vehicle even if not available */
async function fetchVehicles() {
  try {
    const res = await fetch(`${baseURL}/scmlink/vehicles/available`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (data.code === 1000 && data.result?.content) {
      vehicles.value = data.result.content
    } else {
      vehicles.value = []
    }
    // include assigned vehicle if it's not in available list
    if (
      assignedVehicleOriginal.value &&
      !vehicles.value.find(
        (v: any) => v.licensePlate === assignedVehicleOriginal.value.licensePlate,
      )
    ) {
      vehicles.value.unshift(assignedVehicleOriginal.value)
    }
  } catch (e) {
    console.error('Error fetching available vehicles:', e)
    if (assignedVehicleOriginal.value) vehicles.value = [assignedVehicleOriginal.value]
    else vehicles.value = []
  }
}

async function fetchOrders() {
  const res = await fetch(`${baseURL}/scmlink/orders?page=0&size=500`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json()

  if (data.code === 1000) {
    const rawOrders = data.result.content

    const ALLOWED_STATUSES = ['PROCESSING', 'READY FOR SHIPMENT']

    allOrders.value = rawOrders.filter((o: any) => {
      const alreadyAssigned = selectedOrders.value.includes(o.id)
      const canBeSelected = ALLOWED_STATUSES.includes(o.orderStatus)
      return alreadyAssigned || canBeSelected
    })
  }
}

/* load delivery first so we know assigned driver/vehicle, then load shippers/vehicles/orders */
onMounted(async () => {
  await fetchDelivery()
  await Promise.all([fetchDrivers(), fetchVehicles(), fetchOrders()])
})

/* ======================================
   SUBMIT UPDATE
====================================== */
async function submitUpdate() {
  // build minimal payload only with changed fields
  const payload: any = {}

  if (!originalDelivery.value) {
    // fallback: if original not loaded, send full form
    payload.note = form.value.note
    payload.driverId = form.value.driverId
    payload.vehicleLicensePlate = form.value.vehicleLicensePlate
    payload.deliveryStatus = form.value.deliveryStatus
    payload.deliveryOrders = selectedOrders.value.map((id) => ({ orderId: id }))
  } else {
    if (form.value.note !== originalDelivery.value.note) payload.note = form.value.note
    if (form.value.driverId !== originalDelivery.value.driverId)
      payload.driverId = form.value.driverId
    if (form.value.vehicleLicensePlate !== originalDelivery.value.vehicleLicensePlate)
      payload.vehicleLicensePlate = form.value.vehicleLicensePlate
    if (form.value.deliveryStatus !== originalDelivery.value.deliveryStatus)
      payload.deliveryStatus = form.value.deliveryStatus

    // compare arrays for orders
    const origOrders = originalDelivery.value.deliveryOrders || []
    const newOrders = selectedOrders.value || []
    const ordersChanged =
      origOrders.length !== newOrders.length ||
      origOrders.some((id: string) => !newOrders.includes(id))
    if (ordersChanged) payload.deliveryOrders = newOrders.map((id: string) => ({ orderId: id }))
  }

  // if nothing changed, don't call API
  if (Object.keys(payload).length === 0) {
    alert('No changes to update.')
    return
  }

  console.log('Submitting update with payload:', payload)

  const res = await fetch(`${baseURL}/scmlink/deliveries/${props.deliveryId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json()

  if (data.code !== 1000) {
    alert(data.message || 'Failed to update delivery')
    return
  }

  // Only update related order statuses when deliveryStatus actually changed
  const statusChanged =
    originalDelivery.value && form.value.deliveryStatus !== originalDelivery.value.deliveryStatus

  const DELIVERY_TO_ORDER_STATUS: Record<string, string | null> = {
    DELIVERING: 'SHIPPING', // ❌ Không update trạng thái đơn
    DELIVERY_COMPLETED: 'DELIVERED', // ✅ Update Delivered
    DELIVERY_CANCELLED: 'READY_FOR_SHIPMENT', // 🔁 Reset trạng thái để giao lại
  }

  if (statusChanged) {
    const mappedOrderStatus = DELIVERY_TO_ORDER_STATUS[form.value.deliveryStatus]
    if (mappedOrderStatus) {
      for (const o of payload.deliveryOrders ??
        selectedOrders.value.map((id) => ({ orderId: id }))) {
        // if we only changed deliveryStatus nhưng didn't send deliveryOrders, use selectedOrders
        const orderId = o.orderId ?? o
        await updateOrderStatus(orderId, mappedOrderStatus)
      }
    }
  }

  // update snapshot so subsequent edits compare correctly
  originalDelivery.value = {
    note: form.value.note,
    driverId: form.value.driverId,
    vehicleLicensePlate: form.value.vehicleLicensePlate,
    deliveryStatus: form.value.deliveryStatus,
    deliveryOrders: selectedOrders.value.slice(),
  }

  emit('updated')
  emit('close')
}
async function updateOrderStatus(orderId: string, status: string) {
  const payload = { orderStatus: status }

  await fetch(`${baseURL}/scmlink/orders/${orderId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  }).catch((e) => console.error(`❌ Failed to update order: ${orderId}`, e))
}
</script>

<style>
/* ...existing styles... */
</style>
