<template>
  <AdminLayout>
    <PageBreadcrumb pageTitle="Delivery Management" />

    <!-- Overview -->
    <div
      class="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Overview</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Quick insights into deliveries
          </p>
        </div>
        <div class="flex justify-end mt-6">
          <ActionMainButton
            text="Create Delivery"
            icon="plus"
            type="create"
            @click="isCreateDeliveryOpen = true"
          />
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div
          class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
        >
          <p class="text-gray-500 dark:text-gray-400">Total Deliveries</p>
          <p class="text-2xl font-semibold text-gray-800 dark:text-white">{{ totalDeliveries }}</p>
        </div>
        <div
          class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
        >
          <p class="text-gray-500 dark:text-gray-400">Pending</p>
          <p class="text-2xl font-semibold text-yellow-600">{{ pendingDeliveries }}</p>
        </div>
        <div
          class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
        >
          <p class="text-gray-500 dark:text-gray-400">Completed</p>
          <p class="text-2xl font-semibold text-green-600">{{ completedDeliveries }}</p>
        </div>
        <div
          class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
        >
          <p class="text-gray-500 dark:text-gray-400">Total Distance (km)</p>
          <p class="text-2xl font-semibold text-indigo-600">{{ totalDistance }}</p>
        </div>
      </div>
    </div>

    <!-- List -->
    <div
      class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div
        class="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800"
      >
        <div>
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Deliveries</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">Manage your delivery operations</p>
        </div>
        <div class="flex gap-3.5">
          <!-- Search -->
          <div class="relative">
            <span class="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 dark:text-gray-400">
              <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M3.04199 9.37363C3.04199 5.87693 5.87735 3.04199 9.37533 3.04199C12.8733 3.04199 15.7087 5.87693 15.7087 9.37363C15.7087 12.8703 12.8733 15.7053 9.37533 15.7053C5.87735 15.7053 3.04199 12.8703 3.04199 9.37363ZM9.37533 1.54199C5.04926 1.54199 1.54199 5.04817 1.54199 9.37363C1.54199 13.6991 5.04926 17.2053 9.37533 17.2053C11.2676 17.2053 13.0032 16.5344 14.3572 15.4176L17.1773 18.238C17.4702 18.5309 17.945 18.5309 18.2379 18.238C18.5308 17.9451 18.5309 17.4703 18.238 17.1773L15.4182 14.3573C16.5367 13.0033 17.2087 11.2669 17.2087 9.37363C17.2087 5.04817 13.7014 1.54199 9.37533 1.54199Z"
                />
              </svg>
            </span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search deliveries..."
              class="h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pr-4 pl-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden xl:w-[300px] dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
            />
          </div>
        </div>
      </div>

      <!-- Table -->
      <Alert
        v-if="alert.show"
        :variant="alert.type"
        :title="alert.title"
        :message="alert.message"
        :duration="3000"
      />
      <div v-if="loading" class="p-8 text-center text-gray-400">
        <span
          class="animate-spin mr-2 w-6 h-6 border-2 border-t-transparent border-gray-400 rounded-full inline-block"
        ></span>
        Loading...
      </div>
      <div v-else>
        <div class="custom-scrollbar overflow-x-auto">
          <table class="w-full table-auto">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                <th class="p-4 text-left text-xs font-bold text-gray-700 dark:text-gray-400">#</th>
                <th class="p-4 text-left text-xs font-bold text-gray-700 dark:text-gray-400">
                  Code
                </th>
                <th class="p-4 text-left text-xs font-bold text-gray-700 dark:text-gray-400">
                  Driver
                </th>
                <th class="p-4 text-left text-xs font-bold text-gray-700 dark:text-gray-400">
                  Vehicle
                </th>
                <th class="p-4 text-left text-xs font-bold text-gray-700 dark:text-gray-400">
                  Status
                </th>
                <th class="p-4 text-left text-xs font-bold text-gray-700 dark:text-gray-400">
                  Scheduled
                </th>
                <th class="p-4 text-left text-xs font-bold text-gray-700 dark:text-gray-400">
                  Distance (km)
                </th>
                <th class="p-4 text-left text-xs font-bold text-gray-700 dark:text-gray-400">
                  Duration (min)
                </th>
                <th class="p-4 text-left text-xs font-bold text-gray-700 dark:text-gray-400">
                  Note
                </th>
                <th class="p-4 text-center text-xs font-bold text-gray-700 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
              <template v-for="(delivery, idx) in filteredDeliveries" :key="delivery.id">
                <tr class="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td class="p-4 text-sm dark:text-gray-200">{{ idx + 1 }}</td>
                  <td class="p-4 text-sm text-blue-600 font-semibold">{{ delivery.code }}</td>
                  <td class="p-4 text-sm dark:text-gray-200">
                    {{ delivery.assignedDriver?.fullName || '—' }}
                  </td>
                  <td class="p-4 text-sm dark:text-gray-200">
                    {{ delivery.assignedVehicle?.licensePlate || '—' }}
                  </td>
                  <td class="p-4 text-sm">
                    <span
                      :class="statusClass(delivery.deliveryStatus)"
                      class="px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {{ delivery.deliveryStatus }}
                    </span>
                  </td>
                  <td class="p-4 text-sm dark:text-gray-200">
                    {{ formatDate(delivery.scheduledDeliveryTime) }}
                  </td>
                  <td class="p-4 text-sm dark:text-gray-200">
                    {{ delivery.totalDistanceKm || 0 }}
                  </td>
                  <td class="p-4 text-sm dark:text-gray-200">
                    {{ delivery.totalDurationMinutes || 0 }}
                  </td>
                  <td
                    class="p-4 text-sm dark:text-gray-200 max-w-[120px] truncate"
                    :title="delivery.note"
                  >
                    {{ delivery.note }}
                  </td>
                  <td class="p-4 text-center">
                    <div class="flex justify-center gap-2">
                      <ActionMainButton
                        text="Detail"
                        type="detail"
                        icon="detail"
                        @click="goToDeliveryDetail(delivery.id)"
                      />
                      <ActionMainButton
                        text="Update"
                        type="update"
                        icon="edit"
                        @click="onClickUpdate(delivery)"
                      />
                    </div>
                  </td>
                </tr>
              </template>
              <tr v-if="filteredDeliveries.length === 0">
                <td colspan="10" class="p-4 text-center text-gray-400">No deliveries found.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination (vehicles.vue style) -->
        <div
          class="flex flex-col items-center justify-between border-t border-gray-200 px-5 py-4 sm:flex-row dark:border-gray-800 mt-4"
        >
          <div class="pb-3 sm:pb-0">
            <span class="block text-sm font-medium text-gray-500 dark:text-gray-400">
              Showing
              <span class="text-gray-800 dark:text-white/90">{{
                (currentPage - 1) * itemsPerPage + (filteredDeliveries.length ? 1 : 0)
              }}</span>
              to
              <span class="text-gray-800 dark:text-white/90">{{
                (currentPage - 1) * itemsPerPage + filteredDeliveries.length
              }}</span>
              of
              <span class="text-gray-800 dark:text-white/90">{{ totalElements }}</span>
            </span>
          </div>

          <div
            class="flex w-full items-center justify-between gap-2 rounded-lg bg-gray-50 p-4 sm:w-auto sm:justify-normal sm:bg-transparent sm:p-0 dark:bg-white/[0.03] dark:sm:bg-transparent"
          >
            <button
              class="shadow-theme-xs flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 sm:p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
              @click="previousPage"
              :disabled="currentPage === 1"
              :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''"
            >
              <span>
                <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none">
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
              <li v-for="p in visiblePages" :key="p">
                <a
                  href="#"
                  @click.prevent="goToPage(p)"
                  :class="
                    p === currentPage
                      ? 'bg-brand-500 text-white'
                      : 'hover:bg-brand-500 text-gray-700 hover:text-white dark:text-gray-400 dark:hover:text-white'
                  "
                  class="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium"
                >
                  {{ p }}
                </a>
              </li>
            </ul>

            <button
              class="shadow-theme-xs flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 sm:p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
              @click="nextPage"
              :disabled="currentPage === totalPages"
              :class="currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''"
            >
              <span>
                <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none">
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
    </div>

    <!-- Modals -->
    <CreateDeliveryModal
      v-if="isCreateDeliveryOpen"
      @close="isCreateDeliveryOpen = false"
      @created="fetchDeliveries()"
    />
    <UpdateDeliveryModal
      v-if="showUpdateModal"
      :deliveryId="selectedDelivery?.id"
      @close="showUpdateModal = false"
      @updated="fetchDeliveries(currentPage)"
    />
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ActionMainButton from '@/components/common/ActionMainButton.vue'
import CreateDeliveryModal from './CreateDeliveryModal.vue'
import UpdateDeliveryModal from './UpdateDeliveryModal.vue'

const baseURL = import.meta.env.VITE_BASE_URL
const token = localStorage.getItem('auth_token') || ''

const isCreateDeliveryOpen = ref(false)
const deliveries = ref<any[]>([])
const loading = ref(false)
const error = ref('')
const searchQuery = ref('')

// pagination state
const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalPages = ref(1)
const totalElements = ref(0)
const pageNumber = ref(0)

const selectedDelivery = ref<any>(null)
const showUpdateModal = ref(false)

const router = useRouter()

// fetch deliveries with server-side paging
import Alert from '@/components/ui/Alert.vue'
import { reactive } from 'vue'
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

async function fetchDeliveries(page = 1) {
  loading.value = true
  error.value = ''
  try {
    const pageIndex = Math.max(0, page)
    const res = await fetch(
      `${baseURL}/scmlink/deliveries?page=${pageIndex}&size=${itemsPerPage.value}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    const data = await res.json()
    // support both wrapped and unwrapped responses
    const pageData = data?.result || data || {}
    const content = pageData.content || pageData.items || []
    deliveries.value = Array.isArray(content) ? content : []

    totalElements.value = pageData.totalElements ?? deliveries.value.length
    totalPages.value =
      pageData.totalPages ?? Math.max(1, Math.ceil((totalElements.value || 0) / itemsPerPage.value))
    pageNumber.value = pageData.pageNumber ?? pageIndex
    currentPage.value = (pageNumber.value || 0) + 1
  } catch (e) {
    console.error(e)
    alertState('error', 'Error', 'Error loading deliveries')
  } finally {
    loading.value = false
  }
}

const filteredDeliveries = computed(() =>
  deliveries.value.filter((d) =>
    [d.code, d.assignedDriver?.fullName, d.assignedVehicle?.licensePlate]
      .join(' ')
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase()),
  ),
)

// Overview statistics (total uses server total if available)
const totalDeliveries = computed(() => totalElements.value || deliveries.value.length)
const pendingDeliveries = computed(
  () => deliveries.value.filter((d) => d.deliveryStatus === 'PENDING').length,
)
const completedDeliveries = computed(
  () => deliveries.value.filter((d) => d.deliveryStatus === 'COMPLETED').length,
)
const totalDistance = computed(() =>
  deliveries.value.reduce((sum, d) => sum + (d.totalDistanceKm || 0), 0),
)

// pagination helpers (ellipsis)
const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const total = totalPages.value
  const current = currentPage.value
  const maxButtons = 5

  if (total <= maxButtons) {
    for (let i = 1; i <= total; i++) pages.push(i)
    return pages
  }

  const side = Math.floor(maxButtons / 2)
  let start = Math.max(2, current - side)
  let end = Math.min(total - 1, current + side)

  if (current <= side + 1) {
    start = 2
    end = Math.min(total - 1, maxButtons)
  }
  if (current >= total - side) {
    start = Math.max(2, total - maxButtons + 2)
    end = total - 1
  }

  pages.push(1)
  if (start > 2) pages.push('...')
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < total - 1) pages.push('...')
  pages.push(total)
  return pages
})

function goToPage(page: number | string) {
  if (typeof page !== 'number') return
  if (page >= 1 && page <= totalPages.value && page !== currentPage.value) fetchDeliveries(page)
}
function previousPage() {
  if (currentPage.value > 1) fetchDeliveries(currentPage.value - 1)
}
function nextPage() {
  if (currentPage.value < totalPages.value) fetchDeliveries(currentPage.value + 1)
}

function statusClass(status: string) {
  return (
    {
      PENDING: 'bg-yellow-100 text-yellow-700',
      IN_TRANSIT: 'bg-blue-100 text-blue-700',
      COMPLETED: 'bg-green-100 text-green-700',
      FAILED: 'bg-red-100 text-red-700',
    }[status] || 'bg-gray-100 text-gray-700'
  )
}

function formatDate(date: string) {
  if (!date) return '—'
  return new Date(date).toLocaleString('vi-VN')
}

function onClickUpdate(delivery: any) {
  selectedDelivery.value = delivery
  showUpdateModal.value = true
}

function goToDeliveryDetail(deliveryId: string | undefined) {
  if (!deliveryId) return
  router.push(`/admin/delivery-detail/${deliveryId}`)
}

onMounted(() => fetchDeliveries(1))
</script>
