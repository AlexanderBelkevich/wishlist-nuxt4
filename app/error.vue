<script setup lang="ts">
import type { NuxtError } from '#app'
import { ru } from '@nuxt/ui/locale'

const props = defineProps<{ error: NuxtError }>()

const title = computed(() => props.error.statusCode === 404 ? 'Такой страницы нет' : 'Что-то сломалось')

useSeoMeta({ title })
</script>

<template>
  <UApp :locale="ru">
    <NuxtLayout>
      <UContainer class="py-10">
        <UEmpty
          icon="i-lucide-gift"
          :title="title"
          :description="error.message"
          :actions="[{ label: 'На главную', onClick: () => clearError({ redirect: '/' }) }]"
        />
      </UContainer>
    </NuxtLayout>
  </UApp>
</template>
