<script setup lang="ts">
const { loggedIn } = useUserSession()

const links = computed(() => [
  loggedIn.value
    ? { label: 'Мои вишлисты', to: '/lists', icon: 'i-lucide-list' }
    : { label: 'Войти через GitHub', to: '/auth/github', external: true, icon: 'i-simple-icons-github' },
])
</script>

<template>
  <UPageHero
    title="Вишлист без испорченных сюрпризов"
    description="Соберите подарки в список и поделитесь ссылкой. Друзья бронируют подарки, а вы не узнаете, кто что выбрал"
    :links="links"
  />
</template>
