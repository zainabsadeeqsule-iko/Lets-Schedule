<template>
  <div>
    <h2 class="card-title text-primary font-bold uppercase mb-3">Schedules</h2>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Course</th>
          <th>Start Time</th>
          <th>End Time</th>
          <th>Schedule Date</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="isLoading">
          <td colspan="6" class="text-center">
            <Icon icon="line-md:loading-loop" width="48" height="48" class="animate-spin" />
          </td>
        </tr>
        <tr v-else-if="schedules.length === 0">
          <td colspan="6" class="text-center">No schedules found.</td>
        </tr>
        <tr v-else v-for="schedule in schedules" :key="schedule.id">
          <td>{{ schedule.course.name }}</td>
          <td>{{ schedule.start_time }}</td>
          <td>{{ schedule.end_time }}</td>
          <td>{{ schedule.schedule_date }}</td>
          <template v-if="schedule.approved === 0">
            <td class="text-info">Pending</td>
          </template>
          <template v-else>
            <td class="text-success">Approved</td>
          </template>
          <td>
            <button class="btn btn-danger btn-sm me-2" @click="showDeleteConfirmation(schedule)">Delete</button>
            <button class="btn btn-primary btn-sm" @click="showEditSchedule(schedule)">Edit</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="mt-4">
      <h3 class="card-title text-primary font-bold uppercase mb-3">Add Schedule</h3>
      <form @submit.prevent="addSchedule">
        <div class="mb-3">
          <label for="course" class="form-label">Course</label>
          <select id="course" v-model="newSchedule.course_id" class="form-select" required>
            <option value="" disabled>Select a course</option>
            <option v-for="course in courses" :key="course.id" :value="course.id">
              {{ course.name }}
            </option>
          </select>
        </div>
        <div class="mb-3">
          <label for="start-time" class="form-label">Start Time</label>
          <input id="start-time" v-model="newSchedule.start_time" type="time" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="end-time" class="form-label">End Time</label>
          <input id="end-time" v-model="newSchedule.end_time" type="time" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="schedule-date" class="form-label">Schedule Date</label>
          <input id="schedule-date" v-model="newSchedule.schedule_date" type="date" class="form-control" required />
        </div>
        <VaButton class="w-full" type="submit" :loading="isAddingSchedule">Add Schedule</VaButton>
      </form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { userGet, userPost, userPatch, userDelete } from '@/plugins/http'
import Swal from 'sweetalert2'
import { useToast } from 'vuestic-ui'
import { Icon } from '@iconify/vue'

interface Schedule {
  id: number
  start_time: string
  end_time: string
  schedule_date: string
  approved: number
  course: {
    id: number
    name: string
  }
}

interface Course {
  id: number
  name: string
}

const { init } = useToast()
const schedules = ref<Schedule[]>([])
const courses = ref<Course[]>([])
const newSchedule = ref<Partial<Schedule>>({
  course_id: 0,
  start_time: '',
  end_time: '',
  schedule_date: '',
})
const isLoading = ref(true)
const isAddingSchedule = ref(false)

onMounted(async () => {
  try {
    const response = await userGet('/lecturer-view-schedules')
    schedules.value = response.data.data
  } catch (error) {
    console.error('Failed to fetch schedules:', error)
  } finally {
    isLoading.value = false
  }

  try {
    const courseResponse = await userGet('/lecturer-view-courses')
    courses.value = courseResponse.data.data
  } catch (error) {
    console.error('Failed to fetch courses:', error)
  }
})

const showDeleteConfirmation = (schedule: Schedule) => {
  showConfirmation('Delete Schedule', 'Are you sure you want to delete this schedule?', () => deleteSchedule(schedule))
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

const deleteSchedule = async (schedule: Schedule) => {
  try {
    await userDelete(`/lecturer-delete-schedule/${schedule.id}`)
    schedules.value = schedules.value.filter((s) => s.id !== schedule.id)
  } catch (error) {
    console.error('Failed to delete schedule:', error)
  }
}

const showEditSchedule = (schedule: Schedule) => {
  Swal.fire({
    title: 'Edit Schedule',
    html: `
    <div class="mb-3">
      <label for="edit-start-time" class="form-label">Start Time</label>
      <input type="time" id="edit-start-time" class="form-control swal2-input" value="${schedule.start_time.slice(
        0,
        5,
      )}" required />
    </div>
    <div class="mb-3">
      <label for="edit-end-time" class="form-label">End Time</label>
      <input type="time" id="edit-end-time" class="form-control swal2-input" value="${schedule.end_time.slice(
        0,
        5,
      )}" required />
    </div>
    <div class="mb-3">
      <label for="edit-schedule-date" class="form-label">Schedule Date</label>
      <input type="date" id="edit-schedule-date" class="form-control swal2-input" value="${
        schedule.schedule_date
      }" required />
    </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Update',
    preConfirm: () => {
      const startTime = (document.getElementById('edit-start-time') as HTMLInputElement).value
      const endTime = (document.getElementById('edit-end-time') as HTMLInputElement).value
      const scheduleDate = (document.getElementById('edit-schedule-date') as HTMLInputElement).value

      return {
        start_time: startTime + ':00',
        end_time: endTime + ':00',
        schedule_date: scheduleDate,
      }
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await userPatch(`/lecturer-update-schedule/${schedule.id}`, result.value)
        const response = await userGet('/lecturer-view-schedules')
        schedules.value = response.data.data
      } catch (error) {
        console.error('Failed to update schedule:', error)
      }
    }
  })
}

const addSchedule = async () => {
  try {
    isAddingSchedule.value = true
    const formattedStartTime = newSchedule.value.start_time ? newSchedule.value.start_time + ':00' : ''
    const formattedEndTime = newSchedule.value.end_time ? newSchedule.value.end_time + ':00' : ''

    const response = await userPost('/lecturer-create-schedule', {
      ...newSchedule.value,
      start_time: formattedStartTime,
      end_time: formattedEndTime,
    })

    if (response.data.success) {
      init({ message: response.data.message, color: 'success' })
      const updatedResponse = await userGet('/lecturer-view-schedules')
      schedules.value = updatedResponse.data.data
    } else {
      if (response.data.errors) {
        const errorMessage = response.data.message || 'Invalid data'
        const errorDetails = Object.values(response.data.errors).flat().join(', ')
        init({ message: `${errorMessage}: ${errorDetails}`, color: 'danger' })
      } else {
        init({ message: response.data.message, color: 'danger' })
      }
    }
  } catch (error) {
    console.error('Failed to add schedule:', error)
  } finally {
    isAddingSchedule.value = false
  }
}
</script>
