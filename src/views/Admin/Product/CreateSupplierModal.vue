<template>
  <div class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
    <button @click="$emit('close')" class="absolute right-5 top-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300">
      ✕
    </button>

    <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">Create Supplier</h3>
    <p class="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">Create a new supplier by filling out the form below.</p>

    <div v-if="errorMessage" class="mb-4 rounded-lg bg-red-100 text-red-700 px-4 py-2">{{ errorMessage }}</div>

    <form id="create-supplier-form" @submit.prevent="submit" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <input v-model="form.name" type="text" placeholder="Name" class="border rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white" />
      <input v-model="form.code" type="text" placeholder="Code" class="border rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white" />
      <input v-model="form.contactPerson" type="text" placeholder="Contact Person" class="border rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white" />
      <input v-model="form.email" type="email" placeholder="Email" class="border rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white" />
      <input v-model="form.phoneNumber" type="text" placeholder="Phone Number" class="border rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white" />
      <input v-model="form.address" type="text" placeholder="Address" class="border rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white" />
      <input v-model="form.taxId" type="text" placeholder="Tax ID" class="border rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white" />
      <input v-model="form.note" type="text" placeholder="Note" class="border rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white" />
      <label class="flex items-center gap-2 col-span-2">
        <input type="checkbox" v-model="form.active" class="h-4 w-4" />
        <span class="text-gray-700 dark:text-gray-300">Active</span>
      </label>
    </form>

    <div class="mt-6 flex justify-end gap-2">
      <button type="button" @click="$emit('close')" class="px-4 py-2 rounded-lg border dark:border-gray-700 dark:text-gray-400">Cancel</button>
      <button type="submit" form="create-supplier-form" class="px-4 py-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50" :disabled="loading">
        {{ loading ? 'Saving...' : 'Save' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'created'): void
}>()

interface SupplierPayload {
  name: string
  code: string
  contactPerson: string
  email: string
  address: string
  phoneNumber: string
  taxId: string
  note?: string
  active: boolean
}

const baseURL = import.meta.env.VITE_BASE_URL
const token = localStorage.getItem('auth_token') || ''

const loading = ref(false)
const errorMessage = ref('')

const form = ref<SupplierPayload>({
  name: '',
  code: '',
  contactPerson: '',
  email: '',
  address: '',
  phoneNumber: '',
  taxId: '',
  note: '',
  active: true,
})

function validate(s: SupplierPayload) {
  if (!s.name.trim()) return 'Name is required'
  if (!s.code.trim()) return 'Code is required'
  if (!s.email.trim()) return 'Email is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email)) return 'Invalid email format'
  if (!s.phoneNumber.trim()) return 'Phone number is required'
  if (!/^\d{9,11}$/.test(s.phoneNumber)) return 'Phone number must be 9-11 digits'
  return null
}

async function submit() {
  errorMessage.value = ''
  const v = validate(form.value)
  if (v) {
    errorMessage.value = v
    return
  }

  loading.value = true
  try {
    const res = await fetch(`${baseURL}/scmlink/suppliers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form.value),
    })

    const data = await res.json()

    if (!res.ok || data.code !== 1000) {
      errorMessage.value = data.message || 'Failed to create supplier'
      return
    }

    // ✅ THÀNH CÔNG
    emit('created')
    emit('close')
  } catch (e) {
    console.error(e)
    errorMessage.value = 'Network error. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
