<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  validate: route => /^\d+$/.test(String(route.params.id)),
})

const route = useRoute()
const toast = useToast()

const apiUrl = `/api/wishlists/${route.params.id}` as const

const { data: wishlist, error, refresh } = await useFetch(apiUrl)

if (error.value) {
  throw createError({ statusCode: error.value.statusCode, message: 'Вишлист не найден', fatal: true })
}

useSeoMeta({ title: () => wishlist.value?.title })

const deleteOpen = ref(false)
const deleting = ref(false)

async function deleteWishList() {
  deleting.value = true
  try {
    await $fetch(apiUrl, { method: 'DELETE' })
    await navigateTo('/lists')
  }
  catch (error) {
    const message = (error as { data?: { message?: string } }).data?.message
    toast.add({ title: message ?? 'Не удалось удалить вишлист', color: 'error' })
  }
}

type Gift = NonNullable<typeof wishlist.value>['gifts'][number]

function storeName(url: string) {
  return new URL(url).hostname.replace(/^www\./, '')
}

const giftFormOpen = ref(false)
const editedGift = ref<Gift>()

function openGiftForm(gift?: Gift) {
  editedGift.value = gift
  giftFormOpen.value = true
}

async function saveGift(gift: GiftFormState) {
  try {
    if (editedGift.value) {
      await $fetch(`${apiUrl}/gifts/${editedGift.value.id}`, { method: 'PATCH', body: gift })
    }
    else {
      await $fetch(`${apiUrl}/gifts`, { method: 'POST', body: gift })
    }
    giftFormOpen.value = false
    await refresh()
  }
  catch (error) {
    const message = (error as { data?: { message?: string } }).data?.message
    toast.add({ title: message ?? 'Не удалось сохранить подарок', color: 'error' })
  }
}

const giftToDelete = ref<Gift>()
const giftDeleteOpen = computed({ get: () => Boolean(giftToDelete.value),
  set: (open) => {
    if (!open) giftToDelete.value = undefined
  },
})

async function deleteGift() {
  if (!giftToDelete.value) return
  deleting.value = true
  try {
    await $fetch(`${apiUrl}/gifts/${giftToDelete.value.id}`, { method: 'DELETE' })
    await refresh()
  }
  catch (error) {
    const message = (error as { data?: { message?: string } }).data?.message
    toast.add({ title: message ?? 'Не удалось удалить подарок', color: 'error' })
  }
  finally {
    deleting.value = false
    giftToDelete.value = undefined
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
    <div class="flex gap-2">
      <UButton
        icon="i-lucide-plus"
        label="Добавить подарок"
        @click="openGiftForm()"
      />
      <UButton
        icon="i-lucide-trash-2"
        label="Удалить"
        color="error"
        varian="soft"
        @click="deleteOpen = true"
      />
    </div>

    <UEmpty
      v-if="!wishlist.gifts.length"
      class="mt-8"
      icon="i-lucide-gift"
      title="Подарков пока нет"
      description="Добавьте первый подарок"
    />

    <ul
      v-else
      class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      <li
        v-for="gift in wishlist.gifts"
        :key="gift.id"
      >
        <UCard
          class="h-full"
          :ui="{ root: 'flex flex-col', body: 'flex flex-1 flex-col gap-2' }"
        >
          <p class="font-medium break-words">
            {{ gift.title }}
          </p>
          <p
            v-if="gift.price"
            class="text-xl font-bold"
          >
            {{ formatPrice(gift.price) }}
          </p>
          <p
            v-if="gift.note"
            class="text-sm text-muted break-words whitespace-pre-line"
          >
            {{ gift.note }}
          </p>
          <UButton
            v-if="gift.url"
            :to="gift.url"
            target="_blank"
            rel="noopener noreferrer"
            :label="storeName(gift.url)"
            trailing-icon="i-lucide-external-link"
            color="neutral"
            variant="soft"
            size="sm"
            class="self-start"
          />
          <div class="mt-auto flex justify-end gap-1 pt-2">
            <UButton
              icon="i-lucide-pencil"
              color="neutral"
              variant="ghost"
              aria-label="Изменить"
              @click="openGiftForm(gift)"
            />
            <UButton
              icon="i-lucide-trash-2"
              color="error"
              variant="ghost"
              aria-label="Удалить"
              @click="giftToDelete = gift"
            />
          </div>
        </UCard>
      </li>
    </ul>

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

    <UModal
      v-model:open="giftFormOpen"
      :title="editedGift ? 'Изменить подарок' : 'Новый подарок'"
    >
      <template #body>
        <GiftForm
          :gift="editedGift"
          template
          @submit="saveGift"
        />
      </template>
    </UModal>

    <UModal
      v-model:open="giftDeleteOpen"
      title="Удалить подарок?"
      :description="`${giftToDelete?.title} удалиться насовсем, отменить это будет нельзя`"
      :ui="{ footer: 'justify-end' }"
    >
      <template #footer>
        <UButton
          label="Отмена"
          color="neutral"
          variant="outline"
          @click="giftDeleteOpen = false"
        />
        <UButton
          label="Удалить"
          color="error"
          :loading="deleting"
          @click="deleteGift"
        />
      </template>
    </UModal>
  </UContainer>
</template>
