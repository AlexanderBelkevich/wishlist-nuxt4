// GET /api/guest/<slug>/events

export default defineEventHandler(async (event) => {
  const wishlist = await requireWishlistBySlug(event)

  const stream = createEventStream(event)

  const unsubscribe = subscribeToWishlist(wishlist.id, () => {
    stream.push('changed')
  })

  const ping = setInterval(() => {
    stream.push({ event: 'ping', data: '' })
  }, 25_000)

  stream.onClosed(async () => {
    clearInterval(ping)
    unsubscribe()
    await stream.close()
  })

  return stream.send()
})
