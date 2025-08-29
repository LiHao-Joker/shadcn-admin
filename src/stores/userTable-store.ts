import type { RoleDto, UserDto } from '@/api'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type UsersDialogType = 'invite' | 'add' | 'edit' | 'delete'

interface UserTableState {
  open: UsersDialogType | null
  setOpen: (str: UsersDialogType | null) => void
  currentRow: UserDto | null
  setCurrentRow: (user: UserDto | null) => void
  roles: RoleDto[]
  setRoles: (roles: RoleDto[]) => void
}

export const useUserTableStore = create<UserTableState>()(
  immer((set) => {
    return {
      open: null,
      setOpen: (str) =>
        set((state) => {
          state.open = str
        }),
      currentRow: null,
      setCurrentRow: (user) =>
        set((state) => {
          state.currentRow = user
        }),
      roles: [],
      setRoles: (roles) =>
        set((state) => {
          state.roles = roles
        }),
    }
  })
)
