import { randomBytes } from 'node:crypto'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const { title } = await readValidatedBody(event, wishlistSchema.parse)

  const wishlist = await db
    .insert(tables.wishlists)
    .values({ userId: user.id, title, slug: randomBytes(9).toString('hex') })
    .returning({ id: tables.wishlists.id })
    .get()

  return wishlist
})
