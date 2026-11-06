<script setup lang="ts">
import { z } from 'zod'

definePageMeta({ layout: 'guest' })

const route = useRoute()
const config = useRuntimeConfig()
const { $api } = useNuxtApp()

const apiUrl = `/api/guest/${route.params.slug}` as const

const { data: wishlist, error, refresh } = await useApi(apiUrl, { deep: true })

type Gift = NonNullable<typeof wishlist.value>['gifts'][number]

if (error.value) {
  throw createError({ statusCode: error.value.statusCode, message: 'Вишлист не найден', fatal: true })
}

async function celebrate() {
  const { default: confetti } = await import('canvas-confetti')
  confetti({ particleCount: 120, spread: 70, origin: { y: 0.7 }, disableForReducedMotion: true })
}

useSeoMeta({
  title: () => wishlist.value?.title,
  ogTitle: () => wishlist.value?.title,
  description: 'Выберите подарок и забронируйте его, чтобы не подарить то же, что и другие',
  ogDescription: `${wishlist.value?.owner.name} собирает подарки. Выберите подарок и забронируйте его, чтобы не подарить то же, что и другие.`,
  ogImage: `${config.public.siteUrl}/og.png`,
  ogSiteName: 'Вишлист',
  twitterCard: 'summary_large_image',
  robots: 'noindex, nofollow' })

async function reserve(gift: Gift) {
  gift.reserved = true
  gift.reservedByMe = true

  try {
    await $api(`${apiUrl}/gifts/${gift.id}/reservation`, { method: 'POST' })
    celebrate()
  }
  catch {
    await refresh()
  }
}

async function cancelReservation(gift: Gift) {
  gift.reserved = false
  gift.reservedByMe = false

  try {
    await $api(`${apiUrl}/gifts/${gift.id}/reservation`, { method: 'DELETE' })
  }
  catch {
    await refresh()
  }
}

const reservedCount = computed(() => wishlist.value?.gifts.filter(gift => gift.reserved).length ?? 0)

const filterSchema = z.object({
  sort: z.enum(['default', 'cheap', 'expensive']).catch('default'),
  free: z.literal('1').optional().catch(undefined),
})

const filters = computed(() => filterSchema.parse(route.query))

const sortItems = [
  { label: 'Как у владельца', value: 'default' },
  { label: 'Сначала дешевле', value: 'cheap' },
  { label: 'Сначала дороже', value: 'expensive' },
]

function setFilter(name: 'sort' | 'free', value: string | undefined) {
  navigateTo({ query: { ...route.query, [name]: value } }, { replace: true })
}

const sort = computed({
  get: () => filters.value.sort,
  set: value => setFilter('sort', value === 'default' ? undefined : value),
})

const onlyFree = computed({
  get: () => filters.value.free === '1',
  set: value => setFilter('free', value ? '1' : undefined),
})

const visibleGifts = computed(() => {
  let gifts = wishlist.value?.gifts ?? []
  if (onlyFree.value) {
    gifts = gifts.filter(gift => !gift.reserved)
  }
  if (sort.value !== 'default') {
    const direction = sort.value === 'cheap' ? 1 : -1
    gifts = [...gifts].sort((a, b) => {
      if (a.price === null) return 1
      if (b.price === null) return -1
      return (a.price - b.price) * direction
    })
  }
  return gifts
})
</script>

<template>
  <UContainer
    v-if="wishlist"
    class="py-10"
  >
    <WishlistHero :wishlist="wishlist">
      <template #top>
        <UUser
          :name="wishlist.owner.name"
          description="собирает подарки"
          :avatar="{ src: wishlist.owner.avatarUrl, alt: wishlist.owner.name }"
          :ui="{ name: 'text-white', description: 'text-white/80' }"
          class="mb-4"
        />
      </template>
      <div
        v-if="wishlist.gifts.length"
        class="space-y-2"
      >
        <p class="text-sm text-white/90">
          Забронировано {{ reservedCount }} из {{ wishlist.gifts.length }}
        </p>
        <UProgress
          :model-value="reservedCount"
          :max="wishlist.gifts.length"
          color="neutral"
          :ui="{ base: 'bg-white/30', indicator: 'bg-white' }"
        />
      </div>
    </WishlistHero>

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
    <template v-else>
      <div class="mt-6 flex flex-wrap items-center justify-between gap-4">
        <USelect
          v-model="sort"
          :items="sortItems"
          class="w-48"
        />
        <USwitch
          v-model="onlyFree"
          label="Только свободные"
        />
      </div>
      <UEmpty
        v-if="!visibleGifts.length"
        class="mt-8"
        icon="i-lucide-party-popper"
        title="Все подарки уже забронированы"
      />
      <ul
        v-else
        class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <li
          v-for="gift in visibleGifts"
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
                  @click="cancelReservation(gift)"
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
                @click="reserve(gift)"
              />
            </template>
          </GiftCard>
        </li>
      </ul>
    </template>
  </UContainer>
</template>
