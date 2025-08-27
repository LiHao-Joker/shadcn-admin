'use client'

import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getUserByIdEndpoint, type UserDto } from '@/api'
import { showSubmittedData } from '@/lib/show-submitted-data'
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

const formSchema = z.object({
  userName: z.string().min(1, 'Username is required.'),
  email: z.email({
    error: (iss) => (iss.input === '' ? 'Email is required.' : undefined),
  }),
  role: z.string().min(1, 'Role is required.'),
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
      role: currentUser?.role || '',
      isActive: currentUser?.isActive || false,
    })
  }, [currentUser, form])

  const { mutateAsync } = useMutation({
    mutationFn: async (data: UserForm) => {
      if (isEdit) {
        // update user
      } else {
        // create user
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
          <DialogTitle>{isEdit ? 'Edit User' : 'Add New User'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the user here. ' : 'Create new user here. '}
            Click save when you&apos;re done.
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
                      Username
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
                    <FormLabel className='col-span-2 text-end'>Email</FormLabel>
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

              {/*<FormField*/}
              {/*  control={form.control}*/}
              {/*  name='role'*/}
              {/*  render={({ field }) => (*/}
              {/*    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>*/}
              {/*      <FormLabel className='col-span-2 text-end'>Role</FormLabel>*/}
              {/*      <SelectDropdown*/}
              {/*        defaultValue={field.value}*/}
              {/*        onValueChange={field.onChange}*/}
              {/*        placeholder='Select a role'*/}
              {/*        className='col-span-4'*/}
              {/*        items={roles.map(({ label, value }) => ({*/}
              {/*          label,*/}
              {/*          value,*/}
              {/*        }))}*/}
              {/*      />*/}
              {/*      <FormMessage className='col-span-4 col-start-3' />*/}
              {/*    </FormItem>*/}
              {/*  )}*/}
              {/*/>*/}
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type='submit' form='user-form'>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
