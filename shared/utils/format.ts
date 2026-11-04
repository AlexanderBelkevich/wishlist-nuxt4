const pluralRules = new Intl.PluralRules('ru-RU')

const priceFormat = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
})

export function formatPrice(price: number) {
  return priceFormat.format(price)
}

export function plural(count: number, [one, few, many]: [string, string, string]) {
  const form = pluralRules.select(count)
  if (form === 'one') return one
  if (form === 'few') return few
  return many
}
