import { Package, Utensils } from 'lucide-react'

export const callTypes = new Map<boolean, string>([
  [true, 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  [false, 'bg-neutral-300/40 border-neutral-300'],
])

export const categoryTypes = [
  {
    label: '单品套餐',
    value: 'Dishes',
    icon: Utensils,
  },
  {
    label: '组合套餐',
    value: 'ComboMeals',
    icon: Package,
  },
]
