<script lang="ts" setup>
import Departments from './cards/ManageDepartments.vue'
</script>

<template>
  <section class="flex flex-col gap-4">
    <div class="flex flex-col md:flex-row gap-4">
      <Departments class="w-full" />
    </div>
    <!-- Add the new table component to the template -->
  </section>
</template>
