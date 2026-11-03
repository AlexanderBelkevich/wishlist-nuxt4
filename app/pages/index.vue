<script setup lang="ts">
const { loggedIn } = useUserSession()
const config = useRuntimeConfig()
const description = 'Выберите подарок и забронируйте его, чтобы не подарить то же, что и другие'

useSeoMeta({
  ogTitle: 'Вишлист',
  description,
  ogDescription: description,
  ogImage: `${config.public.siteUrl}/og.png`,
  ogSiteName: 'Вишлист',
  twitterCard: 'summary_large_image',
})

const links = computed(() => [
  loggedIn.value
    ? { label: 'Мои вишлисты', to: '/lists', icon: 'i-lucide-list' }
    : { label: 'Войти через GitHub', to: '/auth/github', external: true, icon: 'i-simple-icons-github' },
])
</script>

<template>
  <UPageHero
    title="Вишлист без испорченных сюрпризов"
    :description="description"
    :links="links"
  />
</template>
