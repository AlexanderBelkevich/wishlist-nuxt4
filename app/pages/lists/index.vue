<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useSeoMeta({ title: 'Мои вишлисты' })

const { user } = useUserSession()
const toast = useToast()
const { data: wishlists, refresh } = await useFetch('/api/wishlists')

const state = reactive({ title: '' })
async function create() {
  try {
    await $fetch('/api/wishlists', { method: 'POST', body: state })
    state.title = ''
    await refresh()
  }
  catch (error) {
    const message = (error as { data?: { message?: string } }).data?.message
    toast.add({ title: message ?? 'Не удалось создать вишлист', color: 'error' })
  }
}
</script>

<template>
  <UContainer>
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
        <UCard>{{ wishlist.title }}</UCard>
      </li>
    </ul>
  </UContainer>
</template>
