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
        <UButton
          to="/lists"
          label="Мои вишлисты"
          color="neutral"
          variant="ghost"
        />
        <UColorModeButton />
      </div>
    </UContainer>
  </header>
</template>
