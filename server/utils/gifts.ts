import type { H3Event } from 'h3'
import { and, eq } from 'drizzle-orm'

export const giftColumns = {
  id: tables.gifts.id,
  title: tables.gifts.title,
  url: tables.gifts.url,
  price: tables.gifts.price,
  note: tables.gifts.note,
  reservationToken: tables.gifts.reservationToken,
  imageId: tables.gifts.imageId,
}

export async function requireGift(event: H3Event, wishlistId: number) {
  const giftId = getIdParam(event, 'giftId')

  const gift = await db
    .select()
    .from(tables.gifts)
    .where(and(eq(tables.gifts.id, giftId), eq(tables.gifts.wishlistId, wishlistId)))
    .get()

  if (!gift) {
    throw createError({ statusCode: 404, message: 'Подарок не найден' })
  }
  return gift
}
