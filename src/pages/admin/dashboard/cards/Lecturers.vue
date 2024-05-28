<!-- Lecturers.vue -->
<template>
  <div>
    <h2 class="card-title text-primary font-bold uppercase mb-3">Lecturers</h2>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Name</th>
          <th>Department</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="isLoading">
          <td colspan="2" class="text-center">
            <Icon icon="line-md:loading-loop" width="48" height="48" class="animate-spin" />
          </td>
        </tr>
        <tr v-else-if="lecturers.length === 0">
          <td colspan="2" class="text-center">No lecturers found.</td>
        </tr>
        <tr v-for="lecturer in lecturers" v-else :key="lecturer.id">
          <td>{{ lecturer.fullname }}</td>
          <td>{{ lecturer.department }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { userGet } from '@/plugins/http'
import { Icon } from '@iconify/vue'

interface Lecturer {
  id: number
  fullname: string
  faculty: string
  department: string
}

const lecturers = ref<Lecturer[]>([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    const response = await userGet('/admin-view-lecturers')
    lecturers.value = response.data.data
  } catch (error) {
    console.error('Failed to fetch departments:', error)
  } finally {
    isLoading.value = false
  }
})
</script>
