<script setup lang="ts">
useHead({ titleTemplate: title => (title ? `${title} - Вишлист` : 'Вишлист') })
</script>

<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
