<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'

definePageMeta({
  middleware: 'auth',
  validate: route => /^\d+$/.test(String(route.params.id)),
})

const route = useRoute()
const toast = useToast()
const { $api } = useNuxtApp()

const apiUrl = `/api/wishlists/${route.params.id}` as const

const { data: wishlist, error, refresh } = await useApi(apiUrl, { deep: true })

if (error.value) {
  throw createError({ statusCode: error.value.statusCode, message: 'Вишлист не найден', fatal: true })
}

useSeoMeta({ title: () => wishlist.value?.title })

const deleteOpen = ref(false)
const deleting = ref(false)

async function deleteWishList() {
  deleting.value = true
  try {
    await $api(apiUrl, { method: 'DELETE' })
    await navigateTo('/lists')
  }
  catch {
    // Обработали в $api
  }
  finally {
    deleting.value = false
    deleteOpen.value = false
  }
}

type Gift = NonNullable<typeof wishlist.value>['gifts'][number]

const giftFormOpen = ref(false)
const editedGift = ref<Gift>()

function openGiftForm(gift?: Gift) {
  editedGift.value = gift
  giftFormOpen.value = true
}

async function saveGift({ gift, image, removeImage }: GiftFormResult) {
  try {
    let giftId: number
    if (editedGift.value) {
      giftId = editedGift.value.id
      await $api(`${apiUrl}/gifts/${giftId}`, { method: 'PATCH', body: gift })
    }
    else {
      giftId = (await $api(`${apiUrl}/gifts`, { method: 'POST', body: gift })).id
    }

    if (image) {
      const body = new FormData()
      body.append('image', image)
      await $api(`${apiUrl}/gifts/${giftId}/image`, { method: 'PUT', body })
    }
    else if (removeImage) {
      await $api(`${apiUrl}/gifts/${giftId}/image`, { method: 'DELETE' })
    }

    giftFormOpen.value = false
    await refresh()
  }
  catch {
    // Обработали в $api
    await refresh()
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
    await $api(`${apiUrl}/gifts/${giftToDelete.value.id}`, { method: 'DELETE' })
    await refresh()
  }
  catch {
    // Обработали в $api
  }
  finally {
    deleting.value = false
    giftToDelete.value = undefined
  }
}

async function copyPublicLink(slug: string) {
  try {
    await navigator.clipboard.writeText(`${location.origin}/w/${slug}`)
    toast.add({ title: 'Ссылка скопирована', color: 'success' })
  }
  catch {
    toast.add({ title: 'Не удалось скопировать ссылку', color: 'error' })
  }
}

const settingsOpen = ref(false)

async function saveSettings(data: WishlistFormState) {
  try {
    await $api(apiUrl, { method: 'PATCH', body: data })
    settingsOpen.value = false
    await refresh()
  }
  catch {
    // Обработали в $api
  }
}

const heroButton = 'bg-white/20 text-white hover:bg-white/30 active:bg-white/30'

async function saveOrder(event: { oldIndex?: number, newIndex?: number }) {
  if (event.oldIndex === event.newIndex || !wishlist.value) return
  try {
    await $api(`${apiUrl}/gifts/order`, {
      method: 'PUT',
      body: {
        ids: wishlist.value.gifts.map(gift => gift.id),
      },
    })
  }
  catch {
    await refresh()
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
    <WishlistHero :wishlist="wishlist">
      <div class="flex flex-wrap gap-2">
        <UButton
          icon="i-lucide-plus"
          label="Добавить подарок"
          class="bg-white text-neutral-900 hover:bg-white/90"
          @click="openGiftForm()"
        />
        <UButton
          icon="i-lucide-link"
          label="Скопировать ссылку"
          color="neutral"
          variant="outline"
          :class="heroButton"
          @click="copyPublicLink(wishlist.slug)"
        />
        <UButton
          :to="`/w/${wishlist.slug}`"
          target="_blank"
          icon="i-lucide-eye"
          color="neutral"
          :class="heroButton"
          variant="outline"
        />
        <UButton
          icon="i-lucide-settings"
          :class="heroButton"
          variant="ghost"
          @click="settingsOpen = true"
        />
        <UButton
          icon="i-lucide-trash-2"
          color="error"
          :class="heroButton"
          variant="soft"
          @click="deleteOpen = true"
        />
      </div>
    </WishlistHero>

    <UEmpty
      v-if="!wishlist.gifts.length"
      class="mt-8"
      icon="i-lucide-gift"
      title="Подарков пока нет"
      description="Добавьте первый подарок"
    />

    <VueDraggable
      v-else
      v-model="wishlist.gifts"
      tag="ul"
      handle=".drag-handle"
      :animation="150"
      class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      @end="saveOrder"
    >
      <li
        v-for="gift in wishlist.gifts"
        :key="gift.id"
      >
        <GiftCard :gift="gift">
          <template #actions>
            <UIcon
              name="i-lucide-grip-vertical"
              class="drag-handle size-5 shring-0 cursor-grab touch-none text-muted"
            />
            <UBadge
              v-if="gift.reserved"
              label="Забронирован"
              color="neutral"
              variant="subtle"
            />
            <UButton
              icon="i-lucide-pencil"
              color="neutral"
              varian="ghost"
              class="ml-auto"
              @click="openGiftForm(gift)"
            />
            <UButton
              icon="i-lucide-trash-2"
              color="error"
              varian="ghost"
              @click="giftToDelete = gift"
            />
          </template>
        </GiftCard>
      </li>
    </VueDraggable>

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
        <LazyGiftForm
          :gift="editedGift"
          @submit="saveGift"
        />
      </template>
    </UModal>

    <UModal
      v-model:open="giftDeleteOpen"
      title="Удалить подарок?"
      :description="`${giftToDelete?.title} удалится насовсем, отменить это будет нельзя`"
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

    <UModal
      v-model:open="settingsOpen"
      title="Настройки вишлиста"
    >
      <template #body>
        <LazyWishlistForm
          :wishlist="wishlist"
          @submit="saveSettings"
        />
      </template>
    </UModal>
  </UContainer>
</template>
