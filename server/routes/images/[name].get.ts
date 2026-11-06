export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, 'name') ?? ''
  const imageId = name.endsWith('.webp') ? name.slice(0, -5) : ''
  if (!IMAGE_ID_PATTERN.test(imageId)) {
    throw createError({ statusCode: 404, message: 'Картинка не найдена' })
  }
  const file = await readGiftImage(imageId)
  if (!file) {
    throw createError({ statusCode: 404, message: 'Картинка не найдена' })
  }

  setResponseHeaders(event, { 'Content-Type': 'image/webp', 'Cache-Control': 'public, max-age=31536000, immutable' })
  return file
})
