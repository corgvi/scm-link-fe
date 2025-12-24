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
        Create New Delivery
      </h3>
      <p class="mb-6 text-sm text-gray-500 dark:text-gray-400">
        Assign driver, vehicle, and orders to create a new delivery.
      </p>


      <!-- Form -->
      <Alert
        v-if="alert.show"
        :variant="alert.type"
        :title="alert.title"
        :message="alert.message"
        :duration="3000"
      />
      <form @submit.prevent="submitCreate" class="space-y-6">

        <!-- Delivery Information -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm mb-1">Scheduled Pickup Date</label>
            <input
              type="date"
              v-model="form.scheduledPickupTime"
              required
              class="w-full border rounded p-2"
            />
          </div>

          <div>
            <label class="block text-sm mb-1">Note</label>
            <input v-model="form.note" class="w-full border rounded p-2" />
          </div>
        </div>

        <!-- Driver & Vehicle -->
        <h3 class="font-semibold text-lg text-gray-800 dark:text-white pt-4">
          Driver & Vehicle
        </h3>

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
            <select
              v-model="form.vehicleLicensePlate"
              class="w-full border rounded p-2"
              required
            >
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
            <h3 class="font-semibold text-lg text-gray-800 dark:text-white">
              Select Orders
            </h3>
            <div class="text-xs text-gray-500">Selected: {{ selectedOrders.length }}</div>
          </div>

          <!-- Smart Scrollable List -->
          <div
            class="mt-4 max-h-[260px] overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 divide-y dark:divide-gray-800"
          >
            <div
              v-for="order in allOrders"
              :key="order.id"
              class="flex items-center justify-between p-3 cursor-pointer transition hover:bg-gray-100 dark:hover:bg-gray-800"
              :class="selectedOrders.includes(order.id) ? 'bg-blue-50 dark:bg-blue-900/30' : ''"
              @click="toggleOrder(order.id)"
            >
              <div>
                <p class="font-medium text-gray-800 dark:text-white">
                  #{{ order.code }}
                </p>
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
            :disabled="isSubmitting"
          >
            Cancel
          </button>

          <button
            type="submit"
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60"
            :disabled="isSubmitting || !canSubmit"
          >
            <span v-if="isSubmitting" class="inline-block mr-2 animate-spin w-4 h-4 border-2 border-t-transparent border-white rounded-full"></span>
            Create Delivery
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

const emit = defineEmits(['close', 'created'])

const baseURL = import.meta.env.VITE_BASE_URL
const token = localStorage.getItem('auth_token') || ''

/* =========================
   FORM STATE
========================= */
const form = ref({
  note: '',
  driverId: '',
  vehicleLicensePlate: '',
  scheduledPickupTime: '',
})

const selectedOrders = ref<string[]>([])
const drivers = ref<any[]>([])
const vehicles = ref<any[]>([])
const allOrders = ref<any[]>([])

const isSubmitting = ref(false)
// Alert state
import Alert from '@/components/ui/Alert.vue'
import { reactive } from 'vue'
const alert = reactive({
  show: false,
  type: 'error',
  title: '',
  message: '',
})
function alertState(type: string, title: string, message: string) {
  alert.show = true
  alert.type = type
  alert.title = title
  alert.message = message
  setTimeout(() => { alert.show = false }, 3000)
}

function toggleOrder(id: string) {
  if (selectedOrders.value.includes(id)) {
    selectedOrders.value = selectedOrders.value.filter((o) => o !== id)
  } else {
    selectedOrders.value.push(id)
  }
}

/* =========================
   LOAD DATA
========================= */
async function fetchDrivers() {
  try {
    const res = await fetch(`${baseURL}/scmlink/users/role/SHIPPER`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    drivers.value = data?.result?.content || []
  } catch (err) {
    console.error('fetchDrivers', err)
  }
}

async function fetchVehicles() {
  try {
    const res = await fetch(`${baseURL}/scmlink/vehicles/available`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    vehicles.value = data?.result?.content || []
  } catch (err) {
    console.error('fetchVehicles', err)
  }
}

async function fetchOrders() {
  try {
    const res = await fetch(`${baseURL}/scmlink/orders?page=0&size=500`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (!data) return
    // accept multiple naming variants from API
    const ALLOWED = ['PROCESSING', 'READY_FOR_SHIPMENT']
    if (data.code === 1000 && Array.isArray(data.result.content)) {
      allOrders.value = data.result.content.filter((o: any) =>
        ALLOWED.includes((o.orderStatus || '').toString().toUpperCase()),
      )
    } else {
      allOrders.value = data.result?.content || []
    }
  } catch (err) {
    console.error('fetchOrders', err)
  }
}

onMounted(() => {
  Promise.all([fetchDrivers(), fetchVehicles(), fetchOrders()])
})

/* =========================
   VALIDATION & SUBMIT
========================= */
const canSubmit = computed(() => {
  return (
    !!form.value.driverId &&
    !!form.value.vehicleLicensePlate &&
    !!form.value.scheduledPickupTime &&
    selectedOrders.value.length > 0
  )
})

function buildPayload() {
    console.log('Building payload with selected orders:', selectedOrders.value)
  return {
    note: form.value.note || '',
    driverId: form.value.driverId,
    vehicleLicensePlate: form.value.vehicleLicensePlate,
    scheduledPickupTime: form.value.scheduledPickupTime, // yyyy-mm-dd from input
    deliveryOrders: selectedOrders.value.map((id) => ({ orderId: id })),
  }
}

async function submitCreate() {

  if (!canSubmit.value) {
    alertState('error', 'Error', 'Please fill required fields and select at least one order.')
    return
  }

  isSubmitting.value = true
  try {
    const payload = buildPayload()

    const res = await fetch(`${baseURL}/scmlink/deliveries`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    if (res.ok && data?.code === 1000) {
      // reset form for next create
      form.value = { note: '', driverId: '', vehicleLicensePlate: '', scheduledPickupTime: '' }
      selectedOrders.value = []
      alertState('success', 'Success', 'Delivery created successfully.')
      setTimeout(() => {
        emit('created')
        emit('close')
      }, 900)
    } else {
      alertState('error', 'Error', data?.message || `Failed to create delivery (code:${data?.code ?? 'n/a'})`)
    }
  } catch (err) {
    console.error('submitCreate', err)
    alertState('error', 'Error', 'Network or server error while creating delivery.')
  } finally {
    isSubmitting.value = false
  }
}
</script>
