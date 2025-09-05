'use client'

import { useEffect, useState } from 'react'
import { AxiosError } from 'axios'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  getUserByIdEndpoint,
  type ProblemDetails,
  updateUserRolesEndpoint,
  type UserDto,
} from '@/api'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox.tsx'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label.tsx'
import { useUsers } from '@/features/users/components/users-provider.tsx'

type UserActionDialogProps = {
  currentRow?: UserDto
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserRoleAssignDialog({
  currentRow,
  open,
  onOpenChange,
}: UserActionDialogProps) {
  const { roles } = useUsers()

  const [selectRoles, setSelectRoles] = useState<string[] | undefined>([])

  const { data: user } = useQuery({
    queryKey: ['user', currentRow?.id, currentRow?.roles],
    queryFn: async () => {
      const res = await getUserByIdEndpoint({
        path: {
          id: currentRow!.id,
        },
      })

      return res.data
    },
  })

  useEffect(() => {
    setSelectRoles(user?.roles)
  }, [user?.roles])

  const { mutateAsync: updateRoles } = useMutation({
    mutationFn: async () => {
      await updateUserRolesEndpoint({
        body: {
          roles: selectRoles ?? [],
        },
        path: {
          id: currentRow?.id ?? '',
        },
      })
    },
    onError: (e: AxiosError<ProblemDetails>) => {
      toast.error(e.response?.data.errors[0].reason)
    },
  })

  const handleOnSubmit = async () => {
    await updateRoles()
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>"分配角色"</DialogTitle>
          <DialogDescription>
            '在这里分配角色. ' 完成后点击保存按钮.
          </DialogDescription>
        </DialogHeader>
        <div className='h-[26.25rem] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          {roles.map((role) => (
            <div key={role.id} className='mb-2 flex items-center gap-3'>
              <Checkbox
                checked={selectRoles?.some((r) => r === role.name)}
                onCheckedChange={(checked) => {
                  setSelectRoles((prev) => {
                    if (checked) {
                      if (!prev?.includes(role.name)) {
                        return [...prev!, role.name]
                      }
                      return prev
                    } else {
                      return prev?.filter((r) => r !== role.name)
                    }
                  })
                }}
              />
              <Label htmlFor='roles'>{role.name}</Label>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={handleOnSubmit}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
