<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useSeoMeta({ title: 'Мои вишлисты' })

const { user } = useUserSession()
</script>

<template>
  <UContainer>
    <h1 class="text-2xl font-semibold">
      Мои вишлисты
    </h1>
    <p class="mt-1 text-muted">
      Привет, {{ user?.name }}
    </p>
    <UEmpty
      class="mt-8"
      icon="i-lucide-gift"
      title="Здесь пока пусто"
      description="Скоро здесь появятся ваши вишлисты"
    />
  </UContainer>
</template>
