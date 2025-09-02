import { useEffect } from 'react'
import z from 'zod'
import type { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  type CategoryDto,
  createCategoryEndpoint,
  getCategoriesByIdEndpoint,
  type ProblemDetails,
  updateCategoryEndpoint,
} from '@/api'
import { handleFormValidationErrors } from '@/utils/form.ts'
import { Button } from '@/components/ui/button.tsx'
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
} from '@/components/ui/form.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Switch } from '@/components/ui/switch.tsx'
import { Textarea } from '@/components/ui/textarea.tsx'
import { SelectDropdown } from '@/components/select-dropdown.tsx'
import { categoryTypes } from '@/features/categories/data/data.ts'

const formShema = z.object({
  name: z.string().min(1, '名称不能为空'),
  type: z.string().min(1, '请选择类别'),
  description: z.string().optional(),
  isActive: z.boolean(),
})

type CategoryForm = z.infer<typeof formShema>

type CategoriesActionDialogProps = {
  currentRow?: CategoryDto
  open: boolean
  onOpenChange: (open: boolean) => void
}

function CategoriesActionDialog({
  currentRow,
  open,
  onOpenChange,
}: CategoriesActionDialogProps) {
  const isEdit = !!currentRow

  const form = useForm<CategoryForm>({
    resolver: zodResolver(formShema),
  })

  const { data: currentCategory, isSuccess } = useQuery({
    queryKey: ['category', currentRow?.id],
    queryFn: async () => {
      const res = await getCategoriesByIdEndpoint({
        path: {
          id: currentRow!.id,
        },
      })
      return res.data
    },
    enabled: isEdit,
  })
  useEffect(() => {
    form.reset({
      name: currentCategory?.name || '',
      type: currentCategory?.type || '',
      description: currentCategory?.description || '',
      isActive: currentCategory?.isActive ?? true,
    })
  }, [form, isSuccess, currentCategory])

  const { mutateAsync: actionCategory } = useMutation({
    mutationFn: async (data: CategoryForm) => {
      const type = data.type as 'dishes' | 'comboMeals'
      if (isEdit) {
        // 编辑
        await updateCategoryEndpoint({
          path: { id: currentRow!.id },
          body: {
            ...data,
            type: type,
          },
        })
      } else {
        // 新建
        await createCategoryEndpoint({
          body: {
            ...data,
            type: type,
          },
        })
      }
    },
    onError: (error: AxiosError<ProblemDetails>) => {
      handleFormValidationErrors<CategoryForm>(error, form.setError)
    },
  })

  const onSubmit = async (data: CategoryForm) => {
    await actionCategory(data)
    form.reset()
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
          <DialogTitle>{isEdit ? '编辑分类' : '添加新分类'}</DialogTitle>
          <DialogDescription>
            {isEdit ? '在这里添加分类. ' : '在这里新建分类. '}
            完成后点击保存按钮.
          </DialogDescription>
        </DialogHeader>
        <div className='h-[26.25rem] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='category-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>名称</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='单品套餐'
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
                name='type'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>角色</FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='选择类别'
                      className='col-span-4'
                      isControlled={true}
                      items={
                        categoryTypes?.map((type) => ({
                          label: type.label,
                          value: type.value,
                        })) || []
                      }
                    />
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
                name='description'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>备注</FormLabel>
                    <FormControl>
                      <Textarea className='col-span-4' {...field} />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type='submit' form='category-form'>
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CategoriesActionDialog
