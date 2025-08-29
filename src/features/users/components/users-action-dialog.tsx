'use client'

import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  createUserEndpoint,
  getUserByIdEndpoint,
  updateUserEndpoint,
  type UserDto,
} from '@/api'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch.tsx'
import { SelectDropdown } from '@/components/select-dropdown.tsx'
import { useUsers } from '@/features/users/components/users-provider.tsx'

const formSchema = z.object({
  userName: z.string().min(1, '用户名不能为空'),
  email: z.email({
    error: (iss) =>
      iss.input === '' ? '邮箱不能为空' : '请输入有效的邮箱地址',
  }),
  roleId: z.string().min(1, '请选择角色'),
  isActive: z.boolean(),
})
type UserForm = z.infer<typeof formSchema>

type UserActionDialogProps = {
  currentRow?: UserDto
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersActionDialog({
  currentRow,
  open,
  onOpenChange,
}: UserActionDialogProps) {
  const isEdit = !!currentRow
  const { roles } = useUsers()
  const { data: currentUser } = useQuery({
    queryKey: ['user', currentRow?.id],
    queryFn: async () => {
      const res = await getUserByIdEndpoint({
        path: {
          id: currentRow!.id,
        },
      })
      return res.data
    },
    enabled: isEdit,
  })

  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
  })

  //赋值
  useEffect(() => {
    form.reset({
      userName: currentUser?.userName || '',
      email: currentUser?.email || '',
      roleId: roles?.find((r) => r.name === currentUser?.role)?.id || '',
      isActive: currentUser?.isActive || false,
    })
  }, [currentUser, form, roles])

  const { mutateAsync } = useMutation({
    mutationFn: async (data: UserForm) => {
      if (isEdit) {
        await updateUserEndpoint({
          path: {
            id: currentUser?.id as string,
          },
          body: {
            ...data,
          },
        })
      } else {
        await createUserEndpoint({
          body: {
            ...data,
          },
        })
      }
    },
  })

  const onSubmit = async (values: UserForm) => {
    form.reset()
    await mutateAsync(values)
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>{isEdit ? '编辑用户' : '添加新用户'}</DialogTitle>
          <DialogDescription>
            {isEdit ? '在这里添加用户. ' : '在这里新建用户. '}
            完成后点击保存按钮.
          </DialogDescription>
        </DialogHeader>
        <div className='h-[26.25rem] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='user-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='userName'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      用户名
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='john_doe'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>邮箱</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='john.doe@gmail.com'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='isActive'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>启用</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='roleId'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>角色</FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Select a role'
                      className='col-span-4'
                      isControlled={true}
                      items={
                        roles?.map((role) => ({
                          label: role.name,
                          value: role.id,
                        })) || []
                      }
                    />
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type='submit' form='user-form'>
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
