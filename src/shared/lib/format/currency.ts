import type { Currency } from '@/shared/model'

export const formatCurrency = (value: number, currency: Currency): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}
