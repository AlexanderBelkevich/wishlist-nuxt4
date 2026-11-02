export default defineEventHandler(async (event) => {
  const wishlist = await requireOwnWishlist(event)
  const gift = await readValidatedBody(event, giftSchema.parse)

  await db.insert(tables.gifts).values({ ...gift, wishlistId: wishlist.id })
})
