<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  validate: route => /^\d+$/.test(String(route.params.id)),
})

const route = useRoute()
const toast = useToast()

const { data: wishlist, error } = await useFetch(`/api/wishlists/${route.params.id}`)

if (error.value) {
  throw createError({ statusCode: error.value.statusCode, message: 'Вишлист не найден', fatal: true })
}

useSeoMeta({ title: () => wishlist.value?.title })

const deleteOpen = ref(false)
const deleting = ref(false)

async function deleteWishList() {
  deleting.value = true
  try {
    await $fetch(`/api/wishlists/${route.params.id}`, { method: 'DELETE' })
    await navigateTo('/lists')
  }
  catch (error) {
    const message = (error as { data?: { message?: string } }).data?.message
    toast.add({ title: message ?? 'Не удалось удалить вишлист', color: 'error' })
  }
}
</script>

<template>
  <UContainer
    v-if="wishlist"
    class="py-10"
  >
    <UButton
      to="/lists"
      icon="i-lucide-arrow-left"
      label="Мои вишлисты"
      color="neutral"
      variant="link"
      class="mb-4 px-0"
    />
    <h1 class="text-2xl font-semibold break-words">
      {{ wishlist.title }}
    </h1>
    <UButton
      icon="i-lucide-trash-2"
      label="Удалить"
      color="error"
      varian="soft"
      @click="deleteOpen = true"
    />

    <UModal
      v-model:open="deleteOpen"
      title="Удалить вишлист?"
      description="Вишлист удалится насовсем, омтенить это будет нельзя"
      :ui="{ footer: 'justify-end' }"
    >
      <template #footer>
        <UButton
          label="Отмена"
          color="neutral"
          variant="outline"
          @click="deleteOpen = false"
        />
        <UButton
          label="Удалить"
          color="error"
          :loading="deleting"
          @click="deleteWishList"
        />
      </template>
    </UModal>
  </UContainer>
</template>
