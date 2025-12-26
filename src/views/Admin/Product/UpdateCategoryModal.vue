<template>
  <div class="no-scrollbar relative w-full max-w-[720px] overflow-y-auto rounded-3xl bg-white p-6 dark:bg-gray-900">
    <button @click="$emit('close')" class="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-gray-700">✕</button>

    <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">Edit Category</h3>
    <p class="mb-6 text-sm text-gray-500 dark:text-gray-400">Update the details of the category below.</p>

    <form @submit.prevent="submit" class="grid grid-cols-1 gap-4">
      <div>
        <input v-model="form.name" type="text" placeholder="Name" class="w-full rounded-lg border px-4 py-3 dark:bg-gray-800 dark:text-white" />
        <p v-if="errors.name" class="text-xs text-red-500 mt-1">{{ errors.name }}</p>
      </div>
      <div>
        <input v-model="form.code" type="text" placeholder="Code" class="w-full rounded-lg border px-4 py-3 dark:bg-gray-800 dark:text-white" />
        <p v-if="errors.code" class="text-xs text-red-500 mt-1">{{ errors.code }}</p>
      </div>
      <div>
        <input v-model="form.description" type="text" placeholder="Description" class="w-full rounded-lg border px-4 py-3 dark:bg-gray-800 dark:text-white" />
      </div>

      <div class="flex justify-end gap-2 mt-4">
        <button type="button" @click="$emit('close')" class="px-4 py-2 rounded-lg border">Cancel</button>
        <button type="submit" class="px-6 py-2 rounded-lg bg-brand-500 text-white" :disabled="loading">
          <span v-if="loading" class="animate-spin inline-block mr-2 w-4 h-4 border-2 border-t-transparent rounded-full"></span>
          Save
        </button>
      </div>

      <Alert
        v-if="alert.show"
        :variant="alert.type"
        :title="alert.title"
        :message="alert.message"
        :duration="3000"
      />
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
const props = defineProps<{ category: any | null }>()
const emit = defineEmits(['close', 'updated'])
const baseURL = import.meta.env.VITE_BASE_URL
const token = localStorage.getItem('auth_token') || ''

import Alert from '@/components/ui/Alert.vue'
import { reactive } from 'vue'
const loading = ref(false)
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
const form = ref({ id: '', name: '', code: '', description: '' })
const errors = ref({ name: '', code: '' })

watch(
  () => props.category,
  (c) => {
    if (c) {
      form.value = { id: c.id, name: c.name || '', code: c.code || '', description: c.description || '' }
      errors.value = { name: '', code: '' }
    }
  },
  { immediate: true },
)

function validate() {
  errors.value.name = form.value.name ? '' : 'Name is required'
  errors.value.code = form.value.code ? '' : 'Code is required'
  return !errors.value.name && !errors.value.code
}

async function submit() {
  if (!validate()) return
  loading.value = true
  try {
    const res = await fetch(`${baseURL}/scmlink/categories/${form.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: form.value.name, code: form.value.code, description: form.value.description }),
    })
    const data = await res.json()
    if (res.ok && data.code === 1000) {
      alertState('success', 'Success', 'Category updated successfully.')
      setTimeout(() => {
        emit('updated')
        emit('close')
      }, 900)
    } else {
      alertState('error', 'Error', data.message || 'Failed to update category')
    }
  } catch (e) {
    alertState('error', 'Error', 'Network error. Please try again.')
  } finally {
    loading.value = false
  }
}
</script>