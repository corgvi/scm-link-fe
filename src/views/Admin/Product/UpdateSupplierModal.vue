<template>
  <div class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
    <button @click="$emit('close')" class="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:text-gray-300">✕</button>

    <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">Edit Supplier</h3>
    <p class="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">Update supplier information below.</p>

    <div v-if="errorMessage" class="mb-4 rounded-lg bg-red-100 text-red-700 px-4 py-2">{{ errorMessage }}</div>
    <div v-if="successMessage" class="mb-4 rounded-lg bg-green-100 text-green-700 px-4 py-2">{{ successMessage }}</div>

    <form id="edit-supplier-form" @submit.prevent="submit" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
      <button type="submit" form="edit-supplier-form" class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50" :disabled="loading">
        {{ loading ? 'Saving...' : 'Save Changes' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, toRefs } from 'vue'
const props = defineProps<{ supplier: any | null }>()
const emit = defineEmits(['close','updated'])
const baseURL = import.meta.env.VITE_BASE_URL
const token = localStorage.getItem('auth_token') || ''

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const form = ref({
  id: '',
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

watch(() => props.supplier, (s) => {
  if (s) {
    form.value = {
      id: s.id,
      name: s.name || '',
      code: s.code || '',
      contactPerson: s.contactPerson || '',
      email: s.email || '',
      address: s.address || '',
      phoneNumber: s.phoneNumber || '',
      taxId: s.taxId || '',
      note: s.note || '',
      active: !!s.active,
    }
  }
}, { immediate: true })

function validate(s: any) {
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
  successMessage.value = ''
  const v = validate(form.value)
  if (v) {
    errorMessage.value = v
    return
  }
  loading.value = true
  try {
    const res = await fetch(`${baseURL}/scmlink/suppliers/${form.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form.value),
    })
    const data = await res.json()
    if (res.ok && data.code === 1000) {
      successMessage.value = 'Supplier updated successfully.'
      emit('updated')
      emit('close')
    } else {
      errorMessage.value = data.message || 'Failed to update supplier'
    }
  } catch (e) {
    errorMessage.value = 'Network error. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>