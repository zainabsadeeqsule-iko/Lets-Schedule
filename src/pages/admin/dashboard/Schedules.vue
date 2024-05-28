<script lang="ts" setup>
import ScheduleTable from './cards/Schedule.vue' // Import the new table component
</script>

<template>
  <section class="flex flex-col gap-4">
    <div class="flex flex-col sm:flex-row gap-4">
      <ScheduleTable class="w-full" />
    </div>
    <!-- Add the new table component to the template -->
  </section>
</template>
