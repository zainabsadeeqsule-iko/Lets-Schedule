<template>
  <div>
    <h2 class="card-title text-primary font-bold uppercase mb-3">Faculties</h2>
    <table class="table table-striped mb-5">
      <thead>
        <tr>
          <th>Name</th>
          <th>Departments</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="isLoading">
          <td colspan="3" class="text-center">
            <Icon icon="line-md:loading-loop" width="48" height="48" class="animate-spin" />
          </td>
        </tr>
        <tr v-else-if="faculties.length === 0">
          <td colspan="3" class="text-center">No faculties found.</td>
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
          <td>
            <button class="btn btn-warning btn-sm me-2" @click="showEditFacultyModal(faculty)">Edit Faculty</button>
            <button class="btn btn-danger btn-sm me-2" @click="showDeleteFacultyModal(faculty)">Delete Faculty</button>
          </td>
        </tr>
      </tbody>
    </table>
    <h2 class="card-title text-primary font-bold uppercase mb-3">Add New Faculty</h2>
    <form class="mt-3" @submit.prevent="addFaculty">
      <div class="mb-3">
        <label for="facultyName" class="form-label">Faculty Name</label>
        <input id="facultyName" v-model="newFacultyName" type="text" class="form-control" required />
      </div>
      <VaButton class="w-full" type="submit" :loading="isAddingFaculty">Add Faculty</VaButton>
    </form>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import { userGet, userPost, userPut, userDelete, userPatch } from '@/plugins/http'
import { useToast } from 'vuestic-ui'
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
const { init } = useToast()
const newFacultyName = ref('')
const isLoading = ref(true)
const isAddingFaculty = ref(false)

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

const addFaculty = async () => {
  try {
    isAddingFaculty.value = true
    const response = await userPost('/admin-create-faculty', { name: newFacultyName.value })
    if (response.data.success) {
      init({ message: response.data.message, color: 'success' })
      const newFaculty: Faculty = {
        id: response.data.data.id,
        name: response.data.data.name,
        departments: [],
        showDepartments: false,
      }
      faculties.value.push(newFaculty)
      newFacultyName.value = ''
    } else {
      if (response.data.errors) {
        const errorMessage = response.data.message || 'Invalid credentials'
        const errorDetails = Object.values(response.data.errors).flat().join(', ')
        init({ message: `${errorMessage}: ${errorDetails}`, color: 'danger' })
      } else {
        init({ message: response.data.message, color: 'danger' })
      }
    }
  } catch (error) {
    console.error('Failed to add faculty:', error)
  } finally {
    isAddingFaculty.value = false
  }
}

const showEditFacultyModal = (faculty: Faculty) => {
  Swal.fire({
    title: 'Edit Faculty',
    input: 'text',
    inputValue: faculty.name,
    showCancelButton: true,
    confirmButtonText: 'Update',
    cancelButtonText: 'Cancel',
    preConfirm: async (updatedName) => {
      try {
        const responsed = await userPatch(`/admin-update-faculty/${faculty.id}`, { name: updatedName })
        if (responsed.data.success) {
          init({ message: responsed.data.message, color: 'success' })
          faculty.name = updatedName
          Swal.fire('Success', 'Faculty updated successfully', 'success')
        } else {
          if (responsed.data.errors) {
            const errorMessage = responsed.data.message || 'Invalid credentials'
            const errorDetails = Object.values(responsed.data.errors).flat().join(', ')
            init({ message: `${errorMessage}: ${errorDetails}`, color: 'danger' })
          } else {
            init({ message: responsed.data.message, color: 'danger' })
          }
        }
      } catch (error) {
        console.error('Failed to update faculty:', error)
        Swal.fire('Error', 'Failed to update faculty', 'error')
      }
    },
  })
}

const showDeleteFacultyModal = (faculty: Faculty) => {
  Swal.fire({
    title: 'Delete Faculty',
    text: `Are you sure you want to delete the faculty "${faculty.name}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    preConfirm: async () => {
      try {
        const responsed = await userDelete(`/admin-delete-faculty/${faculty.id}`)
        if (responsed.data.success) {
          init({ message: responsed.data.message, color: 'success' })
          faculties.value = faculties.value.filter((f) => f.id !== faculty.id)
          Swal.fire('Success', 'Faculty deleted successfully', 'success')
        } else {
          if (responsed.data.errors) {
            const errorMessage = responsed.data.message || 'Invalid credentials'
            const errorDetails = Object.values(responsed.data.errors).flat().join(', ')
            init({ message: `${errorMessage}: ${errorDetails}`, color: 'danger' })
          } else {
            init({ message: responsed.data.message, color: 'danger' })
          }
        }
      } catch (error) {
        console.error('Failed to delete faculty:', error)
        Swal.fire('Error', 'Failed to delete faculty', 'error')
      }
    },
  })
}
</script>
