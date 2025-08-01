import { HTMLAttributes } from 'react'
import { z } from 'zod'
import { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { IconBrandFacebook, IconBrandGithub } from '@tabler/icons-react'
import { toast } from 'sonner'
import { signUpEndpoint } from '@/api/auth.ts'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'

import ProblemDetails = API.ProblemDetails

type SignUpFormProps = HTMLAttributes<HTMLFormElement>

const formSchema = z
  .object({
    userName: z
      .string()
      .min(1, '请输入您的用户名')
      .regex(/^[A-Za-z]+$/, '用户名只能包含英文字母'),
    email: z.email({
      error: (iss) => (iss.input === '' ? '请输入您的邮箱' : undefined),
    }),
    name: z.string().min(1, '请输入您的姓名'),
    password: z
      .string()
      .min(1, '请输入您的密码')
      .min(7, '密码长度至少为7个字符'),
    confirmPassword: z.string().min(1, '请确认您的密码'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '两次输入的密码不匹配',
    path: ['confirmPassword'],
  })

export function SignUpForm({ className, ...props }: SignUpFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      userName: '',
      name: '',
      password: '',
      confirmPassword: '',
    },
  })

  const navigate = useNavigate()

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      await signUpEndpoint({
        userName: data.userName,
        email: data.email,
        password: data.password,
        name: data.name,
      })
    },
    onSuccess: () => {
      toast.success('账号创建成功！请登录。')
      navigate({
        to: '/sign-in',
        replace: true,
      })
    },
    onError: (error: AxiosError<ProblemDetails>) => {
      // 首先判断 error 是否为 AxiosError 实例
      // 确认有 response 后再解构
      const { data, status } = error.response || {}
      if (status === 400) {
        data!.errors.forEach((error) => {
          form.setError(
            error.name as 'email' | 'password' | 'userName' | 'name',
            {
              type: 'system',
              message: error.reason,
            }
          )
        })
      }
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    mutate(data)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='userName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>用户名</FormLabel>
              <FormControl>
                <Input placeholder='join' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>姓名</FormLabel>
              <FormControl>
                <Input placeholder='...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>邮箱</FormLabel>
              <FormControl>
                <Input placeholder='name@example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>密码</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>确认密码</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading}>
          创建账号
        </Button>

        <div className='relative my-2'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background text-muted-foreground px-2'>
              或使用以下方式继续
            </span>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-2'>
          <Button
            variant='outline'
            className='w-full'
            type='button'
            disabled={isLoading}
          >
            <IconBrandGithub className='h-4 w-4' /> GitHub
          </Button>
          <Button
            variant='outline'
            className='w-full'
            type='button'
            disabled={isLoading}
          >
            <IconBrandFacebook className='h-4 w-4' /> Facebook
          </Button>
        </div>
      </form>
    </Form>
  )
}
