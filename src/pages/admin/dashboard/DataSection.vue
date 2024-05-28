<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
    <template v-if="!isLoading && dashboardMetrics.length > 0">
      <DataSectionItem
        v-for="metric in dashboardMetrics"
        :key="metric.id"
        :title="metric.title"
        :value="metric.value"
      />
    </template>
    <template v-else-if="!isLoading && dashboardMetrics.length === 0">
      <DataSectionItem title="Total Faculties" value="-" />
      <DataSectionItem title="Total Departments" value="-" />
      <DataSectionItem title="Total Lecturers" value="-" />
      <DataSectionItem title="Total Students" value="-" />
    </template>
    <template v-else>
      <div class="col-span-4 flex justify-center items-center">
        <Icon icon="line-md:loading-loop" width="48" height="48" class="animate-spin" />
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { userGet } from '@/plugins/http'
import { Icon } from '@iconify/vue'
import DataSectionItem from './DataSectionItem.vue'

interface DashboardMetric {
  id: string
  title: string
  value: string
}

const dashboardMetrics = ref<DashboardMetric[]>([])
const isLoading = ref(true)

const fetchDashboardMetrics = async () => {
  try {
    const response = await userGet('/getTotalCounts')
    dashboardMetrics.value = response.data.data
  } catch (error) {
    console.error('Failed to fetch dashboard metrics:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchDashboardMetrics()
})
</script>
