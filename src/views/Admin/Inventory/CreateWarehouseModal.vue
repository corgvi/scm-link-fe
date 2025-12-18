<template>
  <Alert
    v-if="alert.show"
    :variant="alert.type"
    :title="alert.title"
    :message="alert.message"
    :duration="3000"
  />
  <div class="fixed inset-0 flex items-center justify-center bg-black/50 z-99999">
    <div
      class="no-scrollbar relative w-full max-w-[750px] overflow-y-auto rounded-3xl bg-white p-6 dark:bg-gray-900 lg:p-10 shadow-lg"
    >
      <div>
        <button
          @click="closeModal"
          class="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          ✕
        </button>
        <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">Create Warehouse</h3>
        <p class="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
          Fill in the details below to create a new warehouse.
        </p>

        <form @submit.prevent="handleCreateWarehouse" class="grid grid-cols-1 gap-6">
          <div>
            <input
              v-model="form.name"
              type="text"
              placeholder="Name"
              class="border rounded-lg px-4 py-3 w-full dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-brand-500 transition"
              :class="{ 'border-red-500': errors.name }"
              required
            />
            <span v-if="errors.name" class="text-xs text-red-500 mt-1">{{ errors.name }}</span>
          </div>

          <div>
            <input
              v-model="form.address"
              type="text"
              placeholder="Address"
              class="border rounded-lg px-4 py-3 w-full dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-brand-500 transition"
              :class="{ 'border-red-500': errors.address }"
              required
            />
            <span v-if="errors.address" class="text-xs text-red-500 mt-1">{{
              errors.address
            }}</span>
          </div>

          <div>
            <input
              v-model="form.contactPhone"
              type="text"
              placeholder="Contact Phone"
              class="border rounded-lg px-4 py-3 w-full dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-brand-500 transition"
              :class="{ 'border-red-500': errors.contactPhone }"
              required
            />
            <span v-if="errors.contactPhone" class="text-xs text-red-500 mt-1">{{
              errors.contactPhone
            }}</span>
          </div>

          <div>
            <input
              v-model="form.city"
              type="text"
              placeholder="City"
              class="border rounded-lg px-4 py-3 w-full dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-brand-500 transition"
              :class="{ 'border-red-500': errors.city }"
              required
            />
            <span v-if="errors.city" class="text-xs text-red-500 mt-1">{{ errors.city }}</span>
          </div>



          <div class="mt-6 flex justify-end gap-2">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              :disabled="loadingCreate"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-6 py-2 rounded-lg bg-brand-500 text-white font-semibold hover:bg-brand-600 transition flex items-center gap-2"
              :disabled="loadingCreate"
            >
              <span
                v-if="loadingCreate"
                class="animate-spin mr-2 w-4 h-4 border-2 border-t-transparent border-white rounded-full inline-block"
              ></span>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import Alert from '@/components/ui/Alert.vue'

// Emit events back to parent
const emit = defineEmits(['close', 'created'])

const baseURL = import.meta.env.VITE_BASE_URL
const token = localStorage.getItem('auth_token') || ''

const loadingCreate = ref(false)
const form = reactive({
  name: '',
  address: '',
  contactPhone: '',
  city: '',
})

const errors = reactive({
  name: '',
  address: '',
  contactPhone: '',
  city: '',
})

// Alert state
const alert = reactive({
  show: false,
  type: 'success',
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

function closeModal() {
  emit('close')
}

function validateForm() {
  errors.name = form.name ? '' : 'Name is required'
  errors.address = form.address ? '' : 'Address is required'
  errors.contactPhone = form.contactPhone ? '' : 'Contact phone is required'
  errors.city = form.city ? '' : 'City is required'
  return !errors.name && !errors.address && !errors.contactPhone && !errors.city
}

async function handleCreateWarehouse() {
  if (!validateForm()) return

  loadingCreate.value = true
  try {
    const res = await fetch(`${baseURL}/scmlink/warehouses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    })
    const data = await res.json()

    if (res.ok && data.code === 1000) {
      alertState('success', 'Success', 'Warehouse created successfully.')
      setTimeout(() => {
        emit('created', data.result)
        closeModal()
      }, 1000)
    } else {
      alertState('error', 'Error', data.message || 'Failed to create warehouse')
    }
  } catch (e) {
    alertState('error', 'Error', 'Error creating warehouse')
    console.error(e)
  } finally {
    loadingCreate.value = false
  }
}
</script>
