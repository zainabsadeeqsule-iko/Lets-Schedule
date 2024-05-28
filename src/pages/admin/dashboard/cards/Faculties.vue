<template>
  <div>
    <h2 class="card-title text-primary font-bold uppercase mb-3">Faculties</h2>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Name</th>
          <th>Departments</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="isLoading">
          <td colspan="2" class="text-center">
            <Icon icon="line-md:loading-loop" width="48" height="48" class="animate-spin" />
          </td>
        </tr>
        <tr v-else-if="faculties.length === 0">
          <td colspan="2" class="text-center">No faculties found.</td>
        </tr>
        <tr v-for="faculty in faculties" v-else :key="faculty.id">
          <td class="cursor-pointer" @click="toggleDepartments(faculty)">{{ faculty.name }}</td>
          <td>
            <div v-if="faculty.departments.length > 0">
              <div v-if="faculty.showDepartments">
                <ul>
                  <li v-for="department in faculty.departments" :key="department.id">
                    {{ department.name }}
                  </li>
                </ul>
              </div>
              <div v-else>
                <ul>
                  <li class="cursor-pointer text-primary" @click="toggleDepartments(faculty)">
                    Click to see departments
                  </li>
                </ul>
              </div>
            </div>
            <div v-else>
              <RouterLink
                :to="{ name: 'departments', params: { facultyId: faculty.id } }"
                class="btn btn-primary btn-sm"
              >
                Add Department
              </RouterLink>
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

interface Department {
  id: number
  name: string
}

interface Faculty {
  id: number
  name: string
  departments: Department[]
  showDepartments: boolean
}

const faculties = ref<Faculty[]>([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    const response = await userGet('/admin-view-faculty')
    faculties.value = response.data.data.map((faculty: any) => ({
      ...faculty,
      showDepartments: false,
    }))
  } catch (error) {
    console.error('Failed to fetch faculties:', error)
  } finally {
    isLoading.value = false
  }
})

const toggleDepartments = (faculty: Faculty) => {
  faculty.showDepartments = !faculty.showDepartments
}
</script>
