import { eq, max } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const wishlist = await requireOwnWishlist(event)
  const gift = await readValidatedBody(event, giftSchema.parse)

  const last = await db
    .select({ position: max(tables.gifts.position) })
    .from(tables.gifts)
    .where(eq(tables.gifts.wishlistId, wishlist.id))
    .get()

  const lastPosition = last?.position ?? -1

  const created = await db
    .insert(tables.gifts)
    .values({ ...gift, wishlistId: wishlist.id, position: lastPosition + 1 })
    .returning({ id: tables.gifts.id })
    .get()
  return created
})
