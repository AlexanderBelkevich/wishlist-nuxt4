import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const wishlist = await requireOwnWishlist(event)
  await db.delete(tables.wishlists).where(eq(tables.wishlists.id, wishlist.id))
})
