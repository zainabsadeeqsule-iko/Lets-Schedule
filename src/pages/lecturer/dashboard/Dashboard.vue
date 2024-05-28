<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import { userGet } from '@/plugins/http'
import { Icon } from '@iconify/vue'

const currentDate = new Date()
const events = ref([])
const lecturerData = ref(null)
const currentDateTime = ref(new Date())
const isLoading = ref(true)

const currentTime = computed(() => {
  return formatTime(currentDateTime.value)
})

const currentDateFormatted = computed(() => {
  return formatDate(currentDateTime.value)
})

onMounted(async () => {
  try {
    const response = await userGet('/lecturer-view-schedules')
    if (response.data.success) {
      events.value = response.data.data.map((event: any) => ({
        start: new Date(`${event.schedule_date}T${event.start_time}`),
        end: new Date(`${event.schedule_date}T${event.end_time}`),
        title: event.course.name,
      }))
      console.log('Events:', events.value)
    } else {
      console.error('Failed to fetch events:', response.data.message)
    }
  } catch (error) {
    console.error('Failed to fetch events:', error)
  } finally {
    isLoading.value = false
  }

  const storedData = localStorage.getItem('lecturerData')
  if (storedData) {
    lecturerData.value = JSON.parse(storedData)
  }

  setInterval(() => {
    currentDateTime.value = new Date()
  }, 1000)
})

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function formatDate(date: Date) {
  const options = { day: 'numeric', month: 'long', year: 'numeric' }
  return date.toLocaleDateString('en-US', options)
}
</script>

<template>
  <section class="flex flex-col gap-4">
    <div v-if="lecturerData">
      <p>
        Hello <b>{{ lecturerData.name }}</b
        >, the time is <b>{{ currentTime }}</b> and today's date is <b>{{ currentDateFormatted }}</b
        >.
      </p>
    </div>
    <div class="flex flex-col gap-4">
      <template v-if="isLoading">
        <div class="text-center">
          <Icon icon="line-md:loading-loop" width="48" height="48" class="animate-spin" />
        </div>
      </template>
      <template v-else>
        <VueCal
          :selected-date="currentDate"
          :time-from="9 * 60"
          :time-to="23 * 60"
          :disable-views="['years', 'year', 'month', 'day']"
          hide-weekends
          :events="events"
        />
      </template>
    </div>
  </section>
</template>

<style scoped>
.vuecal__menu,
.vuecal__cell-events-count {
  background-color: #42b983;
}
</style>
