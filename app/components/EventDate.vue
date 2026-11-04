<script setup lang="ts">
defineProps<{ date: string }>()
</script>

<template>
  <span class="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
    <NuxtTime
      :datetime="date"
      day="numeric"
      month="long"
      year="numeric"
      time-zone="UTC"
      locale="ru-RU"
    />
    <ClientOnly>
      <span class="rounded-full bg-white/20 px-2 py-0.5 text-sm font-semibold">
        {{ formatCountdown(daysUntil(date)) }}
      </span>
    </ClientOnly>
  </span>
</template>
