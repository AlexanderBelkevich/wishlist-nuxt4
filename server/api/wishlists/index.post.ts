export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const { title } = await readValidatedBody(event, wishlistSchema.parse)

  const wishlist = await db
    .insert(tables.wishlists)
    .values({ userId: user.id, title })
    .returning({ id: tables.wishlists.id })
    .get()

  return wishlist
})
