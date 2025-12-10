<!-- DeliveryDetail.vue - Updated with Real APIs -->
<template>
  <AdminLayout>
    <PageBreadcrumb pageTitle="Delivery Detail" />
    <div v-if="initialLoading" class="text-center py-10 text-gray-500">
      Loading delivery details...
    </div>
    <div v-else-if="error" class="text-center py-10 text-red-500">{{ error }}</div>

    <div v-else class="space-y-6">
      <!-- Header -->
      <div
        class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]"
      >
        <div>
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white">
            Delivery #{{ delivery.code }}
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Status:
            <span
              :class="statusClass(delivery.deliveryStatus)"
              class="px-2 py-1 rounded-full text-xs font-medium"
            >
              {{ delivery.deliveryStatus }}
            </span>
          </p>
        </div>

        <!-- Right actions / summary -->
        <div class="flex items-center gap-3">
          <div class="hidden sm:flex flex-col text-sm text-gray-700 dark:text-gray-300 mr-4">
            <span
              ><strong>Scheduled delivery:</strong> {{ formatDate(delivery.scheduledDeliveryTime) }}</span
            >
            <span
              ><strong>Delivered:</strong> {{ formatDate(delivery.actualDeliveryTime) }}</span
            >
            <span><strong>Scheduled pickup:</strong> {{ formatDate(delivery.scheduledPickupTime) }}</span>
            <span><strong>Picked up:</strong> {{ formatDate(delivery.actualPickupTime) }}</span>
          </div>

          <!-- Edit button (primary) -->
          <ActionMainButton
            v-if="canEditOrMark"
            type="update"
            icon="edit"
            text="Edit"
            @click="showUpdateModal = true"
          />

          <!-- Quick action: mark delivered -->
          <button
            v-if="canEditOrMark"
            type="button"
            @click="confirmAndUpdateStatus('DELIVERY_COMPLETED')"
            class="inline-flex items-center gap-2 rounded-lg border border-green-600 bg-green-50 px-3 py-1.5 text-sm font-semibold text-green-700 hover:bg-green-100 hover:border-green-700 transition duration-150 shadow"
            title="Mark delivery as completed"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Mark Delivered
          </button>
        </div>
      </div>

      <!-- Main Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column: Stats & Info -->
        <div class="space-y-6">
          <!-- Tracking Status -->
          <div class="bg-white rounded-lg shadow p-4 dark:bg-white/[0.03]">
            <div class="flex items-center justify-between">
              <span class="font-medium text-gray-700 dark:text-gray-300">Tracking Updates</span>
              <div class="flex items-center gap-2">
                <div
                  :class="hasRecentUpdates ? 'bg-green-500 animate-pulse' : 'bg-gray-400'"
                  class="w-3 h-3 rounded-full"
                ></div>
                <span class="text-sm text-gray-600 dark:text-gray-400">
                  {{ trackingHistories.length }} points
                </span>
              </div>
            </div>
          </div>

          <!-- Driver Info -->
          <div class="bg-white rounded-lg shadow p-4 dark:bg-white/[0.03]">
            <h3 class="font-semibold mb-3 text-gray-800 dark:text-white">Driver Information</h3>
            <div v-if="delivery.assignedDriver" class="space-y-2 text-sm">
              <div class="flex items-center gap-2">
                <div
                  class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold"
                >
                  {{ getInitials(delivery.assignedDriver.fullName) }}
                </div>
                <div>
                  <p class="font-medium text-gray-800 dark:text-white">
                    {{ delivery.assignedDriver.fullName }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ delivery.assignedDriver.phoneNumber }}
                  </p>
                </div>
              </div>
              <div class="pt-2 border-t">
                <p class="text-gray-600 dark:text-gray-400">
                  Email: {{ delivery.assignedDriver.email }}
                </p>
              </div>
            </div>
            <p v-else class="text-sm text-gray-500">No driver assigned</p>
          </div>

          <!-- Delivery Stats -->
          <div class="bg-white rounded-lg shadow p-4 dark:bg-white/[0.03]">
            <h3 class="font-semibold mb-3 text-gray-800 dark:text-white">Delivery Stats</h3>
            <div class="space-y-3">
              <!-- Progress -->
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-gray-600 dark:text-gray-400">Progress</span>
                  <span class="font-medium text-gray-800 dark:text-white">
                    {{ completedOrders }} / {{ totalOrders }}
                  </span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div
                    :style="{ width: progressPercent + '%' }"
                    class="bg-blue-600 h-2 rounded-full transition-all"
                  ></div>
                </div>
              </div>

              <!-- Stats Grid -->
              <div class="grid grid-cols-2 gap-3 text-sm pt-2">
                <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p class="text-gray-600 dark:text-gray-400 text-xs">Total Distance</p>
                  <p class="text-xl font-bold text-gray-800 dark:text-white">
                    {{ delivery.totalDistanceKm || 0 }} km
                  </p>
                </div>
                <div class="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p class="text-gray-600 dark:text-gray-400 text-xs">Duration</p>
                  <p class="text-xl font-bold text-gray-800 dark:text-white">
                    {{ formatMinutes(delivery.totalDurationMinutes) }}
                  </p>
                </div>
                <div class="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                  <p class="text-gray-600 dark:text-gray-400 text-xs">Tracking Points</p>
                  <p class="text-xl font-bold text-gray-800 dark:text-white">
                    {{ trackingHistories.length }}
                  </p>
                </div>
                <div class="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                  <p class="text-gray-600 dark:text-gray-400 text-xs">Status</p>
                  <p class="text-lg font-bold text-gray-800 dark:text-white">
                    {{ delivery.deliveryStatus }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Delivery Orders / Stops -->
          <div class="bg-white rounded-lg shadow p-4 dark:bg-white/[0.03]">
            <h3 class="font-semibold mb-3 text-gray-800 dark:text-white">Delivery Stops</h3>
            <div
              v-if="delivery.deliveryOrders && delivery.deliveryOrders.length > 0"
              class="space-y-2 max-h-96 overflow-y-auto"
            >
              <div
                v-for="(order, idx) in delivery.deliveryOrders"
                :key="order.orderCode"
                class="border rounded p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div class="flex items-start gap-3">
                  <div
                    :class="getOrderStatusColor(order.itemStatus)"
                    class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  >
                    <span class="text-sm font-bold">{{ order.orderSequence || idx + 1 }}</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-medium text-gray-800 dark:text-white">
                      Order #{{
                        order.orderCode
                      }}
                    </p>
                    <span
                      :class="getOrderStatusBadge(order.itemStatus)"
                      class="inline-block mt-1 px-2 py-0.5 rounded-full text-xs"
                    >
                      {{ order.itemStatus }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-sm text-gray-500">No stops data</div>
          </div>

          <!-- Vehicle Info -->
          <div class="bg-white rounded-lg shadow p-4 dark:bg-white/[0.03]">
            <h3 class="font-semibold mb-3 text-gray-800 dark:text-white">Vehicle Information</h3>
            <div v-if="delivery.assignedVehicle" class="space-y-2 text-sm">
              <div class="flex items-center gap-2 mb-3">
                <div
                  class="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
                >
                  <span class="text-2xl">🚚</span>
                </div>
                <div>
                  <p class="font-bold text-gray-800 dark:text-white">
                    {{ delivery.assignedVehicle.licensePlate }}
                  </p>
                  <p class="text-xs text-gray-500">{{ delivery.assignedVehicle.type }}</p>
                </div>
              </div>
              <div class="space-y-1 text-gray-700 dark:text-gray-300">
                <p><strong>Capacity:</strong> {{ delivery.assignedVehicle.capacityKg }} kg</p>
                <p>
                  <strong>Status:</strong>
                  <span
                    :class="delivery.assignedVehicle.available ? 'text-green-600' : 'text-red-600'"
                  >
                    {{ delivery.assignedVehicle.available ? 'Available' : 'In Use' }}
                  </span>
                </p>
              </div>
            </div>
            <p v-else class="text-sm text-gray-500">No vehicle assigned</p>
          </div>
        </div>

        <!-- Right Column: Map & Timeline -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Map -->
          <div class="bg-white rounded-lg shadow overflow-hidden dark:bg-white/[0.03]">
            <div
              class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between"
            >
              <h3 class="font-semibold text-gray-800 dark:text-white">Delivery Route Map</h3>
              <button
                @click="refreshMap"
                class="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                :disabled="mapLoading"
              >
                {{ mapLoading ? 'Loading...' : '🔄 Refresh' }}
              </button>
            </div>

            <!-- ✅ Relative container - luôn render -->
            <div class="relative w-full h-[500px]">
              <!-- Loading overlay -->
              <div
                v-show="mapLoading"
                class="absolute inset-0 z-10 flex items-center justify-center bg-gray-50/90 dark:bg-gray-900/90"
              >
                <div class="text-center">
                  <div
                    class="animate-spin inline-block w-8 h-8 border-4 border-t-transparent border-blue-600 rounded-full"
                  ></div>
                  <p class="mt-2 text-gray-600 dark:text-gray-400">Loading map...</p>
                </div>
              </div>

              <!-- Token warning overlay -->
              <div
                v-show="!hasMapboxToken"
                class="absolute inset-0 z-20 flex items-center justify-center bg-red-50/90 dark:bg-red-900/90"
              >
                <div class="text-center p-6">
                  <p class="text-red-600 font-semibold mb-2">⚠️ Mapbox Token Missing</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Please set VITE_MAPBOX_TOKEN in your .env file
                  </p>
                </div>
              </div>

              <!-- ✅ Map container - LUÔN được render -->
              <div ref="mapContainer" class="w-full h-full bg-gray-100 dark:bg-gray-800"></div>
            </div>
          </div>

          <!-- Tracking History Timeline -->
          <div class="bg-white rounded-lg shadow p-4 dark:bg-white/[0.03]">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold text-gray-800 dark:text-white">Tracking History</h3>
              <span class="text-xs text-gray-500 dark:text-gray-400">
                Last updated: {{ formatTimeAgo(trackingHistories[0]?.createdAt) }}
              </span>
            </div>

            <div v-if="trackingLoading" class="text-center py-6">
              <div
                class="animate-spin inline-block w-6 h-6 border-2 border-t-transparent border-blue-600 rounded-full"
              ></div>
              <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Loading tracking history...
              </p>
            </div>

            <div v-else-if="trackingHistories.length > 0">
              <ul class="relative border-l-2 border-blue-500 dark:border-blue-600 pl-6 space-y-4">
                <li v-for="(point, idx) in paginatedTracking" :key="point.id" class="relative">
                  <span
                    :class="idx === 0 ? 'bg-blue-500' : 'bg-white dark:bg-gray-800'"
                    class="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-blue-500"
                  ></span>
                  <div
                    class="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div class="flex justify-between items-start mb-2">
                      <div>
                        <p class="text-sm font-medium text-gray-800 dark:text-white">
                          {{ point.statusDescription || 'Location Update' }}
                        </p>
                        <p
                          v-if="point.statusCode"
                          class="text-xs text-gray-500 dark:text-gray-400 font-mono"
                        >
                          {{ point.statusCode }}
                        </p>
                      </div>
                      <span class="text-xs text-gray-500 dark:text-gray-400">
                        {{ formatTimeAgo(point.createdAt) }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-700 dark:text-gray-300 mb-1">
                      📍 {{ point.locationDescription || 'No location description' }}
                    </p>
                    <div
                      class="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-2"
                    >
                      <span>👤 {{ point.createdBy }}</span>
                      <span>🕐 {{ formatFullDate(point.createdAt) }}</span>
                    </div>
                  </div>
                </li>
              </ul>

              <!-- Pagination -->
              <div
                class="flex flex-col items-center justify-between border-t border-gray-200 px-5 py-4 sm:flex-row dark:border-gray-800 mt-4"
              >
                <!-- Left summary -->
                <div class="pb-3 sm:pb-0">
                  <span class="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Showing
                    <span class="text-gray-800 dark:text-white/90">{{
                      (trackingPage - 1) * trackingSize + (paginatedTracking.length ? 1 : 0)
                    }}</span>
                    to
                    <span class="text-gray-800 dark:text-white/90">{{
                      (trackingPage - 1) * trackingSize + paginatedTracking.length
                    }}</span>
                    of
                    <span class="text-gray-800 dark:text-white/90">{{
                      trackingFiltered.length
                    }}</span>
                  </span>
                </div>

                <!-- Buttons -->
                <div
                  class="flex w-full items-center justify-between gap-2 rounded-lg bg-gray-50 p-4 sm:w-auto sm:justify-normal sm:bg-transparent sm:p-0 dark:bg-white/[0.03] dark:sm:bg-transparent"
                >
                  <!-- Prev -->
                  <button
                    class="shadow-theme-xs flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 hover:text-gray-800 sm:p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                    @click="trackingPrevious"
                    :disabled="trackingPage === 1"
                    :class="trackingPage === 1 ? 'opacity-50 cursor-not-allowed' : ''"
                  >
                    <span>
                      <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20">
                        <path
                          d="M2.58 9.99c0 .19.07.38.22.53l5 5c.29.29.77.29 1.06 0s.29-.77 0-1.06L5.14 10.74h11.52c.41 
            0 .75-.34.75-.75s-.34-.75-.75-.75H5.14l3.76-3.72c.29-.29.29-.77 0-1.06a.75.75 0 0 0-1.06 
            0l-5 5a.75.75 0 0 0-.22.53Z"
                        />
                      </svg>
                    </span>
                  </button>

                  <!-- Mobile page display -->
                  <span
                    class="block text-sm font-medium text-gray-700 sm:hidden dark:text-gray-400"
                  >
                    Page {{ trackingPage }} of {{ trackingTotalPages }}
                  </span>

                  <!-- Page list -->
                  <ul class="hidden items-center gap-0.5 sm:flex">
                    <li v-for="page in trackingVisiblePagination" :key="page">
                      <a
                        href="#"
                        @click.prevent="goToTrackingPage(page)"
                        :class="
                          page === trackingPage
                            ? 'bg-brand-500 text-white'
                            : 'hover:bg-brand-500 text-gray-700 hover:text-white dark:text-gray-400 dark:hover:text-white'
                        "
                        class="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium"
                      >
                        {{ page }}
                      </a>
                    </li>

                    <!-- Ellipsis -->
                    <li
                      v-if="
                        trackingVisiblePagination[trackingVisiblePagination.length - 1] <
                        trackingTotalPages
                      "
                    >
                      <span
                        class="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium text-gray-700 dark:text-gray-400"
                        >...</span
                      >
                    </li>

                    <!-- Last Page -->
                    <li
                      v-if="
                        trackingVisiblePagination[trackingVisiblePagination.length - 1] <
                        trackingTotalPages
                      "
                    >
                      <a
                        href="#"
                        @click.prevent="goToTrackingPage(trackingTotalPages)"
                        class="hover:bg-brand-500 flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium text-gray-700 hover:text-white dark:text-gray-400 dark:hover:text-white"
                      >
                        {{ trackingTotalPages }}
                      </a>
                    </li>
                  </ul>

                  <!-- Next -->
                  <button
                    class="shadow-theme-xs flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 hover:text-gray-800 sm:p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                    @click="trackingNext"
                    :disabled="trackingPage === trackingTotalPages"
                    :class="
                      trackingPage === trackingTotalPages ? 'opacity-50 cursor-not-allowed' : ''
                    "
                  >
                    <span>
                      <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20">
                        <path
                          d="M17.42 9.99c0 .19-.07.38-.22.53l-5 5a.75.75 0 0 1-1.06 0c-.29-.29-.29-.77 
            0-1.06l3.76-3.72H3.33c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h11.52l-3.76-3.72a.75.75 
            0 0 1 1.06-1.06l5 5c.15.15.22.34.22.53Z"
                        />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div v-else class="text-center text-gray-500 dark:text-gray-400 py-8">
              <p class="text-lg mb-2">📍</p>
              <p>No tracking history available yet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <UpdateDeliveryModal
      v-if="showUpdateModal"
      :deliveryId="route.params.deliveryId"
      @close="showUpdateModal = false"
      @updated="loadDeliveryDetail"
    />
  </AdminLayout>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { useRoute } from 'vue-router'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import UpdateDeliveryModal from './UpdateDeliveryModal.vue'
import ActionMainButton from '@/components/common/ActionMainButton.vue'
const baseURL = import.meta.env.VITE_BASE_URL
const token = localStorage.getItem('auth_token') || ''
const route = useRoute()

// State
const showUpdateModal = ref(false)
const updatingStatus = ref(false)
const delivery = ref<any>({})
const trackingHistories = ref<any[]>([])
const initialLoading = ref(true)
const trackingLoading = ref(false)
const mapLoading = ref(true)
const error = ref('')
const showAllHistory = ref(false)
const trackingPage = ref(1)
const trackingSize = ref(2) // Mỗi trang 5 dòng
const trackingVisiblePages = ref<number[]>([])

// Map
const mapContainer = ref<HTMLElement | null>(null)
const map = ref<any>(null)
const markers = ref<any[]>([])

// Mapbox Token
const hasMapboxToken = !!import.meta.env.VITE_MAPBOX_TOKEN
if (hasMapboxToken) {
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN
}

// Computed
const trackingFiltered = computed(() => trackingHistories.value)

const trackingTotalPages = computed(
  () => Math.ceil(trackingFiltered.value.length / trackingSize.value) || 1,
)

const paginatedTracking = computed(() => {
  const start = (trackingPage.value - 1) * trackingSize.value
  return trackingFiltered.value.slice(start, start + trackingSize.value)
})

const trackingVisiblePagination = computed(() => {
  const total = trackingTotalPages.value
  const cur = trackingPage.value
  const pages = []

  let start = Math.max(1, cur - 1)
  let end = Math.min(total, start + 2)

  if (end - start < 2) {
    start = Math.max(1, end - 2)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

function goToTrackingPage(page: number) {
  if (page >= 1 && page <= trackingTotalPages.value) trackingPage.value = page
}

function trackingPrevious() {
  if (trackingPage.value > 1) trackingPage.value--
}

function trackingNext() {
  if (trackingPage.value < trackingTotalPages.value) trackingPage.value++
}

const totalOrders = computed(() => delivery.value.deliveryOrders?.length || 0)
const completedOrders = computed(() => {
  return (
    delivery.value.deliveryOrders?.filter(
      (o: any) => o.itemStatus === 'DELIVERED_ITEM' || o.itemStatus === 'COMPLETED',
    ).length || 0
  )
})
const progressPercent = computed(() => {
  return totalOrders.value > 0 ? (completedOrders.value / totalOrders.value) * 100 : 0
})
const hasRecentUpdates = computed(() => {
  if (trackingHistories.value.length === 0) return false
  const latest = new Date(trackingHistories.value[0].createdAt)
  const now = new Date()
  const diffMinutes = (now.getTime() - latest.getTime()) / (1000 * 60)
  return diffMinutes < 30 // Recent if within 30 minutes
})

// NEW: determine if Edit / Mark buttons should be shown
const canEditOrMark = computed(() => {
  const s = delivery.value?.deliveryStatus
  if (!s) return false
  return !['DELIVERY_COMPLETED', 'DELIVERY_CANCELLED'].includes(s)
})

// Fetch delivery detail
async function fetchDeliveryDetail() {
  try {
    const res = await fetch(`${baseURL}/scmlink/deliveries/${route.params.deliveryId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (data.code === 1000) {
      delivery.value = data.result
    } else {
      error.value = data.message || 'Failed to load delivery details.'
    }
  } catch (err) {
    error.value = 'Error fetching delivery detail.'
    console.error(err)
  }
}

// Fetch tracking histories
async function fetchTrackingHistories() {
  trackingLoading.value = true
  try {
    const res = await fetch(`${baseURL}/scmlink/deliveryTrackingHistories/delivery/${route.params.deliveryId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (data.code === 1000 && data.result?.content) {
      // Sort by createdAt descending (newest first)
      trackingHistories.value = data.result.content.sort(
        (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
    }
  } catch (err) {
    console.error('Error fetching tracking histories:', err)
  } finally {
    trackingLoading.value = false
  }
}

// ✅ Initialize map safely
async function initMap() {
  if (!mapContainer.value || !hasMapboxToken) return

  // Clear previous map instance if reloaded
  if (map.value) {
    map.value.remove()
    map.value = null
  }

  mapLoading.value = true

  await nextTick() // đảm bảo DOM render xong
  console.log('🧭 initMap() called, container:', mapContainer.value)

  try {
    map.value = new mapboxgl.Map({
      container: mapContainer.value!,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [105.8342, 21.0278],
      zoom: 11,
    })

    map.value.addControl(new mapboxgl.NavigationControl(), 'top-right')

    map.value.on('load', () => {
      mapLoading.value = false
      updateMap()

      // 👇 Giải quyết lỗi map ẩn trong container flex/grid
      setTimeout(() => {
        map.value?.resize()
      }, 200)
      console.log(mapContainer.value)
    })
  } catch (err) {
    console.error('Map init error:', err)
    mapLoading.value = false
  }
}

// Update map with tracking data
async function updateMap() {
  if (!map.value) return

  // reset
  markers.value.forEach(m => m.remove())
  markers.value = []

  if (map.value.getLayer('delivery-line')) map.value.removeLayer('delivery-line')
  if (map.value.getSource('delivery-line')) map.value.removeSource('delivery-line')

  // warehouse
  const warehouseLat = Number(delivery.value.warehouseLatitude)
  const warehouseLng = Number(delivery.value.warehouseLongitude)
  const hasWarehouse = Number.isFinite(warehouseLat) && Number.isFinite(warehouseLng)

  // driver position
  const latestTracking = trackingHistories.value.find(p => p.latitude && p.longitude)
  const driverLat = latestTracking ? Number(latestTracking.latitude) : NaN
  const driverLng = latestTracking ? Number(latestTracking.longitude) : NaN
  const hasDriver = Number.isFinite(driverLat) && Number.isFinite(driverLng)

  // delivery orders
  const sortedOrders = [...(delivery.value.deliveryOrders || [])].sort(
    (a, b) => (a.orderSequence ?? 0) - (b.orderSequence ?? 0),
  )

  // 🧠 build route coordinates
  const coords: [number, number][] = []

  if (!hasDriver && hasWarehouse) {
    coords.push([warehouseLng, warehouseLat])
  }

  if (hasDriver) {
    coords.push([driverLng, driverLat])
  }

  sortedOrders.forEach(o => {
    const lat = Number(o.orderLatitude)
    const lng = Number(o.orderLongitude)
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      coords.push([lng, lat])
    }
  })

  if (coords.length < 2) {
    console.warn('⚠️ Not enough coordinates to draw a route')
    return
  }

  // MARKERS ================
  function marker(html: string, [lng, lat]: [number, number]) {
    const el = document.createElement('div')
    el.innerHTML = html
    el.style.transform = 'translate(-50%, -50%)'
    const m = new mapboxgl.Marker(el).setLngLat([lng, lat]).addTo(map.value)
    markers.value.push(m)
  }

  if (hasWarehouse) {
    marker(`
      <div class="flex flex-col items-center">
        <div class="bg-white shadow rounded-full p-2">🏭</div>
        <div class="text-xs mt-1 font-medium text-gray-700">Warehouse</div>
      </div>
    `, [warehouseLng, warehouseLat])
  }

  if (hasDriver) {
    marker(`
      <div class="relative flex flex-col items-center">
        <div class="relative">
          <div class="absolute w-8 h-8 bg-blue-400 opacity-70 rounded-full animate-ping"></div>
          <div class="relative bg-blue-600 text-white rounded-full p-2 shadow-md">🚚</div>
        </div>
        <div class="text-xs mt-1 text-blue-600 font-medium">Driver</div>
      </div>
    `, [driverLng, driverLat])
  }

  sortedOrders.forEach(o => {
    const lat = Number(o.orderLatitude)
    const lng = Number(o.orderLongitude)
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return

    marker(`
      <div class="flex flex-col items-center">
        <div class="bg-red-600 text-white rounded-full p-2 shadow">📍</div>
        <div class="text-xs mt-1 text-red-600 font-medium">#${o.orderSequence}</div>
      </div>
    `, [lng, lat])
  })

  // ROUTE ===============
  const waypointStr = coords.map(([lng, lat]) => `${lng},${lat}`).join(';')
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${waypointStr}?geometries=geojson&overview=full&access_token=${mapboxgl.accessToken}`

  try {
    const res = await fetch(url)
    const json = await res.json()

    if (!json.routes?.length) {
      console.warn('No route returned!')
      return
    }

    const routeGeo = json.routes[0].geometry

    map.value.addSource('delivery-line', {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: routeGeo,
      },
    })

    map.value.addLayer({
      id: 'delivery-line',
      type: 'line',
      source: 'delivery-line',
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: {
        'line-color': '#2563eb',
        'line-width': 5,
        'line-opacity': 0.9,
      },
    })
  } catch (e) {
    console.error('Error fetching directions:', e)
  }

  // FIT MAP ===============
  const bounds = new mapboxgl.LngLatBounds()
  coords.forEach(c => bounds.extend(c))
  map.value.fitBounds(bounds, { padding: 70, duration: 900 })
}


// Refresh map
async function refreshMap() {
  await fetchTrackingHistories()
  await updateMap()
}

// Quick status update helper
async function confirmAndUpdateStatus(newStatus: string) {
  if (!route.params.deliveryId) return
  const ok = window.confirm(`Confirm update delivery status to "${newStatus}"?`)
  if (!ok) return

  updatingStatus.value = true
  try {
    const id = route.params.deliveryId
    const res = await fetch(`${baseURL}/scmlink/deliveries/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ deliveryStatus: newStatus }),
    })
    const data = await res.json()
    if (res.ok && data.code === 1000) {
      await fetchDeliveryDetail()
      // also refresh map/tracking if needed
      await fetchTrackingHistories()
      updateMap()
    } else {
      alert(data.message || 'Failed to update delivery status.')
    }
  } catch (err) {
    console.error(err)
    alert('Network error while updating status.')
  } finally {
    updatingStatus.value = false
  }
}

// Utility functions
function getInitials(name: string) {
  if (!name) return '??'
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getOrderStatusColor(status: string) {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    IN_TRANSIT: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    DELIVERED_ITEM: 'bg-green-500 text-white',
    COMPLETED: 'bg-green-500 text-white',
    FAILED: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  }
  return colors[status] || 'bg-gray-100 text-gray-700'
}

function getOrderStatusBadge(status: string) {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    IN_TRANSIT: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    DELIVERED_ITEM: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    COMPLETED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    FAILED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

function formatTimeAgo(dateStr: string) {
  if (!dateStr) return 'N/A'
  const seconds = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

function formatMinutes(minutes: number | null) {
  if (!minutes) return 'N/A'
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
}

function formatDate(dateString: string) {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return date.toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function formatFullDate(dateString: string) {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return date.toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function statusClass(status: string) {
  const classes: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    DELIVERING: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    DELIVERY_COMPLETED: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    DELIVERY_CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

// ✅ Lifecycle
onMounted(async () => {
  try {
    await Promise.all([fetchDeliveryDetail(), fetchTrackingHistories()])
    // 2. Wait for DOM
    await nextTick()

    // 3. Extra delay for safety
    setTimeout(() => {
      initMap()
    }, 100)

    // Auto-refresh tracking
    const refreshInterval = setInterval(async () => {
      await fetchTrackingHistories()
      updateMap()
    }, 60000)

    onUnmounted(() => {
      clearInterval(refreshInterval)
      if (map.value) map.value.remove()
      markers.value.forEach((m) => m.remove())
    })
  } catch (err) {
    console.error('Mount error:', err)
  } finally {
    initialLoading.value = false
  }
})
</script>
<style>
@keyframes ping {
  75%,
  100% {
    transform: scale(2);
    opacity: 0;
  }
}
.animate-ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}
.tracking-marker:hover {
  transform: scale(1.15);
  transition: transform 0.2s;
}

.delivery-stop-marker:hover {
  transform: scale(1.15);
  transition: transform 0.2s ease;
}
.marker {
  animation: pop 0.3s ease;
}
@keyframes pop {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
</style>
