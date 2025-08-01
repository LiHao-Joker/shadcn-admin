import {
  IconCash,
  IconShield,
  IconUsersGroup,
  IconUserShield,
} from '@tabler/icons-react'
import { UserStatus } from './schema'

// 定义类型接口，明确结构
interface StatusConfig {
  className: string
  label: string // 中文标签
}

// 修改 Map 结构，存储包含样式和标签的对象
export const callTypes = new Map<UserStatus, StatusConfig>([
  [
    'CanUse',
    {
      className:
        'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200',
      label: '可用', // 中文标签
    },
  ],
  [
    'Locked',
    {
      className: 'bg-neutral-300/40 border-neutral-300',
      label: '已锁定', // 中文标签
    },
  ],
])

export const userTypes = [
  {
    label: 'Superadmin',
    value: 'superadmin',
    icon: IconShield,
  },
  {
    label: 'Admin',
    value: 'admin',
    icon: IconUserShield,
  },
  {
    label: 'Manager',
    value: 'manager',
    icon: IconUsersGroup,
  },
  {
    label: 'Cashier',
    value: 'cashier',
    icon: IconCash,
  },
] as const
