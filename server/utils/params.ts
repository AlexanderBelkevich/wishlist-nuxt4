import type { H3Event } from 'h3'
import { z } from 'zod'

const idSchema = z.coerce.number().int().positive()

export function getIdParam(event: H3Event, name: string) {
  const result = idSchema.safeParse(getRouterParam(event, name))
  if (!result.success) {
    throw createError({ statusCode: 404, message: 'Не найдено' })
  }
  return result.data
}
