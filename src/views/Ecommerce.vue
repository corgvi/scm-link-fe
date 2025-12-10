<template>
  <admin-layout>
    <div class="grid grid-cols-12 gap-4 md:gap-6">
      <div class="col-span-12 space-y-6 xl:col-span-7">
        <ecommerce-metrics />
      </div>
    
      <div class="col-span-12 xl:col-span-5">
        <monthly-sale />
      </div>
      <!-- MonthlyTarget full width -->
      <div class="col-span-12">
        <monthly-target />
      </div>
      <div class="col-span-12">
        <statistics-chart />
      </div>
      <div class="col-span-12">
        <recent-orders />
      </div>
    </div>
    
  </admin-layout>
</template>

<script>
import AdminLayout from '../components/layout/AdminLayout.vue'
import EcommerceMetrics from '../components/ecommerce/EcommerceMetrics.vue'
import MonthlyTarget from '../components/ecommerce/MonthlySale.vue'
import MonthlySale from '../components/ecommerce/MonthlyTarget.vue'
import StatisticsChart from '../components/ecommerce/StatisticsChart.vue'
import RecentOrders from '../components/ecommerce/RecentOrders.vue'
export default {
  components: {
    AdminLayout,
    EcommerceMetrics,
    MonthlyTarget,
    MonthlySale,
    StatisticsChart,
    RecentOrders,
  },
  name: 'Ecommerce',
}
</script>
