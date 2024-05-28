<template>
  <div>
    <h2 class="card-title text-primary font-bold uppercase mb-3">Courses</h2>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Course Name</th>
          <th>Department</th>
          <th>Student Count</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="isLoading">
          <td colspan="3" class="text-center">
            <Icon icon="line-md:loading-loop" width="48" height="48" class="animate-spin" />
          </td>
        </tr>
        <tr v-else-if="courses.length === 0">
          <td colspan="3" class="text-center">No courses found.</td>
        </tr>
        <tr v-for="course in courses" v-else :key="course.id">
          <td>{{ course.name }}</td>
          <td>{{ course.department }}</td>
          <td>{{ course.student_count }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { userGet } from '@/plugins/http'
import { Icon } from '@iconify/vue'

interface Course {
  id: number
  name: string
  department: string
  student_count: number
}

const courses = ref<Course[]>([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    const response = await userGet('/lecturer-view-courses')
    courses.value = response.data.data
  } catch (error) {
    console.error('Failed to fetch courses:', error)
  } finally {
    isLoading.value = false
  }
})
</script>
