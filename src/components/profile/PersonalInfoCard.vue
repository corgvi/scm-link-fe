<template>
  <div >
    <div class="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm dark:bg-gray-900 dark:border-gray-800">
      <h4 class="mb-6 text-xl font-semibold text-gray-800 dark:text-white/90">
        Personal Information
      </h4>

      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <!-- Full Name -->
        <div class="p-4 border-b border-gray-100 dark:border-gray-700 sm:border-0">
          <p class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Full Name</p>
          <p class="mt-1 text-base font-semibold text-gray-900 dark:text-white">{{ fullName }}</p>
        </div>

        <!-- Username -->
        <div class="p-4 border-b border-gray-100 dark:border-gray-700 sm:border-0">
          <p class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Username</p>
          <p class="mt-1 text-base font-semibold text-gray-900 dark:text-white">{{ username }}</p>
        </div>

        <!-- Email -->
        <div class="p-4 border-b border-gray-100 dark:border-gray-700 sm:border-0">
          <p class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Email</p>
          <p class="mt-1 text-base font-semibold text-gray-900 dark:text-white">{{ email }}</p>
        </div>

        <!-- Phone -->
        <div class="p-4 border-b border-gray-100 dark:border-gray-700 sm:border-0">
          <p class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Phone</p>
          <p class="mt-1 text-base font-semibold text-gray-900 dark:text-white">{{ phoneNumber }}</p>
        </div>

        <!-- Roles -->
        <div class="p-4 border-b border-gray-100 dark:border-gray-700 sm:border-0">
          <p class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Roles</p>
          <p class="mt-1 text-base font-semibold text-blue-600 dark:text-blue-400">
            {{ Array.isArray(roles) ? roles.join(', ') : '' }}
          </p>
        </div>

        <!-- Address -->
        <div class="p-4">
          <p class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Address</p>
          <p class="mt-1 text-base font-semibold text-gray-900 dark:text-white">{{ address }}</p>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'

const email = ref('')
const username = ref('')
const fullName = ref('')
const phoneNumber = ref('')
const dob = ref('')
const address = ref('')
const roles = ref([])

// Load user info from localStorage on mount
onMounted(() => {
  const stored = localStorage.getItem('user_info')
  if (stored) {
    const info = JSON.parse(stored)
    email.value = info.email || ''
    fullName.value = info.fullName || ''
    phoneNumber.value = info.phoneNumber || ''
    dob.value = info.dob || ''
    address.value = info.address || ''
    username.value = info.username || ''
      roles.value = Array.isArray(info.roles)
      ? info.roles.map((r) => (typeof r === 'string' ? r : r.name))
      : []
  }
})
</script>
