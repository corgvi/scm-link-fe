<template>
  <AdminLayout>
    <PageBreadcrumb pageTitle="User Management" />
    <div class="mb-6 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h2 class="font-semibold text-gray-800 dark:text-white/90">
            Overview
          </h2>
        </div>
        <div>
            <button @click="$router.push('/admin/create-user')" class="bg-brand-500 shadow-theme-xs hover:bg-brand-600 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 10.0002H15.0006M10.0002 5V15.0006" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
              Create an User
            </button>
        </div>
      </div>
      <div class="grid grid-cols-1 rounded-xl border border-gray-200 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-y-0 dark:divide-gray-800 dark:border-gray-800">
        <div class="border-b p-5 sm:border-r lg:border-b-0">
          <p class="mb-1.5 text-sm text-gray-400 dark:text-gray-500">
            Overdue
          </p>
          <h3 class="text-3xl text-gray-800 dark:text-white/90">
            $120.80
          </h3>
        </div>
        <div class="border-b p-5 lg:border-b-0">
          <p class="mb-1.5 text-sm text-gray-400 dark:text-gray-500">
            Due within next 30 days
          </p>
          <h3 class="text-3xl text-gray-800 dark:text-white/90">
            0.00
          </h3>
        </div>
        <div class="border-b p-5 sm:border-r sm:border-b-0">
          <p class="mb-1.5 text-sm text-gray-400 dark:text-gray-500">
            Average time to get paid
          </p>
          <h3 class="text-3xl text-gray-800 dark:text-white/90">
            24 days
          </h3>
        </div>
        <div class="p-5">
          <p class="mb-1.5 text-sm text-gray-400 dark:text-gray-500">
            Upcoming Payout
          </p>
          <h3 class="text-3xl text-gray-800 dark:text-white/90">
            $3,450.50
          </h3>
        </div>
      </div>
    </div>
    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-md">
      <div class="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
        <div>
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Users</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">Manage your users below</p>
        </div>
        <div class="flex gap-3.5">
          <div class="hidden h-11 items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 lg:inline-flex dark:bg-gray-900">
            <button @click="filterStatus = 'All'; currentPage = 1" :class="filterStatus === 'All' ? 'shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800' : 'text-gray-500 dark:text-gray-400'" class="text-theme-sm h-10 rounded-md px-3 py-2 font-medium hover:text-gray-900 dark:hover:text-white transition duration-150">
              All Users
            </button>
            <button @click="filterStatus = 'Active'; currentPage = 1" :class="filterStatus === 'Active' ? 'shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800' : 'text-gray-500 dark:text-gray-400'" class="text-theme-sm h-10 rounded-md px-3 py-2 font-medium hover:text-gray-900 dark:hover:text-white transition duration-150">
              Active
            </button>
            <button @click="filterStatus = 'Inactive'; currentPage = 1" :class="filterStatus === 'Inactive' ? 'shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800' : 'text-gray-500 dark:text-gray-400'" class="text-theme-sm h-10 rounded-md px-3 py-2 font-medium hover:text-gray-900 dark:hover:text-white transition duration-150">
              Inactive
            </button>
          </div>
          <div class="hidden flex-col gap-3 sm:flex sm:flex-row sm:items-center">
            <div class="relative">
              <span class="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M3.04199 9.37363C3.04199 5.87693 5.87735 3.04199 9.37533 3.04199C12.8733 3.04199 15.7087 5.87693 15.7087 9.37363C15.7087 12.8703 12.8733 15.7053 9.37533 15.7053C5.87735 15.7053 3.04199 12.8703 3.04199 9.37363ZM9.37533 1.54199C5.04926 1.54199 1.54199 5.04817 1.54199 9.37363C1.54199 13.6991 5.04926 17.2053 9.37533 17.2053C11.2676 17.2053 13.0032 16.5344 14.3572 15.4176L17.1773 18.238C17.4702 18.5309 17.945 18.5309 18.2379 18.238C18.5308 17.9451 18.5309 17.4703 18.238 17.1773L15.4182 14.3573C16.5367 13.0033 17.2087 11.2669 17.2087 9.37363C17.2087 5.04817 13.7014 1.54199 9.37533 1.54199Z" fill=""></path>
                </svg>
              </span>
              <input v-model="searchQuery" type="text" placeholder="Search users..." class="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pr-4 pl-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden xl:w-[300px] dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 transition duration-150">
            </div>
            <button class="shadow-theme-xs flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-[11px] text-sm font-medium text-gray-700 sm:w-auto dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 transition duration-150">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M16.6671 13.3333V15.4166C16.6671 16.1069 16.1074 16.6666 15.4171 16.6666H4.58301C3.89265 16.6666 3.33301 16.1069 3.33301 15.4166V13.3333M10.0013 3.33325L10.0013 13.3333M6.14553 7.18708L9.99958 3.33549L13.8539 7.18708" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
              Export
            </button>
          </div>
        </div>
      </div>
      <!-- Loading/Error/Empty State -->
      <div v-if="loading" class="p-8 text-center text-gray-400">
        <span
          class="animate-spin mr-2 w-6 h-6 border-2 border-t-transparent border-gray-400 rounded-full inline-block"
        ></span>
        Loading categories...
      </div>
      <div v-else-if="error" class="p-8 text-center text-red-500">
        {{ error }}
      </div>
      <div v-else>
      <div class="custom-scrollbar overflow-x-auto">
        <table class="w-full table-auto">
          <thead>
            <tr class="border-b border-gray-200 dark:divide-gray-800 dark:border-gray-800">
              <th class="p-4 whitespace-nowrap">
                <div class="flex w-full cursor-pointer items-center justify-between">
                  <div class="flex items-center gap-3">
                    <label class="flex cursor-pointer items-center text-sm font-medium text-gray-700 select-none dark:text-gray-400">
                      <span class="relative">
                        <input type="checkbox" class="sr-only" @change="toggleSelectAll" :checked="isAllSelected">
                        <span :class="isAllSelected ? 'border-brand-500 bg-brand-500' : 'bg-transparent border-gray-300 dark:border-gray-700'" class="flex h-4 w-4 items-center justify-center rounded-sm border-[1.25px] bg-transparent border-gray-300 dark:border-gray-700">
                          <span :class="isAllSelected ? '' : 'opacity-0'" class="opacity-0">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path d="M10 3L4.5 8.5L2 6" stroke="white" stroke-width="1.6666" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                          </span>
                        </span>
                      </span>
                    </label>
                    <p class="text-theme-xs font-medium text-gray-700 dark:text-gray-400">Username</p>
                  </div>
                </div>
              </th>
              <th class="cursor-pointer p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400">Full Name</th>
              <th class="cursor-pointer p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400">Email</th>
              <th class="cursor-pointer p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400">Phone</th>
              <th class="cursor-pointer p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400">Address</th>
              <th class="cursor-pointer p-4 text-center text-xs font-medium text-gray-700 dark:text-gray-400">Active</th>
              <th class="cursor-pointer p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400">DOB</th>
              <th class="cursor-pointer p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400">Roles</th>
              <th class="p-4 text-center text-xs font-medium text-gray-700 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-x divide-y divide-gray-200 dark:divide-gray-800">
            <tr v-for="user in paginatedUsers" :key="user.id" class="transition hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer" @click="$router.push(`/admin/edit-user/${user.id}`)">
              <td class="p-4 whitespace-nowrap">
                <div class="group flex items-center gap-3">
                  <label class="flex cursor-pointer items-center text-sm font-medium text-gray-700 select-none dark:text-gray-400">
                    <span class="relative">
                      <input type="checkbox" class="sr-only" :checked="selected.includes(user.id)" @change="toggleRow(user.id)">
                      <span :class="selected.includes(user.id) ? 'border-brand-500 bg-brand-500' : 'bg-transparent border-gray-300 dark:border-gray-700'" class="flex h-4 w-4 items-center justify-center rounded-sm border-[1.25px] bg-transparent border-gray-300 dark:border-gray-700">
                        <span :class="selected.includes(user.id) ? '' : 'opacity-0'" class="opacity-0">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M10 3L4.5 8.5L2 6" stroke="white" stroke-width="1.6666" stroke-linecap="round" stroke-linejoin="round"></path>
                          </svg>
                        </span>
                      </span>
                    </span>
                  </label>
                  <p class="text-theme-sm font-medium text-gray-700 group-hover:underline dark:text-gray-200">{{ user.username }}</p>
                </div>
              </td>
              <td class="text-theme-sm p-4 whitespace-nowrap dark:text-gray-200">{{ user.fullName }}</td>
              <td class="text-theme-sm p-4 whitespace-nowrap dark:text-gray-200">{{ user.email }}</td>
              <td class="text-theme-sm p-4 whitespace-nowrap dark:text-gray-200">{{ user.phoneNumber }}</td>
              <td class="text-theme-sm p-4 whitespace-nowrap dark:text-gray-200">{{ user.address }}</td>
              <td class="p-4 whitespace-nowrap text-center">
                <span :class="user.isActive ? 'bg-success-50 dark:bg-success-500/15 text-success-700 dark:text-success-500' : 'bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500'" class="text-theme-xs rounded-full px-2 py-0.5 font-medium">{{ user.isActive ? 'Active' : 'Inactive' }}</span>
              </td>
              <td class="text-theme-sm p-4 whitespace-nowrap dark:text-gray-200">{{ user.dob || '-' }}</td>
              <td class="p-4 whitespace-nowrap">
                <span v-for="role in user.roles" :key="role.name" class="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium mr-1">{{ role.name }}</span>
              </td>
              <td class="p-4 flex justify-center gap-2">
                <button
    @click="$router.push(`/admin/edit-user/${user.id}`)"
    class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
  >
  
    <img src="/images/icons/edit.svg" alt="Edit" class="w-4 h-4"/>
    Edit
  </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      </div>
      <div class="flex flex-col items-center justify-between border-t border-gray-200 px-5 py-4 sm:flex-row dark:border-gray-800">
        <div class="pb-3 sm:pb-0">
          <span class="block text-sm font-medium text-gray-500 dark:text-gray-400">
            Showing
            <span class="text-gray-800 dark:text-white/90">{{ (currentPage - 1) * itemsPerPage + (paginatedUsers.length ? 1 : 0) }}</span>
            to
            <span class="text-gray-800 dark:text-white/90">{{ (currentPage - 1) * itemsPerPage + paginatedUsers.length }}</span>
            of
            <span class="text-gray-800 dark:text-white/90">{{ filteredUsers.length }}</span>
          </span>
        </div>
        <div class="flex w-full items-center justify-between gap-2 rounded-lg bg-gray-50 p-4 sm:w-auto sm:justify-normal sm:bg-transparent sm:p-0 dark:bg-white/[0.03] dark:sm:bg-transparent">
          <button class="shadow-theme-xs flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 hover:text-gray-800 sm:p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200" @click="previousPage" :disabled="currentPage === 1" :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''">
            <span>
              <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M2.58203 9.99868C2.58174 10.1909 2.6549 10.3833 2.80152 10.53L7.79818 15.5301C8.09097 15.8231 8.56584 15.8233 8.85883 15.5305C9.15183 15.2377 9.152 14.7629 8.85921 14.4699L5.13911 10.7472L16.6665 10.7472C17.0807 10.7472 17.4165 10.4114 17.4165 9.99715C17.4165 9.58294 17.0807 9.24715 16.6665 9.24715L5.14456 9.24715L8.85919 5.53016C9.15199 5.23717 9.15184 4.7623 8.85885 4.4695C8.56587 4.1767 8.09099 4.17685 7.79819 4.46984L2.84069 9.43049C2.68224 9.568 2.58203 9.77087 2.58203 9.99715C2.58203 9.99766 2.58203 9.99817 2.58203 9.99868Z" fill=""></path>
              </svg>
            </span>
          </button>
          <span class="block text-sm font-medium text-gray-700 sm:hidden dark:text-gray-400">Page {{ currentPage }} of {{ totalPages }}</span>
          <ul class="hidden items-center gap-0.5 sm:flex">
            <li v-for="page in visiblePages" :key="page">
              <a href="#" @click.prevent="goToPage(page)" :class="page === currentPage ? 'bg-brand-500 text-white' : 'hover:bg-brand-500 text-gray-700 hover:text-white dark:text-gray-400 dark:hover:text-white'" class="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium" >{{ page }}</a>
            </li>
            <li v-if="visiblePages[visiblePages.length-1] < totalPages">
              <span class="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium text-gray-700 dark:text-gray-400">...</span>
            </li>
            <li v-if="visiblePages[visiblePages.length-1] < totalPages">
              <a href="#" @click.prevent="goToPage(totalPages)" class="hover:bg-brand-500 flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium text-gray-700 hover:text-white dark:text-gray-400 dark:hover:text-white">{{ totalPages }}</a>
            </li>
          </ul>
          <button class="shadow-theme-xs flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 hover:text-gray-800 sm:p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200" @click="nextPage" :disabled="currentPage === totalPages" :class="currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''">
            <span>
              <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M17.4165 9.9986C17.4168 10.1909 17.3437 10.3832 17.197 10.53L12.2004 15.5301C11.9076 15.8231 11.4327 15.8233 11.1397 15.5305C10.8467 15.2377 10.8465 14.7629 11.1393 14.4699L14.8594 10.7472L3.33203 10.7472C2.91782 10.7472 2.58203 10.4114 2.58203 9.99715C2.58203 9.58294 2.91782 9.24715 3.33203 9.24715L14.854 9.24715L11.1393 5.53016C10.8465 5.23717 10.8467 4.7623 11.1397 4.4695C11.4327 4.1767 11.9075 4.17685 12.2003 4.46984L17.1578 9.43049C17.3163 9.568 17.4165 9.77087 17.4165 9.99715C17.4165 9.99763 17.4165 9.99812 17.4165 9.9986Z" fill=""></path>
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
interface Role {
  name: string
  description: string
  permissions: unknown[]
}
interface User {
  id: string
  username: string
  fullName: string
  email: string
  phoneNumber: string
  address: string
  isActive: boolean
  dob: string | null
  roles: Role[]
  avatar?: string
}
const baseURL = import.meta.env.VITE_BASE_URL
const token = localStorage.getItem('auth_token') || ''
const users = ref<User[]>([])
const filterStatus = ref('All')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const searchQuery = ref('')
const selected = ref<string[]>([])
const isAllSelected = computed(() => paginatedUsers.value.length > 0 && paginatedUsers.value.every(u => selected.value.includes(u.id)))
const error = ref('')
const loading = ref(false)

async function fetchUsers() {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(`${baseURL}/scmlink/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await res.json()
    if (data.code === 1000) {
      users.value = data.result
    }
  } catch (e) {
    // handle error
    console.error(e)
    error.value = 'Network error. Please try again.'
  } finally {
    loading.value = false
  } 
}

onMounted(fetchUsers)

const filteredUsers = computed(() => {
  let list = users.value
  if (filterStatus.value === 'Active') list = list.filter(u => u.isActive)
  if (filterStatus.value === 'Inactive') list = list.filter(u => !u.isActive)
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(u =>
      u.username.toLowerCase().includes(q) ||
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    )
  }
  return list
})
const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage.value) || 1)
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredUsers.value.slice(start, start + itemsPerPage.value)
})
const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  let start = Math.max(1, currentPage.value - 1)
  let end = Math.min(total, start + 2)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})
function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page
}
function previousPage() {
  if (currentPage.value > 1) currentPage.value--
}
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}
function toggleRow(id: string) {
  if (selected.value.includes(id)) {
    selected.value = selected.value.filter(i => i !== id)
  } else {
    selected.value.push(id)
  }
}
function toggleSelectAll() {
  if (isAllSelected.value) {
    selected.value = selected.value.filter(id => !paginatedUsers.value.some(u => u.id === id))
  } else {
    selected.value = [...selected.value, ...paginatedUsers.value.map(u => u.id).filter(id => !selected.value.includes(id))]
  }
}
</script>
