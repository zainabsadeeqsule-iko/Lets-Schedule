<template>
  <div>
    <VueCal
      :selected-date="currentDate"
      :time-from="9 * 60"
      :time-to="23 * 60"
      :disable-views="['years', 'year', 'month']"
      hide-weekends
      :events="events"
    >
    </VueCal>
  </div>
</template>
<script>
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'

export default {
  components: {
    VueCal,
  },
  data() {
    return {
      currentDate: new Date(),
      events: [
        {
          start: '2024-05-16 10:30',
          end: '2024-05-16 11:30',
          title: 'Doctor appointment',
          content: '<i class="icon material-icons">local_hospital</i>',
          class: 'health',
        },
        {
          start: '2024-05-20 14:00',
          end: '2024-05-20 16:00',
          title: 'Meeting with John',
          content: '<i class="icon material-icons">business_center</i>',
          class: 'work',
        },
        {
          start: '2024-06-02 19:00',
          end: '2024-06-02 21:00',
          title: 'Birthday Party',
          content: '<i class="icon material-icons">cake</i>',
          class: 'birthday',
        },
        // Add more events here
      ],
    }
  },
}
</script>
<style scoped>
/* Add any custom styles for the calendar component */
</style>
