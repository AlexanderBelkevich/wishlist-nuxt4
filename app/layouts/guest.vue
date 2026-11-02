<script setup lang="ts">
const { loggedIn } = useUserSession()
</script>

<template>
  <div class="flex min-h-screen flex-col">
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
          <UButton
            v-if="loggedIn"
            to="/lists"
            label="Мои вишлисты"
            color="neutral"
            variant="ghost"
          />
          <UButton
            v-else
            to="/auth/github"
            external
            label="Создать свой вишлист"
            color="neutral"
            variant="outline"
          />
        </div>
      </UContainer>
    </header>
    <main class="flex-1">
      <slot />
    </main>
    <footer class="py-6 text-center text-sm text-muted">
      Вишлист - дарите то, что действительно хотят
    </footer>
  </div>
</template>
