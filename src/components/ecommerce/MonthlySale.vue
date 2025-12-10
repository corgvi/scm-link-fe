<template>
  <div
    class="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6"
  >
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Monthly Sales</h3>
      <DropdownMenu :menu-items="menuItems">
        <template #icon>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M10.244 6c0-.966.784-1.75 1.75-1.75h.01c.967 0 1.75.784 1.75 1.75S12.97 7.75 12.004 7.75h-.01c-.966 0-1.75-.784-1.75-1.75Zm0 12c0-.967.784-1.75 1.75-1.75h.01c.967 0 1.75.783 1.75 1.75 0 .966-.783 1.75-1.75 1.75h-.01c-.966 0-1.75-.784-1.75-1.75Zm1.75-7.75c-.966 0-1.75.784-1.75 1.75 0 .967.784 1.75 1.75 1.75h.01c.967 0 1.75-.783 1.75-1.75 0-.966-.783-1.75-1.75-1.75h-.01Z"
              fill="currentColor"
            />
          </svg>
        </template>
      </DropdownMenu>
    </div>

    <!-- Tổng quan tháng hiện tại -->
    <div v-if="monthlyData" class="mb-6 flex flex-wrap gap-6">
      <div class="flex flex-col items-start">
        <span class="text-sm text-gray-500 dark:text-gray-400">Current Month</span>
        <span class="text-2xl font-bold text-gray-800 dark:text-white/90">
          {{ currentMonthLabel }}
        </span>
      </div>
      <div class="flex flex-col items-start">
        <span class="text-sm text-gray-500 dark:text-gray-400">Revenue</span>
        <span class="text-2xl font-bold text-indigo-600">
          {{ formatVND(currentMonthRevenue) }}
        </span>
      </div>
      <div class="flex flex-col items-start">
        <span class="text-sm text-gray-500 dark:text-gray-400">Orders</span>
        <span class="text-2xl font-bold text-green-600">
          {{ currentMonthOrders }}
        </span>
      </div>
      <div class="flex flex-col items-start">
        <span class="text-sm text-gray-500 dark:text-gray-400">Growth</span>
        <span
          class="text-2xl font-bold"
          :class="currentMonthGrowthRate >= 0 ? 'text-success-600' : 'text-error-600'"
        >
          {{ currentMonthGrowthRate.toFixed(1) }}%
        </span>
      </div>
    </div>

    <!-- Chart -->
    <div class="max-w-full overflow-x-auto custom-scrollbar">
      <div id="chartOne" class="w-full min-w-[680px] xl:min-w-full pl-2">
        <VueApexCharts type="bar" height="280" :options="chartOptions" :series="series" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import DropdownMenu from '../common/DropdownMenu.vue'

const baseURL = import.meta.env.VITE_BASE_URL
const token = localStorage.getItem('auth_token') || ''

const menuItems = [
  { label: 'View More', onClick: () => console.log('View more') },
  { label: 'Refresh', onClick: () => fetchData() },
]

const monthlyData = ref(null)

const series = ref([
  { name: 'Revenue', type: 'column', data: [] },
  { name: 'Orders', type: 'column', data: [] },
  { name: 'Growth (%)', type: 'line', data: [] },
])

const chartOptions = ref({
  colors: ['#3b82f6', '#f97316', '#facc15'],
  chart: {
    type: 'bar',
    stacked: false,
    fontFamily: 'Outfit, sans-serif',
    toolbar: { show: false },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '40%',
      borderRadius: 5,
    },
  },
  dataLabels: { enabled: false },
  stroke: {
    show: true,
    width: [3, 3, 3],
    colors: ['transparent', 'transparent', '#facc15'],
  },
  xaxis: {
    categories: [],
  },
  yaxis: [
    {
      title: { text: 'Revenue (VND)' },
      labels: {
        formatter: (val) => formatVND(val),
      },
    },
    {
      opposite: true,
      title: { text: 'Growth (%)' },
      labels: {
        formatter: (val) => Number(val).toFixed(1) + '%',
      },
    },
  ],
  legend: {
    position: 'top',
    horizontalAlign: 'left',
    markers: { radius: 50 },
  },
  tooltip: {
    shared: true,
    intersect: false,
    y: {
      formatter: (val, { seriesIndex }) => {
        if (seriesIndex === 0) return formatVND(val)
        if (seriesIndex === 1) return val + ' đơn'
        if (seriesIndex === 2) return Number(val).toFixed(1) + '%'
        return val
      },
    },
  },
  grid: {
    borderColor: '#e5e7eb',
  },
})

function formatVND(value) {
  if (!value || value === 0) return '0 ₫'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumSignificantDigits: 3,
  }).format(value)
}

async function fetchData() {
  try {
    const res = await fetch(`${baseURL}/scmlink/dashboard/monthly-sales`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (data.code === 1000) {
      const result = data.result
      monthlyData.value = result
      chartOptions.value.xaxis.categories = result.months
      series.value = [
        {
          name: 'Revenue',
          type: 'column',
          data: result.revenue,
          yAxisIndex: 0,
        },
        {
          name: 'Orders',
          type: 'column',
          yAxisIndex: 0,
          data: result.orders,
        },
        {
          name: 'Growth (%)',
          type: 'line',
          yAxisIndex: 1,
          data: result.growthRate,
        },
      ]
    }
  } catch (e) {
    console.error('Error loading monthly sales:', e)
  }
}

onMounted(fetchData)

// Thông tin tháng hiện tại
const currentMonthIndex = computed(() => new Date().getMonth())
const currentMonthLabel = computed(() => monthlyData.value?.months?.[currentMonthIndex.value] || '')
const currentMonthRevenue = computed(() => monthlyData.value?.revenue?.[currentMonthIndex.value] || 0)
const currentMonthOrders = computed(() => monthlyData.value?.orders?.[currentMonthIndex.value] || 0)
const currentMonthGrowthRate = computed(() => {
  const arr = monthlyData.value?.growthRate || []
  return typeof arr[currentMonthIndex.value] === 'number'
    ? arr[currentMonthIndex.value]
    : 0
})
</script>
