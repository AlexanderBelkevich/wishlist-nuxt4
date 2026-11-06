<script setup lang="ts">
const props = defineProps<{
  gift: GiftFields
}>()

const store = computed(() => props.gift.url ? new URL(props.gift.url).hostname.replace(/^www\./, '') : null,
)
</script>

<template>
  <UCard
    class="h-full"
    :ui="{ root: 'flex flex-col overflow-hidden', header: 'p-0 sm:p-0', body: 'flex flex-1 flex-col gap-2' }"
  >
    <template #header>
      <img
        v-if="gift.imageId"
        :src="`/images/${gift.imageId}.webp`"
        :alt="gift.title"
        loading="lazy"
        class="block aspect-4/3 w-full object-cover"
      >
      <div
        v-else
        class="flex aspect-4/3 w-full items-center justify-center bg-elevated"
      >
        <img
          src="/gift-placeholder.svg"
          alt=""
          class="size-16"
        >
      </div>
    </template>
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
      v-if="gift.url && store"
      :to="gift.url"
      target="_black"
      :label="store"
      trailing-icon="i-lucide-external-link"
      color="neutral"
      variant="soft"
      size="sm"
      class="selft-start"
    />
    <div class="mt-auto flex items-center gap-1 pt-2">
      <slot name="actions" />
    </div>
  </UCard>
</template>
