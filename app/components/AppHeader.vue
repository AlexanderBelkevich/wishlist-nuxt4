<script setup lang="ts">
const { loggedIn, user } = useUserSession()

const logout = useLogout()
</script>

<template>
  <header class="border-b border-default">
    <UContainer class="flex h-16 items-center justify-between">
      <NuxtLink
        to="/"
        class="flex items-center gap-2 font-semibold"
      >
        <UIcon
          name="i-lucide-gift"
          class="size-6 text-primary"
        />
        Вишлист
      </NuxtLink>

      <div class="flex items-center gap-2">
        <UColorModeButton />
        <template v-if="loggedIn && user">
          <UUser
            :name="user.name"
            :description="`@${user.login}`"
            :avatar="{ src: user.avatarUrl, alt: user.name }"
            to="/lists"
          />
          <UButton
            icon="i-lucide-log-out"
            color="neutral"
            variant="ghost"
            label="Выйти"
            @click="logout"
          />
        </template>
        <UButton
          v-else
          to="/auth/github"
          external
          icon="i-simple-icons-github"
          label="Войти через GitHub"
          color="neutral"
        />
      </div>
    </UContainer>
  </header>
</template>
