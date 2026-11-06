export interface GiftFields {
  title: string
  url: string | null
  price: number | null
  note: string | null
  imageId: string | null
}

export interface GiftFormResult {
  gift: GiftFormState
  image: File | null
  removeImage: boolean
}
