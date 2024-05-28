<template>
  <div>
    <h2 class="card-title text-primary font-bold uppercase mb-3">Lecturers</h2>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Faculty</th>
          <th>Department</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="isLoading">
          <td colspan="5" class="text-center">
            <Icon icon="line-md:loading-loop" width="48" height="48" class="animate-spin" />
          </td>
        </tr>
        <tr v-else-if="lecturers.length === 0">
          <td colspan="5" class="text-center">No lecturers found.</td>
        </tr>
        <tr v-for="lecturer in lecturers" v-else :key="lecturer.id">
          <td>{{ lecturer.fullname }}</td>
          <td>{{ lecturer.email }}</td>
          <td>{{ lecturer.faculty }}</td>
          <td>{{ lecturer.department }}</td>
          <td>
            <button class="btn btn-danger btn-sm me-2" @click="showDeleteConfirmation(lecturer)">Delete</button>
            <button class="btn btn-danger btn-sm" @click="showEditLecturerPassword(lecturer)">Change Password</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="mt-4">
      <h3 class="card-title text-primary font-bold uppercase mb-3">Add Lecturer</h3>
      <form @submit.prevent="addLecturer">
        <div class="mb-3">
          <label for="lecturer-name" class="form-label">Full Name</label>
          <input id="lecturer-name" v-model="newLecturer.fullname" type="text" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="lecturer-email" class="form-label">Email</label>
          <input id="lecturer-email" v-model="newLecturer.email" type="email" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="lecturer-phone" class="form-label">Phone Number</label>
          <input id="lecturer-phone" v-model="newLecturer.phone" type="text" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="lecturer-department" class="form-label">Department</label>
          <select id="lecturer-department" v-model="newLecturer.department_id" class="form-select" required>
            <option value="" disabled>Select a department</option>
            <option v-for="department in departments" :key="department.id" :value="department.id">
              {{ department.name }}
            </option>
          </select>
        </div>
        <div class="mb-3">
          <label for="lecturer-password" class="form-label">Password</label>
          <input id="lecturer-password" v-model="newLecturer.password" type="password" class="form-control" required />
        </div>
        <VaButton class="w-full" type="submit" :loading="isAddingLecturer">Add Lecturer</VaButton>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { userGet, userPatch, userPost, userDelete } from '@/plugins/http'
import Swal from 'sweetalert2'
import { useToast } from 'vuestic-ui'
import { Icon } from '@iconify/vue'

interface Lecturer {
  id: number
  fullname: string
  email: string
  phone: string
  faculty: string
  department: string
  department_id: number
  password: string
}

interface Department {
  id: number
  name: string
}

const { init } = useToast()
const lecturers = ref<Lecturer[]>([])
const departments = ref<Department[]>([])
const newLecturer = ref<Lecturer>({
  id: 0,
  fullname: '',
  email: '',
  phone: '',
  faculty: '',
  department: '',
  department_id: 0,
  password: '',
})
const isLoading = ref(true)
const isAddingLecturer = ref(false)

onMounted(async () => {
  try {
    const response = await userGet('/admin-view-lecturers')
    lecturers.value = response.data.data
  } catch (error) {
    console.error('Failed to fetch departments:', error)
  } finally {
    isLoading.value = false
  }

  try {
    const departmentResponse = await userGet('/fetch-departments')
    departments.value = departmentResponse.data.data
  } catch (error) {
    console.error('Failed to fetch data:', error)
  }
})

const showDeleteConfirmation = (lecturer: Lecturer) => {
  showConfirmation('Delete Lecturer', 'Are you sure you want to delete this lecturer?', () => deleteLecturer(lecturer))
}

const showConfirmation = (title: string, message: string, callback: () => void) => {
  Swal.fire({
    title: title,
    text: message,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
  }).then((result) => {
    if (result.isConfirmed) {
      callback()
    }
  })
}

const deleteLecturer = async (lecturer: Lecturer) => {
  try {
    await userDelete(`/admin-delete-lecturer/${lecturer.id}`)

    // Fetch updated list of lecturers from the server
    const response = await userGet('/admin-view-lecturers')
    lecturers.value = response.data.data
  } catch (error) {
    console.error('Failed to delete lecturer:', error)
  }
}

const showEditLecturerPassword = (lecturer: Lecturer) => {
  Swal.fire({
    title: 'Change Password',
    html: `
    <input id="lecturer-password" class="swal2-input" placeholder="Password" type="password" style="font-size: 14px; width: 300px;">
    <input id="confirm-password" class="swal2-input" placeholder="Confirm Password" type="password" style="font-size: 14px; width: 300px;">
    `,
    confirmButtonText: 'Update',
    cancelButtonText: 'Cancel',
    showCancelButton: true,
    preConfirm: () => {
      const password = (document.getElementById('lecturer-password') as HTMLInputElement).value
      const confirmPassword = (document.getElementById('confirm-password') as HTMLInputElement).value
      return [password, confirmPassword, lecturer.id]
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const [updatedPassword, confirmPassword, lecturerId] = result.value
        const responsed = await userPatch(`/admin-update-lecturer/${lecturerId}`, {
          password: updatedPassword,
          password_confirmation: confirmPassword,
        })

        if (responsed.data.success) {
          init({ message: responsed.data.message, color: 'success' })
          // Fetch updated list of lecturers from the server
          const response = await userGet('/admin-view-lecturers')
          lecturers.value = response.data.data
        } else {
          if (responsed.data.errors) {
            // Extract the error message from the response data
            const errorMessage = responsed.data.message || 'Invalid credentials'
            const errorDetails = Object.values(responsed.data.errors).flat().join(', ')
            init({ message: `${errorMessage}: ${errorDetails}`, color: 'danger' })
          } else {
            init({ message: responsed.data.message, color: 'danger' })
          }
        }
      } catch (error) {
        console.error('Failed to update lecturer:', error)
      }
    }
  })
}

const addLecturer = async () => {
  try {
    isAddingLecturer.value = true
    const responsed = await userPost('/admin-add-lecturer', {
      name: newLecturer.value.fullname,
      email: newLecturer.value.email,
      phone: newLecturer.value.phone,
      department_id: newLecturer.value.department_id,
      password: newLecturer.value.password,
    })

    if (responsed.data.success) {
      init({ message: responsed.data.message, color: 'success' })
      // Fetch updated list of lecturers from the server
      const response = await userGet('/admin-view-lecturers')
      lecturers.value = response.data.data
      // Clear the form fields
      newLecturer.value.fullname = ''
      newLecturer.value.email = ''
      newLecturer.value.department_id = 0
      newLecturer.value.password = ''
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
    console.error('Failed to add lecturer:', error)
  } finally {
    isAddingLecturer.value = false
  }
}
</script>
