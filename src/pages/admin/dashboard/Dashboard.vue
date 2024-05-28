<script lang="ts" setup>
import DataSection from './DataSection.vue'
import ScheduleTable from './cards/Schedule.vue' // Import the new table component
import Faculies from './cards/Faculties.vue'
import Departments from './cards/Departments.vue'
import Lecturers from './cards/Lecturers.vue'
</script>

<template>
  <section class="flex flex-col gap-4">
    <DataSection />
    <div class="flex flex-col sm:flex-row gap-4">
      <ScheduleTable class="w-full" />
    </div>
    <div class="flex flex-col md:flex-row gap-4">
      <Faculies class="w-3/4" /> <Departments class="w-3/4" /> <Lecturers class="w-1/2" />
    </div>
    <!-- Add the new table component to the template -->
  </section>
</template>
