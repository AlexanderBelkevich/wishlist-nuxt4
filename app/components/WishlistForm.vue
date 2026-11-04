<script setup lang="ts">
const props = defineProps<{
  wishlist: {
    title: string
    emoji: WishlistEmoji
    color: WishlistColor
    eventDate: string | null }
}>()
const emit = defineEmits<{ submit: [wishlist: WishlistFormState] }>()

const state = reactive<WishlistFormState>({
  title: props.wishlist.title,
  emoji: props.wishlist.emoji,
  color: props.wishlist.color,
  eventDate: props.wishlist.eventDate ?? '',
})

function onSubmit() {
  emit('submit', { ...state })
}
</script>

<template>
  <UForm
    :schema="wishlistSchema"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
  >
    <UFormField
      label="Название"
      name="title"
      required
    >
      <UInput
        v-model="state.title"
        class="w-full"
      />
    </UFormField>
    <UFormField
      label="Дата события"
      name="eventDate"
      help="Покажем, сколько дней осталось"
    >
      <UInput
        v-model="state.eventDate"
        type="date"
        class="w-full"
      />
    </UFormField>
    <UFormField
      label="Эмодзи"
      name="emodji"
    >
      <div class="grid grid-cols-6 gap-2">
        <button
          v-for="emoji in wishlistEmojis"
          :key="emoji"
          type="button"
          class="rounded-lg py-2 text-2xl transition hover:bg-elevated"
          :class="{ 'bg-elevated ring-2 ring-primary': state.emoji === emoji }"
          @click="state.emoji = emoji"
        >
          {{ emoji }}
        </button>
      </div>
    </UFormField>
    <UFormField
      label="Цвет обложки"
      name="color"
    >
      <div class="grid grid-cols-6 gap-2">
        <button
          v-for="color in wishlistColors"
          :key="color"
          type="button"
          class="size=8 rounded-full ring-offset-2 ring-offset-default transition text-white"
          :class="[wishlistSwatches[color], { 'ring-2 ring-primary': state.color === color }]"
          @click="state.color = color"
        >
          {{ color }}
        </button>
      </div>
    </UFormField>
    <UButton
      type="submit"
      label="Сохранить"
      block
    />
  </UForm>
</template>
