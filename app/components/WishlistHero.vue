<script setup lang="ts">
defineProps <{
  wishlist: {
    title: string
    emoji: WishlistEmoji
    color: WishlistColor
    eventDate: string | null }
}>()
</script>

<template>
  <div
    class="rounded-2xl bg-linear-to-br p-6 text-white shadow-lg sm:p-8"
    :class="wishlistGradients[wishlist.color]"
  >
    <slot name="top" />
    <div class="flex items-center gap-4">
      <span class="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-4xp">
        {{ wishlist.emoji }}
      </span>
      <div class="min-w-0">
        <h1 class="text-2xl font-bold break-words sm:text-3xl">
          {{ wishlist.title }}
        </h1>
        <EventDate
          v-if="wishlist.eventDate"
          :date="wishlist.eventDate"
          class="mt-1 text-white/90"
        />
      </div>
    </div>
    <div
      v-if="$slots.default"
      class="mt-6"
    >
      <slot />
    </div>
  </div>
</template>
