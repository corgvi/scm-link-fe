<template>
  <!-- Alert -->
  <Alert
    v-if="alert.show"
    :variant="alert.type"
    :title="alert.title"
    :message="alert.message"
    :duration="3000"
  />

  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6">
      <!-- Breadcrumb -->
      <div>
        <div class="flex flex-wrap items-center justify-between gap-3 pb-6">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white/90">
            Edit User: {{ form.username }}
          </h2>
          <nav>
            <ol class="flex items-center gap-1.5">
              <li>
                <router-link
                  class="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
                  to="/admin/users"
                >
                  Home
                  <svg
                    class="stroke-current"
                    width="17"
                    height="16"
                    fill="none"
                    viewBox="0 0 17 16"
                  >
                    <path
                      d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                      stroke-width="1.2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </router-link>
              </li>
              <li class="text-sm text-gray-800 dark:text-white/90">Edit User</li>
            </ol>
          </nav>
        </div>
      </div>

      <!-- Content -->
      <div class="space-y-6">
        <form @submit.prevent="updateUser">
          <div
            class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
          >
            <div class="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
              <h2 class="text-lg font-medium text-gray-800 dark:text-white">User Information</h2>
            </div>
            <div class="p-4 sm:p-6">
              <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label
                    for="username"
                    class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                    >Username</label
                  >
                  <input
                    v-model="form.username"
                    id="username"
                    disabled
                    class="h-11 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                  />
                </div>
                <div>
                  <label
                    for="fullName"
                    class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                    >Full Name</label
                  >
                  <input
                    v-model="form.fullName"
                    id="fullName"
                    class="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                    :class="{'border-red-500': errors.fullName}"
                  />
                  <span v-if="errors.fullName" class="text-xs text-red-500">{{ errors.fullName }}</span>
                </div>
                <div>
                  <label
                    for="email"
                    class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                    >Email</label
                  >
                  <input
                    v-model="form.email"
                    type="email"
                    id="email"
                    class="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                    :class="{'border-red-500': errors.email}"
                  />
                  <span v-if="errors.email" class="text-xs text-red-500">{{ errors.email }}</span>
                </div>
                <div>
                  <label
                    for="phoneNumber"
                    class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                    >Phone Number</label
                  >
                  <input
                    v-model="form.phoneNumber"
                    id="phoneNumber"
                    class="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                    :class="{'border-red-500': errors.phoneNumber}"
                  />
                  <span v-if="errors.phoneNumber" class="text-xs text-red-500">{{ errors.phoneNumber }}</span>
                </div>
                <div>
                  <label
                    for="address"
                    class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                    >Address</label
                  >
                  <input
                    v-model="form.address"
                    id="address"
                    class="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                  />
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                    >Date of Birth</label
                  >
                  <input
                    v-model="form.dob"
                    type="date"
                    class="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                  />
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Roles
                  </label>
                  <div class="flex flex-col gap-2">
                    <label
                      v-for="role in allRoles"
                      :key="role.name"
                      class="text-sm flex items-center gap-2"
                    >
                      <input type="checkbox" :value="role.name" v-model="form.roles" />
                      <span>{{ role.name }}</span>
                      <span class="text-xs text-gray-400 ml-2">{{ role.description }}</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label
                    for="isActive"
                    class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                    >Active</label
                  >
                  <select
                    v-model="form.isActive"
                    id="isActive"
                    class="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                  >
                    <option :value="true">Active</option>
                    <option :value="false">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Avatar Upload -->
          <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] mt-6">
            <div class="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
              <h2 class="text-lg font-medium text-gray-800 dark:text-white">Avatar Upload</h2>
            </div>
            <div class="p-4 sm:p-6">
              <label
                for="avatar"
                class="group hover:border-brand-500 block cursor-pointer rounded-lg border-2 border-dashed border-gray-300 transition dark:border-gray-800"
              >
                <div class="flex justify-center p-10">
                  <div class="flex max-w-[260px] flex-col items-center gap-4">
                    <div
                      class="inline-flex h-13 w-13 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition dark:border-gray-800 dark:text-gray-400"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
                        <path
                          d="M20 16V18.5C20 19.328 19.328 20 18.5 20H5.5C4.672 20 4 19.328 4 18.5V16M12 4V16M7.375 8.625L12 4l4.625 4.625"
                          stroke="currentColor"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                    <p class="text-center text-sm text-gray-500 dark:text-gray-400">
                      <span class="font-medium text-gray-800 dark:text-white/90"
                        >Click to upload</span
                      >
                      or drag and drop image
                    </p>
                  </div>
                </div>
                <input type="file" id="avatar" class="hidden" @change="handleAvatarUpload" />
              </label>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col gap-3 sm:flex-row sm:justify-end mt-6">
            <button
              type="button"
              class="shadow-theme-xs inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-medium text-gray-700 ring-1 ring-gray-300 transition hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03]"
              @click="router.push('/admin/users')"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading || !isFormValid"
              class="bg-brand-500 shadow-theme-xs hover:bg-brand-600 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition"
            >
              <span
                v-if="loading"
                class="animate-spin mr-2 w-4 h-4 border-2 border-t-transparent border-white rounded-full inline-block"
              ></span>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import Alert from '@/components/ui/Alert.vue'

const route = useRoute()
const router = useRouter()
const baseURL = import.meta.env.VITE_BASE_URL
const token = localStorage.getItem('auth_token') || ''

const loading = ref(false)
const alert = reactive({
  show: false,
  type: 'success',
  title: '',
  message: '',
})

const form = reactive({
  username: '',
  fullName: '',
  email: '',
  phoneNumber: '',
  address: '',
  isActive: true,
  dob: '',
  roles: [] as string[],
  avatar: null as File | null,
})

const allRoles = ref<{ name: string; description: string }[]>([])

const errors = reactive({
  fullName: '',
  email: '',
  phoneNumber: '',
})

const isFormValid = computed(() => {
  errors.fullName = form.fullName ? '' : 'Full name is required'
  errors.email = form.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? '' : 'Valid email is required'
  errors.phoneNumber = form.phoneNumber ? '' : 'Phone number is required'
  return !errors.fullName && !errors.email && !errors.phoneNumber
})

async function fetchRoles() {
  const res = await fetch(`${baseURL}/scmlink/roles`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json()
  if (data.code === 1000) {
    allRoles.value = data.result
  }
}

async function fetchUser() {
  const userId = route.params.userId || route.params.username
  if (!userId) {
    alert.show = true
    alert.type = 'error'
    alert.title = 'Error'
    alert.message = 'No user provided.'
    return
  }
  const res = await fetch(`${baseURL}/scmlink/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json()
  if (data.code === 1000) {
    Object.assign(form, data.result)
    form.roles = (data.result.roles || []).map((r: any) => r.name)
  }
}

onMounted(async () => {
  await fetchRoles()
  await fetchUser()
})

async function updateUser() {
  if (!isFormValid.value) return
  loading.value = true
  try {
    const res = await fetch(`${baseURL}/scmlink/users/${form.username}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: form.email,
        fullName: form.fullName,
        phoneNumber: form.phoneNumber,
        dob: form.dob,
        address: form.address,
        isActive: form.isActive,
        roles: form.roles,
      }),
    })

    const data = await res.json()
    if (res.ok && data.code === 1000) {
      alert.show = true
      alert.type = 'success'
      alert.title = 'Success'
      alert.message = 'User updated successfully.'
      setTimeout(() => {
        router.push('/admin/users')
      }, 1200)
    } else {
      alert.show = true
      alert.type = 'error'
      alert.title = 'Error'
      alert.message = data.message || 'Failed to update user.'
    }
  } catch {
    alert.show = true
    alert.type = 'error'
    alert.title = 'Error'
    alert.message = 'Error updating user.'
  } finally {
    loading.value = false
  }
}

function handleAvatarUpload(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (files && files[0]) {
    form.avatar = files[0]
  }
}
</script>
