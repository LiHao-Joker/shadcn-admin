import { HTMLAttributes } from 'react'
import { z } from 'zod'
import { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { IconBrandFacebook, IconBrandGithub } from '@tabler/icons-react'
import { Route } from '@/routes/(auth)/sign-in.tsx'
import { signInEndpoint } from '@/api/auth.ts'
import { useAuthStore } from '@/stores/authStore.ts'
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

type UserAuthFormProps = HTMLAttributes<HTMLFormElement>

const formSchema = z.object({
  email: z.email({
    error: (iss) => (iss.input === '' ? '请输入您的邮箱' : undefined),
  }),
  password: z.string().min(1, '请输入您的密码').min(7, '密码长度至少为7个字符'),
})

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const { redirect } = Route.useSearch()
  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      return await signInEndpoint({
        ...data,
      })
    },
    onSuccess: (res) => {
      login({
        userId: res.data.userId,
        accessToken: res.data.accessToken,
        accessTokenExpiry: res.data.accessTokenExpiry,
        refreshToken: res.data.refreshToken,
        refreshTokenValidityMinutes: res.data.refreshTokenValidityMinutes,
      })
      navigate({
        to: redirect ?? '/',
        replace: true,
      })
    },
    onError: (error: AxiosError<ProblemDetails>) => {
      // 首先判断 error 是否为 AxiosError 实例
      // 确认有 response 后再解构
      const { data, status } = error.response || {}
      if (status === 400) {
        data!.errors.forEach((error) => {
          form.setError(error.name as 'email' | 'password', {
            type: 'manual',
            message: error.reason,
          })
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
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
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
            <FormItem className='relative'>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
              <Link
                to='/forgot-password'
                className='text-muted-foreground absolute -top-0.5 right-0 text-sm font-medium hover:opacity-75'
              >
                Forgot password?
              </Link>
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading}>
          Login
        </Button>

        <div className='relative my-2'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background text-muted-foreground px-2'>
              Or continue with
            </span>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-2'>
          <Button variant='outline' type='button' disabled={isLoading}>
            <IconBrandGithub className='h-4 w-4' /> GitHub
          </Button>
          <Button variant='outline' type='button' disabled={isLoading}>
            <IconBrandFacebook className='h-4 w-4' /> Facebook
          </Button>
        </div>
      </form>
    </Form>
  )
}
