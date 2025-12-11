<template>
  <AdminLayout>
    <PageBreadcrumb pageTitle="User Management" />
    <div
      class="mb-6 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h2 class="font-semibold text-gray-800 dark:text-white/90">Overview</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">Quick insights into your users</p>
        </div>
        <div>
          <button
            @click="$router.push('/admin/create-user')"
            class="bg-brand-500 shadow-theme-xs hover:bg-brand-600 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M5 10.0002H15.0006M10.0002 5V15.0006"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
            Create an User
          </button>
        </div>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div
          class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
        >
          <p class="text-gray-500 dark:text-gray-400">Total Users</p>
          <p class="text-3xl font-semibold text-gray-800 dark:text-white/90">{{ totalElements }}</p>
        </div>
        <div
          class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
        >
          <p class="text-gray-500 dark:text-gray-400">Active</p>
          <p class="text-3xl font-semibold text-green-600">{{ activeUsers }}</p>
        </div>
        <div
          class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
        >
          <p class="text-gray-500 dark:text-gray-400">Inactive</p>
          <p class="text-3xl font-semibold text-red-600">{{ inactiveUsers }}</p>
        </div>
        <div
          class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
        >
          <p class="text-gray-500 dark:text-gray-400">Roles</p>
          <p class="text-3xl font-semibold text-indigo-600">{{ totalRoles }}</p>
        </div>
      </div>
    </div>
    <div
      class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-md"
    >
      <div
        class="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800"
      >
        <div>
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Users</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">Manage your users below</p>
        </div>
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div class="flex w-full items-center gap-3">
            <div class="relative flex-1">
              <span
                class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-400"
              >
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M3.042 9.374a6.333 6.333 0 1112.667 0A6.333 6.333 0 013.042 9.374zm6.333-7.833a7.833 7.833 0 105.64 13.473l2.82 2.82a.75.75 0 001.06-1.06l-2.82-2.82A7.833 7.833 0 009.375 1.541z"
                    fill="currentColor"
                  />
                </svg>
              </span>

              <input
                v-model="filters.keyword"
                placeholder="Search username, email, phone..."
                class="h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-11 pr-10 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
              />

              <button
                v-if="filters.keyword"
                @click="filters.keyword = ''"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-400"
                aria-label="Clear search"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M11.5 2.5L2.5 11.5M2.5 2.5L11.5 11.5"
                    stroke="currentColor"
                    stroke-width="1.2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>

            <button
              @click="isFilterOpen = true"
              class="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
              title="Open filters"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M10 18h4M4 6h16M7 12h10"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Filter
            </button>

            <button
              class="shadow-theme-xs flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
              title="Export"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 3v12M8 7l4-4 4 4M21 21H3"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
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
                      <label
                        class="flex cursor-pointer items-center text-sm font-medium text-gray-700 select-none dark:text-gray-400"
                      >
                        <span class="relative">
                          <input
                            type="checkbox"
                            class="sr-only"
                            @change="toggleSelectAll"
                            :checked="isAllSelected"
                          />
                          <span
                            :class="
                              isAllSelected
                                ? 'border-brand-500 bg-brand-500'
                                : 'bg-transparent border-gray-300 dark:border-gray-700'
                            "
                            class="flex h-4 w-4 items-center justify-center rounded-sm border-[1.25px] bg-transparent border-gray-300 dark:border-gray-700"
                          >
                            <span :class="isAllSelected ? '' : 'opacity-0'" class="opacity-0">
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path
                                  d="M10 3L4.5 8.5L2 6"
                                  stroke="white"
                                  stroke-width="1.6666"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                ></path>
                              </svg>
                            </span>
                          </span>
                        </span>
                      </label>
                      <p class="text-theme-xs font-medium text-gray-700 dark:text-gray-400">
                        Username
                      </p>
                    </div>
                  </div>
                </th>
                <th
                  class="cursor-pointer p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400"
                >
                  Full Name
                </th>
                <th
                  class="cursor-pointer p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400"
                >
                  Email
                </th>
                <th
                  class="cursor-pointer p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400"
                >
                  Phone
                </th>
                <th
                  class="cursor-pointer p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400"
                >
                  Address
                </th>
                <th
                  class="cursor-pointer p-4 text-center text-xs font-medium text-gray-700 dark:text-gray-400"
                >
                  Active
                </th>
                <th
                  class="cursor-pointer p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400"
                >
                  DOB
                </th>
                <th
                  class="cursor-pointer p-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400"
                >
                  Roles
                </th>
                <th class="p-4 text-center text-xs font-medium text-gray-700 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-x divide-y divide-gray-200 dark:divide-gray-800">
              <tr
                v-for="user in users"
                :key="user.id"
                class="transition hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer"
                @click="$router.push(`/admin/edit-user/${user.id}`)"
              >
                <td class="p-4 whitespace-nowrap">
                  <div class="group flex items-center gap-3">
                    <label
                      class="flex cursor-pointer items-center text-sm font-medium text-gray-700 select-none dark:text-gray-400"
                    >
                      <span class="relative">
                        <input
                          type="checkbox"
                          class="sr-only"
                          :checked="selected.includes(user.id)"
                          @change="toggleRow(user.id)"
                        />
                        <span
                          :class="
                            selected.includes(user.id)
                              ? 'border-brand-500 bg-brand-500'
                              : 'bg-transparent border-gray-300 dark:border-gray-700'
                          "
                          class="flex h-4 w-4 items-center justify-center rounded-sm border-[1.25px] bg-transparent border-gray-300 dark:border-gray-700"
                        >
                          <span
                            :class="selected.includes(user.id) ? '' : 'opacity-0'"
                            class="opacity-0"
                          >
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path
                                d="M10 3L4.5 8.5L2 6"
                                stroke="white"
                                stroke-width="1.6666"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              ></path>
                            </svg>
                          </span>
                        </span>
                      </span>
                    </label>
                    <p
                      class="text-theme-sm font-medium text-gray-700 group-hover:underline dark:text-gray-200"
                    >
                      {{ user.username }}
                    </p>
                  </div>
                </td>
                <td class="text-theme-sm p-4 whitespace-nowrap dark:text-gray-200">
                  {{ user.fullName }}
                </td>
                <td class="text-theme-sm p-4 whitespace-nowrap dark:text-gray-200">
                  {{ user.email }}
                </td>
                <td class="text-theme-sm p-4 whitespace-nowrap dark:text-gray-200">
                  {{ user.phoneNumber }}
                </td>
                <td class="text-theme-sm p-4 whitespace-nowrap dark:text-gray-200">
                  {{ user.address }}
                </td>
                <td class="p-4 whitespace-nowrap text-center">
                  <span
                    :class="
                      user.isActive
                        ? 'bg-success-50 dark:bg-success-500/15 text-success-700 dark:text-success-500'
                        : 'bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500'
                    "
                    class="text-theme-xs rounded-full px-2 py-0.5 font-medium"
                    >{{ user.isActive ? 'Active' : 'Inactive' }}</span
                  >
                </td>
                <td class="text-theme-sm p-4 whitespace-nowrap dark:text-gray-200">
                  {{ user.dob || '-' }}
                </td>
                <td class="p-4 whitespace-nowrap">
                  <span
                    v-for="role in user.roles"
                    :key="role.name"
                    class="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium mr-1"
                    >{{ role.name }}</span
                  >
                </td>
                <td class="p-4 flex justify-center gap-2">
                  <ActionMainButton
                    text="Update"
                    type="update"
                    icon="edit"
                    @click="router.push(`/admin/edit-user/${user.id}`)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div
        class="flex flex-col items-center justify-between border-t border-gray-200 px-5 py-4 sm:flex-row dark:border-gray-800"
      >
        <div class="pb-3 sm:pb-0">
          <span class="block text-sm font-medium text-gray-500 dark:text-gray-400">
            Showing
            <span class="text-gray-800 dark:text-white/90">{{
              (currentPage - 1) * itemsPerPage + (users.length ? 1 : 0)
            }}</span>
            to
            <span class="text-gray-800 dark:text-white/90">{{
              (currentPage - 1) * itemsPerPage + users.length
            }}</span>
            of
            <span class="text-gray-800 dark:text-white/90">{{ totalElements }}</span>
          </span>
        </div>
        <div
          class="flex w-full items-center justify-between gap-2 rounded-lg bg-gray-50 p-4 sm:w-auto sm:justify-normal sm:bg-transparent sm:p-0 dark:bg-white/[0.03] dark:sm:bg-transparent"
        >
          <button
            class="shadow-theme-xs flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 hover:text-gray-800 sm:p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
            @click="previousPage"
            :disabled="currentPage === 1"
            :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''"
          >
            <span>
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
                  d="M2.58203 9.99868C2.58174 10.1909 2.6549 10.3833 2.80152 10.53L7.79818 15.5301C8.09097 15.8231 8.56584 15.8233 8.85883 15.5305C9.15183 15.2377 9.152 14.7629 8.85921 14.4699L5.13911 10.7472L16.6665 10.7472C17.0807 10.7472 17.4165 10.4114 17.4165 9.99715C17.4165 9.58294 17.0807 9.24715 16.6665 9.24715L5.14456 9.24715L8.85919 5.53016C9.15199 5.23717 9.15184 4.7623 8.85885 4.4695C8.56587 4.1767 8.09099 4.17685 7.79819 4.46984L2.84069 9.43049C2.68224 9.568 2.58203 9.77087 2.58203 9.99715C2.58203 9.99766 2.58203 9.99817 2.58203 9.99868Z"
                  fill=""
                ></path>
              </svg>
            </span>
          </button>
          <span class="block text-sm font-medium text-gray-700 sm:hidden dark:text-gray-400"
            >Page {{ currentPage }} of {{ totalPages }}</span
          >
          <ul class="hidden items-center gap-0.5 sm:flex">
            <!-- First page -->
            <li v-if="(paginationPages[0] as number) > 1">
              <a
                href="#"
                @click.prevent="goToPage(1)"
                class="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium hover:bg-brand-500 hover:text-white"
              >
                1
              </a>
            </li>

            <!-- Ellipsis before -->
            <li v-if="(paginationPages[0] as number) > 2">
              <span
                class="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium text-gray-500"
                >...</span
              >
            </li>

            <!-- Dynamic pages -->
            <li v-for="page in paginationPages" :key="page">
              <a
                href="#"
                @click.prevent="goToPage(page as number)"
                :class="[
                  'flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium',
                  page === currentPage
                    ? 'bg-brand-500 text-white'
                    : 'hover:bg-brand-500 hover:text-white text-gray-700',
                ]"
              >
                {{ page }}
              </a>
            </li>

            <!-- Ellipsis after -->
            <li v-if="(paginationPages[paginationPages.length - 1] as number) < totalPages - 1">
              <span
                class="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium text-gray-500"
                >...</span
              >
            </li>

            <!-- Last page -->
            <li v-if="(paginationPages[paginationPages.length - 1] as number) < totalPages">
              <a
                href="#"
                @click.prevent="goToPage(totalPages)"
                class="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium hover:bg-brand-500 hover:text-white text-gray-700"
              >
                {{ totalPages }}
              </a>
            </li>
          </ul>
          <button
            class="shadow-theme-xs flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 hover:text-gray-800 sm:p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
            @click="nextPage"
            :disabled="currentPage === totalPages"
            :class="currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''"
          >
            <span>
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
                  d="M17.4165 9.9986C17.4168 10.1909 17.3437 10.3832 17.197 10.53L12.2004 15.5301C11.9076 15.8231 11.4327 15.8233 11.1397 15.5305C10.8467 15.2377 10.8465 14.7629 11.1393 14.4699L14.8594 10.7472L3.33203 10.7472C2.91782 10.7472 2.58203 10.4114 2.58203 9.99715C2.58203 9.58294 2.91782 9.24715 3.33203 9.24715L14.854 9.24715L11.1393 5.53016C10.8465 5.23717 10.8467 4.7623 11.1397 4.4695C11.4327 4.1767 11.9075 4.17685 12.2003 4.46984L17.1578 9.43049C17.3163 9.568 17.4165 9.77087 17.4165 9.99715C17.4165 9.99763 17.4165 9.99812 17.4165 9.9986Z"
                  fill=""
                ></path>
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
    <!-- FILTER SIDEBAR -->
    <FilterSidebar
      v-model="isFilterOpen"
      title="Filter Users"
      :filters="filters"
      :fields="filterFields"
      @apply="applyFilters"
      @reset="resetFilters"
    />
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import FilterSidebar from '@/components/layout/FilterSidebar.vue'
import ActionMainButton from '@/components/common/ActionMainButton.vue'
import router from '@/router'

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

// Dữ liệu
const users = ref<User[]>([])
const totalPages = ref(1)
const totalElements = ref(0)
const currentPage = ref(1)
const itemsPerPage = 10

const loading = ref(false)
const error = ref('')

// Filter state
const filters = reactive({
  keyword: '',
  username: '',
  email: '',
  fullName: '',
  phoneNumber: '',
  city: '',
  roles: [] as string[],
})

const isFilterOpen = ref(false)

// Các field cho sidebar
const filterFields = [
  { key: 'username', label: 'Username', type: 'text' },
  { key: 'email', label: 'Email', type: 'text' },
  { key: 'fullName', label: 'Full Name', type: 'text' },
  { key: 'phoneNumber', label: 'Phone Number', type: 'text' },
  { key: 'city', label: 'City', type: 'text' },
  {
    key: 'roles',
    label: 'Roles',
    type: 'select-multiple',
    options: ['ADMIN', 'SHIPPER', 'MANAGER', 'USER'],
  },
]

// Hàm gọi API CHUNG (server-side filter + paging)
async function loadUsers() {
  loading.value = true
  error.value = ''

  try {
    const params = new URLSearchParams({
      page: String(currentPage.value),
      size: String(itemsPerPage),
    })

    // Thêm filter nếu có
    if (filters.keyword) params.append('keyword', filters.keyword)
    if (filters.username) params.append('username', filters.username)
    if (filters.email) params.append('email', filters.email)
    if (filters.fullName) params.append('fullName', filters.fullName)
    if (filters.phoneNumber) params.append('phoneNumber', filters.phoneNumber)
    if (filters.city) params.append('city', filters.city)
    if (filters.roles.length > 0) params.append('roles', filters.roles.join(','))

    const res = await fetch(`${baseURL}/scmlink/users/filter?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) throw new Error('Failed to fetch users')

    const data = await res.json()
    if (data.code === 1000 && data.result) {
      users.value = data.result.content || []
      totalPages.value = data.result.totalPages || 1
      totalElements.value = data.result.totalElements || 0
    } else {
      users.value = []
      totalPages.value = 1
      totalElements.value = 0
    }
  } catch (e) {
    console.error(e)
    error.value = 'Không tải được danh sách người dùng'
    users.value = []
  } finally {
    loading.value = false
  }
}

onMounted(loadUsers)

watch(
  filters,
  () => {
    currentPage.value = 1
    loadUsers()
  },
  { deep: true },
)

let searchTimer: any = null
watch(
  () => filters.keyword,
  () => {
    if (searchTimer) clearTimeout(searchTimer)
    searchTimer = setTimeout(() => {
      currentPage.value = 1
      loadUsers()
    }, 500)
  },
)

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
    currentPage.value = page
    loadUsers()
  }
}
function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    loadUsers()
  }
}
function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    loadUsers()
  }
}

function applyFilters(newFilters: any) {
  Object.assign(filters, newFilters)
  isFilterOpen.value = false
  currentPage.value = 1
  loadUsers()
}

function resetFilters() {
  filters.keyword = ''
  filters.username = ''
  filters.email = ''
  filters.fullName = ''
  filters.phoneNumber = ''
  filters.city = ''
  filters.roles = []
  isFilterOpen.value = false
  currentPage.value = 1
  loadUsers()
}

const activeUsers = computed(() => users.value.filter((u) => u.isActive).length)
const inactiveUsers = computed(() => users.value.filter((u) => !u.isActive).length)
const totalRoles = computed(() => {
  const set = new Set<string>()
  users.value.forEach((u) => u.roles?.forEach((r) => r.name && set.add(r.name)))
  return set.size
})

const selected = ref<string[]>([])
const isAllSelected = computed(
  () => users.value.length > 0 && users.value.every((u) => selected.value.includes(u.id)),
)

function toggleRow(id: string) {
  const idx = selected.value.indexOf(id)
  if (idx > -1) selected.value.splice(idx, 1)
  else selected.value.push(id)
}

function toggleSelectAll() {
  if (isAllSelected.value) {
    selected.value = selected.value.filter((id) => !users.value.some((u) => u.id === id))
  } else {
    const newIds = users.value.map((u) => u.id).filter((id) => !selected.value.includes(id))
    selected.value.push(...newIds)
  }
}

const paginationPages = computed(() => {
  const pages: (number | string)[] = []
  const total = totalPages.value
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (currentPage.value > 4) pages.push('...')
    const start = Math.max(2, currentPage.value - 2)
    const end = Math.min(total - 1, currentPage.value + 2)
    for (let i = start; i <= end; i++) pages.push(i)
    if (currentPage.value < total - 3) pages.push('...')
    if (total > 1) pages.push(total)
  }
  return pages
})
</script>
