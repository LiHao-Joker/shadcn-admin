import { useEffect } from 'react'
import z from 'zod'
import type { AxiosError } from 'axios'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createDishEndpoint,
  type DishDto,
  getCategoriesEndpoint,
  getDishByIdEndpoint,
  type ProblemDetails,
  updateDishEndpoint,
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
import UploadFile from '@/components/upload-file.tsx'
import TagInput from '@/features/dishes/components/tag-input.tsx'

// 口味验证规则
const flavorSchema = z.object({
  name: z.string().min(1, '口味不能为空'),
  value: z.array(z.string().min(1, '值不能为空')).min(1, '至少需要一个值'),
})

// 表单验证规则
const formShema = z
  .object({
    name: z.string().min(1, '名称不能为空'),
    image: z.string().min(1, '请上传图片'),
    price: z.number().min(0, '值必须大于0'),
    categoryId: z.string().min(1, '请选择类别'),
    flavors: z.array(flavorSchema),
    description: z.string().optional(),
    isActive: z.boolean(),
  })
  // 自定义验证：将flavor的错误聚合到flavors字段
  .refine(
    // 验证逻辑：检查每个flavor是否有效
    (data) => {
      return data.flavors.every((flavor) => {
        const result = flavorSchema.safeParse(flavor)
        return result.success
      })
    },
    {
      message: '口味配置有误',
      path: ['flavors'], // 将错误定位到flavors字段
    }
  )

type DishForm = z.infer<typeof formShema>

type DishesActionDialogProps = {
  currentRow?: DishDto
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DishesActionDialog({
  currentRow,
  open,
  onOpenChange,
}: DishesActionDialogProps) {
  const isEdit = !!currentRow
  const form = useForm<DishForm>({
    resolver: zodResolver(formShema),
  })

  const { append, remove, update } = useFieldArray({
    control: form.control,
    name: 'flavors',
  })
  const { data: currentDish, isSuccess } = useQuery({
    queryKey: ['dishes', currentRow?.id],
    queryFn: async () => {
      const res = await getDishByIdEndpoint({
        path: {
          id: currentRow!.id,
        },
      })
      return res.data
    },
    enabled: isEdit,
  })

  //初始化
  useEffect(() => {
    form.reset({
      name: currentDish?.name || '',
      price: currentDish?.price || 0,
      image: currentDish?.image || '',
      description: currentDish?.description || '',
      categoryId: currentDish?.category.id || '',
      flavors: currentDish?.flavors || [],
      isActive: currentDish?.isActive ?? true,
    })
  }, [form, isSuccess, currentDish])

  const queryClient = useQueryClient()

  const { mutateAsync: actionDish } = useMutation({
    mutationFn: async (data: DishForm) => {
      if (isEdit) {
        // 编辑
        await updateDishEndpoint({
          path: { id: currentRow!.id },
          body: {
            ...data,
          },
        })
      } else {
        // 新建
        await createDishEndpoint({
          body: {
            ...data,
          },
        })
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dishes', currentRow?.id] })
    },
    onError: (error: AxiosError<ProblemDetails>) => {
      handleFormValidationErrors<DishForm>(error, form.setError)
    },
  })

  const { data: dishCategories } = useQuery({
    queryKey: ['categories', 'dish'],
    queryFn: async () => {
      const res = await getCategoriesEndpoint({
        query: {
          types: ['dishes'],
        },
      })
      return res.data
    },
  })

  const onSubmit = async (data: DishForm) => {
    await actionDish(data)
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
          <DialogTitle>{isEdit ? '编辑菜品' : '添加新菜品'}</DialogTitle>
          <DialogDescription>
            {isEdit ? '在这里添加菜品. ' : '在这里新建菜品. '}
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
                      <Input className='col-span-4' {...field} />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='price'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>价格</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        className='col-span-4'
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='categoryId'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>分类</FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='选择类别'
                      className='col-span-4'
                      isControlled={true}
                      items={dishCategories?.items?.map((item) => ({
                        value: item.id,
                        label: item.name,
                      }))}
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
              <FormField
                control={form.control}
                name='image'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>图片</FormLabel>
                    <FormControl>
                      <UploadFile
                        defaultValue={field.value as string}
                        onChange={(value) => {
                          field.onChange(value.removeUri)
                        }}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='flavors'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>口味</FormLabel>
                    <FormControl>
                      <div className='col-span-6 grid grid-cols-6 gap-y-2 rounded-lg border p-8'>
                        {field.value.map((d, index) => (
                          <div
                            className='col-span-6 flex flex-wrap gap-1'
                            key={index}
                          >
                            <Input
                              className='basis-1/4'
                              value={field.value[index].name}
                              onChange={(e) => {
                                update(index, {
                                  ...d,
                                  name: e.target.value,
                                })
                              }}
                            />
                            <TagInput
                              className='flex flex-wrap items-center justify-center gap-1'
                              defaultValue={d.value}
                              onChange={(tags) => {
                                update(index, {
                                  ...d,
                                  value: tags as [],
                                })
                              }}
                            />
                          </div>
                        ))}
                        <Button
                          type='button'
                          className='col-span-1'
                          onClick={() => {
                            append({
                              value: [],
                              name: '',
                            })
                          }}
                        >
                          添加
                        </Button>
                        {field.value?.length > 0 && (
                          <Button
                            type='button'
                            className='col-span-1 ml-1'
                            onClick={() => {
                              remove(field.value.length - 1)
                            }}
                            variant='destructive'
                          >
                            删除
                          </Button>
                        )}
                      </div>
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
