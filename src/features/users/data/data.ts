import { UserCheck, Users } from 'lucide-react'

export const callTypes = new Map<boolean, string>([
  [true, 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  [false, 'bg-neutral-300/40 border-neutral-300'],
])

export const roles = [
  {
    label: '管理员',
    value: 'Admin',
    icon: UserCheck,
  },
  {
    label: '用户',
    value: 'User',
    icon: Users,
  },
] as const
