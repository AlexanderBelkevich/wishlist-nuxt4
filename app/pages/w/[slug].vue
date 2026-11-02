<script setup lang="ts">
definePageMeta({ layout: 'guest' })

const route = useRoute()
const toast = useToast()

const apiUrl = `/api/guest/${route.params.slug}` as const

const { data: wishlist, error, refresh } = await useFetch(apiUrl)

if (error.value) {
  throw createError({ statusCode: error.value.statusCode, message: 'Вишлист не найден', fatal: true })
}

useSeoMeta({ title: () => wishlist.value?.title })

async function toggleReservation(giftId: number, method: 'POST' | 'DELETE') {
  try {
    await $fetch(`${apiUrl}/gifts/${giftId}/reservation`, { method })
  }
  catch (error) {
    const message = (error as { data?: { message?: string } }).data?.message
    toast.add({ title: message ?? 'Не получилось', color: 'error' })
  }
  await refresh()
}
</script>

<template>
  <UContainer
    v-if="wishlist"
    class="py-10"
  >
    <UUser
      :name="wishlist.owner.name"
      description="собирает подарки"
      :avatar="{ src: wishlist.owner.avatarUrl, alt: wishlist.owner.name }"
    />
    <h1 class="mt-4 text-2xl font-semibold break-words">
      {{ wishlist.title }}
    </h1>
    <UAlert
      v-if="wishlist.isOwner"
      class="mt-6"
      icon="i-lucide-eye"
      title="Так ваш вишлист видят гости"
      description="Бронировать свои подарки нельзя, а кто что забронировал, не видно даже вам."
    />
    <UEmpty
      v-if="!wishlist.gifts.length"
      class="mt-8"
      icon="i-lucide-gift"
      title="Подарков пока нет"
    />
    <ul
      v-else
      class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      <li
        v-for="gift in wishlist.gifts"
        :key="gift.id"
      >
        <GiftCard
          :gift="gift"
          :class="{ 'opacity-60': gift.reserved && !gift.reservedByMe }"
        >
          <template #actions>
            <template v-if="gift.reservedByMe">
              <UBadge
                label="Вы забронировали"
                color="success"
                variant="subtle"
              />
              <UButton
                label="Отменить"
                color="neutral"
                variant="ghost"
                class="ml-auto"
                @click="toggleReservation(gift.id, 'DELETE')"
              />
            </template>
            <UBadge
              v-else-if="gift.reserved"
              label="Забронирован"
              color="success"
              variant="subtle"
            />
            <UButton
              v-else-if="!wishlist.isOwner"
              label="Забронирую"
              color="neutral"
              block
              @click="toggleReservation(gift.id, 'POST')"
            />
          </template>
        </GiftCard>
      </li>
    </ul>
  </UContainer>
</template>
