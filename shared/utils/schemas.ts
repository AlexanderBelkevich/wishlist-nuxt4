import { z } from 'zod'

export const wishlistSchema = z.object({
  title: z.string().trim().min(1, 'Введите название').max(100, 'Не длиннее 100 символов'),
})
