<template>
  <div class="fixed inset-0 bg-black/50 z-[99999] flex items-center justify-center">
    <div
      class="relative w-full max-w-[650px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 lg:p-10 overflow-y-auto max-h-[90vh] no-scrollbar"
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
        Create New Vehicle
      </h3>
      <p class="mb-6 text-sm text-gray-500 dark:text-gray-400">
        Enter vehicle information to add a new vehicle to the system.
      </p>

      <!-- Form -->
      <form @submit.prevent="submitCreate" class="space-y-6">
        <!-- Error -->
        <div v-if="errorMessage" class="text-sm text-red-600 bg-red-50 p-3 rounded">
          {{ errorMessage }}
        </div>

        <!-- License Plate -->
        <div>
          <label class="block text-sm mb-1">License Plate</label>
          <input
            v-model="form.licensePlate"
            placeholder="29A-09326"
            required
            class="w-full border rounded p-2"
          />
        </div>

        <!-- Type -->
        <div>
          <label class="block text-sm mb-1">Vehicle Type</label>
          <select v-model="form.type" class="w-full border rounded p-2" required>
            <option disabled value="">Select Type</option>
            <option value="TRUCK">TRUCK</option>
            <option value="MOTORBIKE">MOTORBIKE</option>
            <option value="CONTAINER">CONTAINER</option>
            <option value="VAN">VAN</option>
          </select>
        </div>

        <!-- Capacity -->
        <div>
          <label class="block text-sm mb-1">Capacity (Kg)</label>
          <input
            type="number"
            v-model.number="form.capacityKg"
            placeholder="1500"
            min="1"
            required
            class="w-full border rounded p-2"
          />
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-2 pt-4">
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
            <span
              v-if="isSubmitting"
              class="inline-block mr-2 animate-spin w-4 h-4 border-2 border-t-transparent border-white rounded-full"
            ></span>
            Create Vehicle
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const emit = defineEmits(['close', 'created'])

const baseURL = import.meta.env.VITE_BASE_URL
const token = localStorage.getItem('auth_token') || ''

/* =========================
   FORM STATE
========================= */
const form = ref({
  licensePlate: '',
  type: '',
  capacityKg: null as number | null,
})

const isSubmitting = ref(false)
const errorMessage = ref('')

/* =========================
   VALIDATION
========================= */
const canSubmit = computed(() => {
  return (
    !!form.value.licensePlate &&
    !!form.value.type &&
    form.value.capacityKg !== null &&
    form.value.capacityKg > 0
  )
})

/* =========================
   SUBMIT VEHICLE
========================= */
async function submitCreate() {
  errorMessage.value = ''

  if (!canSubmit.value) {
    errorMessage.value = 'Please fill in all required fields.'
    return
  }

  isSubmitting.value = true

  try {
    const payload = {
      licensePlate: form.value.licensePlate,
      type: form.value.type,
      capacityKg: Number(form.value.capacityKg),
    }

    const res = await fetch(`${baseURL}/scmlink/vehicles`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json()

    if (res.ok && data?.code === 1000) {
      form.value = { licensePlate: '', type: '', capacityKg: null }
      emit('created')
      emit('close')
    } else {
      errorMessage.value = data?.message || 'Failed to create vehicle.'
    }
  } catch (err) {
    console.error('submitCreate', err)
    errorMessage.value = 'Network or server error.'
  } finally {
    isSubmitting.value = false
  }
}
</script>
