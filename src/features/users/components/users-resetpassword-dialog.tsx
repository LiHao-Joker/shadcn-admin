import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { updateUserPasswordEndpoint, type UserDto } from '@/api'
import { AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.tsx'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx'
import { ConfirmDialog } from '@/components/confirm-dialog.tsx'
import { PasswordInput } from '@/components/password-input.tsx'

type UsersResetpasswordDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: UserDto
}

const formSchema = z
  .object({
    password: z.string().min(6, '密码至少6位'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword'],
  })

function UsersResetpasswordDialog({
  open,
  onOpenChange,
  currentRow,
}: UsersResetpasswordDialogProps) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const { mutateAsync: changePassword } = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      await updateUserPasswordEndpoint({
        path: {
          id: currentRow.id,
        },
        body: {
          password: data.password,
          confirmPassword: data.confirmPassword,
        },
      })
    },
  })

  const handleConfirm = () => {
    form.handleSubmit(async (data) => {
      await changePassword(data)
      onOpenChange(false)
    })()
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleConfirm}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='stroke-destructive me-1 inline-block'
            size={18}
          />{' '}
          重置用户密码
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            您确定要重置用户
            <span className='font-bold'>{currentRow.userName}</span> 吗？
          </p>
          <Form {...form}>
            <form id='reset-password-form'>
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      新密码
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
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
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      确认密码
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder='john_doe'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          <Alert variant='destructive'>
            <AlertTitle>警告！</AlertTitle>
            <AlertDescription>
              请谨慎操作，此操作一旦执行将无法回滚。
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText='确定'
      cancelBtnText='取消'
      destructive
    ></ConfirmDialog>
  )
}

export default UsersResetpasswordDialog
