import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const wishlist = await requireOwnWishlist(event)
  const data = await readValidatedBody(event, wishlistSchema.parse)

  await db
    .update(tables.wishlists)
    .set(data)
    .where(eq(tables.wishlists.id, wishlist.id))

  notifyWishlistChanged(wishlist.id)
})
