import { z } from 'zod'

export const wishlistSchema = z.object({
  title: z.string().trim().min(1, 'Введите название').max(100, 'Не длиннее 100 символов'),
  emoji: z.enum(wishlistEmojis).default('🎁'),
  color: z.enum(wishlistColors).default('rose'),
  eventDate: z.union([z.iso.date('Неверная дата'), z.literal('')]).default('').transform(value => value || null),
})

export const giftSchema = z.object({
  title: z.string().trim().min(1, 'Введите название').max(200, 'Не длиннее 200 символов'),
  url: z.url({ protocol: /^https?$/, error: 'Нужна ссылка в виде https://...' })
    .max(2000, 'Слишком длинная ссылка')
    .or(z.literal(''))
    .transform(value => value || null),
  price: z
    .number('Введите число')
    .int('Только целое число')
    .positive('Цена больше нуля')
    .max(10_000_000, 'Слишком большая цена')
    .nullish()
    .transform(value => value || null),
  note: z
    .string()
    .trim()
    .max(500, 'Не длиннее 500 символов')
    .transform(value => value || null),
})

export type WishlistFormState = z.input<typeof wishlistSchema>
export type GiftFormState = z.input<typeof giftSchema>
