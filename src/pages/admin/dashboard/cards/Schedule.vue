<!-- ScheduleTable.vue -->
<template>
  <div>
    <h2 class="card-title text-primary font-bold uppercase mb-3">Schedules</h2>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Course</th>
          <th>Lecturer</th>
          <th>Date</th>
          <th>Start Time</th>
          <th>End Time</th>
          <th>Actions</th>
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
        <tr v-for="(schedule, index) in schedules" v-else :key="index">
          <td>{{ schedule.course }}</td>
          <td>{{ schedule.lecturer }}</td>
          <td>{{ schedule.date }}</td>
          <td>{{ schedule.startTime }}</td>
          <td>{{ schedule.endTime }}</td>
          <td>
            <template v-if="schedule.approved === 0">
              <button class="btn btn-success btn-sm me-2" @click="showApproveConfirmation(schedule)">Approve</button>
            </template>
            <template v-else>
              <span class="text-success">Approved</span>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { userGet, userPut, userPatch } from '@/plugins/http'
import { Icon } from '@iconify/vue'
import Swal from 'sweetalert2'

interface Schedule {
  id: number
  course: string
  lecturer: string
  date: string
  startTime: string
  endTime: string
  approved: number
}

const schedules = ref<Schedule[]>([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    const response = await userGet('/admin-view-schedules')
    schedules.value = response.data.data
  } catch (error) {
    console.error('Failed to fetch schedules:', error)
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

const showApproveConfirmation = (schedule: Schedule) => {
  showConfirmation('Approve Schedule', 'Are you sure you want to approve this schedule?', () =>
    approveSchedule(schedule),
  )
}

const approveSchedule = async (schedule: Schedule) => {
  try {
    await userPatch(`/admin-approve-schedule/${schedule.id}`)
    try {
      isLoading.value = true
      const response = await userGet('/admin-view-schedules')
      schedules.value = response.data.data
    } catch (error) {
      console.error('Failed to fetch schedules:', error)
    } finally {
      isLoading.value = false
    }
  } catch (error) {
    console.error('Failed to approve schedule:', error)
  }
}

const rejectSchedule = async (schedule: Schedule) => {
  try {
    await userPut(`/api/schedules/${schedule.id}/reject`)
    schedule.approved = 0
  } catch (error) {
    console.error('Failed to reject schedule:', error)
  }
}
</script>
