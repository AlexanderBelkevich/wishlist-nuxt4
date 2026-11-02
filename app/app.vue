<script setup lang="ts">
import { ru } from '@nuxt/ui/locale'

useHead({ titleTemplate: title => (title ? `${title} - Вишлист` : 'Вишлист') })
</script>

<template>
  <UApp :locale="ru">
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
