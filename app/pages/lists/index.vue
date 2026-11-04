<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useSeoMeta({ title: 'Мои вишлисты' })

const { user } = useUserSession()
const { data: wishlists, status } = useApi('/api/wishlists', { lazy: true })
const { $api } = useNuxtApp()

const state = reactive({ title: '' })
async function create() {
  try {
    const wishlist = await $api('/api/wishlists', { method: 'POST', body: state })
    await navigateTo(`/lists/${wishlist.id}`)
  }
  catch {
    // Обработали в $api
  }
}
</script>

<template>
  <UContainer class="py-10">
    <h1 class="text-2xl font-semibold">
      Мои вишлисты
    </h1>
    <p class="mt-1 text-muted">
      Привет, {{ user?.name }}
    </p>
    <UForm
      :schema="wishlistSchema"
      :state="state"
      class="mt-6 flex items-start gap-2"
      @submit="create"
    >
      <UFormField
        name="title"
        class="flex-1"
      >
        <UInput
          v-model="state.title"
          placeholder="Например, День рождения"
          class="w-full"
        />
      </UFormField>
      <UButton
        type="submit"
        icon="i-lucide-plus"
        label="Создать"
      />
    </UForm>
    <div
      v-if="status === 'pending' && !wishlists"
      class="mt-6 space-y-2"
    >
      <USkeleton
        v-for="n in 3"
        :key="n"
        class="h-20 rounded-xl"
      />
    </div>
    <UEmpty
      v-if="!wishlists?.length"
      class="mt-8"
      icon="i-lucide-gift"
      title="Здесь пока пусто"
      description="Скоро здесь появятся ваши вишлисты"
    />
    <ul
      v-else
      class="mt-6 space-y-2"
    >
      <li
        v-for="wishlist in wishlists"
        :key="wishlist.id"
      >
        <NuxtLink
          :to="`/lists/${wishlist.id}`"
          class="flex items-center gap-4 rounded-xl bg-linear-to-br p-4 text-white transition hover:opacity-90"
          :class="wishlistGradients[wishlist.color]"
        >
          <span class="text-3xl">
            {{ wishlist.emoji }}
          </span>
          <div class="min-w-0">
            <p class="font-semibold break-words">{{ wishlist.title }}</p>
            <EventDate
              v-if="wishlist.eventDate"
              :date="wishlist.eventDate"
              class="text-sm text-white/90"
            />
          </div>
        </NuxtLink>
      </li>
    </ul>
  </UContainer>
</template>
