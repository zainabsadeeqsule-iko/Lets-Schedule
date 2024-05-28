<template>
  <VaCard>
    <VaCardContent>
      <section>
        <header class="flex items-center justify-between">
          <div class="text-lg font-semibold grow">{{ value }}</div>
        </header>
        <div>
          <p class="mb-2">{{ title }}</p>
        </div>
      </section>
    </VaCardContent>
  </VaCard>
</template>

<script lang="ts" setup>
import { VaCard } from 'vuestic-ui'

defineProps<{
  title: string
  value: string | number
}>()
</script>
