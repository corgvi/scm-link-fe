<template>
  <!--  Alert -->
  <Alert
    v-if="alert.show"
    :variant="alert.type"
    :title="alert.title"
    :message="alert.message"
    :duration="3000"
  />
  <AdminLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6">
      <!-- Breadcrumb Start -->
      <div>
        <div class="flex flex-wrap items-center justify-between gap-3 pb-6">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white/90">Create User</h2>
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
                    viewBox="0 0 17 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                      stroke=""
                      stroke-width="1.2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                </router-link>
              </li>
              <li class="text-sm text-gray-800 dark:text-white/90">Create User</li>
            </ol>
          </nav>
        </div>
      </div>
      <!-- Breadcrumb End -->

      <!-- Content Start -->
      <div class="space-y-6">
        <div
          class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
        >
          <div class="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
            <h2 class="text-lg font-medium text-gray-800 dark:text-white">User Information</h2>
          </div>
          <div class="p-4 sm:p-6 dark:border-gray-800">
            <form @submit.prevent="handleSubmit">
              <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label
                    for="username"
                    class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                    >Username</label
                  >
                  <input
                    v-model="form.username"
                    type="text"
                    id="username"
                    class="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                    placeholder="Enter username"
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
                    type="text"
                    id="fullName"
                    class="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                    placeholder="Enter full name"
                  />
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
                    class="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                    placeholder="Enter email"
                  />
                </div>
                <div>
                  <label
                    for="phoneNumber"
                    class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                    >Phone Number</label
                  >
                  <input
                    v-model="form.phoneNumber"
                    type="text"
                    id="phoneNumber"
                    class="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label
                    for="address"
                    class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                    >Address</label
                  >
                  <input
                    v-model="form.address"
                    type="text"
                    id="address"
                    class="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                    placeholder="Enter address"
                  />
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                    >Date of Birth</label
                  >
                  <div class="relative">
                    <flat-pickr
                      v-model="form.dob"
                      :config="{
                        dateFormat: 'Y-m-d',
                        defaultDate: new Date(),
                        onChange: (selectedDates, dateStr) => {
                          form.dob = dateStr // luôn set string yyyy-mm-dd
                        },
                      }"
                      placeholder="Select date"
                      class="dark:bg-dark-900 datepickerTwo shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 pl-4 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 flatpickr-input"
                    />
                    <span
                      class="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                    >
                      <svg
                        class="fill-current"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M6.66659 1.5415C7.0808 1.5415 7.41658 1.87729 7.41658 2.2915V2.99984H12.5833V2.2915C12.5833 1.87729 12.919 1.5415 13.3333 1.5415C13.7475 1.5415 14.0833 1.87729 14.0833 2.2915V2.99984L15.4166 2.99984C16.5212 2.99984 17.4166 3.89527 17.4166 4.99984V7.49984V15.8332C17.4166 16.9377 16.5212 17.8332 15.4166 17.8332H4.58325C3.47868 17.8332 2.58325 16.9377 2.58325 15.8332V7.49984V4.99984C2.58325 3.89527 3.47868 2.99984 4.58325 2.99984L5.91659 2.99984V2.2915C5.91659 1.87729 6.25237 1.5415 6.66659 1.5415ZM6.66659 4.49984H4.58325C4.30711 4.49984 4.08325 4.7237 4.08325 4.99984V6.74984H15.9166V4.99984C15.9166 4.7237 15.6927 4.49984 15.4166 4.49984H13.3333H6.66659ZM15.9166 8.24984H4.08325V15.8332C4.08325 16.1093 4.30711 16.3332 4.58325 16.3332H15.4166C15.6927 16.3332 15.9166 16.1093 15.9166 15.8332V8.24984Z"
                          fill=""
                        ></path>
                      </svg>
                    </span>
                  </div>
                </div>
                <div>
                  <label
                    for="role"
                    class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                    >Role</label
                  >
                  <div>
                  <input value="USER" id="username" disabled
                    class="h-11 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"/>
                </div>
                </div>
                <div>
                  <label
                    for="isActive"
                    class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                    >Active</label
                  >
                  <input value="TRUE" id="username" disabled
                    class="h-11 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"/>
                </div>
                <div class="col-span-full">
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                    >Description</label
                  >
                  <textarea
                    v-model="form.description"
                    placeholder="Description (optional)"
                    rows="4"
                    class="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 w-full resize-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                  ></textarea>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div
          class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
        >
          <div class="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
            <h2 class="text-lg font-medium text-gray-800 dark:text-white">Avatar Upload</h2>
          </div>
          <div class="p-4 sm:p-6">
            <label
              for="avatar"
              class="shadow-theme-xs group hover:border-brand-500 block cursor-pointer rounded-lg border-2 border-dashed border-gray-300 transition dark:border-gray-800"
            >
              <div class="flex justify-center p-10">
                <div class="flex max-w-[260px] flex-col items-center gap-4">
                  <div
                    class="inline-flex h-13 w-13 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition dark:border-gray-800 dark:text-gray-400"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M20.0004 16V18.5C20.0004 19.3284 19.3288 20 18.5004 20H5.49951C4.67108 20 3.99951 19.3284 3.99951 18.5V16M12.0015 4L12.0015 16M7.37454 8.6246L11.9994 4.00269L16.6245 8.6246"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                  </div>
                  <p class="text-center text-sm text-gray-500 dark:text-gray-400">
                    <span class="font-medium text-gray-800 dark:text-white/90"
                      >Click to upload</span
                    >
                    or drag and drop SVG, PNG, JPG or GIF (MAX. 800x400px)
                  </p>
                </div>
              </div>
              <input type="file" id="avatar" class="hidden" @change="handleAvatarUpload" />
            </label>
          </div>
        </div>
        <!-- Button -->
        <div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
           <button
              type="button"
              class="shadow-theme-xs inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-medium text-gray-700 ring-1 ring-gray-300 transition hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03]"
              @click="router.push('/admin/users')"
            >
              Cancel
            </button>
          <button
            type="submit"
            class="bg-brand-500 shadow-theme-xs hover:bg-brand-600 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition"
            @click="handleSubmit"
          >
            Save User
          </button>
        </div>
      </div>
      <!-- Content End -->
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import FlatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Alert from '@/components/ui/Alert.vue'

const router = useRouter()
const baseURL = import.meta.env.VITE_BASE_URL

const form = ref({
  username: '',
  fullName: '',
  email: '',
  phoneNumber: '',
  address: '',
  dob: '',
  role: '',
  isActive: 'true',
  description: '',
  avatar: null,
})

const alert = ref({
  show: false,
  type: 'success',
  title: '',
  message: '',
})

function handleSubmit() {
  const payload = {
    username: form.value.username,
    password: 'abc123456', // You may want to add a password field to your form
    fullName: form.value.fullName,
    phoneNumber: form.value.phoneNumber,
    address: form.value.address,
    email: form.value.email,
    dob: form.value.dob,
    roles: [form.value.role || 'User'],
    isActive: form.value.isActive === 'true',
  }

  fetch(`${baseURL}/scmlink/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.code === 1000) {
        alert.value = {
          show: true,
          type: 'success',
          title: 'Success',
          message: 'User created successfully!',
        }
        setTimeout(() => {
          alert.value.show = false
          alert.value.title = ''
          alert.value.message = ''
          router.push('/admin/users')
        }, 1500)
      } else {
        alert.value = {
          show: true,
          type: 'error',
          title: 'Error',
          message: data.message || 'Failed to create user.',
        }
        setTimeout(() => {
          alert.value.show = false
          alert.value.title = ''
          alert.value.message = ''
        }, 3000)
      }
    })
    .catch(() => {
      alert.value = {
        show: true,
        type: 'error',
        title: 'Error',
        message: 'Failed to create user.',
      }
      setTimeout(() => {
        alert.value.show = false
        alert.value.title = ''
        alert.value.message = ''
      }, 3000)
    })
}
function handleAvatarUpload(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (files && files[0]) {
    form.value.avatar = files[0]
  }
}
</script>
