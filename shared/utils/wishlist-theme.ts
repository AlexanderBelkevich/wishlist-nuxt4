export const wishlistEmojis = ['🎁', '🎂', '🎄', '🎉', '💍', '👶', '🏠', '🎓', '✈️', '❤️', '🎮', '📚'] as const
export const wishlistColors = ['rose', 'amber', 'emerald', 'sky', 'violet', 'slate'] as const

export type WishlistEmoji = (typeof wishlistEmojis)[number]
export type WishlistColor = (typeof wishlistColors)[number]
