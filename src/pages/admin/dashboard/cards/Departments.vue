<template>
  <div>
    <h2 class="card-title text-primary font-bold uppercase mb-3">Departments</h2>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Name</th>
          <th>Courses</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="isLoading">
          <td colspan="2" class="text-center">
            <Icon icon="line-md:loading-loop" width="48" height="48" class="animate-spin" />
          </td>
        </tr>
        <tr v-else-if="faculties.length === 0">
          <td colspan="2" class="text-center">No departments found.</td>
        </tr>
        <tr v-for="department in faculties" v-else :key="department.id">
          <td class="cursor-pointer" @click="toggleDepartments(department)">{{ department.name }}</td>
          <td>
            <div v-if="department.showDepartments">
              <ul v-if="department.courses.length > 0">
                <li v-for="course in department.courses" :key="course.id">{{ course.name }}</li>
              </ul>
              <p v-else class="text-primary">No courses available for this department.</p>
            </div>
            <div v-else>
              <ul>
                <li class="cursor-pointer text-primary" @click="toggleDepartments(department)">Click to see courses</li>
              </ul>
            </div>
          </td>
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
}

interface Department {
  id: number
  name: string
  courses: Course[]
  showDepartments: boolean
}

const faculties = ref<Department[]>([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    const response = await userGet('/faculties/departments')
    faculties.value = response.data.data.map((department: any) => ({
      ...department,
      showDepartments: false,
    }))
  } catch (error) {
    console.error('Failed to fetch faculties:', error)
  } finally {
    isLoading.value = false
  }
})

const toggleDepartments = (department: Department) => {
  department.showDepartments = !department.showDepartments
}
</script>
