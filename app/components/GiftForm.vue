<script setup lang="ts">
const props = defineProps<{
  gift?: GiftFields
}>()

const emit = defineEmits<{
  submit: [gift: GiftFormState]
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

function onSubmit() {
  emit('submit', { ...state })
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
