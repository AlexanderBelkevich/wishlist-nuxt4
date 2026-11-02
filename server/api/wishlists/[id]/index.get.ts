import { eq, asc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const wishlist = await requireOwnWishlist(event)

  const gifts = await db
    .select({
      id: tables.gifts.id,
      title: tables.gifts.title,
      url: tables.gifts.url,
      price: tables.gifts.price,
      note: tables.gifts.note,
    })
    .from(tables.gifts)
    .where(eq(tables.gifts.wishlistId, wishlist.id))
    .orderBy(asc(tables.gifts.id))

  return { id: wishlist.id, title: wishlist.title, gifts }
})
