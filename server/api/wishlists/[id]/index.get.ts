export default defineEventHandler(async (event) => {
  const wishlist = await requireOwnWishlist(event)

  return { id: wishlist.id, title: wishlist.title }
})
