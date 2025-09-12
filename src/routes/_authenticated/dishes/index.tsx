import { createFileRoute } from '@tanstack/react-router'
import Dishes from '@/features/dishes'

export const Route = createFileRoute('/_authenticated/dishes/')({
  component: Dishes,
})
