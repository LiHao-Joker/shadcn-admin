import React, { useState } from 'react'
import { type RoleDto, type UserDto } from '@/api'
import useDialogState from '@/hooks/use-dialog-state'

type UsersDialogType =
  | 'invite'
  | 'add'
  | 'edit'
  | 'delete'
  | 'status'
  | 'resetpassword'

type UsersContextType = {
  open: UsersDialogType | null
  setOpen: (str: UsersDialogType | null) => void
  currentRow: UserDto | null
  setCurrentRow: React.Dispatch<React.SetStateAction<UserDto | null>>

  roles: RoleDto[]
  setRoles: (roles: RoleDto[]) => void
}

const UsersContext = React.createContext<UsersContextType | null>(null)

export function UsersProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<UsersDialogType>(null)
  const [currentRow, setCurrentRow] = useState<UserDto | null>(null)
  const [roles, setRoles] = useState<RoleDto[]>([])
  return (
    <UsersContext
      value={{ open, setOpen, currentRow, setCurrentRow, roles, setRoles }}
    >
      {children}
    </UsersContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUsers = () => {
  const usersContext = React.useContext(UsersContext)

  if (!usersContext) {
    throw new Error('useUsers has to be used within <UsersContext>')
  }

  return usersContext
}
