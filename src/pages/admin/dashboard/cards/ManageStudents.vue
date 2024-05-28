<template>
  <div>
    <h2 class="card-title text-primary font-bold uppercase mb-3">Students</h2>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Name</th>
          <th>School ID</th>
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
        <tr v-else-if="students.length === 0">
          <td colspan="5" class="text-center">No students found.</td>
        </tr>
        <tr v-for="student in students" v-else :key="student.id">
          <td>{{ student.fullname }}</td>
          <td>{{ student.school_id }}</td>
          <td>{{ student.faculty }}</td>
          <td>{{ student.department }}</td>
          <td>
            <button class="btn btn-warning btn-sm me-2" @click="showEditStudentModal(student)">Edit</button>
            <button class="btn btn-danger btn-sm" @click="showDeleteConfirmation(student)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { userGet, userPatch, userDelete } from '@/plugins/http'
import Swal from 'sweetalert2'
import { useToast } from 'vuestic-ui'
import { Icon } from '@iconify/vue'

interface Student {
  id: number
  fullname: string
  school_id: string
  faculty: string
  department: string
}

const { init } = useToast()
const students = ref<Student[]>([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    const response = await userGet('/admin-view-students')
    students.value = response.data.data
  } catch (error) {
    console.error('Failed to fetch students:', error)
  } finally {
    isLoading.value = false
  }
})

const showDeleteConfirmation = (student: Student) => {
  showConfirmation('Delete Student', 'Are you sure you want to delete this student?', () => deleteStudent(student))
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

const deleteStudent = async (student: Student) => {
  try {
    await userDelete(`/admin-delete-student/${student.id}`)
    students.value = students.value.filter((s) => s.id !== student.id)
  } catch (error) {
    console.error('Failed to delete student:', error)
  }
}

const showEditStudentModal = (student: Student) => {
  Swal.fire({
    title: 'Edit Student',
    html: `
      <input id="student-name" class="swal2-input" placeholder="Full Name" value="${student.fullname}" style="font-size: 14px; width: 300px;">
    `,
    confirmButtonText: 'Update',
    cancelButtonText: 'Cancel',
    showCancelButton: true,
    preConfirm: () => {
      const name = (document.getElementById('student-name') as HTMLInputElement).value
      return [name, student.id]
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const [updatedName, studentId] = result.value
        const responsed = await userPatch(`/admin-update-student/${studentId}`, {
          name: updatedName,
        })
        if (responsed.data.success) {
          init({ message: responsed.data.message, color: 'success' })
          const response = await userGet('/admin-view-students')
          students.value = response.data.data
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
        console.error('Failed to update student:', error)
      }
    }
  })
}
</script>
