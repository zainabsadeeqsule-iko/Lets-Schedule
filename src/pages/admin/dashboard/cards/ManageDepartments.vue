<template>
  <div>
    <h2 class="card-title text-primary font-bold uppercase mb-3">Departments</h2>
    <table class="table table-striped mb-5">
      <thead>
        <tr>
          <th>Name</th>
          <th>Courses</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="isLoading">
          <td colspan="3" class="text-center">
            <Icon icon="line-md:loading-loop" width="48" height="48" class="animate-spin" />
          </td>
        </tr>
        <tr v-else-if="departments.length === 0">
          <td colspan="3" class="text-center">No departments found.</td>
        </tr>
        <tr v-for="department in departments" v-else :key="department.id">
          <td class="cursor-pointer" @click="toggleCourses(department)">{{ department.name }}</td>
          <td>
            <div v-if="department.courses.length > 0">
              <div v-if="department.showCourses">
                <ul>
                  <li v-for="course in department.courses" :key="course.id">
                    {{ course.name }}
                  </li>
                </ul>
              </div>
              <div v-else>
                <ul>
                  <li class="cursor-pointer text-primary" @click="toggleCourses(department)">Click to see courses</li>
                </ul>
              </div>
            </div>
            <div v-else>
              <RouterLink :to="{ name: 'admin-courses' }" class="btn btn-primary btn-sm"> Add Course </RouterLink>
            </div>
          </td>
          <td>
            <button class="btn btn-warning btn-sm me-2" @click="showEditDepartmentModal(department)">
              Edit Department
            </button>
            <button class="btn btn-danger btn-sm me-2" @click="showDeleteDepartmentModal(department)">
              Delete Department
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <h2 class="card-title text-primary font-bold uppercase mb-3">Add New Department</h2>
    <form class="mt-3" @submit.prevent="addDepartment">
      <div class="mb-3">
        <label for="facultySelect" class="form-label">Select Faculty</label>
        <select id="facultySelect" v-model="selectedFacultyId" class="form-select" required>
          <option value="" disabled>Select a faculty</option>
          <option v-for="faculty in faculties" :key="faculty.id" :value="faculty.id">{{ faculty.name }}</option>
        </select>
      </div>
      <div class="mb-3">
        <label for="departmentName" class="form-label">Department Name</label>
        <input id="departmentName" v-model="newDepartmentName" type="text" class="form-control" required />
      </div>
      <VaButton class="w-full" type="submit" :loading="isAddingDepartment">Add Department</VaButton>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import { userGet, userPost, userPut, userDelete, userPatch } from '@/plugins/http'
import { useToast } from 'vuestic-ui'
import { Icon } from '@iconify/vue'

interface Course {
  id: number
  name: string
}

interface Department {
  id: number
  name: string
  courses: Course[]
  showCourses: boolean
}

interface Faculty {
  id: number
  name: string
}

const { init } = useToast()
const departments = ref<Department[]>([])
const newDepartmentName = ref('')
const faculties = ref<Faculty[]>([])
const selectedFacultyId = ref('')
const isLoading = ref(true)
const isAddingDepartment = ref(false)

onMounted(async () => {
  try {
    const response = await userGet('/faculties/departments')
    departments.value = response.data.data.map((department: any) => ({
      ...department,
      showCourses: false,
    }))
  } catch (error) {
    console.error('Failed to fetch departments:', error)
  } finally {
    isLoading.value = false
  }

  try {
    const facultyResponse = await userGet('/admin-view-faculty')
    faculties.value = facultyResponse.data.data
  } catch (error) {
    console.error('Failed to fetch faculties:', error)
  }
})

const toggleCourses = (department: Department) => {
  department.showCourses = !department.showCourses
}

const addDepartment = async () => {
  try {
    isAddingDepartment.value = true
    const response = await userPost('/admin-create-department', {
      name: newDepartmentName.value,
      faculty_id: selectedFacultyId.value,
    })
    if (response.data.errors) {
      const errorMessage = response.data.message || 'Invalid credentials'
      const errorDetails = Object.values(response.data.errors).flat().join(', ')
      init({ message: `${errorMessage}: ${errorDetails}`, color: 'danger' })
    } else {
      init({ message: response.data.message, color: 'success' })
      const newDepartment: Department = {
        id: response.data.data.id,
        name: response.data.data.name,
        courses: [],
        showCourses: false,
      }
      departments.value.push(newDepartment)
      newDepartmentName.value = ''
      selectedFacultyId.value = ''
    }
  } catch (error) {
    console.error('Failed to add department:', error)
  } finally {
    isAddingDepartment.value = false
  }
}

const showEditDepartmentModal = (department: Department) => {
  Swal.fire({
    title: 'Edit Department',
    input: 'text',
    inputValue: department.name,
    showCancelButton: true,
    confirmButtonText: 'Update',
    cancelButtonText: 'Cancel',
    preConfirm: async (updatedName) => {
      try {
        const response = await userPatch(`/admin-update-department/${department.id}`, { name: updatedName })
        if (response.data.errors) {
          const errorMessage = response.data.message || 'Invalid credentials'
          const errorDetails = Object.values(response.data.errors).flat().join(', ')
          init({ message: `${errorMessage}: ${errorDetails}`, color: 'danger' })
        } else {
          init({ message: response.data.message, color: 'success' })
          department.name = updatedName
          Swal.fire('Success', 'Department updated successfully', 'success')
        }
      } catch (error) {
        console.error('Failed to update department:', error)
        Swal.fire('Error', 'Failed to update department', 'error')
      }
    },
  })
}

const showDeleteDepartmentModal = (department: Department) => {
  Swal.fire({
    title: 'Delete Department',
    text: `Are you sure you want to delete the department "${department.name}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    preConfirm: async () => {
      try {
        const response = await userDelete(`/admin-delete-department/${department.id}`)
        if (response.data.errors) {
          const errorMessage = response.data.message || 'Invalid credentials'
          const errorDetails = Object.values(response.data.errors).flat().join(', ')
          init({ message: `${errorMessage}: ${errorDetails}`, color: 'danger' })
        } else {
          init({ message: response.data.message, color: 'success' })
          departments.value = departments.value.filter((d) => d.id !== department.id)
          Swal.fire('Success', 'Department deleted successfully', 'success')
        }
      } catch (error) {
        console.error('Failed to delete department:', error)
        Swal.fire('Error', 'Failed to delete department', 'error')
      }
    },
  })
}
</script>
