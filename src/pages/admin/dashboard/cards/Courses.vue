<template>
  <div>
    <div class="mb-4">
      <h2 class="card-title text-primary font-bold uppercase mb-3">Lecturers</h2>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Lecturer</th>
            <th>Manage Course</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td colspan="4" class="text-center">
              <Icon icon="line-md:loading-loop" width="48" height="48" class="animate-spin" />
            </td>
          </tr>
          <tr v-else-if="courses.length === 0">
            <td colspan="4" class="text-center">No courses found.</td>
          </tr>
          <tr v-for="course in courses" v-else :key="course.id">
            <td>{{ course.name }}</td>
            <td>{{ course.department }}</td>
            <td>
              <span v-if="course.lecturer">{{ course.lecturer }}</span>
              <button v-else class="btn btn-primary btn-sm" @click="showAssignLecturerModal(course)">
                Assign Lecturer
              </button>
            </td>
            <td>
              <button class="btn btn-danger btn-sm" @click="showDeleteConfirmation(course)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div>
      <h3 class="card-title text-primary font-bold uppercase mb-3">Add Course</h3>
      <form @submit.prevent="addCourse">
        <div class="mb-3">
          <label for="course-name" class="form-label">Course Name</label>
          <input id="course-name" v-model="newCourseName" type="text" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="department" class="form-label">Department</label>
          <select id="department" v-model="selectedDepartmentId" class="form-select" required>
            <option value="" disabled>Select a department</option>
            <option v-for="department in departments" :key="department.id" :value="department.id">
              {{ department.name }}
            </option>
          </select>
        </div>
        <VaButton class="w-full" type="submit" :loading="isAddingCourse">Add Course</VaButton>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { userGet, userDelete, userPatch, userPost } from '@/plugins/http'
import Swal from 'sweetalert2'
import { useToast } from 'vuestic-ui'
import { Icon } from '@iconify/vue'

interface Course {
  id: number
  name: string
  lecturer: string
  department_id: number
  department: string
}

interface Department {
  id: number
  name: string
}

interface Lecturer {
  id: number
  fullname: string
  department_id: number
  department: string
}

const { init } = useToast()
const courses = ref<Course[]>([])
const lecturers = ref<Lecturer[]>([])
const departments = ref<Department[]>([])
const newCourseName = ref('')
const selectedDepartmentId = ref('')
const isLoading = ref(true)
const isAddingCourse = ref(false)

onMounted(async () => {
  try {
    const response = await userGet('/departments/courses')
    courses.value = response.data.data

    const lecturerResponse = await userGet('/admin-view-lecturers')
    lecturers.value = lecturerResponse.data.data

    const departmentResponse = await userGet('/fetch-departments')
    departments.value = departmentResponse.data.data
  } catch (error) {
    console.error('Failed to fetch data:', error)
  } finally {
    isLoading.value = false
  }
})

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

const showDeleteConfirmation = (course: Course) => {
  showConfirmation('Delete Course', 'Are you sure you want to delete this course?', () => deleteCourse(course))
}

const deleteCourse = async (course: Course) => {
  try {
    const responsed = await userDelete(`/admin-delete-course/${course.id}`)
    if (responsed.data.success) {
      init({ message: responsed.data.message, color: 'success' })
      // Fetch updated list of courses from the server
      const response = await userGet('/departments/courses')
      courses.value = response.data.data
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
    console.error('Failed to delete course:', error)
  }
}

const showAssignLecturerModal = (course: Course) => {
  Swal.fire({
    title: 'Assign Lecturer',
    input: 'select',
    inputOptions: lecturers.value
      .filter((lecturer) => lecturer.department_id === course.department_id)
      .reduce(
        (options, lecturer) => ({
          ...options,
          [lecturer.id]: lecturer.fullname,
        }),
        {},
      ),
    showCancelButton: true,
    confirmButtonText: 'Assign',
    cancelButtonText: 'Cancel',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const lecturerId = parseInt(result.value)
        const courseId = course.id
        const lecturer = lecturers.value.find((l) => l.id === lecturerId)
        if (lecturer) {
          const responsed = await userPatch(`/admin/assign-course-to-lecturer`, {
            lecturer_id: lecturerId,
            course_id: courseId,
          })

          if (responsed.data.success) {
            init({ message: responsed.data.message, color: 'success' })
            // Fetch updated list of courses from the server
            const response = await userGet('/departments/courses')
            courses.value = response.data.data
            // Update the local course data with the lecturer's name
            const updatedCourse = courses.value.find((c) => c.id === course.id)
            if (updatedCourse) {
              updatedCourse.lecturer = lecturer.fullname
            }
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
        }
      } catch (error) {
        console.error('Failed to assign lecturer:', error)
      }
    }
  })
}

const addCourse = async () => {
  try {
    isAddingCourse.value = true
    const responsed = await userPost('/admin-create-course', {
      name: newCourseName.value,
      department_id: selectedDepartmentId.value,
    })

    if (responsed.data.success) {
      init({ message: responsed.data.message, color: 'success' })
      // Fetch updated list of courses from the server
      const response = await userGet('/departments/courses')
      courses.value = response.data.data
      // Clear the form fields
      newCourseName.value = ''
      selectedDepartmentId.value = ''
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
    console.error('Failed to add course:', error)
  } finally {
    isAddingCourse.value = false
  }
}
</script>
