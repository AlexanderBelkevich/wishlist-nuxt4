<script setup lang="ts">
const props = defineProps<{
  gift?: GiftFields
}>()

const emit = defineEmits<{
  submit: [result: GiftFormResult]
}>()

const state = reactive<GiftFormState>({
  title: props.gift?.title ?? '',
  url: props.gift?.url ?? '',
  price: props.gift?.price ?? null,
  note: props.gift?.note ?? '',
})

const priceText = ref(state.price?.toString() ?? '')

function onPriceInput(event: Event) {
  const input = event.target as HTMLInputElement
  const digits = input.value.replace(/\D/g, '').replace(/^0+/, '').slice(0, 8)
  input.value = digits
  priceText.value = digits
  state.price = digits ? Number(digits) : null
}

const image = ref<File | null>(null)
const removeImage = ref(false)
const currentImage = computed(() => {
  return props.gift?.imageId && !removeImage.value ? `/images/${props.gift.imageId}.webp` : null
})

const imageError = computed(() => {
  if (!image.value) return undefined
  if (!IMAGE_TYPES.includes(image.value.type)) return 'Нужна картинка в формате JPEG, PNG или WebP'
  if (image.value.size > MAX_IMAGE_SIZE) return 'Файл больше 5 Мб'
  return undefined
})

function onSubmit() {
  if (imageError.value) return
  emit('submit', { gift: { ...state }, image: image.value, removeImage: removeImage.value })
}
</script>

<template>
  <UForm
    :schema="giftSchema"
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
        autofocus
      />
    </UFormField>
    <UFormField
      label="Ссылка на товар"
      name="url"
    >
      <UInput
        v-model="state.url"
        type="url"
        placeholder="https://..."
        class="w-full"
      />
    </UFormField>
    <UFormField
      label="Фото"
      :error="imageError"
      help="Скриншот товара из магазина или свое фото, до 5 Мб"
    >
      <div
        v-if="currentImage"
        class="flex items-center gap-3"
      >
        <img
          :src="currentImage"
          alt=""
          class="size-16 rounded-lg object-cover"
        >
        <UButton
          label="Убрать фото"
          color="neutral"
          variant="outline"
          size="sm"
          @click="removeImage = true"
        />
      </div>
      <UFileUpload
        v-else
        v-model="image"
        :accept="IMAGE_TYPES.join(',')"
        label="Выберите или перетащите картинку"
        class="w-full"
      />
    </UFormField>
    <UFormField
      label="Цена, ₽"
      name="price"
    >
      <UInput
        :model-value="priceText"
        inputmode="numeric"
        autocomplete="off"
        placeholder="Например, 2990"
        class="w-full"
        @input="onPriceInput"
      />
    </UFormField>
    <UFormField
      label="Дополнительная информация"
      name="note"
    >
      <UTextarea
        v-model="state.note"
        placeholder="Размер, цвет, где купить"
        class="w-full"
      />
    </UFormField>
    <UButton
      type="submit"
      label="Сохранить"
      block
    />
  </UForm>
</template>
