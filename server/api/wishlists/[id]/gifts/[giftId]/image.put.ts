import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const wishlist = await requireOwnWishlist(event)
  const gift = await requireGift(event, wishlist.id)

  const length = Number(getRequestHeader(event, 'content-length'))
  if (!length || length > MAX_IMAGE_SIZE + 64 * 1024) {
    throw createError({ statusCode: 413, message: 'Файл больше 5Мб' })
  }

  const form = await readMultipartFormData(event)
  const file = form?.find(part => part.name === 'image')
  if (!file?.data.length) {
    throw createError({ statusCode: 400, message: 'Выберите картинку' })
  }

  const imageId = await saveGiftImage(file.data)
  await db.update(tables.gifts).set({ imageId }).where(eq(tables.gifts.id, gift.id))
  await deleteGiftImage(gift.imageId)

  notifyWishlistChanged(wishlist.id)
})
