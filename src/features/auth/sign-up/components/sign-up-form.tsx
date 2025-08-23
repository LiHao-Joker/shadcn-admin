import React from 'react'
import { z } from 'zod'
import type { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { type ProblemDetails, signUpEndpoint } from '@/api'
import { toast } from 'sonner'
import { IconFacebook, IconGithub } from '@/assets/brand-icons'
import { cn } from '@/lib/utils'
import { handleFormValidationErrors } from '@/utils/form.ts'
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

const formSchema = z
  .object({
    email: z.email({
      error: (iss) => (iss.input === '' ? '请输入您的邮箱' : undefined),
    }),
    userName: z.string().min(1, '请输入您的用户名'),
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

type SignUpForm = z.infer<typeof formSchema>

export function SignUpForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const form = useForm<SignUpForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })
  const navigate = useNavigate()
  const { mutateAsync: signUp, isPending: isLoading } = useMutation({
    mutationFn: async (data: SignUpForm) => {
      return await signUpEndpoint({
        body: {
          ...data,
        },
      })
    },
    onSuccess: () => {
      toast.success('注册成功')
      navigate({
        to: '/sign-in',
      })
    },
    onError: (error: AxiosError<ProblemDetails>) => {
      handleFormValidationErrors<SignUpForm>(error, form.setError)
    },
  })

  async function onSubmit(data: SignUpForm) {
    await signUp(data)
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
                <Input placeholder='name' {...field} />
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
          注册
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
          <Button
            variant='outline'
            className='w-full'
            type='button'
            disabled={isLoading}
          >
            <IconGithub className='h-4 w-4' /> GitHub
          </Button>
          <Button
            variant='outline'
            className='w-full'
            type='button'
            disabled={isLoading}
          >
            <IconFacebook className='h-4 w-4' /> Facebook
          </Button>
        </div>
      </form>
    </Form>
  )
}
