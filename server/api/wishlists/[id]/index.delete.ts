import { and, eq, isNotNull } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const wishlist = await requireOwnWishlist(event)

  const images = await db
    .select({ imageId: tables.gifts.imageId })
    .from(tables.gifts)
    .where(and(eq(tables.gifts.wishlistId, wishlist.id), isNotNull(tables.gifts.imageId)))

  await db.delete(tables.wishlists).where(eq(tables.wishlists.id, wishlist.id))

  for (const { imageId } of images) {
    await deleteGiftImage(imageId)
  }

  notifyWishlistChanged(wishlist.id)
})
