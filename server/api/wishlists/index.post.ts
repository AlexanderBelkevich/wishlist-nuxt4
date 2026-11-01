export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const { title } = await readValidatedBody(event, wishlistSchema.parse)

  await db.insert(tables.wishlists).values({ userId: user.id, title })
})
