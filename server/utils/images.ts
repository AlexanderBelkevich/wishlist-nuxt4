import sharp from 'sharp'
import { randomBytes } from 'node:crypto'
import { mkdir, writeFile, rm, readFile } from 'node:fs/promises'
import { join } from 'node:path'

const ALLOWED_FORMATS = ['jpeg', 'png', 'webp']
export const IMAGE_ID_PATTERN = /^[\w-]{22}$/

function imagePath(imageId: string) {
  return join(useRuntimeConfig().uploadsDir, `${imageId}.webp`)
}

export async function saveGiftImage(input: Buffer) {
  let image: Buffer
  try {
    const { format } = await sharp(input).metadata()
    if (!format || !ALLOWED_FORMATS.includes(format)) throw new Error('format')
    image = await sharp(input)
      .rotate()
      .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer()
  }
  catch {
    throw createError({ statusCode: 400, message: 'Нужна картинка в формате JPEG, PNG или WebP' })
  }

  const imageId = randomBytes(16).toString('base64url')
  await mkdir(useRuntimeConfig().uploadsDir, { recursive: true })
  await writeFile(imagePath(imageId), image)
  return imageId
}

export async function readGiftImage(imageId: string) {
  try {
    return await readFile(imagePath(imageId))
  }
  catch {
    return null
  }
}

export async function deleteGiftImage(imageId: string | null) {
  if (imageId) await rm(imagePath(imageId), { force: true })
}
